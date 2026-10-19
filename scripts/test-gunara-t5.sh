#!/bin/bash
# E2E Test Task 5 — Fitur baru: Backup otomatis terjadwal (+ guard, unduh, hapus, audit)
# Grafik Recharts & multi-bahasa diverifikasi via browser (Agent Browser).
set -u
BASE="http://localhost:3000"
CEO_PASS="GUNARA-CEO-2026"
J="-H Content-Type:application/json"
PASS=0; FAIL=0
ck() {
  local nama="$1" ok="$2"
  if [ "$ok" = "1" ]; then PASS=$((PASS+1)); echo "PASS  $nama"; else FAIL=$((FAIL+1)); echo "FAIL  $nama"; fi
}

echo "=== A. Guard backup API ==="
S=$(curl -s -o /dev/null -w "%{http_code}" $BASE/api/admin/backup)
ck "GET /api/admin/backup tanpa sesi → 403" "$([ "$S" = "403" ] && echo 1 || echo 0)"
S=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/api/admin/backup)
ck "POST /api/admin/backup tanpa sesi → 403" "$([ "$S" = "403" ] && echo 1 || echo 0)"

echo "=== B. Login CEO ==="
S=$(curl -s -c /tmp/t5_ceo.txt -o /dev/null -w "%{http_code}" -X POST $BASE/api/admin/login $J -d "{\"password\":\"$CEO_PASS\"}")
ck "login CEO" "$([ "$S" = "200" ] && echo 1 || echo 0)"

echo "=== C. Status scheduler ==="
R=$(curl -s -b /tmp/t5_ceo.txt $BASE/api/admin/backup)
ck "status scheduler enabled" "$(echo "$R" | rg -q '"enabled":true' && echo 1 || echo 0)"
ck "interval 24 jam" "$(echo "$R" | rg -q '"intervalHours":24' && echo 1 || echo 0)"
ck "keep 10" "$(echo "$R" | rg -q '"keep":10' && echo 1 || echo 0)"

echo "=== D. Backup manual + verifikasi arsip ==="
R=$(curl -s -b /tmp/t5_ceo.txt -X POST $BASE/api/admin/backup)
BID=$(echo "$R" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('backup',{}).get('id',''))" 2>/dev/null)
[ -n "$BID" ] && ck "POST backup → $BID" 1 || { ck "POST backup" 0; exit 1; }
[ -f "/home/z/my-project/gunara-corp-ungu/backups/$BID" ] && ck "file arsip ada di backups/" 1 || ck "file arsip" 0
S=$(curl -s -b /tmp/t5_ceo.txt -o /tmp/t5_bak.tar.gz -w "%{http_code}" "$BASE/api/admin/backup?id=$BID")
MAGIC=$(head -c 2 /tmp/t5_bak.tar.gz)
ck "unduh arsip (200 + magic gzip)" "$([ "$S" = "200" ] && [ "$MAGIC" = $'\x1f\x8b' ] && echo 1 || echo 0)"
tar -tzf /tmp/t5_bak.tar.gz | rg -q "custom.db" && ck "arsip berisi database" 1 || ck "arsip berisi database" 0
tar -tzf /tmp/t5_bak.tar.gz | rg -q "uploads" && ck "arsip berisi uploads" 1 || ck "arsip berisi uploads" 0

echo "=== E. Audit & hapus ==="
R=$(curl -s -b /tmp/t5_ceo.txt $BASE/api/admin/team)
ck "audit tercatat: backup_buat" "$(echo "$R" | rg -q "backup_buat" && echo 1 || echo 0)"
S=$(curl -s -b /tmp/t5_ceo.txt -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/admin/backup?id=$BID")
ck "hapus arsip (200)" "$([ "$S" = "200" ] && echo 1 || echo 0)"
[ ! -f "/home/z/my-project/gunara-corp-ungu/backups/$BID" ] && ck "file terhapus" 1 || ck "file terhapus" 0
S=$(curl -s -b /tmp/t5_ceo.txt -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/admin/backup?id=../evil.tar.gz")
ck "path-traversal ditolak (400)" "$([ "$S" = "400" ] && echo 1 || echo 0)"

echo "=== F. Smoke: halaman & API inti tetap sehat ==="
S=$(curl -s -o /dev/null -w "%{http_code}" $BASE/)
ck "root 200" "$([ "$S" = "200" ] && echo 1 || echo 0)"
S=$(curl -s -b /tmp/t5_ceo.txt -o /dev/null -w "%{http_code}" $BASE/api/admin/team)
ck "admin/team 200" "$([ "$S" = "200" ] && echo 1 || echo 0)"

echo ""
echo "══════════════════════════════════════════════"
echo "HASIL: $PASS PASS, $FAIL FAIL"
echo "══════════════════════════════════════════════"
