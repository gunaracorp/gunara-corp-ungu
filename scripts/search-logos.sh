#!/bin/bash
# Cari logo instansi RI via z-ai image-search — paralel 6 job.
OUT=/home/z/my-project/scripts/logo-search
mkdir -p "$OUT"

declare -A Q=(
  [kemenkumham]="logo resmi Kementerian Hukum Republik Indonesia"
  [kemenimipas]="logo resmi Kementerian Imigrasi dan Pemasyarakatan Indonesia"
  [bkpm]="logo resmi Kementerian Investasi BKPM Indonesia"
  [kemenkeu]="logo resmi Kementerian Keuangan Republik Indonesia"
  [kemendag]="logo resmi Kementerian Perdagangan Republik Indonesia"
  [kemenperin]="logo resmi Kementerian Perindustrian Republik Indonesia"
  [kemnaker]="logo resmi Kementerian Ketenagakerjaan Republik Indonesia"
  [kemenkop]="logo resmi Kementerian Koperasi Republik Indonesia"
  [kemenag]="logo resmi Kementerian Agama Republik Indonesia"
  [kemenkes]="logo resmi Kementerian Kesehatan Republik Indonesia"
  [bpom]="logo resmi Badan POM BPOM Indonesia"
  [klh]="logo resmi Kementerian Lingkungan Hidup Republik Indonesia"
  [pu]="logo resmi Kementerian Pekerjaan Umum Republik Indonesia"
  [komdigi]="logo resmi Kementerian Komunikasi dan Digital Republik Indonesia"
  [ojk]="logo resmi Otoritas Jasa Keuangan OJK Indonesia"
  [bsn]="logo resmi Badan Standardisasi Nasional SNI Indonesia"
  [kemenpar]="logo resmi Kementerian Pariwisata Republik Indonesia"
  [bappebti]="logo resmi Bappebti Badan Pengawas Perdagangan Berjangka Komoditi"
)

run_one() {
  local slug="$1"; local query="$2"
  z-ai image-search -q "$query" -c 4 --no-rank -o "$OUT/$slug.json" >/dev/null 2>&1
  echo "done: $slug"
}

# Jalankan paralel maksimal 6
i=0
for slug in "${!Q[@]}"; do
  run_one "$slug" "${Q[$slug]}" &
  i=$((i+1))
  if (( i % 6 == 0 )); then wait; fi
done
wait
echo "=== SEMUA SELESAI ==="
ls -la "$OUT"
