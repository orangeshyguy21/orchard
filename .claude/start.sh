#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22 > /dev/null 2>&1

# Point the Angular dev-server at a running e2e docker stack.
# Source the stack's own env file so the runtime-config generator produces
# a client config that matches that stack (bitcoin/lightning/tapass/mint flags).
# Override with ORCHARD_STACK to target a different stack.
REPO_ROOT="$(git rev-parse --show-superproject-working-tree 2>/dev/null)"
[ -z "$REPO_ROOT" ] && REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
[ -z "$REPO_ROOT" ] && REPO_ROOT="/Users/admin/Sites/orchard"
STACK="${ORCHARD_STACK:-lnd-nutshell-sqlite}"
case "$STACK" in
  lnd-nutshell-sqlite)  STACK_PORT=3322 ;;
  cln-cdk-postgres)     STACK_PORT=3323 ;;
  lnd-cdk-sqlite)       STACK_PORT=3324 ;;
  cln-nutshell-postgres) STACK_PORT=3325 ;;
  *) STACK_PORT=3322 ;;
esac

# Pre-define the flag vars the runtime-config generator reads, so that
# generate-runtime-config.mjs's dotenv(override:false) treats them as already
# set and doesn't leak values from the repo-root .env into the dev-server
# build. Stack env (sourced next) will overwrite the ones it actually uses.
export BITCOIN_TYPE="" LIGHTNING_TYPE="" TAPROOT_ASSETS_TYPE="" MINT_TYPE="" MINT_DATABASE=""

set -a
source "$REPO_ROOT/e2e/docker/configs/$STACK/env" 2>/dev/null
set +a

export SERVER_PORT="$STACK_PORT"
exec npm "$@"
