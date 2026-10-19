#!/usr/bin/env bash
# IndexNow ping — GUNARA CONSULTAN
# ----------------------------------------------------------------------------
# Memberi tahu aliansi IndexNow (Bing, Yandex, Naver, Seznam, Yep) bahwa
# sitemap situs berubah → mesin non-Google mengindeks lebih cepat.
# Google TIDAK memakai IndexNow; Google merayapi sitemap.xml otomatis.
#
# Pemakaian (setelah deploy produksi):
#   bash scripts/indexnow.sh                       # kirim semua URL via endpoint situs
#   curl -X POST https://<domain>/api/indexnow \
#        -H 'Content-Type: application/json' \
#        -d '{"urls":["https://<domain>/perizinan/izin-baru"]}'   # halaman tertentu
set -euo pipefail

BASE_URL="${1:-${NEXT_PUBLIC_SITE_URL:-https://topkonsultan.web.id}}"

echo "→ Ping IndexNow via ${BASE_URL}/api/indexnow"
curl -fsS "${BASE_URL}/api/indexnow"
echo
echo "✓ Selesai. Cek status field pada respons (200/202 = diterima)."
