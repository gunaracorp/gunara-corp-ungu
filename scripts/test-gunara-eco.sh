#!/usr/bin/env bash
# =============================================================
# Tes E2E Ekosistem GUNARA — dokumen, WA, laporan PDF, tier/GOD MODE
# =============================================================
set -uo pipefail
BASE="http://localhost:3000"
PASS=0; FAIL=0
ok(){ PASS=$((PASS+1)); echo "  ✔ $1"; }
fail(){ FAIL=$((FAIL+1)); echo "  ✘ $1  →  ${2:-}"; }

check(){ # $1 deskripsi, $2 kondisi (0=ok)
  if [ "$2" -eq 0 ]; then ok "$1"; else fail "$1" "kondisi tidak terpenuhi"; fi
}

echo "── 1. Panel CEO ──────────────────────────────────────────"
LOGIN=$(curl -s -c /tmp/g_admin.txt -X POST "$BASE/api/admin/login" -H "Content-Type: application/json" -d '{"password":"GUNARA-CEO-2026"}')
check "login CEO" "$(echo "$LOGIN" | rg -q '"ok":true' && echo 0 || echo 1)"

TEAM=$(curl -s -b /tmp/g_admin.txt "$BASE/api/admin/team")
check "GET /api/admin/team memuat tierCodes+waItems+documents" "$(echo "$TEAM" | python3 -c 'import json,sys; d=json.load(sys.stdin); assert "tierCodes" in d and "waItems" in d and "documents" in d and "tierCodesAktif" in d["stats"]' 2>/dev/null && echo 0 || echo 1)"

echo "── 2. Kode tier & GOD MODE ───────────────────────────────"
KODE=$(curl -s -b /tmp/g_admin.txt -X POST "$BASE/api/admin/team" -H "Content-Type: application/json" -d '{"kind":"tier","action":"kode-create","data":{"tier":"GOD","targetRole":"karyawan","jumlah":1,"note":"tes-e2e"}}')
GODCODE=$(echo "$KODE" | python3 -c 'import json,sys; print(json.load(sys.stdin)["codes"][0])' 2>/dev/null)
check "terbitkan kode GOD ($GODCODE)" "$([ -n "$GODCODE" ] && echo 0 || echo 1)"

echo "── 3. Portal karyawan ────────────────────────────────────"
# Reset tier karyawan demo ke STANDARD lewat API set-tier (juga menguji endpoint-nya)
EMPID=$(echo "$TEAM" | python3 -c "import json,sys; d=json.load(sys.stdin); e=[x for x in d['employees'] if x['code']=='GUNARA-EMP-3ATE-HHHT']; print(e[0]['id'] if e else '')" 2>/dev/null)
curl -s -b /tmp/g_admin.txt -X POST "$BASE/api/admin/team" -H "Content-Type: application/json" -d "{\"kind\":\"tier\",\"action\":\"set-tier\",\"data\":{\"id\":\"$EMPID\",\"tier\":\"STANDARD\",\"targetKind\":\"karyawan\"}}" > /dev/null

KL=$(curl -s -c /tmp/g_emp.txt -X POST "$BASE/api/portal/login" -H "Content-Type: application/json" -d '{"portal":"karyawan","code":"GUNARA-EMP-3ATE-HHHT"}')
check "login karyawan" "$(echo "$KL" | rg -q '"ok":true' && echo 0 || echo 1)"

DATA=$(curl -s -b /tmp/g_emp.txt "$BASE/api/portal/data")
check "portal/data punya tier+tierInfo+waItems" "$(echo "$DATA" | python3 -c 'import json,sys; d=json.load(sys.stdin); assert d["profile"]["tier"] and "tierInfo" in d and "waItems" in d' 2>/dev/null && echo 0 || echo 1)"

TIER0=$(echo "$DATA" | python3 -c 'import json,sys; print(json.load(sys.stdin)["profile"]["tier"])')
echo "     tier awal: $TIER0"

AKT=$(curl -s -b /tmp/g_emp.txt -X POST "$BASE/api/tiers" -H "Content-Type: application/json" -d "{\"code\":\"$GODCODE\"}")
check "aktivasi kode → GOD MODE" "$(echo "$AKT" | rg -q '"tier":"GOD"' && echo 0 || echo 1)"

echo "── 4. Upload dokumen (karyawan) ──────────────────────────"
echo "Dokumen uji E2E GUNARA $(date +%s)" > /tmp/g_uji.txt
UP=$(curl -s -b /tmp/g_emp.txt -X POST "$BASE/api/documents/upload" -F "file=@/tmp/g_uji.txt" -F "note=dokumen tes e2e" -F "visibility=semua")
DOCID=$(echo "$UP" | python3 -c 'import json,sys; print(json.load(sys.stdin)["item"]["id"])' 2>/dev/null)
check "upload dokumen sukses" "$([ -n "$DOCID" ] && echo 0 || echo 1)"

LIST=$(curl -s -b /tmp/g_emp.txt "$BASE/api/documents")
check "daftar dokumen memuat berkas baru" "$(echo "$LIST" | python3 -c "import json,sys; d=json.load(sys.stdin); assert any(x['id']=='$DOCID' for x in d['items'])" 2>/dev/null && echo 0 || echo 1)"

