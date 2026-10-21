"use client";

/**
 * /harga — Garansi Harga Terbaik & Perbandingan Pasar.
 * ----------------------------------------------------------------------------
 * Halaman transparansi harga: GUNARA vs 5 situs kompetitor sekategori
 * (jasa pendirian badan usaha & perizinan). Seluruh angka bersumber dari
 * src/data/price-comparison.ts (satu kebenaran dengan badge katalog dan
 * JSON-LD). Struktur:
 *  - PageHero + meta riset
 *  - StatBand (angka dari data)
 *  - Kartu perbandingan per layanan (kita vs termurah kompetitor + rentang)
 *  - Garansi "Ketemu lebih murah? Kami samakan + 5%"
 *  - Lima situs acuan (transparansi metodologi)
 *  - FAQ (satu sumber dengan JSON-LD FAQPage)
 *  - CTA
 */

import {
  ArrowUpRight,
  BadgeCheck,
  ExternalLink,
  HandCoins,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/landing/motion";
import { JsonLd } from "@/components/seo/json-ld";
import { CTABand, LinkButton, PageHero, StatBand } from "@/components/site/ui";
import { BRAND } from "@/data/brand";
import {
  COMPETITOR_SITES,
  PRICE_COMPARISONS,
  PRICE_RESEARCH_DATE,
  competitorSite,
} from "@/data/price-comparison";
import { hargaFaqItems, hargaPageLd } from "@/lib/seo-ld";

export default function HargaPage() {
  const waHref = `${BRAND.whatsappHref}?text=${encodeURIComponent(
    "Halo GUNARA, saya menemukan penawaran kompetitor yang lebih murah untuk paket setara. Berikut tautan/buktinya — mohon klaim Garansi Harga Terbaik.",
  )}`;

  return (
    <>
      <JsonLd data={hargaPageLd()} />

      <PageHero
        eyebrow="Garansi Harga Terbaik"
        title={
          <>
            Harga Paling Kompetitif di Kelasnya.{" "}
            <span className="text-gradient-gold">Terbukti, Bukan Klaim.</span>
          </>
        }
        sub={
          <>
            Kami memantau harga {COMPETITOR_SITES.length} platform jasa
            pendirian &amp; perizinan sejenis, lalu memastikan harga mulai
            GUNARA berada di bawahnya untuk {PRICE_COMPARISONS.length} layanan
            kunci — dengan cakupan yang lebih lengkap.
          </>
        }
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Harga Terbaik" }]}
        meta={[
          `Riset harga: ${PRICE_RESEARCH_DATE}`,
          `${COMPETITOR_SITES.length} situs acuan sekategori`,
          `${PRICE_COMPARISONS.length} layanan dibandingkan`,
          "Biaya resmi negara selalu dirinci apa adanya",
        ]}
      >
        <LinkButton to="/layanan" variant="gold">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Jelajahi 120+ Layanan
        </LinkButton>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-emerald-300 bg-emerald-50 px-8 py-3.5 text-sm font-bold text-emerald-600 backdrop-blur transition-all duration-300 hover:border-emerald-500/60 hover:bg-emerald-100"
        >
          <HandCoins className="h-4 w-4" aria-hidden="true" />
          Klaim Garansi Harga Terbaik
        </a>
      </PageHero>

      {/* Statistik dari data */}
      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6" aria-label="Ringkasan perbandingan">
        <StatBand
          stats={[
            { value: `${PRICE_COMPARISONS.length}`, label: "Layanan kunci dibandingkan" },
            { value: `${COMPETITOR_SITES.length}`, label: "Situs acuan sekategori" },
            { value: "0", label: "Selisih yang kami kalahkan" },
          ]}
        />
      </section>

      {/* Kartu perbandingan */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="tabel-perbandingan">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-violet-300 bg-violet-600/[0.07] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-700">
            <Scale className="h-3.5 w-3.5" aria-hidden="true" />
            Head-to-Head
          </span>
          <h2 id="tabel-perbandingan" className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            GUNARA vs <span className="text-gradient-gold">Pasar</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Harga &ldquo;mulai dari&rdquo; GUNARA dibanding harga mulai termurah
            yang dipublikasikan lima situs acuan untuk paket setara — per{" "}
            {PRICE_RESEARCH_DATE}.
          </p>
        </div>

        <ul className="grid gap-5 md:grid-cols-2">
          {PRICE_COMPARISONS.map((c, i) => {
            const site = competitorSite(c.competitorLowest.siteId);
            return (
              <Reveal key={c.slug} delay={(i % 2) * 0.05}>
                <li className="h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_18px_45px_-20px_rgba(4,120,87,0.35)]">
                  <div className="flex items-start justify-between gap-3">
                    <a
                      href={`#/layanan/${c.slug}`}
                      className="group inline-flex items-center gap-1.5 font-display text-lg font-bold text-slate-900 transition-colors hover:text-violet-600"
                    >
                      {c.name}
                      <ArrowUpRight className="h-4 w-4 text-violet-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </a>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Harga Terbaik
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-violet-600/[0.06] p-4">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-700">
                        GUNARA — mulai
                      </span>
                      <span className="mt-1 block font-display text-2xl font-bold text-violet-700">
                        {c.ours}
                      </span>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Termurah kompetitor
                      </span>
                      <span className="mt-1 block font-display text-xl font-bold text-slate-400 line-through decoration-slate-400/70">
                        {c.competitorLowest.price}
                      </span>
                      <span className="mt-0.5 block text-[11px] font-medium text-slate-500">
                        {site?.name ?? c.competitorLowest.siteId}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-[13px] font-semibold text-slate-900">
                    <span className="text-emerald-600">✓</span> {c.savings}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
                    {c.coverage}
                  </p>
                  <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">
                    Rentang harga mulai lima situs: {c.competitorRange}
                  </p>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* Garansi */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6" aria-labelledby="garansi">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600/[0.07] via-white to-violet-600/[0.04] p-8 sm:p-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/30">
                <ShieldCheck className="h-8 w-8" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <h2 id="garansi" className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Ketemu lebih murah? <span className="text-gradient-gold">Kami samakan + potongan 5%.</span>
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
                  Jika Anda menemukan penawaran resmi kompetitor yang lebih murah
                  untuk paket setara — cakupan pekerjaan sejenis, masa proses
                  sebanding — kirimkan tautannya via WhatsApp. Tim kami
                  memverifikasi maksimal 1×24 jam; bila sah, kami menyamakan
                  harganya dan menambahkan potongan 5% sebagai permintaan maaf
                  atas waktu Anda.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-violet-700"
                  >
                    <HandCoins className="h-4 w-4" aria-hidden="true" />
                    Ajukan Klaim Sekarang
                  </a>
                  <LinkButton to="/faq" variant="ghost">
                    Baca Ketentuan Lengkap
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Lima situs acuan — transparansi metodologi */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6" aria-labelledby="situs-acuan">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-violet-300 bg-violet-600/[0.07] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-700">
            <Scale className="h-3.5 w-3.5" aria-hidden="true" />
            Metodologi Terbuka
          </span>
          <h2 id="situs-acuan" className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Lima Situs Acuan <span className="text-gradient-gold">Kategori Sama</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Kami membandingkan diri dengan harga yang mereka publikasikan sendiri
            — bukan angka rumor. Setiap perubahan harga mereka dicatat dalam
            tinjauan kuartalan kami.
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPETITOR_SITES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <li className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-slate-900">
                    {i + 1}. {s.name}
                  </span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    aria-label={`Kunjungi ${s.name} (tautan eksternal)`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-violet-500/60 hover:text-violet-600"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-slate-500">
                  {s.note}
                </p>
              </li>
            </Reveal>
          ))}
          <Reveal delay={0.25}>
            <li className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-violet-300 bg-violet-600/[0.04] p-5">
              <p className="text-[13px] leading-relaxed text-slate-500">
                <strong className="font-semibold text-slate-900">Catatan:</strong>{" "}
                harga kompetitor adalah harga mulai yang mereka tayangkan; paket
                terendah mereka kerap belum mencakup NPWP, NIB, atau pajak
                daerah — GUNARA menyatakan cakupan lengkap di setiap layanan.
              </p>
            </li>
          </Reveal>
        </ol>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6" aria-labelledby="harga-faq">
        <h2 id="harga-faq" className="mb-8 text-center font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Pertanyaan Seputar <span className="text-gradient-gold">Harga</span>
        </h2>
        <div className="space-y-3">
          {hargaFaqItems().map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-colors open:border-violet-400/60"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-violet-500 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-500">
                {f.a.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <CTABand />
    </>
  );
}
