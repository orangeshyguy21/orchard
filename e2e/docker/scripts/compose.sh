#!/bin/sh
# Generic compose dispatcher for e2e configs.
#
# Usage:
#   ./compose.sh <action> <config-name>
#   ./compose.sh <action> all          # iterate over every config
# Actions:
#   up    — build + bring up and wait for healthy
#   down  — tear down and remove volumes
#   logs  — follow logs (not supported with `all`)
#   ps    — list service state
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
    echo "usage: $0 <up|down|logs|ps> <config-name|all>" >&2
    echo "configs:" >&2
    list_configs | sed 's|^|  |' >&2
    exit 1
fi

# Expand `all` into a loop over every config.
if [ "$CONFIG" = "all" ]; then
    if [ "$ACTION" = "logs" ]; then
        echo "logs against 'all' would interleave — run against a single config" >&2
        exit 1
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

# Layer versions.env first, then the per-config env. Later --env-file
# entries override earlier ones, so a config can pin its own tag.
compose() {
    docker compose --env-file "$VERSIONS_ENV" --env-file "$ENVFILE" -f "$COMPOSE" "$@"
}

case "$ACTION" in
    up)
        echo "==> building + bringing up $CONFIG"
        compose up -d --build --wait --wait-timeout 300
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
