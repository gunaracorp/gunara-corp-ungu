# Worklog — Proyek Omniprime Global Advisory

---
Task ID: 1
Agent: Z.ai Code (main orchestrator — "master polymath spectrum mode")
Task: Membangun website konsultan #1 dunia "Omniprime Global Advisory" — full animasi, 46 Council of Experts, melebihi McKinsey/Google, siap shared hosting.

Work Log:
- Audit proyek: Next.js 16 + React 19 + Tailwind 4 + shadcn/ui + framer-motion v12 (sudah terpasang) + lucide-react + z-ai-web-dev-sdk.
- Load skill LLM untuk backend Oracle AI chat (zai.chat.completions.create, thinking disabled, system prompt via role "assistant").
- Design system: globals.css (tema dark-luxury zinc-950 + gold amber, keyframes marquee/float/ping-slow/gradient-x/typing-dot, utilitas text-gradient-gold, glass, gold-ring, custom-scrollbar, grid-bg, shine, noise-overlay, mask-fade-x, prefers-reduced-motion) + layout.tsx (font Inter + Space Grotesk via next/font, metadata SEO, class dark) + app/icon.svg (favicon monogram oracle).
- Data layer src/data/content.ts: 46 councils (6 kategori: Strategy 8, Tech & AI 8, Science 8, Finance 7, Society 8, Health 7 — total 46, masing-masing 150 tahun), 12 services hulu-ke-hilir, 5 fase Oracle Protocol, 7 baris comparison vs McKinsey/Google/46 councils, 4 case studies, 5 testimonials, 10 global hubs, benchmarks marquee, budgets, oracle prompts.
- Komponen landing (src/components/landing/): logo.tsx, motion.tsx (Reveal, Counter, SectionHeading, SplitWords, TiltCard, EASE), preloader.tsx (boot sinematik 1.25s + exit curtain), scroll-progress.tsx, navbar.tsx (glass on scroll + menu mobile), hero.tsx (Mandala SVG 46 node orbit, typewriter, parallax scroll, split-word reveal, chips), marquee.tsx (benchmark infinite scroll, pause on hover), stats.tsx (animated counters), about.tsx (tilt cards), services.tsx (12 kartu), councils.tsx (filter tab interaktif + grid scrollable max-h saat All), methodology.tsx (timeline scroll-linked progress), comparison.tsx (tabel head-to-head), results.tsx, testimonials.tsx (carousel auto), global.tsx (globe wireframe + 10 hub pulsing + satellite orbit), contact.tsx (form + state sukses), oracle-chat.tsx (FAB + panel chat AI), footer.tsx (sticky mt-auto + safe-area).
- API routes: /api/contact (validasi + in-memory store, id OMNI-XXX) dan /api/oracle (ZAI SDK, system prompt THE ORACLE, strip markdown, rate-slice history 10 msg).
- Perbaikan bug hasil verifikasi browser: (1) hydration mismatch Math.cos/sin di Mandala → pembulatan .toFixed(2) deterministik; (2) gradien gold hero terlalu pucat → diperkuat token; (3) import rusak di contact.tsx → diperbaiki; (4) markdown ** di bubble Oracle → dibersihkan di route.
- Verifikasi: lint bersih; curl API contact (400 invalid / 200 valid + id) & oracle (200, jawaban in-persona); Agent Browser E2E — hero desktop/mobile, filter councils (All 46 → Technology & AI 8 kartu), Oracle chat end-to-end (pertanyaan → jawaban AI), form kontak end-to-end (submit → "The Councils convene." + engagement ID), menu hamburger mobile, footer sticky, globe section, full-page screenshot, dev.log tanpa error.

Stage Summary:
- Website lengkap 1 halaman (14 section) + 2 API routes, semua verifikasi browser lolos.
- Brand: OMNIPRIME GLOBAL ADVISORY — "Beyond McKinsey. Beyond Google. Beyond human limits."
- Fitur kunci: preloader sinematik, Mandala 46 node, typewriter, animated counters, filter 46 councils, timeline scroll-linked, tabel comparison, globe wireframe, Oracle AI chat (z-ai-web-dev-sdk), form kontak dengan engagement ID, marquee benchmark, footer sticky + safe-area.
- Shared-hosting friendly: tanpa dependensi DB eksternal (in-memory store), animasi transform/opacity GPU-friendly, font via next/font, reduced-motion dihormati.

---
Task ID: 2 (multi-page expansion)
Agent: Z.ai Code (main orchestrator)
Task: Memenuhi permintaan user — "lengkapi detail setiap halaman, setiap page, setiap link pastikan hidup semua" — mengubah situs one-pager menjadi website multi-halaman penuh.

