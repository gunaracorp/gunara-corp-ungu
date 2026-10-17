"use client";

/**
 * /newsroom — Ruang Media.
 * Rilis pers resmi, lembar fakta firma, perangkat media (media kit),
 * dan kontak pers — standar firma konsultan internasional.
 */

import Image from "next/image";
import { ArrowUpRight, BadgeCheck, Download, FileText, Globe2, Mail, MessageCircle, Newspaper, Phone, Rss, ShieldCheck } from "lucide-react";
import { BRAND } from "@/data/brand";
import { Reveal, SectionHeading, TiltCard } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero, StatBand } from "@/components/site/ui";

type Release = {
  date: string;
  dateLabel: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  featured?: boolean;
};

const RELEASES: Release[] = [
  {
    date: "2026-01-08",
    dateLabel: "8 Januari 2026",
    category: "Produk & Teknologi",
    title: "GUNARA resmikan Oracle — kecerdasan kolektif 46 Dewan Pakar yang kini eksklusif untuk Member VVIP",
    excerpt:
      "Setelah delapan belas bulan uji coba tertutup, GUNARA membuka Oracle: mesin konsultasi yang menyatukan pengalaman gabungan 6.900 tahun lintas 46 Dewan Pakar, tersedia 24/7. Layanan langsung diposisikan sebagai ruang eksklusif Member VVIP — jajaran klien prioritas firma.",
    image: "/images/menara-top.jpg",
    featured: true,
  },
  {
    date: "2025-12-12",
    dateLabel: "12 Desember 2025",
    category: "Akreditasi",
    title: "Akreditasi PPIU baru memperluas layanan travel umrah & haji GUNARA",
    excerpt:
      "Pijat kemitraan dengan lembaga penyelenggara travel umrah menambah kapasitas akreditasi GUNARA pada lini jasa keagamaan — dari legalitas PPIU hingga pendampingan regulasi Kemenag, memperkuat posisi firma pada perizinan sektor keagamaan.",
    image: "/images/akreditasi-ppiu-ashanty.jpg",
  },
  {
    date: "2025-11-20",
    dateLabel: "20 November 2025",
    category: "Kemitraan",
    title: "Penyerahan izin BPW — gerbang bisnis wisata klien dituntaskan dalam hitungan minggu",
    excerpt:
      "Proses akreditasi Bi Perjalanan Wisata (BPW) untuk klien korporat selesai dan diserahkan langsung — menjadi contoh kerja antara tim perizinan GUNARA, Kemenparekraf, dan jaringan asosiasi terkait.",
    image: "/images/penyerahan-bpw-ashanty.jpg",
  },
  {
    date: "2025-10-30",
    dateLabel: "30 Oktober 2025",
    category: "Ekspansi",
    title: "Kantor Jakarta GUNARA kini melayani dari PHI Kwitang, Jakarta Pusat",
    excerpt:
      "Untuk mendekatkan Dewan-dewan strategi dan perizinan pada klien korporat & kedutaan, GUNARA memperkuat kehadirannya di ibu kota melalui kantor resmi di kawasan PHI Kwitang, Senen — melengkapi dua kantor pusat layanan di Tasikmalaya.",
    image: "/images/hq.png",
  },
  {
    date: "2025-09-25",
    dateLabel: "25 September 2025",
    category: "Akreditasi",
    title: "Akreditasi kanwil memperkuat jaringan lembaga mitra GUNARA di Jawa Timur",
    excerpt:
      "Kemitraan akreditasi tingkat kanwil membuka layanan pengurusan dokumen dan sertifikasi klien Jawa Timur langsung dari jaringan GUNARA — memangkas rantai perantara yang selama ini memperlambat proses.",
    image: "/images/akreditasi-kanwil-jatim.jpg",
  },
];

const FACTS = [
  { k: "Nama resmi", v: "GUNARA CORPORATION (Gunara Consultan)" },
  { k: "Berdiri", v: "2001 — Tasikmalaya, Jawa Barat" },
  { k: "Perusahaan ditangani", v: "1.524 perusahaan — lokal & nasional, global & dalam negeri, daerah & pusat" },
  { k: "Kantor resmi", v: "4 lokasi (Tasikmalaya I & II, Jakarta, IPHI Pusat)" },
  { k: "Praktik layanan", v: "12 praktik; 36+ jenis perizinan" },
  { k: "Dewan Pakar", v: "46 dewan internasional, 6.900 tahun pengalaman gabungan" },
  { k: "Penugasan", v: "12.000+ dituntaskan, tingkat keberhasilan 99,97%" },
  { k: "Jangkauan", v: "Klien di 190 negara, layanan 40+ bahasa" },
  {
    k: "Pimpinan & penagihan",
    v: "Senior Konsultan Tn. H. Gugun Gunara, MBA — seluruh pembayaran atas nama beliau",
  },
  { k: "Kontak resmi", v: "WhatsApp & telepon +62 813-1651-6524 · halo@topkonsultan.web.id" },
];

