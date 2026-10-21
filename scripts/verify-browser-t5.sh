#!/bin/bash
# Verifikasi browser satu-sesi: server dijaga hidup selama seluruh langkah berjalan.
# Uji: multi-bahasa (EN/ID) + tab Grafik Recharts + sub-panel Backup.
set -u
cd /home/z/my-project/gunara-corp-ungu
AB="agent-browser"

# 1. Pastikan server hidup
if ! curl -s -o /dev/null --max-time 3 http://localhost:3000/; then
  for P in $(lsof -t -i:3000 2>/dev/null); do kill -9 $P 2>/dev/null; done
  rm -f dev.log
  nohup bun run dev > /dev/null 2>&1 &
  for i in $(seq 1 40); do curl -s -o /dev/null --max-time 2 http://localhost:3000/ && break; sleep 1; done
fi
echo "server: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/)"

# 2. Buka Panel CEO (bahasa default ID)
$AB open "http://localhost:3000/#/admin" > /dev/null
$AB wait --load networkidle > /dev/null 2>&1
sleep 1

# 3. Klik EN di layar login → judul harus "CEO Panel"
$AB find role button click --name "EN" > /dev/null 2>&1
sleep 0.6
H=$($AB get text "h1" 2>/dev/null | head -1)
echo "login h1 (EN): $H"

# 4. Login
$AB find label "Kata sandi CEO" fill "GUNARA-CEO-2026" > /dev/null 2>&1 || \
  $AB eval "document.querySelector('input[type=password]').value='GUNARA-CEO-2026'" > /dev/null 2>&1
$AB eval "
  const inp = document.querySelector('input[type=password]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  setter.call(inp,'GUNARA-CEO-2026');
  inp.dispatchEvent(new Event('input',{bubbles:true}));
" > /dev/null 2>&1
$AB eval "
  const f = document.querySelector('input[type=password]')?.closest('form');
  f?.requestSubmit ? f.requestSubmit() : f?.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
" > /dev/null 2>&1
sleep 3

# 5. Verifikasi chrome EN: tab pertama = Overview, kedua = Charts
TXT=$($AB eval "Array.from(document.querySelectorAll('nav[aria-label] button')).map(b=>b.textContent.trim()).filter(t=>t.length<30).slice(0,8).join(' | ')" 2>/dev/null)
echo "tab EN: $TXT"

# 6. Buka tab Charts, tunggu grafik SVG recharts render
$AB eval "
  const btn = Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Charts');
  btn?.click(); btn ? 'klik Charts' : 'TIDAK ADA'
"
sleep 3
RECHARTS=$($AB eval "document.querySelectorAll('.recharts-surface').length + ' surface / ' + document.querySelectorAll('.recharts-wrapper').length + ' wrapper'" 2>/dev/null)
echo "recharts: $RECHARTS"
$AB screenshot /home/z/my-project/download/gunara-admin-grafik-en.png > /dev/null 2>&1

# 7. Kembali ke ID → label berubah ke Bahasa Indonesia
$AB eval "
  const b = Array.from(document.querySelectorAll('button')).find(x=>x.textContent.trim()==='ID');
  b?.click(); 'klik ID'
"
sleep 1
TXT2=$($AB eval "Array.from(document.querySelectorAll('nav[aria-label] button')).map(b=>b.textContent.trim()).filter(t=>t.length<30).slice(0,8).join(' | ')" 2>/dev/null)
echo "tab ID: $TXT2"
$AB screenshot /home/z/my-project/download/gunara-admin-grafik.png > /dev/null 2>&1

# 8. Sub-panel Backup: Ekosistem → Backup
$AB eval "
  const ek = Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Ekosistem');
  ek?.click(); 'ok'
"
sleep 2
$AB eval "
  const bk = Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Backup');
  bk?.click(); 'ok'
"
sleep 2
BK=$($AB eval "(document.body.innerText.match(/Status Scheduler|Buat Backup Sekarang|Arsip \\(/g)||[]).join(', ')" 2>/dev/null)
echo "backup panel: $BK"
$AB screenshot /home/z/my-project/download/gunara-admin-backup.png > /dev/null 2>&1

# 9. Cek error console
echo "---console errors---"
$AB errors 2>/dev/null | tail -4
echo "SELESAI"
