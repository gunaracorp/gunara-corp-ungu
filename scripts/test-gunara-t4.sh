#!/bin/bash
# E2E Test — Fitur Baru GUNARA: Tiket Dukungan, Invoice, Audit Log, Ekspor CSV, PDF Invoice
# Kredensial dari seed demo (worklog Task 3)
set -u
BASE="http://localhost:3000"
CEO_PASS="GUNARA-CEO-2026"
EMP_CODE="GUNARA-EMP-3ATE-HHHT"   # Budi (GOD)
CLI_CODE="GUNARA-CLI-99A9-J27A"   # Sari Dewi (PRO)

PASS=0; FAIL=0
ck() { # ck <nama> <expected_status> <actual_status> [extra_ok]
  local nama="$1" exp="$2" act="$3" extra="${4:-}"
  if [ "$act" = "$exp" ] && { [ -z "$extra" ] || [ "$extra" = "1" ]; }; then
    PASS=$((PASS+1)); echo "PASS  $nama"
  else
    FAIL=$((FAIL+1)); echo "FAIL  $nama (status=$act, harap=$exp, extra=$extra)"
  fi
}

J="-H Content-Type:application/json"

echo "=== 1. Login CEO ==="
R=$(curl -s -c /tmp/t4_ceo.txt -w "\n%{http_code}" -X POST $BASE/api/admin/login $J -d "{\"password\":\"$CEO_PASS\"}")
ck "login CEO" 200 "$(echo "$R" | tail -1)"
ck "login CEO ok:true" 200 "$(echo "$R" | head -1 | rg -o '"ok":true' >/dev/null && echo 200 || echo 0)"

echo "=== 2. Login Portal (karyawan & client) ==="
R=$(curl -s -c /tmp/t4_emp.txt -w "\n%{http_code}" -X POST $BASE/api/portal/login $J -d '{"portal":"karyawan","code":"'$EMP_CODE'"}')
ck "login karyawan" 200 "$(echo "$R" | tail -1)"
R=$(curl -s -c /tmp/t4_cli.txt -w "\n%{http_code}" -X POST $BASE/api/portal/login $J -d '{"portal":"client","code":"'$CLI_CODE'"}')
ck "login client" 200 "$(echo "$R" | tail -1)"

echo "=== 3. Client buat tiket ==="
R=$(curl -s -b /tmp/t4_cli.txt -w "\n%{http_code}" -X POST $BASE/api/portal/actions $J -d '{"action":"tiket","sub":"buat","subject":"Tiket uji E2E fitur baru","body":"Mohon bantuan penjelasan tagihan untuk proyek uji otomatis.","category":"tagihan","priority":"tinggi"}')
ck "client buat tiket" 200 "$(echo "$R" | tail -1)"
TIKET_REF=$(echo "$R" | head -1 | rg -o '"refCode":"(TIK-[^"]+)"' -r '$1')
echo "      ref: $TIKET_REF"

echo "=== 4. WA otomatis ke admin atas tiket (cek admin team) ==="
R=$(curl -s -b /tmp/t4_ceo.txt $BASE/api/admin/team)
ck "GET admin/team" 200 200
ck "audit berisi tiket_buat" 200 "$(echo "$R" | rg -q 'tiket_buat' && echo 200 || echo 0)"
ck "waItems berisi ref tiket" 200 "$(echo "$R" | rg -q "$TIKET_REF" && echo 200 || echo 0)"

echo "=== 5. Karyawan lihat tiket & balas ==="
R=$(curl -s -b /tmp/t4_emp.txt $BASE/api/portal/data)
ck "portal data karyawan punya tickets" 200 "$(echo "$R" | rg -q '"tickets":\[' && echo 200 || echo 0)"
TIKET_ID=$(echo "$R" | python3 -c "import sys,json; d=json.load(sys.stdin); t=[x for x in d['tickets'] if x['refCode']=='$TIKET_REF']; print(t[0]['id'] if t else '')")
if [ -n "$TIKET_ID" ]; then
  R=$(curl -s -b /tmp/t4_emp.txt -w "\n%{http_code}" -X POST $BASE/api/portal/actions $J -d '{"action":"tiket","sub":"balas","ticketId":"'$TIKET_ID'","message":"Baik, kami proses penjelasannya hari ini."}')
  ck "karyawan balas tiket (auto-assign)" 200 "$(echo "$R" | tail -1)"
else
  ck "karyawan balas tiket" 404 0
fi

