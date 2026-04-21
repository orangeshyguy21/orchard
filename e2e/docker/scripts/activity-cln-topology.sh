#!/bin/sh
# Orchard e2e — activity generator for CLN topology (alice/orchard via CLN,
# carol via LND cross-impl).
#
# Runs once from the `activity` compose service after orchard is healthy.
# Sprays realistic LN + Cashu wallet activity on a freshly-funded stack so
# the SUT has history to observe.
#
# Categories (each count env-overridable; set to 0 to skip, or ACTIVITY_SKIP=1
# to disable the whole script):
#   - ACTIVITY_FORWARDS — alice ⇄ carol via orchard (forwarded LN payments)
#   - ACTIVITY_INBOUND  — alice/carol → orchard (inbound LN)
#   - ACTIVITY_OUTBOUND — orchard → alice/carol (outbound LN)
#   - ACTIVITY_MINTS    — wallet mints ecash; alice pays the mint's invoice
#   - ACTIVITY_SWAPS    — wallet sends + receives to itself (internal swap)
#   - ACTIVITY_MELTS    — wallet pays alice/carol invoice (burns ecash → LN)
#
# Requires:
#   - docker socket mounted (for exec into wallet + cln containers)
#   - /lnd/carol volume mounted ro for macaroon + tls access
#   - CONFIG_NAME, MINT_SERVICE, MINT_PORT env vars set by compose

set -eu

: "${CONFIG_NAME:?CONFIG_NAME must be set}"
: "${MINT_SERVICE:?MINT_SERVICE must be set (nutshell|cdk-mintd)}"
: "${MINT_PORT:?MINT_PORT must be set (3338|3339)}"

MINT_URL="http://${MINT_SERVICE}:${MINT_PORT}"

ACTIVITY_FORWARDS=${ACTIVITY_FORWARDS:-6}
ACTIVITY_INBOUND=${ACTIVITY_INBOUND:-4}
ACTIVITY_OUTBOUND=${ACTIVITY_OUTBOUND:-4}
ACTIVITY_MINTS=${ACTIVITY_MINTS:-5}
ACTIVITY_SWAPS=${ACTIVITY_SWAPS:-4}
ACTIVITY_MELTS=${ACTIVITY_MELTS:-3}

log() { printf '[activity] %s\n' "$*"; }

if [ "${ACTIVITY_SKIP:-0}" = "1" ]; then
    log "ACTIVITY_SKIP=1 — exiting without generating activity"
    exit 0
fi

# ── CLN via docker exec (mirrors fund-cln-topology.sh). $1 = short node name. ──
cln() {
    node="$1"; shift
    docker exec "${CONFIG_NAME}-cln-${node}" \
        lightning-cli --lightning-dir=/home/clightning/.lightning --network=regtest "$@"
}

# ── LND REST for lnd-carol (the sole LND node in this topology). ──
lnd_carol() {
    method="$1"; path="$2"; body="${3:-}"
    macaroon_hex=$(xxd -p -c 10000 /lnd/carol/data/chain/bitcoin/regtest/admin.macaroon)
    if [ -n "$body" ]; then
        curl -sS --fail -X "$method" \
            --cacert /lnd/carol/tls.cert \
            -H "Grpc-Metadata-macaroon: ${macaroon_hex}" \
            -H 'content-type: application/json' \
            -d "$body" \
            "https://lnd-carol:8080${path}"
    else
        curl -sS --fail -X "$method" \
            --cacert /lnd/carol/tls.cert \
            -H "Grpc-Metadata-macaroon: ${macaroon_hex}" \
            "https://lnd-carol:8080${path}"
    fi
}

# Produce an invoice on a CLN node; echoes bolt11.
# CLN `invoice` needs msat + unique label + description.
cln_invoice() {
    node="$1"; amt_sat="$2"
    msat=$((amt_sat * 1000))
    label="activity-${node}-$(od -An -N4 -tu4 < /dev/urandom | tr -cd '0-9')"
    cln "$node" invoice "$msat" "$label" "e2e-activity" | jq -r '.bolt11'
}

# Produce an invoice on lnd-carol; echoes bolt11.
carol_invoice() {
    lnd_carol POST /v1/invoices "{\"value\":$1}" | jq -r '.payment_request'
}

# Pay a bolt11 from a CLN node.
cln_pay() {
    cln "$1" pay "$2" > /dev/null
}

# Pay a bolt11 from lnd-carol.
carol_pay() {
    resp=$(lnd_carol POST /v1/channels/transactions "{\"payment_request\":\"$1\"}")
    err=$(printf '%s' "$resp" | jq -r '.payment_error // ""')
    if [ -n "$err" ]; then
        log "  pay failed: $err"
        return 1
    fi
}

# Produce an invoice on any topology node; $1 ∈ {alice, orchard, carol}.
any_invoice() {
    case "$1" in
        alice|orchard) cln_invoice "$1" "$2" ;;
        carol)         carol_invoice "$2" ;;
        *) log "unknown node: $1"; return 1 ;;
    esac
}

# Pay from any topology node.
any_pay() {
    case "$1" in
        alice|orchard) cln_pay "$1" "$2" ;;
        carol)         carol_pay "$2" ;;
        *) log "unknown node: $1"; return 1 ;;
    esac
}

# Run cashu CLI inside the wallet container.
wallet() {
    docker exec -i "${CONFIG_NAME}-wallet" poetry run cashu -h "$MINT_URL" "$@"
}