Work Log:
- Membangun hash router (src/lib/router.tsx) dengan useSyncExternalStore — routing "#/about", "#/services/02", "#/councils/<slug>", query params (#/councils?filter=...), anchor native tetap hidup, deep-linkable, shared-hosting friendly.
- Foundation data: src/data/extended-types.ts (interfaceCouncilProfile, ServiceDetail, Industry, Insight, Leader, Role, Perk, LegalDoc, FaqItem, Office, TimelineEvent + slugify).
- Data library lengkap (9 file): council-profiles.ts (46 profil dewan: chair, seat, mastery, 6 capabilities, 3 achievements, signatureMove), service-details.ts (12), industries.ts (12 industri), insights.ts (6 artikel penuh 12-14 paragraf), leadership.ts (12 pimpinan), careers.ts (8 mandat + 6 perks), legal.ts (3 dokumen hukum + 10 FAQ), offices.ts (10 hub + timezone alamat), timeline.ts (8 milestone 1874-2025).
- Aset merek: 13 gambar AI (6 potret eksekutif, 6 sampul insight, 1 HQ Zürich) — bg process mati berulang → solusi: run foreground resumable; bug ukuran (1440x720 bukan kelipatan 32 → 400 API) diperbaiki ke 1344x768.
- Backend upgrade: Prisma ContactMessage + NewsletterSubscriber (db push sukses), src/lib/db.ts, /api/contact persist ke SQLite dengan fallback memori, /api/newsletter baru (upsert).
- App shell: src/components/site/app.tsx — switch 18 rute + title dinamis per halaman + skip-link a11y + page-enter transition.
- 17 halaman baru di src/components/site/pages/: home, about (story+timeline+leadership+jam dunia), services+service-detail, councils (filter+search 46)+council-detail, industries+industry-detail, insights+insight-detail (share X/LinkedIn), careers (accordion mandat+apply→contact?role=), method, results, contact (reuse form + office clocks), legal, faq, not-found (404).
- Komponen bersama: site/ui.tsx (PageHero, Breadcrumb, LinkButton, StatBand, CTABand, Ornament), site/office-clocks.tsx (jam live 10 hub via Intl timezone).
- Rewire semua link mati: navbar (6 rute + active state + menu mobile 10 link), footer (sitemap penuh: 6 Firm + 6 kategori council dengan query filter + 7 practices + 4 legal + newsletter Oracle Dispatch dengan toast + sosial dengan toast "coming soon"), hero CTA → #/contact #/method, kartu services/councils di home → halaman detail.
- Landing contact.tsx ditambah prop initialRole (badge "Application mandate" untuk lamaran karier, type=career ke API).
- Fix lint: react-hooks/set-state-in-effect (useSyncExternalStore untuk router, rAF-defer untuk jam, render-time adjustment untuk menu), useEffect import hilang di router (500 → 200).

Stage Summary:
- 18 rute hidup: /, about, services (+12 detail), councils (+46 detail), industries (+12 detail), insights (+6 artikel), careers, method, results, contact, faq, privacy, terms, cookies, 404.
- SETIAP link hidup dan teruji browser: nav aktif, breadcrumb, filter via query, prev/next navigasi, share link, mailto, apply-role-prefill, newsletter, sosial toast.
- Form kontak E2E terverifikasi: submit → ID OMNI-MTZ5KQ1L → persisted SQLite ({"total":1,"source":"db"}), newsletter API OK.
- 13 gambar merender (200 OK); lint bersih; dev.log tanpa error runtime baru; mobile menu + responsive terverifikasi 390px & 1280px.

---
Task ID: 3-a
Agent: perizina-forge
Task: Membuat file data /home/z/my-project/src/data/perizinan.ts (katalog "Gerbang Perizinan" PT TOP KONSULTAN INTERNASIONAL) sesuai spesifikasi notes/perizinan-spec.md — 8 kategori, 36 item, lolos tsc.

Work Log:
- Membaca worklog.md (konteks proyek) dan spesifikasi lengkap notes/perizinan-spec.md (interface, 8 kategori, 36 item slug/nama/instansi, fakta regulasi, gaya penulisan).
- Verifikasi ikon lucide-react 0.525 (installed) terhadap 44 nama ikon yang direncanakan via runtime export check; 3 nama usulan awal dicek (FileSignature, Globe2, CheckCircle2 terbukti tersedia sebagai alias resmi). Hasil: 44 ikon UNIK — 0 pengulangan (8 kategori + 36 item).
- Menulis src/data/perizinan.ts (±1.310 baris): ekspor PerizinanCategory, PerizinanItem, PERIZINAN_CATEGORIES (8, urutan wajib), PERIZINAN (36 item), PERIZINAN_STATS (4 stat sesuai spesifikasi).
- Kualitas konten: setiap item punya tagline + enTagline (ID/EN), description TEPAT 2 paragraf (par.1 = masalah & konteks regulasi; par.2 = cara TOP menuntaskan), TEPAT 5 requirements, TEPAT 5 process steps "01"–"05" linear (konsultasi → penyerahan dokumen), timeline, validity, complexity (Dasar/Menengah/Kompleks), priceNote yang selalu menyebut "biaya resmi negara" + estimasi jasa TOP Rp1,5–50 juta (PMA/OJK/AMDAL lebih tinggi), tanpa janji harga pasti.
- Fakta regulasi yang dipertahankan akurat: PMA modal disetor Rp2,5 miliar/pemegang saham & investasi ≥ Rp10 miliar (di luar tanah-bangunan); halal wajib pangan-minuman sejak 17 Oktober 2024 (PP 42/2024), bertahap 2026, via SiHalal, pendaftaran sertifikat asing Rp800 ribu/sertifikat; PBG menggantikan IMB (UU Cipta Kerja, SIMBG); SLF gedung 5 tahun / rumah tinggal 20 tahun; PSE Privat Permenkominfo 5/2020 → TDPSE; API-U/API-P fungsi ganda via NIB OSS RBA; RPTKA wajib sebelum TKA + DKP-TKA sesuai regulasi terkini (tanpa mengarang angka yang tidak ada di spesifikasi); tax holiday hingga 20 tahun, super deduction 300% riset & 200% vokasi; merek via PDKI 10 tahun; NIB = identitas + izin risiko rendah, OSS RBA 4 tingkat risiko; AMDAL/UKL-UPL/SPPL sesuai skala dampak; PP-PKB 2 tahun.
- Validasi data via bun (struktur vs spesifikasi): per kategori badan-hukum 6, oss-nib 4, pajak 4, ketenagakerjaan 4, lingkungan 4, perdagangan 5, kekayaan-intelektual 4, sektor-khusus 5 = 36; slug unik; description=2; requirements=5; process=5 (01–05); priceNote selalu memuat biaya negara; 44 ikon unik — SEMUA LOLOS (setelah 4 priceNote disesuaikan agar selalu menyebut "biaya resmi negara").
- Typecheck: bunx tsc --noEmit → 4 error total, SEMUA berasal dari luar src/ (examples/websocket/frontend.tsx & server.ts: socket.io/socket.io-client tidak terpasang; skills/image-edit & skills/stock-analysis: mismatch tipe SDK) — TIDAK ADA error dari perizinan.ts maupun seluruh folder src/. File lain tidak disentuh.
- APPEND entri ini ke worklog.md (tanpa mengubah isi sebelumnya).

Stage Summary:
- src/data/perizinan.ts SELESAI & lolos tsc: katalog 8 kategori × (6+4+4+4+4+5+4+5) = 36 jenis izin "Gerbang Perizinan" PT TOP KONSULTAN INTERNASIONAL, bilingual ID/EN premium, siap dikonsumsi UI (?kategori= & /perizinan/<slug>).
- Ekspor: PerizinanCategory, PerizinanItem, PERIZINAN_CATEGORIES, PERIZINAN, PERIZINAN_STATS (36+/8/48 jam/99,97%).
- 44 ikon lucide-react unik relevan per item; tidak ada import tak terpakai; tidak ada any; angka format Indonesia (Rp2,5 miliar, 99,97%, 17 Oktober 2024).
- Catatan untuk agen lain: 4 error tsc pre-existing berada di examples/websocket/* (modul socket.io tidak terpasang) dan skills/* (tipe SDK) — bukan bagian proyek web; error dari file yang sedang diedit agen lain: tidak ditemukan di src/.
- Next: build halaman /perizinan (listing + filter kategori + detail item) mengonsumsi file ini.

---
Task ID: 3-c
Agent: terjemah-data
Task: Menerjemahkan/me-rewrite 8 file data situs ke Bahasa Indonesia premium dengan rebrand "Omniprime Global Advisory" → PT TOP KONSULTAN INTERNASIONAL (Jakarta 2001, 46 Dewan Pakar, 6.900 tahun pengalaman, 190 negara, 12.000+ penugasan, 99,97%, 10 hub): service-details.ts, industries.ts, insights.ts, leadership.ts, careers.ts, legal.ts, offices.ts, timeline.ts — plus mengisi field bilingual wajib di extended-types.ts (enName, enTagline, enTitle, enExcerpt, enRole, enTitle).

Work Log:
- Membaca worklog.md, extended-types.ts, ke-8 file target, dan content.ts (nama Inggris 12 SERVICES untuk enName; HUBS untuk koordinat office; kategori COUNCILS untuk referensi).
- service-details.ts: 12 praktik diterjemahkan penuh — overview 2 paragraf, capabilities 6, deliverables 4, kpis[].label, protocol 3 — copywriting premium; enName diisi nama Inggris asli (01 "Strategy & Transformation" … 12 "Sovereign & Nation Advisory"); num, relatedCouncils, kpis[].value tak tersentuh (diverifikasi identik vs git HEAD).
- industries.ts: 12 slug TIDAK DIUBAH; name Indonesia (Keuangan & Fintech, Teknologi & SaaS, Energi & Utilitas, Kesehatan & Ilmu Hayati, Ritel & E-Commerce, Manufaktur, Infrastruktur & Kota, Pemerintahan & Publik, Media & Hiburan, Logistik & Transportasi, Pangan & Agri, Antariksa & Teknologi Frontier); enName + enTagline diisi asli; tagline/description/challenges/approach/stats label diterjemahkan; councils & services refs identik.
- insights.ts: 6 artikel — slug/date/readTime/cover tetap; title+enTitle, excerpt+enExcerpt, category Indonesia; body diterjemahkan seluruhnya termasuk 5-7 subjudul "## " per artikel (jumlah entri body per artikel identik dengan versi lama); keyPoints (4) & tags (3) Indonesia; author.name TETAP, author.role diterjemahkan.
- leadership.ts: 6 pemimpin berfoto (Voss, Okafor, Watanabe, Marchetti, Anand, Laurent) — nama/image/council/initials tetap, role+bio diterjemahkan ke konteks TOP, enRole diisi. 6 pemimpin monogram DIGANTI jajaran Indonesia: Bimo Aria Wibowo (Direktur Utama, BAW), Sri Ayu Kartika (Direktur Perizinan & Regulasi, SAK), Rangga Prasetyo (Direktur Strategi Korporat, RP), Maya Anggraini (Kepala Oracle & Teknologi, MA), Arif Nugroho (Direktur Keuangan, AN), Dewi Sartika (Kepala SDM, DS) — bio 2-3 kalimat kredibel; council ref diambil dari nilai data lama yang relevan per domain (terverifikasi: seluruh 12 nilai council ⊆ nilai lama).
- careers.ts: 8 role + 6 perk diterjemahkan; id tetap; enTitle diisi; lokasi Jakarta (Singapore & London masing-masing 1); type "Penuh Waktu", level Indonesia (Partner/Principal/Manajer/Fellow/Senior/Direktur/Lead/Kepala Staf); "Omniprime Academy" → "Akademi TOP", referensi 151 tahun → memori kolektif 12.000+ penugasan.
- legal.ts: tiga dokumen diterjemahkan sebagai dokumen hukum Indonesia — "Kebijakan Privasi", "Syarat & Ketentuan", "Kebijakan Cookie" — id & updated tetap; entitas PT TOP KONSULTAN INTERNASIONAL, Menara TOP Lt. 38 Jl. Jend. Sudirman Kav. 52–53 Jakarta Selatan 12190, halo@topkonsultan.co.id / privacy@topkonsultan.co.id; mengeksekusi UU No. 27/2022 (PDP, termasuk hak subjek data & respons 3×24 jam), UU ITE, PP 71/2019 (PSTE); yurisdiksi Indonesia (PN Jakarta Selatan). 10 FAQ diterjemahkan + rebrand penuh.
- offices.ts: REWRITE ke 10 hub persis sesuai spesifikasi (Jakarta flagship x72 y58, Singapore, Tokyo, Seoul, Sydney, Dubai, London, Frankfurt, New York, San Francisco) — city/x/y/timezone tervalidasi identik dengan HUBS di content.ts.
- timeline.ts: REWRITE ke 8 event TOP 2001→2024 (teks sesuai spesifikasi; "Geribang" di spesifikasi dinormalisasi menjadi "Gerbang Pertama di Jakarta" agar konsisten dengan "Gerbang Singapura"/"Gerbang Perizinan" — typos spesifikasi).
- QA: bunx tsc --noEmit → 4 error pre-existing di luar src/ (examples/websocket ×2 socket.io, skills/image-edit & skills/stock-analysis tipe SDK); NOL error dari 8 file ini dan seluruh src/. ESLint bersih pada ke-8 file. Script verifikasi bun membandingkan git HEAD vs working tree: slugs/nums/relatedCouncils/councils/services/kpi values/dates/readTime/covers/ids/initials-berfoto/flagship SEMUA identik; nol sisa string "Omniprime"/"omniprime.global"/"1874" di ke-8 file. File lain (content.ts, council-profiles.ts, dst. milik agen lain) tidak disentuh.

Stage Summary:
- 8 file data selesai: seluruh string pengguna kini Bahasa Indonesia baku & berwibawa, brand PT TOP KONSULTAN INTERNASIONAL (Jakarta 2001, 46 Dewan Pakar, 6.900 tahun, 190 negara, 12.000+ penugasan, 99,97%, 10 hub global), istilah teknis asing lazim dipertahankan (Partner-in-Chief, war-game, value-track, follow-the-sun, dst.).
- Field bilingual wajib terisi lengkap: ServiceDetail.enName (12), Industry.enName+enTagline (12+12), Insight.enTitle+enExcerpt (6+6), Leader.enRole (12), Role.enTitle (8).
- Join keys & invariants aman (diverifikasi otomatis vs git HEAD): slug, num, relatedCouncils, industry.councils/services, leader.council (⊆ data lama), initials 6 pemimpin berfoto, image, cover, date, readTime, value stats/kpis, ikon, id, updated — semua TIDAK berubah.
- offices.ts kini persis 10 hub spesifikasi dan sinkron dengan globe landing (HUBS content.ts); Jakarta flagship. timeline.ts kini kisah TOP 2001–2024.
- Catatan untuk agen lain: leader.council untuk 6 monogram diambil dari nilai lama yang relevan secara domain (mis. Maya → "Technology & AI — London", Arif → "Finance & Risk — Tokyo"); Bimo memakai "Office of the Concord — Zürich" (ref kantor pimpinan tertinggi dari data lama) — jika string "Concord/Zürich" ingin dibersihkan total, itu keputusan lintas-file bersama content.ts. tsc: 4 error pre-existing di examples/ & skills/, bukan milik proyek web.

---
Task ID: 3-f
Agent: terjemah-page-1
Task: Translasi (write code) 10 file halaman/komponen ke Bahasa Indonesia premium untuk rebrand PT TOP KONSULTAN INTERNASIONAL — about, method, results, careers, faq, legal, not-found, contact (site pages) + landing/contact + oracle-chat. Hanya salinan milik halaman; data (LEGAL_DOCS, FAQS, ROLES, PERKS, TIMELINE, LEADERS, dsb.) tidak disentuh.

Work Log:
- Baca worklog.md + audit 10 file target, konstanta BRAND (src/data/brand.ts) dan data milik halaman (BUDGETS/GUARANTEES/ORACLE_PROMPTS/ABOUT_CARDS di content.ts; OFFICES) untuk memastikan tidak menghardcode terjemahan nilai data.
- about.tsx: hero "Tentang Perusahaan" / "Bukan sekadar konsultan. Sebuah peradaban keahlian." — narasi didirikan 2001 di Jakarta (BRAND.founded/BRAND.countries/BRAND.legal), Zürich/1874/Concord/Bahnhofstrasse diganti Menara TOP Jakarta; pakta pendirian (46 pakar, satu gerbang tunggal); 4 butir piagam firma (mitra senyap, Satu Mitra Utama, 46 disiplin tanpa alih tangan, follow-the-sun 10 hub); heading timeline "Memori firma", kepemimpinan "menjawab dengan nama", nilai "Yang kami ikrarkan", kutipan "Beri kami 46 menit…" — Piagam Pendirian Pasal 1; TIMELINE/LEADERS/ABOUT_CARDS tetap dari data.
- method.tsx: "Protokol Oracle" hero + sub 6.900 tahun/Jakarta 2001; 6 PRINCIPLES halaman diterjemahkan (Tak ada yang luput diuji … Dieksekusi, bukan sekadar slide); StatBand 12.000+/99,97%/48 jam; kutipan "Kami tidak menjual jam…" — Piagam Firma Pasal VII; Methodology (data) utuh.
- results.tsx: "Hasil & Bukti" — "Brief mustahil. Tuntas.", meta 12.000+/99,97%/190 negara, kutipan Putri Maheswari → Ketua Dewan Komisaris.
- careers.tsx: "Karier di TOP" — "Jenius mencari jenius.", StatBand (10 hub, 46 disiplin, 18 bln rekor magang→mandat), "Yang kami berikan kembali", "Delapan pintu menuju firma", label "Syarat dari firma", tombol "Lamar Sekarang" (prefill ?role tetap), CTA "Tulis mandat Anda sendiri"; ROLES/PERKS tetap dari data.
- faq.tsx: "Pertanyaan Umum" — eyebrow "Pertanyaan, dijawab tuntas", meta (10 jawaban / Hukum 48 jam / Nol basa-basi), CTA "Tanya langsung ke Dewan"/"Lihat buktinya"; FAQS tetap dari data.
- legal.tsx: eyebrow "Doktrin firma", crumb Beranda, meta "Diperbarui {updated} · Bahasa yang lugas · Mengikat sejak 2001", strip "Version X — menggugurkan seluruh ketentuan sebelumnya", "Doktrin lainnya", blok kontak → Dewan Audit Forensik + mailto BRAND.email (halo@topkonsultan.co.id), tombol "Baca Pertanyaan Umum kami", fallback "Dokumen tidak ditemukan."; LEGAL_DOCS (judul/intro/section) tetap dari data.
- not-found.tsx: h1 "404 — Halaman Tidak Ditemukan.", salinan "Jalur ini tidak ada di peta kami. Namun 46 Dewan Pakar selalu tahu jalan.", waypoint ID (46 Dewan Pakar/Dua Belas Praktik/Wawasan/Tentang Kami/Hubungi Kami), tombol "Kembali ke Beranda" (→ /).
- contact.tsx (site): breadcrumb Beranda / "Konsultasi dengan Dewan"; form landing dipakai ulang.
- landing/contact.tsx: CONTACT_ROWS → BRAND.email/BRAND.phone/BRAND.address (Email resmi/Telepon langsung/Kantor pusat); heading "Konsultasikan dengan 46 Dewan Pakar." + sub ≤ 48 jam; label Nama Lengkap/Email Kantor/Perusahaan (opsional)/Anggaran (BUDGETS)/Jelaskan Tantangan/kebutuhan Anda; placeholder ID; badge "Mandat lamaran: {role}"; tombol "Kirim Brief ke Dewan", loading "Dewan sedang berdeliberasi…"; sukses "Brief diterima." + "46 Dewan Pakar telah menghadir — wawasan pertama datang dalam ≤ 48 jam." + #{engagementId}, tombol "Kirim brief baru"; error ID + fallback ID TOP-0000; footnote kerahasiaan; POST tetap kirim type=career untuk lamaran.
- oracle-chat.tsx: FAB aria "Buka Oracle"/"Tutup Oracle", panel dialog "Konsultasi dengan Oracle", header "ORACLE" + "Kecerdasan 46 Dewan Pakar", greeting "Selamat datang. Saya Oracle — suara tersatukan 46 Dewan Pakar…", placeholder "Tanyakan apa saja — izin, strategi, pajak…", aria kirim "Kirim", fallback balasan & error ID; quick prompts tetap dari ORACLE_PROMPTS (data).
- Struktur/animasi/class/a11y tidak diubah; hanya copy & referensi brand. rg guard: 0 sisa "omniprime/Zürich/Concord/1874/chamber/Councils…" di 10 file milik tugas ini (sisa di global/office-clocks/council-*/insight-*/service-detail/industry-detail/ui.tsx adalah milik agen lain).
- QA: bunx tsc --noEmit (filter examples/skills) → 0 error dari seluruh src/.
- APPEND entri ini ke worklog.md (tanpa mengubah isi sebelumnya).

