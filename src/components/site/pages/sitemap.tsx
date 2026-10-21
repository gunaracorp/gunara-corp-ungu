"use client";

/**
 * /sitemap — Peta Situs.
 * Indeks lengkap seluruh halaman publik — standar aksesibilitas & SEO
 * situs firma internasional. Rute privat (member/panel) tidak dicantumkan.
 */

import { ArrowUpRight, BookOpen, Building2, FileText, GraduationCap, Landmark, Layers, LayoutGrid, LifeBuoy, Scale, ShieldCheck, Users } from "lucide-react";
import { COUNCIL_CATEGORIES, SERVICES } from "@/data/content";
import { CATALOG_CATEGORIES, catalogByCategory, SERVICES_CATALOG } from "@/data/service-catalog";
import { INDUSTRIES } from "@/data/industries";
import { INSIGHTS } from "@/data/insights";
import { PERIZINAN, PERIZINAN_CATEGORIES } from "@/data/perizinan";
import { Reveal, TiltCard } from "@/components/landing/motion";
import { Link } from "@/lib/router";
import { CTABand, PageHero } from "@/components/site/ui";

type SiteLink = { to: string; label: string; note?: string };
type SiteGroup = { id?: string; icon: typeof LayoutGrid; title: string; desc: string; links: SiteLink[] };