echo "=== 6. CEO assign + status tiket ==="
EMP_ID=$(curl -s -b /tmp/t4_ceo.txt $BASE/api/admin/team | python3 -c "import sys,json; d=json.load(sys.stdin); print([e['id'] for e in d['employees'] if e['name']=='Budi Santoso'][0])")
R=$(curl -s -b /tmp/t4_ceo.txt -w "\n%{http_code}" -X POST $BASE/api/admin/team $J -d '{"kind":"tiket","action":"status","data":{"id":"'$TIKET_ID'","status":"diproses"}}')
ck "CEO ubah status tiket" 200 "$(echo "$R" | tail -1)"

echo "=== 7. CEO buat invoice untuk client ==="
CLI_ID=$(curl -s -b /tmp/t4_ceo.txt $BASE/api/admin/team | python3 -c "import sys,json; d=json.load(sys.stdin); print([c['id'] for c in d['clients'] if 'Sari' in c['name']][0])")
R=$(curl -s -b /tmp/t4_ceo.txt -w "\n%{http_code}" -X POST $BASE/api/admin/team $J -d '{"kind":"invoice","action":"create","data":{"clientId":"'$CLI_ID'","items":[{"desc":"Konsultasi pendirian PT","qty":1,"price":3500000},{"desc":"Pengurusan OSS per jam","qty":4,"price":500000}],"note":"Termin pembayaran 100% di muka"}}')
ck "CEO buat invoice" 200 "$(echo "$R" | tail -1)"
INV_ID=$(echo "$R" | head -1 | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))")
INV_REF=$(echo "$R" | head -1 | python3 -c "import sys,json; print(json.load(sys.stdin).get('refCode',''))")
echo "      invoice: $INV_REF (id=$INV_ID)"

echo "=== 8. Invoice status terkirim → WA otomatis ==="
R=$(curl -s -b /tmp/t4_ceo.txt -w "\n%{http_code}" -X POST $BASE/api/admin/team $J -d '{"kind":"invoice","action":"status","data":{"id":"'$INV_ID'","status":"terkirim"}}')
ck "invoice → terkirim" 200 "$(echo "$R" | tail -1)"

echo "=== 9. Client lihat invoice + unduh PDF ==="
R=$(curl -s -b /tmp/t4_cli.txt $BASE/api/portal/data)
ck "portal data client punya invoices" 200 "$(echo "$R" | rg -q '"invoices":\[' && echo 200 || echo 0)"
ck "invoice client berisi ref" 200 "$(echo "$R" | rg -q "$INV_REF" && echo 200 || echo 0)"
S=$(curl -s -b /tmp/t4_cli.txt -o /tmp/t4_inv.pdf -w "%{http_code}" "$BASE/api/reports/pdf?type=invoice&id=$INV_ID")
ck "unduh PDF invoice (200)" 200 "$S"
ck "PDF invoice valid (%PDF)" 200 "$(head -c 4 /tmp/t4_inv.pdf | rg -q '%PDF' && echo 200 || echo 0)"
echo "      ukuran: $(wc -c < /tmp/t4_inv.pdf) byte"

echo "=== 10. Ekspor CSV (CEO) ==="
for T in karyawan client proyek tiket invoice dokumen wa audit; do
  S=$(curl -s -b /tmp/t4_ceo.txt -o /tmp/t4_exp.csv -w "%{http_code}" "$BASE/api/admin/export?type=$T")
  OKX=0; [ "$S" = "200" ] && head -c 3 /tmp/t4_exp.csv | od -An -tx1 | rg -q "ef bb bf" && OKX=1
  ck "ekspor CSV $T (200+BOM)" 200 "$S" "$OKX"
done
S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/admin/export?type=proyek")
ck "ekspor tanpa sesi → 403" 403 "$S"

echo "=== 11. Audit log tumbuh ==="
R=$(curl -s -b /tmp/t4_ceo.txt $BASE/api/admin/team)
ck "audit berisi ekspor_csv" 200 "$(echo "$R" | rg -q 'ekspor_csv' && echo 200 || echo 0)"
ck "audit berisi invoice_buat" 200 "$(echo "$R" | rg -q 'invoice_buat' && echo 200 || echo 0)"
ck "audit berisi login" 200 "$(echo "$R" | rg -q '"login"' && echo 200 || echo 0)"

echo "=== 12. Client menutup tiketnya ==="
R=$(curl -s -b /tmp/t4_cli.txt -w "\n%{http_code}" -X POST $BASE/api/portal/actions $J -d '{"action":"tiket","sub":"status","ticketId":"'$TIKET_ID'","status":"selesai"}')
ck "client selesaikan tiket" 200 "$(echo "$R" | tail -1)"

echo ""
echo "================================"
echo "HASIL: $PASS PASS, $FAIL FAIL"
echo "================================"
[ $FAIL -eq 0 ]
