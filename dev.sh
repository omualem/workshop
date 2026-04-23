#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "=== RentMatch Dev ==="
echo ""

# First-time setup: install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
  echo "[setup] node_modules not found — running npm install..."
  npm install
  echo ""
fi

# First-time setup: create .env files and seed the DB if the SQLite file is missing
if [ ! -f "apps/api/prisma/dev.db" ]; then
  echo "[setup] Database not found — running first-time setup (migrate + seed)..."
  npm run setup:local
  echo ""
fi

echo "[start] Starting API (port 4000) and Web (port 3000)..."
echo ""

npm run dev
