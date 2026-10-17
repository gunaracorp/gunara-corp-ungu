#!/usr/bin/env bash
# lh-audit.sh — jalankan Lighthouse terhadap server produksi lokal (port 3000).
# Usage: lh-audit.sh <path> <form-factor:mobile|desktop>
set -u
PATH_URL="${1:-/}"
FORM="${2:-mobile}"
BASE="http://localhost:3000"
OUT_DIR="/home/z/my-project/lighthouse"
CHROME="/home/z/.cache/puppeteer/chrome/linux-153.0.8010.36/chrome-linux64/chrome"
export CHROME_PATH="$CHROME"

# Pastikan server hidup
bash /home/z/my-project/scripts/ensure-server.sh >/dev/null || { echo "server down"; exit 1; }

NAME=$(echo "$PATH_URL" | sed 's|^/$|home|; s|^/||; s|[/?.&=]|_|g')
OUT="$OUT_DIR/${NAME}-${FORM}.json"

lighthouse "$BASE$PATH_URL" \
  --quiet \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor="$FORM" \
  --screenEmulation.mobile="$([ "$FORM" = mobile ] && echo true || echo false)" \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage" \
  --max-wait-for-load=90000 \
  --output=json --output-path="$OUT" 2>&1 | tail -3

node /home/z/my-project/scripts/lh-summary.js "$OUT"
