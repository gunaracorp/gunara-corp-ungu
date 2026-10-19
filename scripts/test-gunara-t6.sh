#!/usr/bin/env bash
# ============================================================
# TEST GUNARA — T6: Fitur 195 Bahasa (i18n god mode)
# API locales/status/overrides/generate + registry + guard
# ============================================================
set -u
BASE="http://localhost:3000"
JAR="$(mktemp)"
PASS=0; FAIL=0
ok(){ PASS=$((PASS+1)); echo "PASS  $1"; }
no(){ FAIL=$((FAIL+1)); echo "FAIL  $1"; }

check(){ # nama, kondisi (0/1)
  if [ "$2" -eq 0 ]; then ok "$1"; else no "$1"; fi
}

# 1. Root hidup
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/")
[ "$code" = "200" ]; check "root 200" $?

# 2. Registry tepat 195
total=$(bun -e "const l=require('./src/lib/i18n/languages.json'); console.log(l.length)")
[ "$total" = "195" ]; check "registry = 195 bahasa" $?

# 3. Locale publik ja lengkap
n=$(curl -s "$BASE/api/i18n/locales?code=ja" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d['data']))")
[ "$n" -ge 60 ]; check "locale ja terisi ($n kunci)" $?

# 4. Locale publik zh
okz=$(curl -s "$BASE/api/i18n/locales?code=zh" | python3 -c "import json,sys; print(json.load(sys.stdin)['ok'])")
[ "$okz" = "True" ]; check "locale zh ok" $?

# 5. Kode tak dikenal → 404
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/i18n/locales?code=xx_zz")
[ "$code" = "404" ]; check "kode tak dikenal 404" $?

# 6. Status tanpa sesi → 403
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/i18n/status")
[ "$code" = "403" ]; check "status tanpa sesi 403" $?

# 7. Login CEO
okl=$(curl -s -c "$JAR" -X POST "$BASE/api/admin/login" -H "Content-Type: application/json" -d '{"password":"GUNARA-CEO-2026"}' | python3 -c "import json,sys; print(json.load(sys.stdin)['ok'])")
[ "$okl" = "True" ]; check "login CEO" $?

# 8. Status dgn sesi → total 195
st=$(curl -s -b "$JAR" "$BASE/api/i18n/status" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['ok'], d['total'], d['expected'])")
[ "$st" = "True 195 69" ]; check "status: total 195, kunci 69" $?

# 9. PUT override
okp=$(curl -s -b "$JAR" -X PUT "$BASE/api/i18n/overrides" -H "Content-Type: application/json" -d '{"lang":"jv","key":"tab.overview","value":"Ringkesan Utama"}' | python3 -c "import json,sys; print(json.load(sys.stdin)['ok'])")
[ "$okp" = "True" ]; check "PUT override jv" $?

# 10. Override ter-merge
mv=$(curl -s "$BASE/api/i18n/locales?code=jv" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['tab.overview'])")
[ "$mv" = "Ringkesan Utama" ]; check "override ter-merge di /locales" $?

# 11. Override terlihat di endpoint overrides
ov=$(curl -s "$BASE/api/i18n/overrides?lang=jv" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['tab.overview'])")
[ "$ov" = "Ringkesan Utama" ]; check "GET overrides jv" $?

# 12. PUT kunci tak dikenal → 400
code=$(curl -s -b "$JAR" -o /dev/null -w "%{http_code}" -X PUT "$BASE/api/i18n/overrides" -H "Content-Type: application/json" -d '{"lang":"jv","key":"kunci.ngawur","value":"x"}')
[ "$code" = "400" ]; check "PUT kunci ngawur 400" $?

# 13. PUT tanpa sesi → 403
code=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$BASE/api/i18n/overrides" -H "Content-Type: application/json" -d '{"lang":"jv","key":"tab.overview","value":"x"}')
[ "$code" = "403" ]; check "PUT tanpa sesi 403" $?

# 14. DELETE override → kembali ke berkas
okd=$(curl -s -b "$JAR" -X DELETE "$BASE/api/i18n/overrides?lang=jv&key=tab.overview" | python3 -c "import json,sys; print(json.load(sys.stdin)['ok'])")
mv2=$(curl -s "$BASE/api/i18n/locales?code=jv" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['tab.overview'])")
{ [ "$okd" = "True" ] && [ "$mv2" = "Ringkesan" ]; }; check "DELETE override → nilai asli" $?

# 15. Audit tercatat
au=$(curl -s -b "$JAR" "$BASE/api/admin/team" | python3 -c "
import json,sys
d=json.load(sys.stdin)
acts=[a['action'] for a in d.get('audit',[])]
print('i18n_override' in acts)")
[ "$au" = "True" ]; check "audit i18n_override tercatat" $?

# 16. Generate kode ngawur → 400
code=$(curl -s -b "$JAR" -o /dev/null -w "%{http_code}" -X POST "$BASE/api/i18n/generate" -H "Content-Type: application/json" -d '{"code":"xx_zz"}')
[ "$code" = "400" ]; check "generate kode ngawur 400" $?

# 17. Generate tanpa sesi → 403
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/i18n/generate" -H "Content-Type: application/json" -d '{"code":"ja"}')
[ "$code" = "403" ]; check "generate tanpa sesi 403" $?

# 18. Validator skrip
v=$(bun scripts/check-locales.mjs | grep -c "registry      : 195")
[ "$v" -ge 1 ]; check "check-locales: registry 195" $?

# 19. Semua berkas locale yang ada lengkap
p=$(bun scripts/check-locales.mjs | grep "parsial" | grep -oE "parsial       : [0-9]+" | grep -oE "[0-9]+")
[ "$p" = "0" ]; check "tidak ada locale parsial/rusak" $?

# 20. RTL list 13 bahasa
rtl=$(bun -e "const l=require('./src/lib/i18n/languages.json'); console.log(l.filter(x=>x[5]===1).length)")
[ "$rtl" = "13" ]; check "13 bahasa RTL" $?

echo
echo "══════════════════════════════════════════════"
echo "HASIL: $PASS PASS, $FAIL FAIL"
echo "══════════════════════════════════════════════"
rm -f "$JAR"
[ "$FAIL" = "0" ]
