# Panduan Deploy ke Vercel — GUNARA CORPORATION

Ditulis untuk pemula. Tidak perlu latar belakang IT — cukup ikuti langkahnya dari atas ke bawah. Semua yang tertulis di sini adalah kondisi nyata, tanpa janji palsu.

---

## 1. Apa yang otomatis jalan di Vercel (tanpa Anda set apa pun)

| Fitur | Status di Vercel |
|---|---|
| Seluruh situs (124 tampilan, katalog perizinan, galeri akreditasi, 23 logo instansi) | ✅ Otomatis jalan |
| Tema ungu-biru, animasi, responsif mobile | ✅ Otomatis jalan |
| Form kontak dengan nomor tiket (GUNARA-XXXX) | ✅ Jalan — tersimpan di memori server |
| Newsletter | ✅ Jalan — tersimpan di memori server |
| Tombol WhatsApp mengapung (wa.me/6281316516524) | ✅ Otomatis jalan |
| Chat Oracle AI | 💎 **Eksklusif Member VVIP** — tidak tampil di situs publik. Hanya bisa dibuka di `alamat-situs/#/vvip` dengan kode akses. Untuk AI penuh, isi 1 environment variable (bagian 4) |

**Kejujuran soal database:** Vercel memakai filesystem yang tidak permanen (serverless). Karena itu pesan form kontak tidak tersimpan permanen seperti di komputer lokal. Tiket tetap terbit dan situs tetap berfungsi 100%, tetapi jika Anda ingin pesan tersimpan permanen, ikuti bagian 6 (opsional, ±10 menit).

---

## 2. Siapkan kode di GitHub (jika belum)

