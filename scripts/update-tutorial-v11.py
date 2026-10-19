#!/usr/bin/env python3
"""Update tutorial GUNARA v1.1:
1. Suntik Bab 19 (Grafik, Multi-bahasa, Backup Otomatis) ke panduan-gunara.html
2. Bump versi footer v1.0 → v1.1
3. Hasilkan panduan-v11-suplemen.html (bergaya sama) untuk dicetak jadi PDF suplemen.
"""
import re

PATH = "/home/z/my-project/download/panduan-gunara.html"
html = open(PATH, encoding="utf-8").read()

BAB19 = """
<!-- ── BAB 19 ── -->
<div class="chapter-header">
  <span class="section-tag">Bab 19</span>
  <div class="section-title">Grafik Dashboard, Multi-bahasa &amp; Backup Otomatis</div>
  <div class="divider"></div>
</div>
<p class="body-text">Tiga fitur pelengkap memperkuat kendali perusahaan: <b>tab Grafik</b> di Panel CEO yang memvisualkan kesehatan bisnis secara real-time, <b>multi-bahasa ID/EN</b> untuk seluruh dashboard (Panel CEO, Portal Karyawan, Portal Client), dan <b>backup otomatis terjadwal</b> yang merawat keutuhan data tanpa sentuhan manusia. Ketiganya hadir tanpa mengubah alur kerja lama — tab, tombol, dan API yang sudah Anda kenal tetap bekerja persis seperti sebelumnya.</p>

<div class="card">
  <div class="card-title">Tab Grafik — Panel CEO</div>
  <div class="card-desc">
    Buka <span class="inline-code">/#/admin</span> → tab <b>Grafik</b> (di samping Ringkasan). Empat visualisasi tampil dari data hidup, tanpa konfigurasi:<br>
    <b>1. Aktivitas 14 Hari</b> — area chart tiket, invoice, dan aksi audit per hari; gunakan untuk melihat denyut operasional.<br>
    <b>2. Nilai Invoice per Status</b> — batang nilai (juta rupiah) untuk Draft/Terkirim/Dibayar/Batal; indikator kas masuk.<br>
    <b>3. Distribusi Tier Akun</b> — donat proporsi akun STANDARD/PRO/ELITE/GOD; ukur penetrasi GOD MODE.<br>
    <b>4. Proyek per Status</b> — batang horizontal per tahap (Baru → Berjalan → Review → Selesai).<br>
    Di atasnya, empat kartu KPI: nilai invoice terkirim, proyek berjalan + rata-rata progres, akun GOD MODE, total tiket. Grafik dirender Recharts (SVG) murni dari data yang sudah dimuat — tanpa endpoint tambahan, tanpa beban server baru.
  </div>
</div>

<div class="card">
  <div class="card-title">Multi-bahasa ID/EN</div>
  <div class="card-desc">
    Saklar <span class="inline-code">ID | EN</span> tersedia di kanan atas semua dashboard — termasuk di layar login, sehingga tamu pun bisa membaca gerbang masuk dalam bahasanya. Cakupan: judul halaman, seluruh label tab, tombol umum (Muat ulang, Keluar, Unduh, Salin), dan teks layar login. Konten bisnis (isi tiket, catatan proyek, pesan WA) mengikuti bahasa penulisnya — jujur secara konteks, bukan terjemahan mesin. Pilihan tersimpan di peramban (kunci <span class="inline-code">gunara-lang</span>) dan tersinkron antar-tab lewat event. Kamus terpusat di <span class="inline-code">src/lib/i18n.ts</span>; menambah bahasa ketiga cukup menambah satu kolom kamus.
  </div>
</div>

<div class="card">
  <div class="card-title">Backup Otomatis Terjadwal</div>
  <div class="card-desc">
    Saat server menyala, scheduler backup aktif sendiri (lihat log <span class="inline-code">[backup] scheduler aktif</span>). Setiap interval, sistem mengonsistenkan database SQLite (<span class="inline-code">PRAGMA wal_checkpoint</span>) lalu mengarsipkan <b>database + folder uploads</b> menjadi <span class="inline-code">backups/gunara-backup-YYYYMMDD-HHMMSS.tar.gz</span>. Arsip lama dipangkas otomatis melebihi kuota retensi. Kontrol via environment:<br>
    <span class="inline-code">BACKUP_INTERVAL_HOURS</span> — jeda antar backup, default 24 (isi 0 untuk mematikan).<br>
    <span class="inline-code">BACKUP_KEEP</span> — jumlah arsip dipertahankan, default 10.<br>
    Kelola manual dari Panel CEO → <b>Ekosistem → Backup</b>: lihat status scheduler, <b>Buat Backup Sekarang</b>, unduh, atau hapus arsip. Setiap aksi tercatat di Audit Log (<span class="inline-code">backup_buat</span>, <span class="inline-code">backup_hapus</span>). API: <span class="inline-code">GET/POST/DELETE /api/admin/backup</span> (guard CEO; unduh via <span class="inline-code">?id=NAMA</span>; nama arsip divalidasi regex — path traversal ditolak).
  </div>
</div>

<table class="table">
  <thead><tr><th>Kebutuhan</th><th>Cara</th></tr></thead>
  <tbody>
    <tr><td>Lihat tren bisnis mingguan</td><td>Panel CEO → Grafik → bandingkan area Aktivitas 14 Hari dengan nilai invoice per status.</td></tr>
    <tr><td>Antarmuka untuk staf asing</td><td>Minta staf klik EN di layar login portal — pilihan tersimpan permanen di perambannya.</td></tr>
    <tr><td>Cadangan sebelum migrasi/update</td><td>Panel CEO → Ekosistem → Backup → Buat Backup Sekarang → unduh arsipnya.</td></tr>
    <tr><td>Backup lebih sering</td><td>Set <span class="inline-code">BACKUP_INTERVAL_HOURS=6</span> lalu restart server.</td></tr>
    <tr><td>Restore data</td><td>Ekstrak arsip: tar -xzf gunara-backup-*.tar.gz → salin custom.db ke lokasi DATABASE_URL, folder uploads ke root proyek → restart.</td></tr>
  </tbody>
</table>
"""