Stage Summary:
- 10 file milik Task 3-f 100% Bahasa Indonesia premium PT TOP KONSULTAN INTERNASIONAL: site/pages/{about,method,results,careers,faq,legal,not-found,contact}.tsx + landing/{contact,oracle-chat}.tsx — lolos tsc, struktur/animasi/a11y utuh.
- Data-file (LEGAL_DOCS, FAQS, ROLES, PERKS, TIMELINE, LEADERS, GUARANTEES, ORACLE_PROMPTS, METHOD/CASES/COMPARISON) dirender apa adanya dari data — menunggu agen translasi data.
- Kontak & identitas halaman kini dari BRAND: telp +62 21 5088 8000, halo@topkonsultan.co.id, Menara TOP Lt. 38 Sudirman; fallback ID engagement TOP-0000.
- Catatan agen lain: copy Inggris tersisa di site/ui.tsx, site/office-clocks.tsx, landing/global.tsx, pages/{councils,council-detail,insights,insight-detail,service-detail,industry-detail,home}.tsx + data content.ts (GUARANTEES/TESTIMONIALS/ORACLE_PROMPTS)/offices.ts — di luar lingkup 3-f.

---
Task ID: 3-d
Agent: terjemah-ui-1
Task: Translasi copy komponen landing milik sendiri (hero.tsx, marquee.tsx, stats.tsx, about.tsx, services.tsx) ke Bahasa Indonesia premium untuk rebrand PT TOP KONSULTAN INTERNASIONAL — tanpa mengubah animasi, struktur, class, maupun aksesibilitas.

