#!/bin/sh
# Generic compose dispatcher for e2e configs.
#
# Usage:
#   ./compose.sh <action> <config-name>
#   ./compose.sh <action> most    # iterate, no mainchain overlay
#   ./compose.sh <action> all     # iterate + mainchain overlay where available
# Actions:
#   up    — build + bring up and wait for healthy
#   down  — tear down and remove volumes
#   logs  — follow logs (not supported with most/all)
#   ps    — list service state
#
# Targets:
#   <config-name>  single stack; overlay toggled by E2E_MAINCHAIN env var
#   most           every stack, no overlay (plain matrix)
#   all            every stack + mainchain overlay (requires bootstrap first)
set -eu

ACTION="${1:-}"
CONFIG="${2:-}"

HERE="$(cd "$(dirname "$0")/.." && pwd)"
CONFIGS_DIR="${HERE}/configs"
VERSIONS_ENV="${HERE}/versions.env"

list_configs() {
    (cd "$CONFIGS_DIR" && ls -1 -d */) 2>/dev/null | sed 's|/$||'
}

if [ -z "$ACTION" ] || [ -z "$CONFIG" ]; then
    echo "usage: $0 <up|down|logs|ps> <config-name|most|all>" >&2
    echo "configs:" >&2
    list_configs | sed 's|^|  |' >&2
    exit 1
fi

# `most` and `all` both iterate every config; they differ only on whether
# the mainchain overlay is loaded. We propagate that choice to the
# recursive invocation via E2E_MAINCHAIN (force-set, ignoring any value
# the caller passed — the token is an explicit override).
if [ "$CONFIG" = "most" ] || [ "$CONFIG" = "all" ]; then
    if [ "$ACTION" = "logs" ]; then
        echo "logs against '$CONFIG' would interleave — run against a single config" >&2
        exit 1
    fi
    if [ "$CONFIG" = "all" ]; then
        export E2E_MAINCHAIN=1
        echo "==> target 'all' — mainchain overlay enabled where configs ship one"
    else
        export E2E_MAINCHAIN=0
        echo "==> target 'most' — plain matrix, no mainchain overlay"
    fi
    status=0
    for c in $(list_configs); do
        echo ""
        echo "=========================================="
        echo "==> $ACTION $c"
        echo "=========================================="
        # Don't abort the loop on per-config failure (especially on down).
        "$0" "$ACTION" "$c" || status=$?
    done
    exit "$status"
fi

DIR="${CONFIGS_DIR}/${CONFIG}"
COMPOSE="${DIR}/compose.yml"
ENVFILE="${DIR}/env"

if [ ! -f "$COMPOSE" ]; then
    echo "compose file not found: $COMPOSE" >&2
    exit 1
fi

if [ ! -f "$VERSIONS_ENV" ]; then
    echo "versions file not found: $VERSIONS_ENV" >&2
    exit 1
fi

# cd into the config dir so compose's relative build contexts + volume
# bind mounts resolve correctly.
cd "$DIR"

# When E2E_MAINCHAIN=1 is set and the config has a compose.mainchain.yml
# overlay, include it. Adds a host-connected mainnet bitcoind + re-points
# Orchard's BITCOIN_RPC_* at it without touching the LN/mint stack.
# Only cln-nutshell-postgres ships an overlay today.
COMPOSE_FILES="-f $COMPOSE"
MAINCHAIN_ENV_FLAG=""
UP_TIMEOUT=300
if [ "${E2E_MAINCHAIN:-}" = "1" ] && [ -f "${DIR}/compose.mainchain.yml" ]; then
    echo "==> E2E_MAINCHAIN=1 — including compose.mainchain.yml overlay"
    COMPOSE_FILES="$COMPOSE_FILES -f ${DIR}/compose.mainchain.yml"
    # Optional host-specific config: e2e/.mainchain/.env (gitignored).
    # Named with a leading dot so editors apply dotenv syntax highlighting.
    # Layered last so it overrides anything in versions.env/per-config env
    # for mainchain vars — e.g. HOST_BITCOIN_P2P_PORT when the user's host
    # bitcoind isn't on the default 8333.
    MAINCHAIN_ENV="$(cd "$HERE/../.." && pwd)/.mainchain/.env"
    if [ -f "$MAINCHAIN_ENV" ]; then
        echo "==> sourcing host config from $MAINCHAIN_ENV"
        MAINCHAIN_ENV_FLAG="--env-file $MAINCHAIN_ENV"
    fi
    # loadtxoutset + header sync from host can push setup-mainchain past
    # the default 300s window. Bump for mainchain runs only.
    UP_TIMEOUT=900
fi

# Layer versions.env first, then the per-config env, finally the optional
# host-specific mainchain env. Later --env-file entries override earlier
# ones, so a config can pin its own tag and a user can pin per-host values.
compose() {
    # shellcheck disable=SC2086
    docker compose --env-file "$VERSIONS_ENV" --env-file "$ENVFILE" $MAINCHAIN_ENV_FLAG $COMPOSE_FILES "$@"
}

case "$ACTION" in
    up)
        echo "==> building + bringing up $CONFIG"
        compose up -d --build --wait --wait-timeout "$UP_TIMEOUT"
        echo "==> $CONFIG is healthy"
        compose ps
        ;;
    down)
        compose down -v
        ;;
    logs)
        compose logs -f
        ;;
    ps)
        compose ps
        ;;
    *)
        echo "unknown action: $ACTION (valid: up, down, logs, ps)" >&2
        exit 1
        ;;
esac