DL=$(curl -s -b /tmp/g_emp.txt "$BASE/api/documents/$DOCID/file?download=1")
check "unduh berkas isi cocok" "$(echo "$DL" | rg -q 'Dokumen uji E2E GUNARA' && echo 0 || echo 1)"

NOAUTH=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/documents")
check "akses tanpa sesi ditolak (401/403)" "$([ "$NOAUTH" = "403" ] && echo 0 || echo 1)"

echo "── 5. Notifikasi WhatsApp ────────────────────────────────"
WAP=$(curl -s -b /tmp/g_emp.txt -X POST "$BASE/api/wa" -H "Content-Type: application/json" -d '{"action":"hubungi-admin","message":"Tes pesan karyawan ke CEO dari E2E."}')
check "portal kirim WA ke admin" "$(echo "$WAP" | rg -q '"ok":true' && echo 0 || echo 1)"

BLAST=$(curl -s -b /tmp/g_admin.txt -X POST "$BASE/api/wa" -H "Content-Type: application/json" -d '{"action":"kirim","audience":"karyawan","message":"Pengumuman tes blast dari E2E ekosistem GUNARA."}')
check "CEO blast WA ke karyawan" "$(echo "$BLAST" | rg -q '"ok":true' && echo 0 || echo 1)"

WAID=$(curl -s -b /tmp/g_admin.txt "$BASE/api/wa" | python3 -c 'import json,sys; d=json.load(sys.stdin); q=[x for x in d["items"] if x["status"]=="queued"]; print(q[0]["id"] if q else "")')
TANDAI=$(curl -s -b /tmp/g_admin.txt -X POST "$BASE/api/wa" -H "Content-Type: application/json" -d "{\"action\":\"tandai-terkirim\",\"id\":\"$WAID\"}")
check "tandai terkirim" "$(echo "$TANDAI" | rg -q '"ok":true' && echo 0 || echo 1)"

WALOG=$(curl -s -b /tmp/g_admin.txt "$BASE/api/admin/team" | python3 -c "import json,sys; d=json.load(sys.stdin); evs=[w['event'] for w in d['waItems']]; print(1 if 'dokumen' in evs and 'tier' in evs else 0)" 2>/dev/null)
check "pemicu otomatis WA (dokumen & tier) tercatat" "$([ "${WALOG:-0}" = "1" ] && echo 0 || echo 1)"

echo "── 6. Laporan PDF ────────────────────────────────────────"
PDF1=$(curl -s -b /tmp/g_emp.txt "$BASE/api/reports/pdf?type=karyawan" -o /tmp/g_lap_emp.pdf -w "%{http_code}")
HDR=$(head -c 5 /tmp/g_lap_emp.pdf 2>/dev/null)
check "karyawan (GOD) unduh laporan PDF" "$([ "$PDF1" = "200" ] && [ "$HDR" = "%PDF-" ] && echo 0 || echo 1)"

PDF2=$(curl -s -b /tmp/g_admin.txt "$BASE/api/reports/pdf?type=ringkasan" -o /tmp/g_lap_admin.pdf -w "%{http_code}")
HDR2=$(head -c 5 /tmp/g_lap_admin.pdf 2>/dev/null)
check "CEO unduh ringkasan eksekutif PDF" "$([ "$PDF2" = "200" ] && [ "$HDR2" = "%PDF-" ] && echo 0 || echo 1)"
SIZE=$(stat -c%s /tmp/g_lap_admin.pdf 2>/dev/null || echo 0)
echo "     ukuran ringkasan: ${SIZE} B"

echo "── 7. Portal client ──────────────────────────────────────"
CL=$(curl -s -c /tmp/g_cli.txt -X POST "$BASE/api/portal/login" -H "Content-Type: application/json" -d '{"portal":"client","code":"GUNARA-CLI-99A9-J27A"}')
check "login client" "$(echo "$CL" | rg -q '"ok":true' && echo 0 || echo 1)"

PRJ=$(curl -s -b /tmp/g_cli.txt -X POST "$BASE/api/portal/actions" -H "Content-Type: application/json" -d '{"action":"buat-proyek","title":"Tes E2E Ekosistem","description":"Permintaan layanan uji dari skrip E2E ekosistem GUNARA.","priority":"normal"}')
check "client buat permintaan → WA otomatis" "$(echo "$PRJ" | rg -q '"ok":true' && echo 0 || echo 1)"

echo "── 8. Pembersihan ────────────────────────────────────────"
DEL=$(curl -s -b /tmp/g_emp.txt -X DELETE "$BASE/api/documents?id=$DOCID")
check "hapus dokumen tes" "$(echo "$DEL" | rg -q '"ok":true' && echo 0 || echo 1)"

echo
echo "══════════ HASIL: $PASS lolos, $FAIL gagal ══════════"
[ $FAIL -eq 0 ] && echo "SEMUA TES LOLOS ✅" || echo "ADA TES GAGAL ❌"
exit $FAIL