Work Log:
- Membaca worklog.md (konteks Task 1, 2, 3-a) lalu membaca kelima file yang dimiliki beserta motion.tsx (referensi props SplitWords/SectionHeading — tidak diubah) dan mengecek lokasi data BENCHMARKS/STATS/ABOUT_*/SERVICES di src/data/content.ts (milik agen lain — tidak disentuh, tidak di-hardcode).
- hero.tsx: badge → "EST. 2001 — JAKARTA · MELAYANI 190 NEGARA"; H1 3 baris SplitWords dipertahankan pola delay 1.55/1.78/2.01 + allGold baris terakhir → "Satu Gerbang untuk" / "Segala Izin dan" / "Kejayaan Bisnis Anda" (gold); sub → copy 46 Dewan Pakar + 6.900 tahun + 190 negara dengan span tebal pada klausa akhir; typewriter words diganti seluruhnya (NIB & OSS RBA., Pendirian PT & PMA., Izin BPOM & Halal., SNI & KITAS., Strategi & Ekspansi Global.) + prefix "Sedang menuntaskan:"; CTA 1 tetap #/contact → "Mulai Konsultasi"; CTA 2 #/method → #/perizinan "Jelajahi 36 Izin"; 4 chips → 46 Dewan Pakar / 6.900 Tahun Pengalaman / 99,97% Keberhasilan / Respons ≤ 48 Jam (ikon Globe2 → Clock agar semantik, satu-satunya perubahan import); aria-label section & scroll cue → Indonesia ("Gulir"); parallax, Mandala, orbs, chips ul, seluruh class/delay animasi tidak disentuh.
- marquee.tsx: aria-label section → "Tolok ukur industri yang kami lampaui"; prefix → "Tolok ukur yang kamijadikan acuan — lalu kami melampauinya"; aria-label BadgeCheck "surpassed" → "terlampaui"; BENCHMARKS dari data file tetap dikonsumsi apa adanya; animasi marquee/pause-hover tidak diubah.
- stats.tsx: aria-label → "Angka-angka kunci"; eyebrow → "Dalam Angka"; title → "Keahlian, terukur." (span text-gradient-gold dipertahankan); sub → "Angka yang ditanggung langsung oleh 46 Dewan Pakar — total 6.900 tahun pengalaman gabungan."; render STATS (value/label/caption/prefix/suffix) tetap murni dari data file — tidak ada hardcoded.
- about.tsx: aria-label → "Tentang PT TOP Konsultan Internasional"; eyebrow → "Perusahaan"; title → "Bukan sekadar konsultan. Satu jawaban terpadu." (gold pada frasa kedua); sub menonjolkan satu jawaban terpadu 46 disiplin, strategi hulu-eksekusi hilir, perizinan end-to-end; blockquote → "Berikan kami 46 menit. 46 Dewan Pakar akan memberikan Anda dekade berikutnya." + cite "— Piagam Pendirian, Pasal 1"; ABOUT_POINTS/ABOUT_CARDS tetap dari data file; TiltCard/Reveal utuh.
- services.tsx: aria-label → "Layanan"; eyebrow → "Hulu ke Hilir — Strategi hingga Eksekusi" (duplikasi Inggris dihapus); title → "Setiap bidang. Satu komando."; sub → "Dua Belas Praktik, satu pikiran terpadu. …"; aria-label kartu → `Buka praktik ${s.title}`; label hover "Enter the practice" → "Lihat detail"; link bawah → "Jelajahi Dua Belas Praktik secara mendalam" (#/services tetap); judul/desc/tags layanan tetap dari data SERVICES.
- QA: bunx tsc --noEmit (filter examples/ & skills/) → 0 error dari kelima file maupun seluruh src/; grep sisa copy Inggris/Omniprime di 5 file → hanya identifier kode, id/href anchor (#services, #benchmarks, #/services, #/contact, #/perizinan), dan komentar — tidak ada teks user-facing Inggris.
- APPEND entri ini ke worklog.md; tidak ada file lain yang disentuh.

Stage Summary:
- 5 komponen landing (hero, marquee, stats, about, services) kini ber-copy Bahasa Indonesia premium bermerek PT TOP KONSULTAN INTERNASIONAL: badge EST. 2001, H1 "Satu Gerbang untuk Segala Izin dan Kejayaan Bisnis Anda" (gold), typewriter 5 layanan perizinan, CTA Mulai Konsultasi + Jelajahi 36 Izin (#/perizinan), chips 46 Dewan Pakar/6.900 tahun/99,97%/≤48 Jam.
- Semua animasi (SplitWords, typewriter, parallax, Mandala, marquee, Counter, Reveal, TiltCard), struktur DOM, class, href, dan aria tetap utuh; hanya 1 import ikon berubah (Globe2 → Clock).
- Nilai data (STATS, ABOUT_POINTS/CARDS, SERVICES, BENCHMARKS) tetap dikonsumsi dari data file — translasi datanya adalah tugas agen lain.
- tsc bersih; siap dirangkai agen perizinan-page & review akhir.

---
Task ID: 3-e
Agent: terjemah-ui-2
Task: Terjemahan komponen landing (write code) — councils.tsx, methodology.tsx, comparison.tsx, results.tsx, testimonials.tsx, global.tsx ke Bahasa Indonesia premium untuk rebrand PT TOP KONSULTAN INTERNASIONAL.

Work Log:
- Membaca worklog.md (konteks Task 1, 2, 3-a) + memverifikasi struktur data content.ts (COUNCIL_CATEGORIES, METHODOLOGY, COMPARISON_ROWS, CASES, TESTIMONIALS, HUBS) dan pola query router (#/councils?filter=... diparse via URLSearchParams, decode otomatis) sebelum menyentuh file.
- councils.tsx: aria "46 Dewan Pakar"; eyebrow "Dewan Pakar"; heading "46 Pikiran. Satu Vonis." (gold); sub premium (150 tahun/dewan, 6.900 tahun gabungan, bersidang sejak jam nol); tab filter 100% DINAMIS dari COUNCIL_CATEGORIES (tanpa string kategori hardcoded; sentinel "All" hanya state internal, label dirender "Semua"); aria tablist "Filter dewan menurut ranah"; aria kartu "Buka Dewan <nama>"; badge "150 th"; footer "Menampilkan X dari 46 dewan" + link "Lihat semua 46 dewan di ruang sidang lengkap →" yang kini deep-link `#/councils?filter=` + encodeURIComponent(filter) (param tetap "filter", nilai kategori dinamis).
- methodology.tsx: aria "Metode Oracle"; eyebrow "Metode Oracle"; heading "Lima Gerakan. Nol Kegagalan." (gold); sub protokol 6.900 tahun; label "PHASE {step}" → "TAHAP {step}"; scroll-progress timeline & struktur tidak disentuh.
- comparison.tsx: kolom "Omniprime Global" → "TOP" (tag "No. 1 di Dunia"); "McKinsey & Co." & "Google" tetap (tag diterjemahkan "Rival yang dihormati" / "Raksasa pencarian"); "Top 46 Councils*" → "46 Dewan Terfragmentasi*" (tag "Tanpa sinergi"); heading "Kami menghormati para legenda. Lalu kami melampaui mereka."; sub Dewan Rendah Hati (kalah voting 45 banding 1); caption sr-only + header "Dimensi" + catatan kaki diterjemahkan; sel tabel tetap dari COMPARISON_ROWS (data, agen lain).
- results.tsx: aria "Hasil studi kasus"; eyebrow "Bukti, bukan janji"; heading "Hasil yang Berbicara."; sub 12.000+ penugasan + anonimitas klien; kartu CASES dirender dinamis dari data.
- testimonials.tsx: aria "Testimoni klien"; eyebrow "Apa kata dunia"; heading "Kata mereka yang pernah menang."; aria navigasi "Sebelumnya"/"Berikutnya"; tablist "Pilih testimoni"; aria titik "Testimoni dari <nama>"; auto-carousel & a11y tak berubah.
- global.tsx: aria "Jangkauan global"; eyebrow "Kehadiran global"; heading "Dari Jakarta untuk Dunia." (gold); sub organisme mengikuti matahari + 190 negara + Mitra Utama; hub pertama data (Jakarta) ditandai flagship — chip "Markas Global — <nama>" dan label globe "Markas Global" via indeks (bukan nama hardcoded); "24/7/365 — matahari tak pernah terbenam di atas para Dewan."; globe/satelit tak berubah.
- QA: bunx tsc --noEmit (filter examples/ & skills/) → 0 baris error; grep audit 6 file → tidak ada copy Inggris tersisa (hanya proper noun McKinsey/Google/Oracle sesuai instruksi).
- Disiplin: 0 hardcode nilai data (kategori, judul, kutipan, nama hub selalu dari import); tidak ada file lain yang disentuh kecuali append worklog ini.

Stage Summary:
- 6 komponen landing (councils, methodology, comparison, results, testimonials, global) sepenuhnya Bahasa Indonesia premium bernuansa TOP — animasi, class, struktur, a11y dipertahankan; hanya copy & brand yang berubah.
- Filter councils aman terhadap perubahan COUNCIL_CATEGORIES oleh agen lain (semua tab/href/URL query dinamis, ?filter= + encodeURIComponent tetap).
- tsc bersih untuk seluruh file milik agen; siap digabung dengan terjemahan data (content.ts) dari agen lain.

---
Task ID: 3-g
Agent: terjemah-page-2
Task: Menerjemahkan 8 halaman situs (services, service-detail, councils, council-detail, industries, industry-detail, insights, insight-detail) ke Indonesia premium untuk rebrand PT TOP KONSULTAN INTERNASIONAL + render bilingual kickline EN.

Work Log:
- Membaca worklog.md, extended-types.ts (field bilingual enName/enTagline/enTitle/enExcerpt), content.ts, dan ui.tsx (PageHero menerima sub ReactNode → dipakai untuk kickline EN di bawah judul).
- services.tsx: eyebrow "12 Praktik Layanan", heading "Dua Belas Praktik. Satu Standar: Mutlak.", sub, crumb "Beranda/Praktik", meta chips, aria "Semua praktik"/"Buka praktik X", kickline s.enName di kartu, label "Lihat detail", kutipan + CTA "Lihat 46 Dewan di baliknya"/"Tugaskan sebuah praktik".
- service-detail.tsx: empty-state ID; eyebrow "Praktik NN dari 12"; kickline EN unik service.enName · detail.enName (Set-dedupe) di bawah judul hero; CTA "Konsultasikan Praktik Ini"; seksi "Kapabilitas", "Luaran", label band "KPI Hasil", "Protokol Penugasan", "Dewan Terkait" ("Penguasaan 150 tahun"), prev/next + aria "Navigasi praktik", footer "Disidangkan di bawah Konsordium 1874".
- councils.tsx: tab filter TETAP 100% DINAMIS dari COUNCIL_CATEGORIES (tanpa hardcode; hanya literal "All" dipetakan ke label "Semua"; query param `filter` + validInitial tidak berubah); heading "46 Dewan Pakar"/"Parlemen para polimat.", placeholder "Cari dewan pakar…", aria filter/search/hapus, "Diketuai oleh", badge "150 th", empty-state + CTA "Bentuk dewan baru", baris hitung "Menampilkan N dari 46 dewan".
- council-detail.tsx: judul "Dewan {name}.", meta "Diketuai oleh/Kedudukan · seat/Penguasaan 150 tahun", CTA "Konsultasikan dengan Dewan Ini", label "Penguasaan", "Ketua Dewan", "Bersidang di", "Pencapaian Tanda Tangan", "— Gerakan Khas dewan ini", "Enam Instrumen"/Kapabilitas, StatBand ID (6.900 format Indonesia), pointer "Tempat dewan ini diterjunkan"/"Lihat dua belas praktik kami", prev/next aria "Navigasi dewan". Tanpa kickline EN (nama dewan memang Inggris, sesuai spec).
- industries.tsx: eyebrow "Industri", heading "Setiap Industri. Kedalaman Absolut.", sub, aria "Lihat karya TOP di X" (rebrand Omniprime→TOP), kickline ind.enName di kartu, "Jelajahi wilayah", kutipan + CTA "Petakan yang belum terpetakan"/"Lihat 46 Dewan Pakar".
- industry-detail.tsx: kickline EN industry.enName + industry.enTagline di bawah judul hero (via sub ReactNode); seksi "Bukti di Lapangan" (kicker di atas StatBand), "Tantangan" ("Laporan Cuaca"/"Empat badai…"), "Pendekatan Kami", "Dewan Terkait", "Praktik Terkait", prev/next "Wilayah sebelumnya/berikutnya" aria "Navigasi industri".
- insights.tsx: formatDate → locale id-ID (tanggal Indonesia); heading "Wawasan dari Ruang Dewan." + sub; badge "Sorotan Utama"; label "Baca wawasan"; "mnt" untuk read time; kickline enTitle di kartu featured & grid; aria "Baca: …"/alt "Ilustrasi sampul untuk …"; kutipan + CTA "Sidangkan para dewan"/"Lihat cara putusan ditempa".
- insight-detail.tsx: empty-state, back-link, "Waktu baca N menit", kickline insight.enTitle di bawah judul H1, shareText rebrand "— PT TOP KONSULTAN INTERNASIONAL", label "Berbagi" + aria "Berbagi ke X / Twitter"/"Berbagi ke LinkedIn", "Poin Kunci", author box "Ditulis dari ruang dewan" + doktrin transparansi (byline dari data), prev/next "Wawasan sebelumnya/berikutnya" aria "Wawasan lainnya".
- QA: rg menyisir 8 file — 0 sisa copy Inggris/"Omniprime" (hanya identifier kode); bunx tsc --noEmit (filter examples/skills) → 0 error; semua field EN dirender dengan optional chaining aman (field opsional di interface, aman bila agen data belum mengisi).

Stage Summary:
- 8 halaman milik terjemah-page-2 kini Indonesia premium bermerek PT TOP KONSULTAN INTERNASIONAL; struktur/animasi/kelas tidak berubah, hanya copy + kickline bilingual + label seksi sesuai spec.
- councils.tsx kebal perubahan nilai COUNCIL_CATEGORIES (tab, count, validasi query semuanya dinamis; query param tetap `filter`).
- Bilingual EN: service-detail (service.enName + detail.enName), industry-detail (enName + enTagline), insight-detail (enTitle) di bawah judul; kartu list services/industries/insights menampilkan enName/enTitle kecil bila ada; council-detail sengaja tanpa kickline.
- tsc bersih; tidak ada file lain yang disentuh.

---
Task ID: 3-b
Agent: terjemah-core
Task: Menerjemahkan seluruh string user-facing di src/data/content.ts dan src/data/council-profiles.ts ke Bahasa Indonesia premium (rebrand PT TOP KONSULTAN INTERNASIONAL) — tanpa mengubah join key, struktur, icon, atau angka.

Work Log:
- Membaca worklog.md (konteks rebrand) dan kedua file target secara penuh; verifikasi `enChairTitle?: string` sudah ada di extended-types.ts (line 28) dan `enName?: string` sudah ada di interface Service — tidak perlu menyentuh file lain.
- content.ts (ditulis ulang penuh): (1) CouncilCategory union + COUNCIL_CATEGORIES + 46 COUNCILS[].category konsisten ke 6 kategori Indonesia ("Strategi & Kepemimpinan", "Teknologi & AI", "Sains & Rekayasa", "Keuangan & Risiko", "Masyarakat & Tata Kelola", "Kesehatan & Potensi Manusia"); (2) 46 blurb dewan diterjemahkan copywriting premium; (3) 12 SERVICES: title sesuai spesifikasi ("Strategi & Transformasi" … "Penasihat Sovereign & Negara"), enName diisi nama Inggris asli (12/12), desc + tags diterjemahkan (M&A, Cloud, S&OP, GTM, CX, LLM Ops, DevSecOps, Net-Zero tetap asing); (4) NAV_LINKS → Tentang/Layanan/46 Dewan Pakar/Metode/Hasil; (5) STATS label+caption sesuai spesifikasi; (6) ABOUT_POINTS 4 poin & ABOUT_CARDS (Skala Kognitif/Kecepatan/Presisi/Kedaulatan); (7) METHODOLOGY 01-05 → Pemindaian Total/Sidang Dewan/Transendensi/Arsitektur/Asensi; (8) COMPARISON_ROWS: label + mck/goo/uni diterjemahkan, kolom omni persis "150 tahun", "Semua 46", "48 jam", "99,97%", "Spektrum penuh", "Selalu", "24/7/365"; (9) CASES: title/desc/tag Indonesia, prefix/suffix/value/decimals apa adanya; (10) TESTIMONIALS: quote diterjemahkan, nama & initials tetap, role Indonesia ("CEO Grup…", "Ketua Umum, Nusantara Financial Holdings"), satu-satunya "Omniprime's councils" → "Dewan-dewan TOP"; (11) GUARANTEES & ORACLE_PROMPTS persis sesuai spesifikasi; HUBS, BUDGETS, BENCHMARKS tidak disentuh.
- council-profiles.ts (ditulis ulang penuh, 46 profil): name/chair/seat byte-identik (join key aman); chairTitle diterjemahkan ("Ketua · …") + field enChairTitle berisi judul Inggris asli ditambahkan pada 46/46 profil; mastery (2-3 kalimat), capabilities (6 per profil), achievements[].label, signatureMove diterjemahkan dengan gaya brosur premium — istilah teknis lazim tetap asing (alignment, settlement, provenance, custody, PQC, MRV, FinOps, duty-of-care, healthspan, longevity, dst.); achievements[].value tidak tersentuh; komentar header diubah ke Indonesia + kunci gabungan ditegaskan; tidak ada referensi "Omniprime" di file ini sejak awal.
- QA otomatis via bun: COUNCILS=46 vs PROFILES=46, JSON.stringify(name) identik (join key OK, tanpa duplikat); kategori terpakai ≡ COUNCIL_CATEGORIES; enName 12/12; enChairTitle 46/46; capabilities=6 & achievements=3 di semua profil; spot-check render NAV/SERVICES/METHODOLOGY/COMPARISON omni/GUARANTEES/ORACLE_PROMPTS/ABOUT_CARDS/CASES tag/role testimoni — semua sesuai spesifikasi.
- Typecheck: `bunx tsc --noEmit` → 4 error pre-existing di luar src/ (examples/websocket/*: socket.io tidak terpasang; skills/image-edit & skills/stock-analysis-skill: tipe SDK) — NOL error dari content.ts, council-profiles.ts, maupun seluruh src/.
- APPEND entri ini ke worklog.md; tidak ada file lain yang disentuh.
- Catatan untuk agen lain: sisa "Omniprime" masih ada di careers.ts, timeline.ts, legal.ts, leadership.ts, extended-types.ts (komentar) — di luar kewenangan task ini; kategori dewan kini bahasa Indonesia, jadi query filter/hardcode kategori berbahasa Inggris di komponen/halaman (mis. careers.ts `team:`) perlu disesuaikan agen pemiliknya.

Stage Summary:
- content.ts & council-profiles.ts FULL Bahasa Indonesia premium, lolos tsc bersih (0 error src/), join key 46 dewan identik, struktur/interface tetap valid.
- Kunci gabungan aman: name dewan, service num, icon, value/prefix/suffix/decimals, initials, x/y, prefix/suffix CASES, HUBS, BUDGETS, BENCHMARKS — semuanya tidak berubah.
- Bilingual layer aktif: SERVICES.enName (12) & COUNCIL_PROFILES.enChairTitle (46) menyimpan versi Inggris asli untuk keperluan tampilan bilingual.
- Next: agen pemilik komponen/halaman menyesuaikan pemakaian kategori (kini Indonesia) dan membersihkan sisa "Omniprime" di file data lain.

---
Task ID: 3-core (rebrand + perizinan + integrasi)
Agent: Z.ai Code (main orchestrator)
Task: Permintaan user — rebrand menjadi PT TOP KONSULTAN INTERNASIONAL, fokus konsultasi + perizinan terlengkap di dunia (OSS/NIB/BPOM/halal/dll), Bahasa Indonesia utama dengan kesiapan terjemahan global, semua negara maju masuk jangkauan.

Work Log:
- Riset web 10 query (OSS RBA, PMA, BPOM/halal BPJPH, PBG/SLF/AMDAL, RPTKA/KITAS, API-U/P, DJKI, PSE Komdigi, pajak/tax holiday, taksonomi layanan 8 konsultan global terbaik) → notes/*.json + digest ke spec.
- Menulis src/data/brand.ts (single source of truth: legal name, tagline ID/EN, kontak, alamat Menara TOP Jakarta, angka kunci).
- Menulis notes/perizinan-spec.md (spec 36 izin × 8 kategori, fakta regulasi terverifikasi) → Task 3-a (subagent) mengempa src/data/perizinan.ts (1.316 baris, 44 ikon unik, tsc bersih).
- extended-types.ts: field bilingual opsional (enName/enTagline/enTitle/enExcerpt/enRole/enChairTitle).
- content.ts: HUBS diganti 10 hub negara maju (Jakarta HQ + Singapore, Tokyo, Seoul, Sydney, Dubai, London, Frankfurt, New York, San Francisco), BUDGETS → Rupiah, enName di interface Service.
- Rombak komponen brand: logo.tsx (monogram gerbang TOP), preloader (TOP KONSULTAN + "Menghadirkan 46 Dewan Pakar"), navbar (6 link ID + Perizinan + CTA "Konsultasi Sekarang"), footer (sitemap: Perusahaan + 8 kategori Perizinan + Layanan + Dewan + Hukum + kontak telp/email/alamat + newsletter ID), ui.tsx CTABand ID, layout.tsx (metadata SEO ID, lang="id", keyword perizinan lengkap), icon.svg (gerbang emas), app.tsx (rute /perizinan + /perizinan/[slug] + judul ID semua rute + skip-link ID).
- Halaman baru: pages/perizinan.tsx (StatBand, search, 9 tab filter, grid 36 kartu, empty-state), pages/perizinan-detail.tsx (breadcrumb, fakta 4 kolom, deskripsi, 5 persyaratan, protokol 5 langkah, sidebar kartu izin + jaminan, terkait), landing/perizinan-section.tsx (8 kartu kategori di beranda).
- API: /api/contact → kode TOP-XXXXX + pesan Indonesia; /api/oracle → persona Oracle TOP berbahasa Indonesia (jawab multibahasa mengikuti pengguna).
- 6 subagent paralel (3-b s/d 3-g): terjemahan premium seluruh data + halaman (content, 46 profil dewan, 12 service-detail, 12 industri, 6 wawasan, leadership — 6 pimpinan monogram diganti jajaran Indonesia: Bimo Aria Wibowo dkk., karier, legal UU PDP/UU ITE/PP PSTE, offices 10 hub, timeline 2001–2024, hero, marquee, stats, about, services, councils, methodology, comparison, results, testimonials, global, contact, oracle-chat, 8 halaman site-pages dengan kickline EN).
- Pembersihan sisa brand lama: kursi "Zürich" didistribusi ke 10 hub, "Konsordium 1874" → "Piagam TOP 2001", leadership council refs di-Indonesia-kan, id careers chief-of-staff-top, komentar router/ui/extended-types.
- Perbaikan bug hasil E2E: overflow-x mobile 550px (blob dekoratif di services/councils/methodology/perizinan-section tanpa overflow-hidden → ditambah overflow-hidden + hardening global html/body overflow-x: clip; terverifikasi 390=390).
- Verifikasi Agent Browser: 13 rute utama + 3 detail + 404 semua judul & H1 benar; filter kategori deep-link (?kategori & ?filter) hidup; katalog 36 kartu; form kontak E2E dua kali (TOP-MUP07W6H, TOP-MUP0DXMA; POST 200; persist SQLite total 3); newsletter sukses; Oracle chat E2E (jawab PMA dalam bahasa Indonesia); menu mobile; footer sticky; kickline EN di detail (STRATEGY & TRANSFORMATION, dst.); nol error konsol; lint & tsc bersih.

Stage Summary:
- Situs multi-halaman 20+ rute full Bahasa Indonesia premium dengan brand PT TOP KONSULTAN INTERNASIONAL.
- Katalog "Gerbang Perizinan" 36 izin × 8 kategori (badan hukum, OSS/NIB, pajak, ketenagakerjaan & imigrasi, lingkungan & bangunan, perdagangan & produk, KI & digital, sektor khusus & global) — inti bisnis user.
- Bilingual: konten ID + kickline EN (enName/enTagline/enTitle) + Oracle multibahasa; 10 hub negara maju dari Jakarta HQ.
- Semua link hidup, semua verifikasi browser lolos, tanpa jejak brand lama.

---
Task ID: 4-leadership-readme
Agent: Z.ai Code (main orchestrator)
Task: Permintaan user — (1) buat README terbaik dengan full design & full version; (2) masukkan Gugun Gunara (pengusaha asal Tasikmalaya, konsultan bisnis senior, pernah berpartner dengan McKinsey) sebagai pimpinan perusahaan.

Work Log:
- Menulis scripts/gen-founders.sh (7 potret editorial black-gold konsisten dengan set leadership-1..6) dan menjalankannya di background: founder-gugun-gunara.png + leadership-7..12.png untuk seluruh C-suite Indonesia.
- extended-types.ts: menambah field opsional `featured?: boolean` pada interface Leader.
- leadership.ts ditulis ulang: Gugun Gunara sebagai entri #1 (featured) — Pendiri & Direktur Utama / Founder & CEO, council "Kantor Pusat — Menara TOP, Jakarta", bio Tasikmalaya + McKinsey partnership, chips "Tasikmalaya · Jawa Barat / Konsultan Bisnis Senior / Berpartner dengan McKinsey"; Bimo Aria Wibowo digeser menjadi Wakil Direktur Utama (bio disesuaikan, tetap memimpin operasi 12.000+ penugasan); 6 pimpinan Indonesia kini berpotret (leadership-7..12); 6 Mitra Senior internasional dipertahankan urut di belakang.
- about.tsx: seksi Kepemimpinan kini merender kartu Pendiri full-width (sm:col-span-2 lg:col-span-3) — potret 340px kiri, konten kanan, chip aksen emas, kickline enRole italic; perbaikan penutup map `))}` → `})}` setelah konversi body arrow ke block.
- README.md ditulis penuh (full design): ASCII logo TOP, badge shields.io, banner hq.png, daftar isi 18 bagian, ringkasan eksekutif dengan tabel angka kunci, matriks fitur, identitas brand, peta situs 124 tampilan, diagram arsitektur ASCII + penjelasan hash router, struktur proyek, tabel 12 file data, Gerbang Perizinan 36 izin × 8 kategori, strategi dwibahasa + peta jalan bahasa, Oracle AI, referensi 3 API dengan contoh curl, skema Prisma, quickstart, deploy shared hosting (dual mode), sistem desain, rekaman QA E2E, peta jalan, seksi Kepemimpinan (Gugun Gunara difeatured + tabel 13 pimpinan), lisensi/kredit. Semua angka diambil dari kodebase (fakta, bukan klaim).
- QA: bunx tsc --noEmit → 0 error di src/; bun run lint bersih; dev server 200.

Stage Summary:
- Gugun Gunara kini Pendiri & Direktur Utama PT TOP KONSULTAN INTERNASIONAL di seluruh data + halaman /about (kartu featured full-width).
- README.md premium siap publikasi — full design (ASCII art, badge, tabel, diagram, collapsible facts), full version (18 bagian), 100% faktual terhadap kodebase.
- 7 potret pimpinan Indonesia digenerate gaya black-gold konsisten.

---
Task ID: 1
Agent: Super Z (main agent)
Task: Clone & install repositori https://github.com/prabudanling/topkonsultan

Work Log:
- Clone repo dari GitHub ke /home/z/my-project/topkonsultan
- Inisialisasi environment fullstack (init-fullstack.sh)
- Rsync seluruh isi repo ke /home/z/my-project (root proyek dev server), hapus folder clone
- bun install — 915 packages, tanpa perubahan (deps sudah lengkap)
- bun run db:push — skema Prisma (ContactMessage, NewsletterSubscriber) sinkron dengan SQLite db/custom.db
- Verifikasi Agent Browser: beranda render sempurna (tema emas-hitam), #/perizinan hidup (36 izin, 9 tab filter), Oracle AI menjawab pertanyaan PMA dalam Bahasa Indonesia (POST /api/oracle 200)
- Uji POST /api/contact → tiket TOP-MUP7ZLMJ tersimpan di SQLite
- dev.log bersih tanpa error runtime

Stage Summary:
- Situs PT TOP KONSULTAN INTERNASIONAL berjalan penuh di port 3000 (Next.js 16.1.3 + Turbopack)
- Fitur terverifikasi E2E: hash router 124 tampilan, katalog perizinan, Oracle AI (Z.AI SDK), form kontak bertiket, newsletter
- Screenshot verifikasi: download/verify-home.png, download/verify-oracle.png

---
Task ID: 2
Agent: Super Z (main agent)
Task: Branding situs dengan foto asli upload (logo master, foto Pendiri, foto Menara, 5 foto akreditasi/sertifikat)

Work Log:
- Inspeksi 8 file upload di /home/z/my-project/upload (dimensi & konten)
- Optimasi via scripts/brand-assets.py (PIL resize + kompresi): logo 9MB->316KB, founder 2.1MB->178KB, total 8 aset ke public/images/
- Komponen baru src/components/landing/accreditation.tsx — galeri "Setiap Sertifikat Adalah Bukti." berisi 5 kartu foto akreditasi/penyerahan + 1 kartu segel logo emas Pusat Perizinan.ID (next/image, Reveal, SectionHeading, gaya gold zinc-950 konsisten)
- home.tsx: <Accreditation/> disisipkan antara Results dan Testimonials
- leadership.ts: foto Pendiri diganti foto asli founder-gugun-gunara.jpg
- about.tsx: foto Menara TOP diganti menara-top.jpg (1344x768)
- Verifikasi: ESLint bersih, tsc src bersih, dev.log tanpa error, Agent Browser: galeri 6 kartu render, foto founder & menara termuat, screenshot di download/verify-*.png

Stage Summary:
- Situs kini memakai aset branding asli klien di beranda & halaman Tentang
- Galeri Akreditasi hidup di beranda posisi setelah section Hasil (#akreditasi)
- Semua aset teroptimasi untuk web (total < 1.6KB..KB rata-rata <250KB per foto)

---
Task ID: 3
Agent: Super Z (main agent)
Task: Tambah logo resmi kementerian/lembaga RI sebagai section "Jaringan Instansi" di beranda

Work Log:
- Upstream z-ai image-search error 400; Wikimedia 429 dengan UA generik -> solusi: UA deskriptif "TopKonsultanSiteBuilder/1.0" + jeda sopan, akses API Wikipedia/Commons lancar
- Unduh 18 kandidat via scripts/fetch-agency-logos.py + refetch-logos.py (pageimages id.wikipedia & Commons search)
- QC visual via contact sheet (scripts/logo-contact-sheet.py): 17 lolos, bappebti (PDF sampul) & pu (tidak ada kandidat layak) dibuang per permintaan user "yang tidak bagus jangan dimasukan"
- Perbaikan manual: kemenkumham awalnya seal Kemenko (salah) -> diganti logo resmi Kemenkumham "Pengayoman"; ojk awalnya foto gedung -> diganti logo OJK; kemenpar awalnya Pesona Indonesia -> lambang resmi Kementerian Pariwisata (2024); bonus logo DJKI (merek/paten/hak cipta)
- Komponen baru src/components/landing/agencies.tsx: section #instansi "Satu Meja dengan Semua Instansi." — 17 kartu putih berisi logo resmi + nama + cakupan izin, disisipkan setelah PerizinanSection, plus disclaimer kepemilikan logo (bukan afiliasi resmi)
- Verifikasi: lint bersih, dev.log bersih, Agent Browser: 3 baris logo render sempurna, nol error console

Stage Summary:
- Beranda kini menampilkan 17 logo resmi instansi (Kemenkumham, BKPM, Kemenkeu, Kemendag, Imipas, KLH, Kemnaker, Kemenkes, BPOM, Kemenag, BSN, DJKI, Komdigi, OJK, Kemenperin, Kemenkop, Kemenpar)
- Framing jujur & aman: "instansi yang dihadapi langsung", bukan klaim kemitraan — diproteksi disclaimer hukum

---
Task ID: 3
Agent: Z.ai Code (main orchestrator)
Task: Kontak resmi (+6281111165165 / halo@topkonsultan.web.id / 4 alamat: Arjamukti, Andalusia, PHI Kwitang, IPHI Pusat), rebrand ungu-biru, maksimalkan layanan + logo mitra instansi resmi.

Work Log:
- brand.ts: telepon & WhatsApp +62 811-1116-5165 (wa.me/6281111165165), email halo@topkonsultan.web.id, 4 alamat resmi (addresses[]) + address pusat Arjamukti.
- offices.ts ditulis ulang: 4 kantor real (Tasikmalaya I pusat, Tasikmalaya II, Jakarta PHI Kwitang, IPHI Pusat).
- office-clocks.tsx -> seksi "Kantor Kami": jam WIB live, jam operasional, 4 kartu kantor + link Google Maps.
- Rebrand ungu-biru: sed amber->violet di 43 file tsx/ts/svg (314 kemunculan), hex #fbbf24->#a78bfa dst, rgba glow->violet, CTA signature from-violet-400 via-indigo-400 to-blue-500, globals.css (text-gradient-gold jadi gradasi violet-indigo-blue, glass/gold-ring/scrollbar/grid/selection/focus).
- logo.tsx + icon.svg favicon -> violet.
- legal.ts, leadership.ts, about.tsx: alamat Menara TOP fiktif -> alamat real, email privacy -> halo@.
- Logo instansi: scripts/fetch-ministry-logos.py (+round 2) dari id.wikipedia REST & Wikimedia Commons, quality-gate + auto-crop + optimasi PIL; QA via contact sheet; buang logo salah (foto gedung ESDM, Ditjen Survei utk ATR, Badan Keolahragaan utk BSN); hasil 19 logo resmi.
- agencies.tsx: array 23 instansi (tambah kemenhub, kemendagri, kemenpu, atr-bpn, kesdm, kemendesa; ganti kemendag EN->ID, kemenkop wordmark), strip "Perhimpunan Profesi" PHI Kwitang + IPHI Pusat; logo ke public/images/agencies/.
- WhatsApp: komponen whatsapp-float.tsx (kiri-bawah, hijau, ping) global di app.tsx; tombol Chat WhatsApp di hero + CTABand.
- landing/contact.tsx: baris kontak WA/email/telepon/alamat + Jaringan Kantor 4 lokasi; footer.tsx: WA 24/7 + 4 alamat.
- Debug cache: cache image Next 16 Turbopack ada di .next/dev/cache/images (bukan .next/cache/images) -> hapus + restart server.
- Verifikasi: lint OK, tsc OK (src), browser E2E multi-screenshot (hero ungu-biru, 23 kartu instansi, PHI/IPHI strip, Kantor Kami, kartu kantor, footer), wa.me href benar, console bersih.

Stage Summary:
- Website kini bernuansa ungu-biru penuh, kontak resmi terpasang di seluruh halaman, 23 logo instansi resmi tampil sebagai mitra pengurusan izin, tombol WhatsApp mengapung aktif 24/7.
- File kunci: src/data/brand.ts, src/data/offices.ts, src/components/landing/{agencies,whatsapp-float,contact,footer,hero}.tsx, src/components/site/office-clocks.tsx, src/app/globals.css.
- Screenshot verifikasi: download/verify-*.png. Skrip fetch logo: scripts/fetch-ministry-logos*.py.

---
Task ID: 4
Agent: Super Z (main agent)
Task: Aktifkan AI di Vercel production — setup deploy otomatis, env-based AI provider, fallback anti-rusak, panduan deploy non-IT.

Work Log:
- Forensik SDK z-ai-web-dev-sdk: auth via file .z-ai-config (baseUrl+apiKey) di cwd/~//etc — file ini HANYA ada di sandbox, tidak akan ada di Vercel.
- src/app/api/oracle/route.ts ditulis ulang (dua provider): (1) env AI_API_KEY + AI_BASE_URL (default https://api.z.ai/api/paas/v4) + AI_MODEL (default glm-4.6), fetch OpenAI-compatible + thinking disabled utk z.ai/bigmodel + timeout AbortController 25s + maxDuration=30; (2) SDK sandbox sebagai jalur kedua. catch -> HTTP 200 fallbackReply() berisi WA +62 811-1116-5165 & halo@ + flag fallback:true — chat tidak pernah tampak rusak.
- oracle-chat.tsx: state fallback, import BRAND, CTA hijau "Chat Tim Manusia via WhatsApp" (BRAND.whatsappHref) muncul saat flag fallback, reset saat kirim baru.
- src/lib/db.ts: lazy resilient singleton via Proxy — tanpa DATABASE_URL import tetap aman, query melempar "database_unavailable" yang ditangkap API (fallback memori).
- API contact & newsletter: + runtime nodejs + dynamic force-dynamic (cegah eksekusi DB saat static-optimize build Vercel).
- package.json: engines node >=20.9.0; build = "next build" (Vercel parity); build:standalone dipisah utk self-host; postinstall = "prisma generate" (wajib agar Prisma client ter-generate di Vercel).
- vercel.json minimal (framework nextjs + buildCommand); .env.example (DATABASE_URL, AI_API_KEY, AI_BASE_URL, AI_MODEL berkomentar ID); .gitignore sudah menutup .env* & .z-ai-config.
- DEPLOY.md: panduan bahasa Indonesia non-IT — status jujur (apa otomatis, apa perlu 1 env var, DB fallback memori), langkah GitHub->Vercel import, aktivasi Z.AI key, domain, opsional Vercel Postgres, troubleshooting.
- Verifikasi: lint OK, tsc OK, bun run build (produksi) sukses, semua API route dinamic-f.
- Uji runtime prod: oracle via SDK sandbox jawab AI penuh (NIB, PMA); oracle dgn AI_API_KEY invalid -> fallback:true + pesan WA; contact terbit tiket TOP-MUPMNZS0; newsletter ok; TANPA DATABASE_URL sama sekali -> tiket tetap terbit (memori), nol crash.
- Browser E2E (agent-browser): hero ungu-biru render, panel Oracle buka, fallback pesan + tombol hijau "Chat Tim Manusia via WhatsApp" href https://wa.me/6281111165165 benar, console & errors bersih. Screenshot: download/verify-vercel-home.png, download/verify-oracle-fallback.png.
- Dev server port 3000 dipulihkan, oracle API balas normal.

Stage Summary:
- Situs 100% siap deploy Vercel zero-config: git push -> import -> Deploy.
- Oracle AI hidup penuh di Vercel setelah 1 env var (AI_API_KEY dari Z.AI open platform); tanpa itu chat berjalan elegan mengarahkan tamu ke WhatsApp resmi.
- Form kontak & newsletter tahan serverless (fallback memori), upgrade permanen via Vercel Postgres didokumentasikan.
- Panduan lengkap: DEPLOY.md.

---
Task ID: 5
Agent: Super Z (main agent)
Task: Anti "No Production Deployment" di Vercel — repo tinggal import, bukan kosongan/manual.

Work Log:
- Diagnosa akar masalah: (1) .env ikut tertrack git, (2) junk tertrack (download/ 32 file, upload/ 9, tool-results/ 5, examples), (3) tidak ada remote origin, (4) tanpa postinstall prisma generate bun tidak selalu auto-generate client di Vercel.
- .gitignore +/download/,/upload/,/tool-results/,/agent-ctx/,/examples/,db/*.db-journal; git rm --cached .env download upload tool-results examples.
- README.md baru: badge Deploy-with-Vercel 1 klik (vercel.com/new/clone?repository-url=...prabudanling/topkonsultan&env=AI_API_KEY), env var table, struktur, kontak resmi.
- Commit bersih d0ab21b: 244 file sumber (tanpa junk, tanpa .env, tanpa node_modules).
- SIMULASI VERSEL PENUH: git clone segar dari HEAD -> bun install --frozen-lockfile (827 paket, postinstall prisma generate sukses -> node_modules/.prisma/client terisi) -> bun run build SUKSES penuh (6/6 static, 4 API dynamic-f) -> next start tanpa env sama sekali: GET / 200, POST /api/contact terbit TOP-MUPWRGOT, /api/oracle jawab AI penuh (sandbox) / fallback elegan (Vercel nanti).
- git archive -> download/topkonsultan-vercel-ready.zip (9.2MB, sumber bersih siap GitHub).
- remote origin diset ke https://github.com/prabudanling/topkonsultan.git; git push tanpa kredensial gagal (harap dianggap: butuh PAT dari user ATAU GitHub Desktop oleh user).

Stage Summary:
- Repo main branch 100% Vercel-ready terbukti build di kondisi identik Vercel (clone segar + frozen lockfile + tanpa env). "No Production Deployment" tidak akan terjadi selama kode ini sampai ke GitHub.
- 2 jalur push bagi user: (A) kirim GitHub PAT classic repo-scope ke agent -> agent push; (B) download ZIP -> ekstrak -> GitHub Desktop -> Publish repository -> Vercel import via tombol README.
- Semua config deploy tersimpan: vercel.json, postinstall prisma generate, engines node >=20.9, .env.example, DEPLOY.md, README deploy button.

---
Task ID: 6
Agent: Super Z (main agent)
Task: README kelas dunia bilingual (ID+EN) full futuristik + pembersihan final repo.

Work Log:
- Banner SVG custom assets/readme/banner.svg (1200x320): bg zinc-950, grid + starfield, corner brackets futuristik, monogram TOP lingkaran gradien, judul gradien violet->indigo->blue, subtitle PUSAT PERIZINAN.ID, strip EST. 2001.
- Diagram SVG assets/readme/oracle-architecture.svg (1200x200): 4 node (PENGGUNA -> ORACLE AI -> 46 DEWAN PAKAR -> JAWABAN) border gradien + panah + strip teknologi.
- README.md ditulis ulang penuh: hero center (banner + tagline ID/EN), 2 baris badge shields (Next.js 16, React 19, TS, Tailwind 4 / Prisma, Z.AI, Vercel Ready, Production), tombol Deploy-with-Vercel 1 klik, pilih bahasa badge -> anchor, dua seksi penuh (ID & EN) masing-masing: quote, fitur 8 baris berglyph, deploy 60 detik, env vars, run lokal, struktur, kontak resmi; footer copyright dual-language.
- QC visual: kedua SVG di-screenshot via agent-browser — render sempurna (download/verify-banner.png, verify-arch.png).
- Commit cc3f7b0; ZIP arsip diregenerasi dari HEAD (download/topkonsultan-vercel-ready.zip, 9.2MB); working tree bersih 0 dirty.

Stage Summary:
- Repo tampil kelas dunia: README bilingual futuristik dengan aset SVG custom, tombol deploy 1 klik, badge stack modern.
- Semua siap push ke GitHub (butuh PAT user / GitHub Desktop) — setelah push, Vercel tinggal import & Deploy.

---
Task ID: 7
Agent: Super Z (main agent)
Task: Rebrand seluruh situs gelap -> tema CERAH (Bright Executive) yang enak dipandang, identitas ungu-biru dipertahankan sebagai aksen.

Work Log:
- Inventaris 45+ pola kelas warna via grep stat; desain palet terang: bg #fafafc (putih-lavender), teks slate-900/600, kartu putih + border slate-200 + bayangan violet lembut, aksen teks violet-600/700 (kontras AA di latar terang), CTA gradien violet-600->indigo-500->blue-600 + teks putih.
- scripts/light-theme.py: ~90 aturan replace terurut (suffix opacity dulu), kasus khusus (chip kategori councils, radial globe), glow rgba violet ditendang (0.7->0.42 dst); 45 file .ts/.tsx berubah.
- globals.css: :root light oklch, body #fafafc/slate-800, selection violet-600 putih, scrollbar terang, text-gradient-gold -> gradien dalam (#6d28d9..#2563eb), glass putih 0.8, grid-bg violet lembut, color-scheme light.
- layout.tsx: className="dark" dihapus, themeColor #fafafc; logo.tsx gradien #7c3aed->#2563eb; icon.svg tetap violet.
- Perbaikan lanjutan hasil QC browser: wrapper app.tsx bg-[#07070a]->bg-white (akar latar masih gelap), preloader, navbar mobile bg-[#0a0a0d], perizinan-detail; watermark angka services text-slate-900/10; footer border-slate-200.
- E2E Agent Browser: hero cerah premium, 23 kartu instansi putih, galeri akreditasi, halaman #/perizinan & #/contact & 404, footer lengkap (4 alamat), panel Oracle putih kaca, chat user bubble violet-600 + jawaban AI nyata (NIB). Screenshot: download/verify-light-*.png (9 file).
- Verifikasi: eslint bersih, tsc src bersih, bun run build produksi sukses.
- Commit 52efe35; ZIP arsip HEAD diregenerasi (9.2MB).

Stage Summary:
- Situs kini BERTEMa CERAH penuh (light mode premium): putih-lavender + aksen ungu-biru, nyaman di mata, kontras WCAG, semua 124 tampilan + landing section + Oracle chat + footer konsisten.
- Identitas brand ungu-biru tetap kental lewat gradien judul, CTA, badge, dan aksen; WhatsApp tetap hijau.
- Repo & ZIP siap push GitHub -> Vercel (proses deploy tetap zero-config).

---
Task ID: 8
Agent: Z.ai Code (main orchestrator)
Task: Permintaan user — "Oracle hanya untuk VVIP member, jangan tampilkan di website depan" — sembunyikan Oracle dari situs publik, jadikan lounge eksklusif dengan kode akses.

Work Log:
- Hapus OracleChat dari app shell (src/components/site/app.tsx): situs publik 124 tampilan kini 0 elemen Oracle (terverifikasi browser).
- Modul keamanan src/lib/vvip.ts: expectedVvipCode() dari env VVIP_ACCESS_CODE (bawaan TOP-VVIP-2026) + perbandingan timingSafeEqual (panjang beda tetap membakar waktu supaya panjang kode tidak bocor).
- API baru POST /api/vvip (src/app/api/vvip/route.ts): verifikasi kode gerbang; 400 tanpa kode, 403 kode salah + jeda 700ms anti brute-force, 200 + tier VVIP bila cocok; case-insensitive.
- API /api/oracle diperkuat: wajib header x-vvip-code server-side — 403 + pesan WhatsApp resmi bila tidak cocok; tanpa kode pun ditolak.
- src/components/site/pages/vvip.tsx (baru): lounge dark premium (zinc-950 + glow violet/indigo/blue, noise overlay) — badge "AREA EKSKLUSIF MEMBER VVIP", judul Oracle gradien, kartu kode (input mono uppercase tracking, tombol gradien, error shake via framer-motion key errorTick), tautan "Ajukan kandidatur via WhatsApp" bagi non-member. Setelah lolos: badge "AKSES VVIP AKTIF" (crown), heading "Selamat datang di Lounge Oracle", chip keunggulan, OracleChat embedded, tombol "Keluar dari sesi VVIP". Auto re-verifikasi kode tersimpan saat mount (kode rotate → gerbang menutup lagi). Layout anti-luapan: container tanpa justify-center, gerbang pakai my-auto.
- oracle-chat.tsx refactor: props embedded (panel inline tanpa FAB, tanpa tombol tutup, header "Akses VVIP aktif"), getVvipCode() dari sessionStorage topkonsultan_vvip_code, header x-vvip-code dikirim tiap pesan, penanganan 403 (pesan minta kode terbaru), tinggi embedded h-[min(620px,62svh)] agar muat viewport.
- Rute diskret "/vvip" didaftarkan di app.tsx (judul "Member Lounge") — TIDAK ditautkan dari navbar/footer/sitemap: hanya dibagikan personal via WhatsApp.
- FAQ disesuaikan: kutipan kini menyebut Oracle menunggu di lounge Member VVIP (janji publik konsisten, tanpa bocor URL).
- Dokumen: DEPLOY.md bagian 4 direvisi + bagian 4b baru (alamat lounge, kode bawaan, cara rotasi, keamanan, cara memberi akses); README ID+EN (fitur Oracle = Eksklusif VVIP, tabel env + VVIP_ACCESS_CODE); .env.example dibuat dan di-un-ignore (.gitignore: .env* + !.env.example).
- E2E curl: oracle tanpa kode 403; oracle kode salah 403; oracle kode benar 200 (jawaban AI penuh sandbox); /api/vvip salah 403 / benar 200.
- E2E Agent Browser: homepage 0 elemen Oracle; #/vvip gerbang render desktop+mobile (390px) elegan; kode salah → alert "Kode akses tidak dikenal"; kode benar → lounge + chat; chat kirim pesan → vonis Oracle muncul; tombol Keluar → gerbang kembali + sessionStorage null. Screenshot: download/verify-vvip-gate.png, verify-vvip-reject.png, verify-vvip-lounge3.png, verify-vvip-chat.png, verify-vvip-mobile-gate.png.
- eslint + tsc bersih; commit 3e5645f (11 file, +539/-117).

Stage Summary:
- Oracle AI resmi jadi layanan EKSKLUSIF Member VVIP: hilang dari seluruh situs publik, hanya bisa diakses lewat URL diskret situs/#/vvip + kode akses yang diverifikasi di server.
- Kode akses bawaan TOP-VVIP-2026; rotasi kapan pun via env VVIP_ACCESS_CODE di Vercel (kode lama langsung mati, tanpa deploy ulang).
- Sesi member berakhir otomatis saat tab ditutup (sessionStorage) — aman di perangkat bersama; API tetap menolak 403 walau UI dilewati.
- Kepada member: pemilik situs cukup kirim WhatsApp pribadi berisi alamat #/vvip + kode.
