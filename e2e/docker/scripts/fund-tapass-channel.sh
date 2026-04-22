#!/bin/sh
# Orchard e2e — opens an asset-backed LN channel lnd-orchard → lnd-alice using
# the TESTASSET minted by fund-tapd.sh. Required so the spec that exercises
# orc-lightning-general-channel-summary has a taproot-asset row to render —
# plain sat channels alone leave `channel.asset` null and the taproot path
# in the component untested.
#
# Runs from the tapass-channel-setup compose service after tapd-setup has
# completed (asset exists) and lnd-alice is healthy (peer + LN pubkey are
# reachable). Idempotent: if an asset channel funded with the TESTASSET
# group/asset_id already exists, skips the open.
#
# Asset channels are a litd-specific feature (litcli ln fundchannel
# --asset_id). This script assumes lnd-orchard is a litd container and reaches
# litcli via `docker exec`; tapd-orchard is the network alias pointing at the
# same litd container's embedded tapd.

set -eu

: "${LITD_CONTAINER:?LITD_CONTAINER must be set (orchard litd container name)}"

log() { printf '[tapass-channel-setup] %s\n' "$*"; }

bcli() {
    local method="$1"
    local params="${2:-[]}"
    curl -sS --fail \
        -u "${BTC_RPC_USER}:${BTC_RPC_PASS}" \
        -H 'content-type: application/json' \
        -d "{\"jsonrpc\":\"1.0\",\"method\":\"${method}\",\"params\":${params}}" \
        http://bitcoind:18443/ | jq -r '.result'
}

# tapd REST against litd's integrated tapd on orchard, via litd's unified
# :8443 HTTPS endpoint. Integrated tapd doesn't expose 10029/8089 — all tapd
# RPC/REST calls are multiplexed through :8443. Auth uses tapd's admin.macaroon;
# TLS trusts litd's cert (the one served on 8443).
tapd_orchard() {
    local method="$1" path="$2"
    local macaroon_hex
    macaroon_hex=$(xxd -p -c 10000 /tapd-orchard/data/regtest/admin.macaroon)
    curl -sS --fail -X "$method" \
        --cacert /lit-orchard/tls.cert \
        -H "Grpc-Metadata-macaroon: ${macaroon_hex}" \
        "https://lnd-orchard:8443${path}"
}

# lnd REST against lnd-alice. Reads alice's lnd macaroon + cert from the
# lnd-alice-data volume (mounted read-only at /lnd-alice).
lnd_alice() {
    local method="$1" path="$2"
    local macaroon_hex
    macaroon_hex=$(xxd -p -c 10000 /lnd-alice/data/chain/bitcoin/regtest/admin.macaroon)
    curl -sS --fail -X "$method" \
        --cacert /lnd-alice/tls.cert \
        -H "Grpc-Metadata-macaroon: ${macaroon_hex}" \
        "https://lnd-alice:8080${path}"
}

# litcli inside the orchard litd container. docker exec runs as root, whose
# $HOME doesn't hold the lit config — pass --macaroonpath and --tlscertpath
# explicitly to hit the litd user's regtest data dir.
litcli() {
    docker exec "${LITD_CONTAINER}" litcli \
        --tlscertpath=/home/litd/.lit/tls.cert \
        --macaroonpath=/home/litd/.lit/regtest/lit.macaroon \
        "$@"
}

wait_for() {
    local desc="$1"; shift
    local retries=60
    local last_err=""
    while true; do
        if last_err=$("$@" 2>&1); then
            log "ready: $desc"
            return 0
        fi
        retries=$((retries - 1))
        if [ "$retries" -le 0 ]; then
            log "timeout waiting for $desc"
            log "last output: ${last_err}"
            exit 1
        fi
        sleep 1
    done
}

check_tapd_orchard_info() {
    tapd_orchard GET /v1/taproot-assets/getinfo > /dev/null
}

check_lnd_alice_info() {
    lnd_alice GET /v1/getinfo > /dev/null
}

check_asset_channel_pending_or_active() {
    # Looks at orchard's open channels (including pending) for any carrying a
    # non-empty custom_channel_data (asset metadata is serialized there). If
    # present, the channel was funded with an asset and we can skip.
    docker exec "${LITD_CONTAINER}" lncli --lnddir=/home/litd/.lnd --network=regtest listchannels 2>/dev/null \
        | jq -e '.channels[]? | select((.custom_channel_data // "") != "")' > /dev/null
}