1. Buat akun di [github.com](https://github.com) jika belum punya.
2. Buat repository baru, misal `topkonsultan` (Private disarankan).
3. Upload seluruh folder proyek ini ke repository tersebut.

Cara cepat dari terminal (di folder proyek):

```bash
git init
git add .
git commit -m "Situs GUNARA CONSULTAN siap deploy Vercel"
git branch -M main
git remote add origin https://github.com/USERNAME/topkonsultan.git
git push -u origin main
```

> File sensitif (`.env`, `.z-ai-config`) sudah otomatis dikecualikan lewat `.gitignore` — tidak akan ikut ter-upload.

## 3. Deploy pertama ke Vercel (±3 menit)

1. Buka [vercel.com](https://vercel.com) → **Sign Up with GitHub**.
2. Klik **Add New → Project** → pilih repository `topkonsultan` → **Import**.
3. Biarkan semua pengaturan **default** (Vercel sudah mendeteksi Next.js otomatis dari `vercel.json`).
4. Klik **Deploy** dan tunggu 2–5 menit.
5. Selesai — Anda mendapat alamat seperti `https://topkonsultan.vercel.app`.

Setiap kali Anda `git push` ke GitHub, Vercel **otomatis membangun ulang** situs. Tidak perlu sentuh apa pun lagi.

## 4. Mengaktifkan Oracle AI penuh + kode akses VVIP

Di sandbox lokal, chat Oracle memakai kredensial internal yang **tidak tersedia di Vercel** — itulah sebabnya di Vercel perlu 1 kunci API. Begini caranya:

1. Buka [z.ai](https://z.ai) → daftar akun → masuk ke **Open Platform** (open.z.ai).
2. Buat **API Key** dan salin kuncinya.
3. Di Vercel: buka proyek Anda → **Settings → Environment Variables** → tambah:

   | Name | Value |
   |---|---|
   | `AI_API_KEY` | kunci API dari Z.AI |
   | `AI_MODEL` | `glm-4.6` (terbaik) atau `glm-4.5-flash` (paling hemat) |
   | `AI_BASE_URL` | `https://api.z.ai/api/paas/v4` (bawaan; boleh dikosongkan) |
   | `VVIP_ACCESS_CODE` | kode akses VVIP Anda (lihat bagian 4b di bawah) |

4. Klik **Deployments → tab terakhir → Redeploy** (wajib agar variabel baru terbaca).

Setelah itu chat Oracle di situs Anda hidup penuh — menjawab pertanyaan perizinan, bisnis, pajak, apa pun, dalam bahasa yang sama dengan penanya.

> Alternatif: variabel ini kompatibel dengan semua penyedia "OpenAI-compatible". Punya kunci OpenAI? Cukup set `AI_BASE_URL=https://api.openai.com/v1` dan `AI_MODEL=gpt-4o-mini`.
>
> Tanpa kunci: chat tetap berfungsi — menjawab dengan mode cadangan + tombol besar **"Chat Tim Manusia via WhatsApp"**. Member VVIP tidak pernah melihat error.

## 4b. Cara kerja Area VVIP (panduan pemilik situs)

Oracle AI **tidak lagi tampil di website depan** — ia kini menjadi layanan eksklusif Member VVIP:

| Hal | Keterangan |
|---|---|
| Alamat lounge VVIP | `alamat-situs-anda.com/#/vvip` (tidak ada di menu — bagikan hanya ke member) |
| Kode akses bawaan | `GUNARA-VVIP-2026` |
| Mengganti kode | Vercel → Environment Variables → ubah `VVIP_ACCESS_CODE` → Redeploy. Kode lama langsung mati |
| Keamanan | Kode diverifikasi **di server** (API menolak dengan 403). Sesi member berakhir otomatis saat tab ditutup |
| Cara memberi akses | Kirim WhatsApp pribadi ke member: "Berikut alamat lounge VIP kami + kode akses Anda" |

> Simpan kode dengan rapi: selama `VVIP_ACCESS_CODE` tidak diisi di Vercel, kode bawaan `GUNARA-VVIP-2026` yang dipakai. Segera ganti bila kode bocor.

## 4c. Panel CEO & Dashboard Member (baru)

Situs ini punya dua ruang privat lagi — keduanya tidak ada di menu publik:

| Ruang | Alamat | Untuk siapa | Cara masuk |
|---|---|---|---|
| **Panel CEO** | `alamat-situs.com/#/admin` | Anda (pemilik) | Kata sandi — bawaan `GUNARA-CEO-2026`, ganti lewat env `ADMIN_PASSWORD` |
| **Dashboard Member** | `alamat-situs.com/#/member` | Setiap member VVIP | Kode personal dari Panel CEO |

**Yang bisa dilakukan dari Panel CEO:**
- Lihat ringkasan: tiket brief masuk, member aktif, pelanggan newsletter, log akses.
- Kelola **Tiket Brief**: tandai "dibaca"/"sudah dibalas", balas via email, hapus.
- Kelola **Member VVIP**: daftarkan member (nama, email, WA, perusahaan, tier VVIP/GOLD/PLATINUM, masa berlaku) → **kode personal terbit otomatis** → tombol salin → kirim ke member via WhatsApp. Bisa menangguhkan, mengaktifkan, atau mencabut keanggotaan.
- Pantau **Log Akses**: setiap login member yang berhasil dan setiap percobaan kode salah tercatat lengkap dengan waktu.

**Yang dirasakan member** di `#/member`: kartu identitas keanggotaan (nama, tier, masa berlaku), tombol langsung ke Lounge Oracle, jalur WhatsApp prioritas, dan **tiket brief miliknya sendiri** (otomatis cocok dari email member — ia tidak melihat tiket orang lain).

**Keamanan berlapis:**
1. Kata sandi CEO dikirim setiap login, sesi cookie `HttpOnly` bertanda tangan HMAC berumur 8 jam — mengubah `ADMIN_PASSWORD` otomatis mematikan semua sesi lama.
2. Kode member diverifikasi **di server** (API menolak 403). Menangguhkan member = kode langsung mati.
3. Panel menampilkan **peringatan kuning** selama kata sandi masih bawaan — ikuti instruksinya sebelum situs ramai.

> Catatan jujur soal penyimpanan: di lokal semua data persisten (SQLite). Di Vercel tanpa database, data form/member/log disimpan dalam memori server — bertahan selama instance hidup lalu hilang saat cold-start. Supaya permanen di Vercel, aktifkan bagian 6 (Vercel Postgres, ±10 menit). Panel CEO menampilkan status "database persisten" atau "mode memori" di pojok kiri atas — jadi Anda selalu tahu sedang memakai yang mana.

## 5. Ganti nama domain sendiri (opsional)

1. Beli domain (mis. `topkonsultan.web.id` di registrar Indonesia mana pun).
2. Vercel → proyek → **Settings → Domains** → **Add** → ikuti instruksi DNS (biasanya 2 record: `A` ke `76.76.21.21` dan `CNAME` ke `cname.vercel-dns.com`).
3. HTTPS aktif otomatis.

## 5b. Optimalkan Google (SEO) — ±5 menit

Situs sudah *search-engine-first* sejak hari pertama: ±135 URL ter-SSR bisa di-crawl Google, metadata unik per halaman, JSON-LD (Organization, 3 kantor, FAQ, artikel), sitemap & robots dinamis, dan gambar sosial bermerek — semuanya otomatis. Yang perlu Anda lakukan hanya mendaftarkan situs ke Google:

1. Buka [search.google.com/search-console](https://search.google.com/search-console) → **Add property** → masukkan domain/URL produksi Anda.
2. Pilih metode verifikasi **HTML tag**. Google memberi kode seperti `<meta name="google-site-verification" content="abc123..."/>` — **salin hanya isi `content`-nya**.
3. Vercel → proyek → **Settings → Environment Variables** → tambah:
   - `GOOGLE_SITE_VERIFICATION` = (isi kode tadi)
   - *(opsional)* `NEXT_PUBLIC_SITE_URL` = `https://domain-anda.com` bila memakai domain sendiri — memastikan canonical, sitemap & JSON-LD memakai domain final
4. **Redeploy** (Deployments → Redeploy), lalu di Search Console klik **Verify**.
5. Masih di Search Console → **Sitemaps** → kirim: `https://domain-anda.com/sitemap.xml`
6. *(Bonus)* Daftar juga di [Bing Webmaster Tools](https://www.bing.com/webmasters) — bisa impor langsung dari Search Console; kodenya masuk ke env `BING_SITE_VERIFICATION`.

Cara cek hasilnya: setelah 1–4 minggu, pencarian Google `site:domain-anda.com` akan menampilkan puluhan halaman (perizinan, dewan pakar, wawasan, dst.), dan halaman izin bisa muncul sebagai *rich results* dengan breadcrumb.

## 6. Opsional: Database permanen (±10 menit)

Agar pesan kontak & newsletter tersimpan permanen:

1. Vercel → proyek → tab **Storage** → **Create Database → Postgres** (paket Hobby gratis).
2. Setelah dibuat, Vercel otomatis menambahkan `DATABASE_URL` (format `postgres://...`).
3. Di `prisma/schema.prisma`, ubah satu baris:
   ```prisma
   datasource db {
     provider = "postgresql"   // sebelumnya "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
4. Jalankan `bun install` lalu commit & push — Vercel membangun ulang otomatis.
5. Selesai. Pesan tersimpan permanen dan bisa dilihat via tab **Data** di Vercel.

> Tanpa langkah ini, situs tetap berfungsi penuh dengan fallback memori — hanya saja pesan tidak tersimpan permanen.

## 7. Memperbarui situs di kemudian hari

Ubah apa pun di komputer, lalu:

```bash
git add .
git commit -m "Update isi situs"
git push
```

Vercel otomatis membangun ulang ±2–5 menit. Selesai.

## 8. Kalau terjadi masalah

| Gejala | Solusi |
|---|---|
| Deploy gagal | Buka tab **Building** di Vercel, baca baris error terakhir; 9 dari 10 kasus karena variabel salah ketik |
| Oracle menjawab mode cadangan terus | Cek `AI_API_KEY` di Environment Variables, lalu **Redeploy** |
| Form kontak tidak terbit tiket | Pastikan tidak ada rate-limit; cek tab **Logs** di Vercel |
| Ubah env var tidak berefek | Selalu **Redeploy** setelah mengubah Environment Variables |

---

**Ringkasan jujur:** Deploy ke Vercel = 0 konfigurasi. AI penuh = 1 environment variable. Database permanen = opsional 10 menit. Selebihnya otomatis.
