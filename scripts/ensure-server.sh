#!/usr/bin/env bash
# ensure-server.sh — pastikan server produksi standalone Next.js hidup di port 3000.
# Dipakai karena sandbox dapat mematikan background process antar tool call.
#
# PENTING: setelah `bun run build:standalone`, JALANKAN DENGAN --restart.
# Tanpa flag itu, server LAMA yang masih menjawab di port akan dianggap "OK"
# padahal ia menyajikan HTML/manifes build lama → chunk baru 404/500
# (jebakan terdokumentasi di worklog Task 12).
set -u
PORT="${PORT:-3000}"
BASE="http://localhost:${PORT}"
RESTART="${1:-}"

# 1. Sudah hidup? (lewati bila --restart diminta)
if [ "$RESTART" != "--restart" ] && curl -s -o /dev/null --max-time 3 "$BASE"; then
  echo "server OK on :$PORT"
  exit 0
fi

# 2. Bersihkan port — bun standalone / dev server / zombie apapun
pkill -f "standalone/server.js" 2>/dev/null
fuser -k "${PORT}/tcp" 2>/dev/null
sleep 1.5
# Verifikasi port benar-benar bebas; kalau masih ada penyusup, bunuh lagi.
if curl -s -o /dev/null --max-time 2 "$BASE"; then
  pkill -9 -f "standalone/server.js" 2>/dev/null
  fuser -k -9 "${PORT}/tcp" 2>/dev/null
  sleep 1.5
fi

# 3. Start standalone server
cd /home/z/my-project
PORT="$PORT" NODE_ENV=production nohup bun .next/standalone/server.js > server.log 2>&1 &
echo "starting standalone server on :$PORT (pid $!)"

# 4. Tunggu siap (maks 30 dtk)
for i in $(seq 1 30); do
  if curl -s -o /dev/null --max-time 2 "$BASE"; then
    echo "server UP after ${i}s"
    exit 0
  fi
  sleep 1
done

echo "server FAILED to start"; tail -20 server.log
exit 1