check_asset_channel_active() {
    docker exec "${LITD_CONTAINER}" lncli --lnddir=/home/litd/.lnd --network=regtest listchannels --active_only 2>/dev/null \
        | jq -e '.channels[]? | select((.custom_channel_data // "") != "")' > /dev/null
}

wait_for "tapd-orchard info"  check_tapd_orchard_info
wait_for "lnd-alice info"     check_lnd_alice_info

if check_asset_channel_pending_or_active; then
    log "asset channel already present on lnd-orchard — skipping"
    mkdir -p /shared
    touch /shared/tapass-channel-ready
    log "ALL DONE"
    exit 0
fi

ASSET_NAME="${TAPD_FUND_ASSET_NAME:-TESTASSET}"
ASSET_AMOUNT="${TAPASS_CHANNEL_ASSET_AMOUNT:-500}"
SAT_PER_VBYTE="${TAPASS_CHANNEL_SAT_PER_VBYTE:-1}"

# Extract the asset_id for the minted TESTASSET. fund-tapd.sh mints a single
# un-grouped asset, so asset_genesis.asset_id is the canonical identifier.
# The REST API returns it base64-encoded; litcli wants hex — convert via xxd.
ASSET_ID_B64=$(tapd_orchard GET /v1/taproot-assets/assets \
    | jq -r --arg name "$ASSET_NAME" \
        '.assets[]? | select(.asset_genesis.name == $name) | .asset_genesis.asset_id' \
    | head -n1)
ASSET_ID=$(printf '%s' "$ASSET_ID_B64" | base64 -d | xxd -p -c 256)

if [ -z "${ASSET_ID_B64}" ] || [ "${ASSET_ID_B64}" = "null" ] || [ -z "${ASSET_ID}" ]; then
    log "could not resolve asset_id for '${ASSET_NAME}' on tapd-orchard"
    log "available assets: $(tapd_orchard GET /v1/taproot-assets/assets | jq -c '.assets[]?.asset_genesis')"
    exit 1
fi

log "resolved ${ASSET_NAME} asset_id=${ASSET_ID}"

ALICE_PUBKEY=$(lnd_alice GET /v1/getinfo | jq -r '.identity_pubkey')
if [ -z "${ALICE_PUBKEY}" ] || [ "${ALICE_PUBKEY}" = "null" ]; then
    log "could not resolve lnd-alice identity_pubkey"
    exit 1
fi

log "resolved lnd-alice pubkey=${ALICE_PUBKEY}"

# Alice's tapd needs to have TESTASSET's issuance proof locally before it can
# verify the channel funding proof orchard sends. The proofcourieraddr will
# fetch the asset lazily during transfer, but channel funding expects the
# issuance to already be known — so do the universe sync explicitly here.
log "syncing TESTASSET issuance to alice's tapd universe"
: "${TAPD_ALICE_CONTAINER:=lnd-cdk-sqlite-lnd-alice}"
docker exec "${TAPD_ALICE_CONTAINER}" tapcli \
    --rpcserver=localhost:8443 \
    --tlscertpath=/home/litd/.lit/tls.cert \
    --macaroonpath=/home/litd/.tapd/data/regtest/admin.macaroon \
    --network=regtest \
    universe sync \
    --universe_host lnd-orchard:8443 \
    --asset_id "${ASSET_ID}" >/dev/null

log "opening asset channel orchard → alice (amount=${ASSET_AMOUNT} ${ASSET_NAME})"
litcli ln fundchannel \
    --node_key="${ALICE_PUBKEY}" \
    --asset_id="${ASSET_ID}" \
    --asset_amount="${ASSET_AMOUNT}" \
    --sat_per_vbyte="${SAT_PER_VBYTE}" >/dev/null

log "mining 6 confirmations for asset channel funding tx"
MINER_ADDR=$(bcli getnewaddress)
bcli generatetoaddress "[6, \"${MINER_ADDR}\"]" >/dev/null

wait_for "asset channel active on lnd-orchard" check_asset_channel_active

# Give LND a moment to gossip the asset channel edge network-wide — parallels
# the sat-channel topology's post-mine sleep in fund-lnd-topology.sh.
sleep 3

mkdir -p /shared
touch /shared/tapass-channel-ready
log "ALL DONE — asset channel live (${ASSET_AMOUNT} ${ASSET_NAME})"
