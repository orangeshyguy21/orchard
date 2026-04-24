#!/bin/sh
# Run the supertest tier against every e2e config sequentially, fail-fast.
# Stacks must already be up (`npm run e2e:up all`).
#
# To debug a single config, call jest directly:
#   E2E_CONFIG=lnd-cdk-sqlite npx jest --config ./e2e/supertest/jest.config.json
set -eu

HERE="$(cd "$(dirname "$0")/.." && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
CONFIGS_DIR="$REPO/e2e/docker/configs"
JEST_CONFIG="$HERE/jest.config.json"

for c in $(cd "$CONFIGS_DIR" && ls -1 -d */ | sed 's|/$||'); do
    echo ""
    echo "=========================================="
    echo "==> supertest: $c"
    echo "=========================================="
    E2E_CONFIG="$c" npx jest --config "$JEST_CONFIG"
done
