#!/bin/sh
# ==============================================================
# wait-healthy.sh — bring up a pair and block until the whole
# stack is healthy (setup service exited clean, all others healthy).
#
# Usage:
#   ./wait-healthy.sh pair1
#   ./wait-healthy.sh pair2
# ==============================================================
set -eu

PAIR="${1:-pair1}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE="${HERE}/${PAIR}.compose.yml"
ENVFILE="${HERE}/${PAIR}.env"

if [ ! -f "$COMPOSE" ]; then
    echo "compose file not found: $COMPOSE" >&2
    exit 1
fi

echo "==> building + bringing up $PAIR"
docker compose \
    --env-file "$ENVFILE" \
    -f "$COMPOSE" \
    up -d --build --wait --wait-timeout 300

echo "==> $PAIR is healthy"
docker compose --env-file "$ENVFILE" -f "$COMPOSE" ps
