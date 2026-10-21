#!/bin/bash
# Portret pimpinan PT TOP KONSULTAN INTERNASIONAL — 7 eksekutif Indonesia
# Gaya konsisten dengan set leadership-1..6 (black-gold editorial)
set -u
cd /home/z/my-project
mkdir -p public/images

gen() {
  local prompt="$1"; local out="$2"; local size="$3"
  if [ -s "$out" ]; then echo "SKIP $out (exists)"; return 0; fi
  echo "GEN $out ..."
  z-ai image -p "$prompt" -o "$out" -s "$size" && echo "OK  $out" || echo "FAIL $out"
}

STYLE="dark charcoal studio background, dramatic warm golden rim light, shallow depth of field, 85mm lens, photorealistic, premium executive photography, high quality, detailed"

# 1. PENDIRI & DIREKTUR UTAMA — Gugun Gunara (Tasikmalaya)
gen "Editorial executive portrait of a distinguished charismatic Indonesian businessman in his mid fifties, confident warm smile, neatly groomed black hair with subtle gray at temples, wearing an impeccable black suit with a golden batik-patterned pocket square, $STYLE" "public/images/founder-gugun-gunara.png" "864x1152"

# 2. Bimo Aria Wibowo — Wakil Direktur Utama
gen "Editorial executive portrait of an Indonesian man in his late forties with short black hair wearing a tailored charcoal suit and dark tie, calm authoritative expression, $STYLE" "public/images/leadership-7.png" "864x1152"

# 3. Sri Ayu Kartika — Direktur Perizinan & Regulasi
gen "Editorial executive portrait of an elegant Indonesian professional woman in her forties wearing a refined black hijab and tailored dark blazer, poised confident smile, $STYLE" "public/images/leadership-8.png" "864x1152"

# 4. Rangga Prasetyo — Direktur Strategi Korporat
gen "Editorial executive portrait of an Indonesian man in his early forties with modern glasses wearing a black suit without tie, sharp thoughtful gaze, $STYLE" "public/images/leadership-9.png" "864x1152"

# 5. Maya Anggraini — Kepala Oracle & Teknologi
gen "Editorial executive portrait of a modern Indonesian professional woman in her late thirties with long dark hair wearing an elegant black blazer, intelligent confident expression, $STYLE" "public/images/leadership-10.png" "864x1152"

# 6. Arif Nugroho — Direktur Keuangan
gen "Editorial executive portrait of an Indonesian man in his mid fifties with silver-streaked hair wearing a charcoal three-piece suit, composed dignified expression, $STYLE" "public/images/leadership-11.png" "864x1152"

# 7. Dewi Sartika — Kepala Sumber Daya Manusia
gen "Editorial executive portrait of a graceful Indonesian professional woman in her forties with short dark hair wearing a dark elegant blazer, warm assured smile, $STYLE" "public/images/leadership-12.png" "864x1152"

echo "ALL DONE"
