#!/bin/bash
# Omniprime brand asset generation — 13 images via z-ai CLI
set -u
cd /home/z/my-project
mkdir -p public/images

gen() {
  local prompt="$1"; local out="$2"; local size="$3"
  if [ -s "$out" ]; then echo "SKIP $out (exists)"; return 0; fi
  echo "GEN $out ..."
  z-ai image -p "$prompt" -o "$out" -s "$size" && echo "OK  $out" || echo "FAIL $out"
}

gen "Editorial executive portrait of a distinguished man in his early sixties with silver hair and a tailored black suit, dark charcoal studio background, dramatic warm golden rim light, confident expression, shallow depth of field, 85mm lens, photorealistic, premium executive photography, high quality, detailed" "public/images/leadership-1.png" "864x1152"

gen "Editorial executive portrait of an elegant African woman in her fifties with natural short hair wearing a black turtleneck, dark charcoal studio background, dramatic warm golden rim light, confident subtle smile, shallow depth of field, 85mm lens, photorealistic, premium executive photography, high quality, detailed" "public/images/leadership-2.png" "864x1152"

gen "Editorial executive portrait of a Japanese man in his fifties with glasses wearing a charcoal suit, dark charcoal studio background, dramatic warm golden rim light, calm confident expression, shallow depth of field, 85mm lens, photorealistic, premium executive photography, high quality, detailed" "public/images/leadership-3.png" "864x1152"

gen "Editorial executive portrait of an Italian woman in her forties with dark hair wearing a black blazer, dark charcoal studio background, dramatic warm golden rim light, confident gaze, shallow depth of field, 85mm lens, photorealistic, premium executive photography, high quality, detailed" "public/images/leadership-4.png" "864x1152"

gen "Editorial executive portrait of an Indian man in his forties with a trimmed beard wearing a dark suit, dark charcoal studio background, dramatic warm golden rim light, confident expression, shallow depth of field, 85mm lens, photorealistic, premium executive photography, high quality, detailed" "public/images/leadership-5.png" "864x1152"

gen "Editorial executive portrait of a French woman in her forties with short blonde hair wearing an elegant black dress, dark charcoal studio background, dramatic warm golden rim light, poised confident expression, shallow depth of field, 85mm lens, photorealistic, premium executive photography, high quality, detailed" "public/images/leadership-6.png" "864x1152"

gen "Ultra modern black glass skyscraper headquarters at dusk with warm golden interior lights glowing, dramatic clouds, reflective marble plaza, architectural photography, cinematic, premium, high quality, detailed" "public/images/hq.png" "1344x768"

gen "Abstract 3D render of a shattered obsidian chessboard with golden light seeping through the cracks, black and gold palette, cinematic lighting, minimal composition, premium financial editorial cover, high quality, detailed" "public/images/insight-1.png" "1344x768"

gen "Abstract golden neural network threads forming a glowing human brain silhouette floating in black space, elegant, cinematic rim lighting, minimal, premium editorial cover, high quality, detailed" "public/images/insight-2.png" "1344x768"

gen "Vast dunes of black glass under a golden energy sky with glowing gold veins running through the sand, minimal cinematic landscape, premium editorial cover, high quality, detailed" "public/images/insight-3.png" "1344x768"

gen "A single luminous golden thread being pulled from a dark woven tapestry, macro photography, dramatic chiaroscuro light, black background, premium editorial cover, high quality, detailed" "public/images/insight-4.png" "1344x768"

gen "Stylized world map drawn in glowing golden circuit lines on black marble, dramatic top lighting, minimal composition, premium editorial cover, high quality, detailed" "public/images/insight-5.png" "1344x768"

gen "Elegant hourglass with golden sand flowing upward against a pure black background, cinematic rim light, minimal, premium editorial cover, high quality, detailed" "public/images/insight-6.png" "1344x768"

echo "ALL DONE"