# 1. Suntik Bab 19 sebelum penutup bagian akhir (sebelum blok footer/penutup).
marker = html.rfind("<div class=\"chapter-header\">")
end_prev = html.find("</div>", html.find("card-desc", marker))
# Sisipkan sebelum elemen penutup terakhir yang berisi penutup (cari <div class="foot">)
foot_idx = html.rfind('<div class="foot">')
if foot_idx == -1:
    raise SystemExit("marker foot tidak ditemukan")
# mundur ke awal blok penutup: cari awal section penutup — sisip sebelumnya
close_idx = html.rfind("</body>")
html = html[:close_idx] + BAB19 + html[close_idx:]

# 2. Bump versi
html = html.replace("v1.0 · 2026", "v1.1 · 2026")

open(PATH, "w", encoding="utf-8").write(html)
print("panduan-gunara.html diperbarui → Bab 19 tersuntik, versi v1.1")

# 3. Suplemen HTML: kepala/CSS sama, isi = judul + Bab 19 + footer
head = html[: html.find("</head>") + len("</head>")]
css_open = head.find("<style")
def grab_style(src: str) -> str:
    s = src.find("<style")
    e = src.find("</style>", s)
    return src[s : e + len("</style>")]

style = grab_style(html)
suplemen = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GUNARA — Suplemen Panduan v1.1</title>
{style}
</head>
<body>
<div class="wrap">
  <div class="chapter-header" style="margin-top:24px">
    <span class="section-tag">Suplemen v1.1</span>
    <div class="section-title">Grafik Dashboard, Multi-bahasa &amp; Backup Otomatis</div>
    <div class="divider"></div>
  </div>
  <p class="body-text">Dokumen suplemen untuk <b>Panduan Super Lengkap dari Hulu ke Hilir</b> (Bab 1–18 tetap berlaku). Bab 19 menutup tiga fitur terbaru: tab Grafik Recharts di Panel CEO, saklar multi-bahasa ID/EN di semua dashboard, dan backup otomatis terjadwal dengan retensi otomatis.</p>
  {BAB19}
  <div class="foot">
    <span>GUNARA CORPORATION · DOKUMEN INTERNAL</span>
    <span>v1.1 · 2026</span>
  </div>
</div>
</body>
</html>"""
open("/home/z/my-project/download/panduan-v11-suplemen.html", "w", encoding="utf-8").write(suplemen)
print("panduan-v11-suplemen.html dibuat")