rand_sat() {
    min="${1:-100}"; max="${2:-5000}"
    range=$((max - min))
    r=$(od -An -N2 -tu2 < /dev/urandom | tr -cd '0-9')
    echo $((min + (r % range)))
}

# ───── 1. Forwarded LN payments (alice ⇄ carol via orchard) ─────
# alice → orchard → carol exercises CLN → CLN → LND forwarding;
# the reverse direction exercises LND → CLN → CLN.
if [ "$ACTIVITY_FORWARDS" -gt 0 ]; then
    log "forwarded LN payments: $ACTIVITY_FORWARDS"
    i=0
    while [ "$i" -lt "$ACTIVITY_FORWARDS" ]; do
        amt=$(rand_sat 100 5000)
        if [ $((i % 2)) -eq 0 ]; then src=alice; dst=carol; else src=carol; dst=alice; fi
        inv=$(any_invoice "$dst" "$amt")
        any_pay "$src" "$inv" || true
        log "  fwd ${src} → ${dst} ${amt} sat"
        i=$((i + 1))
    done
fi

# ───── 2. Inbound LN to orchard ─────
if [ "$ACTIVITY_INBOUND" -gt 0 ]; then
    log "inbound LN to orchard: $ACTIVITY_INBOUND"
    i=0
    while [ "$i" -lt "$ACTIVITY_INBOUND" ]; do
        amt=$(rand_sat 100 2000)
        if [ $((i % 2)) -eq 0 ]; then src=alice; else src=carol; fi
        inv=$(cln_invoice orchard "$amt")
        any_pay "$src" "$inv" || true
        log "  in  ${src} → orchard ${amt} sat"
        i=$((i + 1))
    done
fi

# ───── 3. Outbound LN from orchard ─────
if [ "$ACTIVITY_OUTBOUND" -gt 0 ]; then
    log "outbound LN from orchard: $ACTIVITY_OUTBOUND"
    i=0
    while [ "$i" -lt "$ACTIVITY_OUTBOUND" ]; do
        amt=$(rand_sat 100 2000)
        if [ $((i % 2)) -eq 0 ]; then dst=alice; else dst=carol; fi
        inv=$(any_invoice "$dst" "$amt")
        cln_pay orchard "$inv" || true
        log "  out orchard → ${dst} ${amt} sat"
        i=$((i + 1))
    done
fi

# ───── 4. Wallet mints ─────
# Same pattern as LND script: run `cashu invoice` backgrounded, extract the
# bolt11 from stdout, pay it from alice, wait for cashu to redeem.
if [ "$ACTIVITY_MINTS" -gt 0 ]; then
    log "wallet mints: $ACTIVITY_MINTS"
    i=0
    while [ "$i" -lt "$ACTIVITY_MINTS" ]; do
        amt=$(rand_sat 100 2000)
        tmp=$(mktemp)

        wallet invoice "$amt" > "$tmp" 2>&1 &
        pid=$!

        bolt11=""
        tries=30
        while [ "$tries" -gt 0 ]; do
            bolt11=$(grep -oE 'lnbcrt[0-9a-z]+' "$tmp" 2>/dev/null | head -1 || true)
            [ -n "$bolt11" ] && break
            sleep 0.5
            tries=$((tries - 1))
        done

        if [ -z "$bolt11" ]; then
            log "  mint ${amt} FAILED (no invoice in cashu output)"
            sed 's/^/    /' "$tmp" || true
            kill "$pid" 2>/dev/null || true
            rm -f "$tmp"
            i=$((i + 1))
            continue
        fi

        cln_pay alice "$bolt11" || true

        if wait "$pid"; then
            log "  mint ${amt} sat"
        else
            log "  mint ${amt} FAILED (redeem)"
            sed 's/^/    /' "$tmp" || true
        fi
        rm -f "$tmp"
        i=$((i + 1))
    done
fi

# ───── 5. Internal swaps (wallet → wallet) ─────
if [ "$ACTIVITY_SWAPS" -gt 0 ]; then
    log "wallet swaps: $ACTIVITY_SWAPS"
    i=0
    while [ "$i" -lt "$ACTIVITY_SWAPS" ]; do
        amt=$(rand_sat 10 100)
        token=$(wallet send "$amt" 2>&1 | grep -oE 'cashu[AB][A-Za-z0-9+/_=-]+' | head -1 || true)
        if [ -z "$token" ]; then
            log "  swap ${amt} FAILED (no token)"
            i=$((i + 1))
            continue
        fi
        if wallet receive "$token" >/dev/null 2>&1; then
            log "  swap ${amt} sat"
        else
            log "  swap ${amt} FAILED (receive)"
        fi
        i=$((i + 1))
    done
fi

# ───── 6. Wallet melts ─────
if [ "$ACTIVITY_MELTS" -gt 0 ]; then
    log "wallet melts: $ACTIVITY_MELTS"
    i=0
    while [ "$i" -lt "$ACTIVITY_MELTS" ]; do
        amt=$(rand_sat 50 500)
        if [ $((i % 2)) -eq 0 ]; then dst=alice; else dst=carol; fi
        inv=$(any_invoice "$dst" "$amt")
        if wallet pay "$inv" >/dev/null 2>&1; then
            log "  melt ${amt} sat → ${dst}"
        else
            log "  melt ${amt} FAILED"
        fi
        i=$((i + 1))
    done
fi

log "DONE — forwards=$ACTIVITY_FORWARDS inbound=$ACTIVITY_INBOUND outbound=$ACTIVITY_OUTBOUND mints=$ACTIVITY_MINTS swaps=$ACTIVITY_SWAPS melts=$ACTIVITY_MELTS"
