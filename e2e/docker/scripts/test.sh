#!/bin/sh
# Orchard e2e — playwright wrapper that translates a 'most' | 'all' target
# into the right env + filters.
#
# Usage:
#   ./test.sh                    # legacy: whatever's in the env, no filter
#   ./test.sh most               # run the matrix without @mainchain specs
#   ./test.sh all                # run the matrix including @mainchain
#   ./test.sh most -- --project=cln-nutshell-postgres:3325  # extra args
#
# Extra args after `--` are forwarded to playwright untouched, so existing
# `--project=...` / `--grep` / `--reporter=...` usage still works.
set -eu

TARGET="${1:-}"
shift || true

# Strip an optional leading `--` separator (makes 'most -- --project=...' work
# the same as 'most --project=...').
if [ "${1:-}" = "--" ]; then
    shift
fi

case "$TARGET" in
    all)
        export E2E_MAINCHAIN=1
        echo "==> target 'all' — @mainchain specs enabled"
        ;;
    most)
        export E2E_MAINCHAIN=0
        echo "==> target 'most' — @mainchain specs skipped"
        ;;
    "")
        # No target — honor whatever's already in the env. Keeps the bare
        # `npm run e2e:test -- ...` workflow working for ad-hoc filters.
        :
        ;;
    *)
        # Not a known target — treat as a passthrough arg (e.g. someone
        # typed `e2e:test --project=...` without a target word).
        set -- "$TARGET" "$@"
        ;;
esac

exec npx playwright test --config=./e2e/playwright.config.ts "$@"
