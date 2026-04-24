#!/bin/sh
# Orchard e2e — mints a test taproot asset on tapd-orchard so the
# wallet-summary spec has tapd state to observe without touching the tapd
# CLI at test time. Idempotent: skips the mint if an asset with the same
# name already exists.
#
# Runs from its own setup compose service after `tapd-orchard` is healthy
# AND the main `fund-lnd-topology.sh` setup has completed (needed for a
# confirmed on-chain balance on lnd-orchard so tapd can fund the mint's
# anchor tx).

set -eu

log() { printf '[tapd-setup] %s\n' "$*"; }

bcli() {
    local method="$1"
    local params="${2:-[]}"
    curl -sS --fail \
        -u "${BTC_RPC_USER}:${BTC_RPC_PASS}" \
        -H 'content-type: application/json' \
        -d "{\"jsonrpc\":\"1.0\",\"method\":\"${method}\",\"params\":${params}}" \
        http://bitcoind:18443/ | jq -r '.result'
}

# tapd REST goes through litd's unified :8443 HTTPS endpoint in integrated
# mode — integrated tapd doesn't bind its own 10029/8089 ports. Auth still
# uses tapd's admin.macaroon; TLS verification uses litd's cert (the one
# presented on 8443), not tapd's.
tapd() {
    local method="$1" path="$2" body="${3:-}"
    local macaroon_hex
    macaroon_hex=$(xxd -p -c 10000 /tapd/data/regtest/admin.macaroon)
    if [ -n "$body" ]; then
        curl -sS --fail -X "$method" \
            --cacert /lit/tls.cert \
            -H "Grpc-Metadata-macaroon: ${macaroon_hex}" \
            -H 'content-type: application/json' \
            -d "$body" \
            "https://lnd-orchard:8443${path}"
    else
        curl -sS --fail -X "$method" \
            --cacert /lit/tls.cert \
            -H "Grpc-Metadata-macaroon: ${macaroon_hex}" \
            "https://lnd-orchard:8443${path}"
    fi
}

# Asset identity: name + supply + decimals drive the amount the UI displays.
# 100000 / 10^2 = 1,000 — the number the wallet-summary spec asserts against.
ASSET_NAME="${TAPD_FUND_ASSET_NAME:-TESTASSET}"
ASSET_SUPPLY="${TAPD_FUND_ASSET_SUPPLY:-100000}"
ASSET_DECIMAL="${TAPD_FUND_ASSET_DECIMAL:-2}"

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

check_tapd_info() {
    tapd GET /v1/taproot-assets/getinfo > /dev/null
}

asset_exists() {
    tapd GET /v1/taproot-assets/assets 2>/dev/null \
        | jq -e --arg name "$ASSET_NAME" '.assets[]? | select(.asset_genesis.name == $name)' > /dev/null
}

wait_for "tapd-orchard info" check_tapd_info

if asset_exists; then
    log "asset '${ASSET_NAME}' already exists on tapd-orchard — skipping mint"
    mkdir -p /shared
    touch /shared/tapd-ready
    log "ALL DONE"
    exit 0
fi

log "minting ${ASSET_SUPPLY} ${ASSET_NAME} (decimal_display=${ASSET_DECIMAL}, grouped)"
# new_grouped_asset=true so the mint emits a group_key. lnd's custom_channel_data
# on asset-backed channels surfaces group_key at the top level; the orchard
# server's parseLndCustomChannelData returns null for channels without one, so
# the fixture has to mint a grouped asset to exercise that code path.
tapd POST /v1/taproot-assets/assets "{
    \"asset\": {
        \"asset_version\": \"ASSET_VERSION_V0\",
        \"asset_type\": \"NORMAL\",
        \"name\": \"${ASSET_NAME}\",
        \"amount\": \"${ASSET_SUPPLY}\",
        \"new_grouped_asset\": true,
        \"decimal_display\": ${ASSET_DECIMAL}
    }
}" > /dev/null

log "finalizing mint batch"
tapd POST /v1/taproot-assets/assets/mint/finalize '{}' > /dev/null

MINER_ADDR=$(bcli getnewaddress)
log "mining 6 confirmations for mint anchor tx"
bcli generatetoaddress "[6, \"${MINER_ADDR}\"]" >/dev/null

wait_for "tapd confirms ${ASSET_NAME}" asset_exists

mkdir -p /shared
touch /shared/tapd-ready
log "ALL DONE — ${ASSET_NAME} live on tapd-orchard"
