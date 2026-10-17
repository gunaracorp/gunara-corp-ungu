#!/usr/bin/env bash
# ============================================================================
# REBRANDING TOP KONSULTAN → GUNARA CORPORATION / GUNARA CONSULTAN
# Aturan berurutan (spesifik → umum). Idempoten: pola lama tak ada lagi
# setelah jalan pertama, jadi jalan kedua = no-op.
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

apply() { # $1 = perl expression, sisanya = file list
  local expr="$1"; shift
  for f in "$@"; do
    [ -f "$f" ] && perl -pi -e "$expr" "$f"
  done
}

# Kumpulan file sumber + dokumen utama
mapfile -t FILES < <(find src README.md DEPLOY.md .env.example -type f \
  \( -name '*.ts' -o -name '*.tsx' -o -name '*.md' -o -name '.env.example' \) \
  | sort)

echo "→ ${#FILES[@]} file diproses"

# 1-2. Nama legal lengkap (huruf kapital)
apply 's/PT\.? TOP KONSULTAN INTERNASIONAL/GUNARA CORPORATION/g' "${FILES[@]}"
apply 's/TOP KONSULTAN INTERNASIONAL/GUNARA CORPORATION/g' "${FILES[@]}"
# 3-4. Varian kapitalisasi campuran
apply 's/PT TOP Konsultan Internasional/Gunara Corporation/g' "${FILES[@]}"
apply 's/TOP Konsultan Nusantara/Gunara Consultan Nusantara/g' "${FILES[@]}"
# 5-6. Wordmark
apply 's/TOP KONSULTAN/GUNARA CONSULTAN/g' "${FILES[@]}"
apply 's/TOP Konsultan/Gunara Consultan/g' "${FILES[@]}"
# 7-8. Telepon & WhatsApp resmi baru
apply 's/\+62 ?811-1116-5165/+62 813-1651-6524/g' "${FILES[@]}"
apply 's/6281111165165/6281316516524/g' "${FILES[@]}"
# 9. Kunci sessionStorage internal (jangan sentuh domain topkonsultan.web.id!)
apply 's/topkonsultan_(vvip_code|preloader_seen)/gunara_$1/g' "${FILES[@]}"
# 10. Sisa singkatan merek "TOP" → GUNARA (tim TOP, Piagam TOP, TOP-VVIP, dst.)
apply 's/\bTOP\b/GUNARA/g' "${FILES[@]}"

echo "✓ Selesai. Sisa referensi lama:"
grep -rnE "PT\.? TOP|TOP KONSULTAN|TOP Konsultan|\bTOP\b|811-1116|6281111165165|topkonsultan_(vvip|preloader)" \
  src README.md DEPLOY.md .env.example 2>/dev/null | head -20 || true
echo "(baris kosong = bersih)"
