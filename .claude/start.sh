#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22 > /dev/null 2>&1

# Load .env from the main repo (persists across worktrees)
set -a
source "$(git rev-parse --show-superproject-working-tree 2>/dev/null || echo "$(pwd)")/.env" 2>/dev/null \
  || source /Users/admin/Sites/orchard/.env
set +a

# Override port so AI doesn't collide with human dev
export SERVER_PORT=3322
exec npm "$@"