export default function SitemapPage() {
  const firma: SiteGroup = {
    id: "firma",
    icon: ShieldCheck,
    title: "Firma",
    desc: "Siapa kami, bagaimana kami bekerja, dan di mana Anda menemukan kami.",
    links: [
      { to: "/", label: "Beranda", note: "Ringkasan seluruh layanan & Dewan" },
      { to: "/about", label: "Tentang Kami", note: "Cerita, nilai, dan kronologi sejak 2001" },
      { to: "/leadership", label: "Pimpinan & Tata Kelola", note: "Jajaran direksi, mitra senior, piagam tata kelola" },
      { to: "/method", label: "Metode Oracle", note: "Bagaimana putusan ditempa lintas 46 Dewan" },
      { to: "/results", label: "Hasil & Bukti", note: "Penugasan dituntaskan & perbandingan jujur" },
      { to: "/responsibility", label: "Tanggung Jawab & Dampak", note: "Etika, pemberdayaan UMKM, pendidikan, lingkungan" },
      { to: "/careers", label: "Karier", note: "Jalur mitra, magang akademi, lowongan aktif" },
      { to: "/offices", label: "Kantor Kami", note: "Empat lokasi resmi, arah & protokol kunjungan" },
      { to: "/newsroom", label: "Ruang Media", note: "Rilis pers, lembar fakta, perangkat media" },
    ],
  };

  const layanan: SiteGroup = {
    id: "layanan",
    icon: LayoutGrid,
    title: "12 Praktik Layanan",
    desc: "Dua belas praktik konsultasi — dari strategi hulu hingga eksekusi hilir.",
    links: SERVICES.map((s) => ({ to: `/services/${s.num}`, label: s.title })),
  };

  const katalog: SiteGroup[] = [
    {
      id: "katalog",
      icon: Layers,
      title: `Katalog ${SERVICES_CATALOG.length}+ Layanan`,
      desc: "120 layanan siap jalan dalam 12 kategori — harga transparan, penanggung jawab bernama.",
      links: [
        { to: "/layanan", label: "Semua layanan katalog", note: "Pencarian & filter 12 kategori" },
        { to: "/harga", label: "Harga Terbaik — Perbandingan vs 5 Situs", note: "Garansi samakan harga + 5%" },
        ...CATALOG_CATEGORIES.map((c) => ({
          to: `/layanan?kategori=${c.id}`,
          label: c.name,
          note: `${catalogByCategory(c.id).length} layanan`,
        })),
      ],
    },
  ];

  const perizinan: SiteGroup[] = [
    {
      id: "perizinan",
      icon: Landmark,
      title: "Gerbang Perizinan — Kategori",
      desc: "Delapan kategori, 36+ jenis izin yang dikawal end-to-end.",
      links: [
        { to: "/perizinan", label: "Semua perizinan", note: "Katalog lengkap dengan pencarian & filter" },
        ...PERIZINAN_CATEGORIES.map((c) => ({ to: `/perizinan?kategori=${c.id}`, label: c.name })),
      ],
    },
    ...PERIZINAN_CATEGORIES.map<SiteGroup>((c) => ({
      icon: FileText,
      title: `Perizinan — ${c.name}`,
      desc: c.desc,
      links: PERIZINAN.filter((p) => p.categoryId === c.id).map((p) => ({
        to: `/perizinan/${p.slug}`,
        label: p.name,
        note: `${p.agency} · ${p.complexity}`,
      })),
    })),
  ];

  const dewanIndustri: SiteGroup[] = [
    {
      id: "dewan-industri",
      icon: Users,
      title: "46 Dewan Pakar",
      desc: "Dewan-dewan internasional yang menjawab dengan satu suara.",
      links: [
        { to: "/councils", label: "Semua Dewan", note: "Jelajahi 46 dewan lintas disiplin" },
        ...COUNCIL_CATEGORIES.map((c) => ({
          to: `/councils?filter=${encodeURIComponent(c)}`,
          label: c,
        })),
      ],
    },
    {
      icon: Building2,
      title: "Industri",
      desc: "Kendali sektor demi sektor — tantangan, jalur perizinan, dan kemenangan tipikal.",
      links: [
        { to: "/industries", label: "Semua industri" },
        ...INDUSTRIES.map((i) => ({ to: `/industries/${i.slug}`, label: i.name })),
      ],
    },
  ];

  const informasi: SiteGroup[] = [
    {
      id: "informasi",
      icon: GraduationCap,
      title: "Wawasan",
      desc: "Pengetahuan dari meja Dewan — gratis dibaca, ditulis praktisi.",
      links: [
        { to: "/insights", label: "Semua wawasan" },
        ...INSIGHTS.map((i) => ({ to: `/insights/${i.slug}`, label: i.title })),
      ],
    },
    {
      icon: BookOpen,
      title: "Pusat Sumber Daya",
      desc: "Unduhan resmi & pustaka dokumen kerja.",
      links: [
        { to: "/resources", label: "Pusat Sumber Daya", note: "Checklist PT & peta jalan OSS RBA (PDF)" },
      ],
    },
    {
      icon: LifeBuoy,
      title: "Bantuan & Kontak",
      desc: "Jawaban cepat dan jalur langsung ke Dewan.",
      links: [
        { to: "/faq", label: "Pertanyaan Umum" },
        { to: "/contact", label: "Kontak & Konsultasi", note: "Formulir brief + WhatsApp 24/7" },
      ],
    },
    {
      icon: Scale,
      title: "Hukum & Kebijakan",
      desc: "Dokumen yang mengikat kerja kami bersama Anda.",
      links: [
        { to: "/privacy", label: "Kebijakan Privasi" },
        { to: "/terms", label: "Syarat & Ketentuan" },
        { to: "/cookies", label: "Kebijakan Cookie" },
        { to: "/sitemap", label: "Peta Situs", note: "Anda di sini" },
      ],
    },
  ];

  const groups = [firma, layanan, ...katalog, ...perizinan.slice(0, 4), ...dewanIndustri, ...informasi, ...perizinan.slice(4)];

  return (
    <>
      <PageHero
        eyebrow="Peta Situs"
        title={
          <>
            Setiap halaman, <span className="text-gradient-gold">satu peta.</span>
          </>
        }
        sub="Indeks lengkap situs GUNARA CORPORATION — dirancang agar tidak ada informasi yang tersembunyi lebih dalam dari satu klik ini."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Peta Situs" }]}
        meta={[
          "9 halaman firma",
          `${SERVICES.length} praktik layanan`,
          `${SERVICES_CATALOG.length} layanan katalog`,
          `${PERIZINAN.length} jenis izin`,
          `${INSIGHTS.length} wawasan`,
          `${INDUSTRIES.length} industri`,
        ]}
      />

      {/* Navigasi cepat */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8" aria-label="Navigasi cepat peta situs">
        <Reveal>
          <nav className="flex flex-wrap gap-2.5" aria-label="Lompat ke bagian peta">
            {[
              { href: "#firma", label: "Firma" },
              { href: "#layanan", label: "Layanan" },
              { href: "#perizinan", label: "Perizinan" },
              { href: "#dewan-industri", label: "Dewan & Industri" },
              { href: "#informasi", label: "Wawasan & Informasi" },
            ].map((chip) => (
              <a
                key={chip.href}
                href={chip.href}
                className="inline-flex min-h-9 items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-300 hover:border-violet-500/60 hover:text-violet-600"
              >
                {chip.label}
              </a>
            ))}
          </nav>
        </Reveal>
      </section>

      {/* Grupo halaman */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-label="Indeks seluruh halaman">
        <div className="columns-1 gap-5 md:columns-2 xl:columns-3 [&>*]:mb-5">
          {groups.map((g, gi) => (
            <Reveal key={g.title + gi} delay={Math.min(gi * 0.04, 0.3)} className="break-inside-avoid">
              <TiltCard>
                <section
                  id={g.id}
                  aria-label={g.title}
                  className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(13,148,136,0.22)] sm:p-7"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600">
                      <g.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="font-display text-base font-bold text-slate-900">{g.title}</h2>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{g.desc}</p>
                    </div>
                  </div>
                  <ul className="mt-5 divide-y divide-slate-100">
                    {g.links.map((l) => (
                      <li key={l.to + l.label}>
                        <Link
                          to={l.to}
                          className="group flex items-start justify-between gap-3 py-2.5 transition-colors"
                        >
                          <span>
                            <span className="block text-sm font-medium text-slate-700 transition-colors group-hover:text-violet-700">
                              {l.label}
                            </span>
                            {l.note ? (
                              <span className="mt-0.5 block text-[11px] leading-snug text-slate-400">{l.note}</span>
                            ) : null}
                          </span>
                          <ArrowUpRight
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-violet-600"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-slate-400">
            Rute layanan khusus member & panel internal tidak dicantumkan di peta ini dan hanya dapat diakses
            melalui tautan yang dibagikan langsung oleh firma.
          </p>
        </Reveal>
      </section>

      <CTABand />
    </>
  );
}
