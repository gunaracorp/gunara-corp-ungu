"use client";

/**
 * /resources — Pusat Sumber Daya.
 * Unduhan resmi (PDF bermerek TOP), pustaka panduan per kategori,
 * dan kanal permintaan dokumen khusus.
 */

import { ArrowRight, BookOpenCheck, Boxes, CalendarClock, CheckCircle2, Download, FileText, Landmark, ListChecks, Mail, Map, MessageCircle, Newspaper, Route, ScrollText, ShieldCheck } from "lucide-react";
import { BRAND } from "@/data/brand";
import { Reveal, SectionHeading, TiltCard } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero } from "@/components/site/ui";

const FEATURED_DOWNLOADS = [
  {
    icon: ListChecks,
    title: "Checklist Pendirian PT 2026",
    format: "PDF · 3 halaman · Edisi 2026",
    desc: "Dua puluh enam titik krusial pendirian Perseroan Terbatas dalam satu dokumen kerja: dari penentuan nama dan KBLI, akta notaris, pengesahan Kemenkumham, hingga kewajiban yang paling sering terlewat pasca-NIB — LKPM, BPJS, dan SPT pertama. Dilengkapi tabel estimasi durasi per tahap.",
    href: "/downloads/checklist-pendirian-pt-2026.pdf",
    tag: "Terpopuler",
  },
  {
    icon: Map,
    title: "Peta Jalan Perizinan OSS RBA 2026",
    format: "PDF · 3 halaman · Edisi 2026",
    desc: "Memahami perizinan berusaha berbasis risiko tanpa bahasa birokrat: tabel skema risiko (rendah hingga tinggi), peta jalan enam tahap dari NIB hingga kewajiban berkelanjutan, dan lima kesalahan paling mahal yang membuat klien kami akhirnya datang.",
    href: "/downloads/peta-jalan-perizinan-oss-rba-2026.pdf",
    tag: "Baru",
  },
] as const;

const LIBRARY = [
  {
    icon: Landmark,
    category: "Perizinan & Regulasi",
    items: [
      "Panduan NIB & registrasi awal di OSS RBA — langkah demi langkah dengan tangkapan layar",
      "Matriks skema risiko 20 KBLI paling banyak digunakan startup & UMKM",
      "Checklist KITAS & RPTKA untuk pemberi kerja yang mempekerjakan pakar asing",
      "Ringkasan kewajiban LKPM per skala usaha — apa, kapan, dan konsekuensinya",
    ],
  },
  {
    icon: Boxes,
    category: "Strategi & Operasi",
    items: [
      "Kerangka war-game TOP: uji strategi Anda terhadap 10.000 skenario sebelum dieksekusi",
      "Templat kalender kepatuhan tahunan untuk badan usaha (pajak, izin, ketenagakerjaan)",
      "Panduan struktur modal & porsi saham untuk pendiri dengan investor",
      "Playbook ekspansi lintas negara: urutan keputusan dari riset pasar hingga entitas pertama",
    ],
  },
  {
    icon: ScrollText,
    category: "Templat Dokumen",
    items: [
      "Kerangka anggaran dasar PT yang selaras UU Cipta Kerja & KBLI pilihan",
      "Surat permohonan & persetujuan umum yang paling sering diminta instansi",
      "Checklist kelengkapan dokumen due diligence untuk negosiasi investasi",
      "Struktur laporan LKPM yang lolos verifikasi tanpa revisi berulang",
    ],
  },
] as const;

const REQUEST_STEPS = [
  {
    icon: MessageCircle,
    title: "Sebutkan dokumen",
    desc: "Kirim judul dokumen yang Anda butuhkan melalui WhatsApp resmi atau formulir kontak — satu kalimat cukup, kami yang lengkapi konteksnya.",
  },
  {
    icon: CalendarClock,
    title: "Konfirmasi kebutuhan",
    desc: "Dewan yang menangani sektor Anda menghubungi Anda untuk menyesuaikan edisi dokumen dengan kondisi spesifik usaha Anda — bukan sekadar lampiran generik.",
  },
  {
    icon: CheckCircle2,
    title: "Terima salinan resmi",
    desc: "Dokumen dikirim dalam format siap pakai beserta catatan penggunaannya. Untuk kebutuhan yang lebih kompleks, briefing 46 menit dapat dijadwalkan pada hari yang sama.",
  },
] as const;