const MEDIA_ASSETS = [
  {
    icon: Download,
    title: "Logo resmi (SVG)",
    desc: "Logogram vektor GUNARA — siap pakai untuk media digital dan cetak, latar terang maupun gelap.",
    action: "Unduh logo",
    href: "/logo.svg",
    download: true,
  },
  {
    icon: FileText,
    title: "Lembar fakta (PDF)",
    desc: "Ringkasan satu halaman: profil firma, angka kunci, dan kronologi — untuk keperluan pemberitaan.",
    action: "Minta salinan",
    href: "mailto:halo@topkonsultan.web.id?subject=Permintaan%20Lembar%20Fakta%20(Ruang%20Media)",
    download: false,
  },
  {
    icon: Globe2,
    title: "Foto & aset acara",
    desc: "Dokumentasi penyerahan izin, akreditasi, dan kegiatan Dewan — resolusi tinggi dengan izin publikasi.",
    action: "Minta akses",
    href: "mailto:halo@topkonsultan.web.id?subject=Permintaan%20Aset%20Foto%20(Ruang%20Media)",
    download: false,
  },
] as const;

const PRESS_POLICY = [
  {
    icon: ShieldCheck,
    title: "Verifikasi kutipan",
    desc: "Kutipan pimpinan dan data kinerja yang akan diterbitkan wajib dikonfirmasi ke Ruang Media terlebih dahulu — kami membalas konfirmasi dalam 1×24 jam pada hari kerja.",
  },
  {
    icon: BadgeCheck,
    title: "Kerahasiaan klien",
    desc: "GUNARA tidak mengungkap identitas klien tanpa persetujuan tertulis. Studi kasus yang beredar telah dianonimkan atau diloloskan klien — prinsip yang sama berlaku untuk wawancara.",
  },
  {
    icon: Newspaper,
    title: "Wawancara & kunjungan media",
    desc: "Wawancara diselenggarakan daring atau di kantor pusat dengan penjadwalan minimal tiga hari kerja sebelumnya. Permintaan tatap muka dengan pendiri disesuaikan agenda Dewan.",
  },
] as const;

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsroomPage() {
  const featured = RELEASES.find((r) => r.featured) ?? RELEASES[0];
  const rest = RELEASES.filter((r) => r !== featured);

  return (
    <>
      <PageHero
        eyebrow="Ruang Media"
        title={
          <>
            Kabar resmi, <span className="text-gradient-gold">tuntas dan terverifikasi.</span>
          </>
        }
        sub="Rilis pers, lembar fakta, dan perangkat media resmi GUNARA CORPORATION. Seluruh angka dan kutipan di halaman ini boleh dikutip — kami menjamin konsistensinya."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Ruang Media" }]}
        meta={["Rilis pers resmi", "Lembar fakta firma", "Aset media siap unduh", "Respons pers ≤ 1×24 jam"]}
      >
        <a
          href="mailto:halo@topkonsultan.web.id?subject=Permintaan%20Wawancara%20%2F%20Konfirmasi%20Berita%20(Ruang%20Media)"
          className="shine inline-flex min-h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 px-7 py-3 text-sm font-bold text-white transition-transform duration-300 hover:scale-[1.04] active:scale-95"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Hubungi Ruang Media
        </a>
        <LinkButton to="/about" variant="ghost">
          Profil firma
        </LinkButton>
      </PageHero>

      {/* Rilis utama */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8" aria-label="Rilis pers utama">
        <Reveal>
          <TiltCard>
            <article className="group grid overflow-hidden rounded-3xl border border-violet-300 bg-white transition-all duration-300 hover:border-violet-500/60 hover:shadow-[0_32px_80px_-32px_rgba(139,92,246,0.4)] lg:grid-cols-[480px_1fr]">
              <div className="relative h-64 overflow-hidden lg:h-full">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/45 to-transparent lg:bg-gradient-to-r" aria-hidden="true" />
                <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  Rilis Terbaru
                </span>
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="rounded-full border border-violet-300 bg-violet-50/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-700">
                    {featured.category}
                  </span>
                  <time dateTime={featured.date} className="font-medium text-slate-500">
                    {featured.dateLabel}
                  </time>
                </div>
                <h2 className="font-display text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                  {featured.title}
                </h2>
                <p className="text-[15px] leading-relaxed text-slate-600">{featured.excerpt}</p>
                <p className="text-xs italic text-slate-500">
                  Tasikmalaya / Jakarta — {formatDate(featured.date)}
                </p>
              </div>
            </article>
          </TiltCard>
        </Reveal>
      </section>

      {/* Arsip rilis */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-label="Arsip rilis pers">
        <SectionHeading
          eyebrow="Arsip rilis pers"
          title={
            <>
              Kronologi yang <span className="text-gradient-gold">dapat dikutip.</span>
            </>
          }
          sub="Setiap rilis disusun ulang dari berkas resmi firma — bukan rumor. Tanggal, konteks, dan angka konsisten dengan lembar fakta."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) * 0.08} className="h-full">
              <TiltCard className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(139,92,246,0.22)]">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" aria-hidden="true" />
                    <span className="absolute left-3.5 top-3.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-700 backdrop-blur">
                      {r.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <time dateTime={r.date} className="text-xs font-medium text-slate-500">
                      {r.dateLabel}
                    </time>
                    <h3 className="font-display text-base font-bold leading-snug text-slate-900">{r.title}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-slate-600">{r.excerpt}</p>
                    <a
                      href={`mailto:halo@topkonsultan.web.id?subject=${encodeURIComponent("Permintaan rilis lengkap: " + r.title)}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 transition-colors hover:text-violet-600"
                    >
                      Minta rilis lengkap
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Lembar fakta */}
      <section className="border-y border-slate-200 bg-gradient-to-b from-violet-600/[0.04] to-transparent py-16 sm:py-20" aria-label="Lembar fakta firma">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Lembar fakta"
            title={
              <>
                Firma dalam <span className="text-gradient-gold">delapan baris.</span>
              </>
            }
            sub="Data resmi yang selalu kami jaga mutakhirnya — silakan kutip langsung dari halaman ini."
          />
          <div className="mt-12">
            <Reveal>
              <dl className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-2">
                {FACTS.map((f, i) => (
                  <div
                    key={f.k}
                    className={`flex flex-col gap-1.5 p-6 ${i % 2 === 0 ? "sm:border-r sm:border-slate-200" : ""} ${i >= 2 ? "border-t border-slate-200" : ""} ${i >= 4 ? "sm:[&:nth-child(n+5)]:border-t-0" : ""}`}
                  >
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-600">{f.k}</dt>
                    <dd className="text-sm font-medium leading-relaxed text-slate-700">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-6">
                <StatBand
                  stats={[
                    { value: "12.000+", label: "Penugasan dituntaskan" },
                    { value: "99,97%", label: "Tingkat keberhasilan" },
                    { value: "190", label: "Negara dilayani" },
                  ]}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Media kit */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Perangkat media">
        <SectionHeading
          eyebrow="Perangkat media"
          title={
            <>
              Perangkat yang siap <span className="text-gradient-gold">Anda pakai.</span>
            </>
          }
          sub="Aset resmi untuk pemberitaan — dan saluran resmi bila yang Anda butuhkan belum tercantum."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {MEDIA_ASSETS.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08} className="h-full">
              <TiltCard className="h-full">
                <div className="glass group flex h-full flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:gold-ring sm:p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <a.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-base font-bold text-slate-900 sm:text-lg">{a.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.desc}</p>
                  </div>
                  <a
                    href={a.href}
                    {...(a.download ? { download: "top-konsultan-logo.svg" } : {})}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-violet-500/60 hover:text-violet-600"
                  >
                    {a.download ? <Download className="h-4 w-4" aria-hidden="true" /> : <Mail className="h-4 w-4" aria-hidden="true" />}
                    {a.action}
                  </a>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Kebijakan pers + kontak */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20" aria-label="Kebijakan pers dan kontak media">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Kebijakan pers"
            title={
              <>
                Tiga aturan yang menjaga <span className="text-gradient-gold">akurasi.</span>
              </>
            }
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PRESS_POLICY.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-violet-500/50 sm:p-7">
                  <p.icon className="h-6 w-6 text-violet-600" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-base font-bold text-slate-900 sm:text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-violet-300 bg-gradient-to-br from-violet-600/[0.08] via-white to-white">
              <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-700">
                    Kontak pers resmi
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold text-slate-900 sm:text-2xl">
                    Narasumber, konfirmasi data, permintaan wawancara
                  </h3>
                  <ul className="mt-5 space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      <a href={`mailto:${BRAND.email}?subject=Ruang%20Media%20TOP`} className="font-medium transition-colors hover:text-violet-600">
                        {BRAND.email} — subjek: &ldquo;Ruang Media&rdquo;
                      </a>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      {BRAND.phone} — WhatsApp bisnis resmi, aktif 24/7
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Rss className="h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      Rilis terbaru selalu diperbarui di halaman ini — tautkan langsung, silakan.
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  <a
                    href="mailto:halo@topkonsultan.web.id?subject=Ruang%20Media%20TOP%20—%20Permintaan%20Wawancara"
                    className="shine inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 px-7 py-3 text-sm font-bold text-white transition-transform duration-300 hover:scale-[1.04] active:scale-95"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Kirim permintaan media
                  </a>
                  <span className="text-center text-[11px] leading-relaxed text-slate-400">
                    Respons resmi ≤ 1×24 jam (hari kerja).
                    <br />
                    Selalu sebut media & tenggat Anda.
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
