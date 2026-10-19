#!/bin/bash
# Walkthrough Alur Bab 4–5 Tutorial — verifikasi hidup end-to-end:
#   Login CEO → (client) buat tiket → CEO balas → terbitkan invoice → ekspor CSV
# Mengikuti panduan: download/panduan-gunara.html (Bab 4: Peran & Kredensial, Bab 5: Panel CEO)
set -u
BASE="http://localhost:3000"
CEO_PASS="GUNARA-CEO-2026"
CLI_CODE="GUNARA-CLI-99A9-J27A"   # Sari Dewi (PRO) — client demo dari tutorial Bab 4
J="-H Content-Type:application/json"
STEP=0
ok()   { STEP=$((STEP+1)); echo "  [OK]  $1"; }
bad()  { STEP=$((STEP+1)); echo "  [GAGAL] $1"; }
say()  { echo ""; echo "== $1 =="; }

echo "╔══════════════════════════════════════════════════════╗"
echo "║  GUNARA — Walkthrough Alur Bab 4–5 (Tutorial)        ║"
echo "╚══════════════════════════════════════════════════════╝"

say "1. Bab 4 — Login CEO di /#/admin (ADMIN_PASSWORD)"
R=$(curl -s -c /tmp/w_ceo.txt -w "\n%{http_code}" -X POST $BASE/api/admin/login $J -d "{\"password\":\"$CEO_PASS\"}")
[ "$(echo "$R" | tail -1)" = "200" ] && ok "CEO masuk (cookie sesi 8 jam)" || { bad "login CEO: $R"; exit 1; }

say "2. Bab 5 — Client Sari Dewi masuk portal, buat tiket dukungan"
R=$(curl -s -c /tmp/w_cli.txt -w "\n%{http_code}" -X POST $BASE/api/portal/login $J -d '{"portal":"client","code":"'$CLI_CODE'"}')
[ "$(echo "$R" | tail -1)" = "200" ] && ok "Client masuk portal" || { bad "login client: $R"; exit 1; }
R=$(curl -s -b /tmp/w_cli.txt -w "\n%{http_code}" -X POST $BASE/api/portal/actions $J \
  -d '{"action":"tiket","sub":"buat","subject":"[Demo Bab 4-5] Permintaan konsultasi pajak","body":"Mohon penjelasan kewajiban pajak badan untuk PT kami tahun ini.","category":"konsultasi","priority":"tinggi"}')
ST=$(echo "$R" | tail -1)
TIKET_REF=$(echo "$R" | head -n -1 | python3 -c "import sys,json; print(json.load(sys.stdin).get('refCode',''))" 2>/dev/null)
[ "$ST" = "200" ] && [ -n "$TIKET_REF" ] && ok "Tiket dibuat: $TIKET_REF (WA otomatis ke admin)" || { bad "buat tiket: $R"; exit 1; }
TIKET_ID=$(curl -s -b /tmp/w_cli.txt $BASE/api/portal/data | python3 -c "import sys,json; d=json.load(sys.stdin); print([t['id'] for t in d['tickets'] if t['refCode']=='$TIKET_REF'][0])" 2>/dev/null)
[ -n "$TIKET_ID" ] && ok "ID tiket ditemukan via portal/data" || { bad "tiket tidak terlihat di portal"; exit 1; }

say "3. Bab 5 (tab Dukungan) — CEO balas tiket"
R=$(curl -s -b /tmp/w_ceo.txt -w "\n%{http_code}" -X POST $BASE/api/admin/team $J \
  -d '{"kind":"tiket","action":"balas","data":{"id":"'$TIKET_ID'","message":"Terima kasih. Tim pajak kami akan mengirimkan ringkasan kewajiban PPh Badan hari ini juga."}}')
ST=$(echo "$R" | tail -1)
[ "$ST" = "200" ] && ok "CEO membalas (auto-assign + WA ke client)" || bad "balas tiket: $R"

say "4. Bab 5 (tab Invoice) — CEO terbitkan invoice untuk client"
CLI_ID=$(curl -s -b /tmp/w_ceo.txt $BASE/api/admin/team | python3 -c "import sys,json; d=json.load(sys.stdin); print([c['id'] for c in d['clients'] if 'Sari' in c['name']][0])")
R=$(curl -s -b /tmp/w_ceo.txt -w "\n%{http_code}" -X POST $BASE/api/admin/team $J \
  -d '{"kind":"invoice","action":"create","data":{"clientId":"'$CLI_ID'","items":[{"desc":"Konsultasi pajak badan (sesi demo Bab 4-5)","qty":1,"price":2500000},{"desc":"Penyusunan kalender pajak","qty":2,"price":750000}],"note":"Walkthrough tutorial — termin 100% di muka"}}')
ST=$(echo "$R" | tail -1)
INV_ID=$(echo "$R" | head -n -1 | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
INV_REF=$(echo "$R" | head -n -1 | python3 -c "import sys,json; print(json.load(sys.stdin).get('refCode',''))" 2>/dev/null)
[ "$ST" = "200" ] && [ -n "$INV_ID" ] && ok "Invoice terbit: $INV_REF — Rp 4.000.000" || { bad "buat invoice: $R"; exit 1; }

R=$(curl -s -b /tmp/w_ceo.txt -w "\n%{http_code}" -X POST $BASE/api/admin/team $J \
  -d '{"kind":"invoice","action":"status","data":{"id":"'$INV_ID'","status":"terkirim"}}')
[ "$(echo "$R" | tail -1)" = "200" ] && ok "Status → TERKIRIM (WA otomatis ke client)" || bad "status invoice: $R"

S=$(curl -s -b /tmp/w_cli.txt -o /tmp/w_inv.pdf -w "%{http_code}" "$BASE/api/reports/pdf?type=invoice&id=$INV_ID")
[ "$S" = "200" ] && [ "$(head -c 4 /tmp/w_inv.pdf)" = "%PDF" ] && ok "Client unduh PDF invoice ($(wc -c < /tmp/w_inv.pdf) byte, valid)" || bad "PDF invoice status=$S"

say "5. Bab 5 (tab Audit & Ekspor) — CEO ekspor CSV"
for T in tiket invoice; do
  H=$(curl -s -b /tmp/w_ceo.txt -D /tmp/w_hdr.txt -o /tmp/w_$T.csv -w "%{http_code}" "$BASE/api/admin/export?type=$T")
  BOM=$(head -c 3 /tmp/w_$T.csv | od -An -tx1 | tr -d ' \n')
  ROWS=$(($(wc -l < /tmp/w_$T.csv)))
  [ "$H" = "200" ] && [ "$BOM" = "efbbbf" ] && ok "Ekspor CSV '$T': $ROWS baris, BOM UTF-8 Excel-ready" || bad "ekspor $T: status=$H bom=$BOM"
done

say "6. Bab 5 — Jejak lengkap di Audit Log"
A=$(curl -s -b /tmp/w_ceo.txt $BASE/api/admin/team)
for ACT in tiket_buat tiket_balas invoice_buat invoice_status ekspor_csv; do
  echo "$A" | rg -q "$ACT" && ok "Audit tercatat: $ACT" || bad "Audit tidak menemukan: $ACT"
done

say "7. Bersih-bersih (logout portal client)"
curl -s -b /tmp/w_cli.txt -X DELETE $BASE/api/portal/login > /dev/null && ok "Sesi client ditutup"

echo ""
echo "══════════════════════════════════════════════"
echo "HASIL: $STEP langkah, tiket $TIKET_REF, invoice $INV_REF"
echo "══════════════════════════════════════════════"