export default function ResourcesPage() {
  const waUrl = `${BRAND.whatsappHref}?text=${encodeURIComponent("Halo TOP Konsultan, saya ingin meminta salinan dokumen dari Pusat Sumber Daya.")}`;

  return (
    <>
      <PageHero
        eyebrow="Pusat Sumber Daya"
        title={
          <>
            Pengetahuan yang <span className="text-gradient-gold">kami tulis sendiri.</span>
          </>
        }
        sub="Panduan, checklist, dan peta jalan yang disusun tim Perizinan & Regulasi TOP dari praktik 12.000+ penugasan — bukan ringkasan peraturan yang bisa Anda temukan di mana pun."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Pusat Sumber Daya" }]}
        meta={["Unduhan resmi PDF", "Diperbarui berkala", "Gratis, tanpa registrasi"]}
      >
        <LinkButton to="/insights" withArrow>
          Baca Wawasan terkini
        </LinkButton>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-emerald-300 bg-emerald-50 px-7 py-3 text-sm font-bold text-emerald-600 transition-all duration-300 hover:border-emerald-500/60 hover:bg-emerald-100"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Minta dokumen khusus
        </a>
      </PageHero>

      {/* Unduhan utama */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8" aria-label="Unduhan utama">
        <SectionHeading
          eyebrow="Unduhan resmi"
          title={
            <>
              Dua dokumen kerja, <span className="text-gradient-gold">langsung pakai.</span>
            </>
          }
          sub="Disusun ulang setiap kali regulasi bergerak. Versi di halaman ini selalu yang terbaru — unduh sekarang, gunakan bersama tim Anda."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {FEATURED_DOWNLOADS.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.08} className="h-full">
              <TiltCard className="h-full">
                <article className="group flex h-full flex-col rounded-3xl border border-violet-300 bg-gradient-to-br from-violet-600/[0.07] via-white to-white p-6 transition-all duration-300 hover:border-violet-500/60 hover:shadow-[0_32px_80px_-32px_rgba(139,92,246,0.4)] sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                      <d.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                      {d.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-slate-900 sm:text-2xl">{d.title}</h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600">
                    {d.format}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{d.desc}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a
                      href={d.href}
                      download
                      className="shine inline-flex min-h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 px-7 py-3 text-sm font-bold text-white transition-transform duration-300 hover:scale-[1.04] active:scale-95"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Unduh PDF
                    </a>
                    <span className="text-xs text-slate-400">
                      Gratis · tanpa formulir · boleh disebarkan utuh
                    </span>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pustaka per kategori */}
      <section className="border-y border-slate-200 bg-gradient-to-b from-violet-600/[0.04] to-transparent py-16 sm:py-20" aria-label="Pustaka dokumen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Pustaka pengetahuan"
            title={
              <>
                Tiga rak, satu <span className="text-gradient-gold">disiplin: bukti.</span>
              </>
            }
            sub="Setiap dokumen lahir dari penugasan nyata, lalu dirapikan menjadi panduan. Pilih raknya — minta isi lengkapnya lewat kanal resmi."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {LIBRARY.map((lib, i) => (
              <Reveal key={lib.category} delay={i * 0.08} className="h-full">
                <TiltCard className="h-full">
                  <div className="glass group flex h-full flex-col gap-5 rounded-2xl p-6 transition-all duration-300 hover:gold-ring sm:p-7">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                      <lib.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-slate-900">{lib.category}</h3>
                      <ul className="mt-4 space-y-3">
                        {lib.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href={`${BRAND.whatsappHref}?text=${encodeURIComponent(`Halo TOP Konsultan, saya ingin meminta dokumen dari rak "${lib.category}".`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-violet-500/60 hover:text-violet-600"
                    >
                      Minta isi lengkap rak ini
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cara permintaan dokumen */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Cara meminta dokumen">
        <SectionHeading
          eyebrow="Permintaan dokumen khusus"
          title={
            <>
              Tidak menemukannya? <span className="text-gradient-gold">Kami tuliskan.</span>
            </>
          }
          sub="Sebagian dokumen kami simpan tertutup untuk klien penugasan — namun permintaan Anda selalu dijawab lewat tiga langkah sederhana berikut."
        />
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {REQUEST_STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="h-full">
              <li className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(139,92,246,0.22)] sm:p-7">
                <span className="font-display text-4xl font-bold text-violet-600/15 transition-colors duration-300 group-hover:text-violet-600/30" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-2 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-slate-900 sm:text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
              <Route className="h-6 w-6 text-violet-600" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-slate-900">Belajar langsung dari kasus</h3>
              <p className="flex-1 text-sm leading-relaxed text-slate-600">
                Dokumen di halaman ini adalah versi tulisnya. Versi ceritanya — kasus, keputusan, dan pelajaran
                dari lapangan — kami terbitkan rutin di kolom Wawasan, gratis untuk dibaca.
              </p>
              <LinkButton to="/insights" variant="ghost" className="self-start">
                Jelajahi Wawasan
              </LinkButton>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-violet-300 bg-gradient-to-br from-violet-600/[0.08] via-white to-white p-6 sm:p-7">
              <Newspaper className="h-6 w-6 text-violet-600" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-slate-900">Oracle Dispatch</h3>
              <p className="flex-1 text-sm leading-relaxed text-slate-600">
                Rilis dokumen & perubahan regulasi terpenting, dirangkum satu kirim per bulan — tanpa derau,
                tanpa pelacak. Berlangganan dari formulir di kaki halaman mana pun.
              </p>
              <a
                href={`mailto:${BRAND.email}?subject=Langganan%20Oracle%20Dispatch`}
                className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-violet-700 transition-colors hover:text-violet-600"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Langganan via email
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Jaminan mutu dokumen */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20" aria-label="Jaminan mutu dokumen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Jaminan mutu"
            title={
              <>
                Kenapa dokumen kami <span className="text-gradient-gold">boleh dipercaya.</span>
              </>
            }
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Ditulis praktisi, bukan agregator",
                desc: "Penyusunnya adalah Dewan yang setiap minggu menghadapi regulator yang sama dengan Anda — bukan penulis konten yang membaca ulang peraturan.",
              },
              {
                icon: BookOpenCheck,
                title: "Diverifikasi silang antar-Dewan",
                desc: "Setiap edisi diaudit oleh Dewan lain yang tak terlibat penyusunan. Yang lolos cetak hanya yang selamat dari uji silang.",
              },
              {
                icon: CalendarClock,
                title: "Diperbarui saat regulasi bergerak",
                desc: "Edisi lama ditarik, bukan dibiarkan. Nomor edisi tercantum di sampul — bila dokumen Anda lebih tua dari edisi terbaru, mintalah yang baru, selalu gratis.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-violet-500/50 sm:p-7">
                  <c.icon className="h-6 w-6 text-violet-600" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-base font-bold text-slate-900 sm:text-lg">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
