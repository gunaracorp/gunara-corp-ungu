"use client";

/**
 * /layanan/<slug> — Detail satu layanan Katalog Layanan.
 * ----------------------------------------------------------------------------
 * Satu layanan konkret: ikhtisar, luaran, persyaratan, alur penugasan, FAQ
 * (satu sumber data dengan JSON-LD layananFaqLd), layanan terkait se-kategori,
 * dan navigasi prev/next dalam kategori. Pola visual meniru service-detail.tsx.
 */

import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  ListChecks,
  ScrollText,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/landing/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CTABand, LinkButton, PageHero } from "@/components/site/ui";
import { BRAND } from "@/data/brand";
import {
  catalogByCategory,
  catalogCategoryById,
  catalogRelated,
  catalogServiceBySlug,
} from "@/data/service-catalog";
import { layananFaqItems } from "@/lib/seo-ld";

/** Protokol penugasan generik GUNARA — sama untuk semua layanan katalog. */
const ALUR_PENUGASAN: readonly string[] = [
  "Brief & peta jalan — dalam 48 jam kami kirim peta jalan penugasan, estimasi biaya final, dan penanggung jawab bernama.",
  "Dokumen & penugasan tim — kami susun kelengkapan dokumen bersama Anda dan mengerahkan Dewan terkait.",
  "Eksekusi & pemantauan — proses berjalan dengan laporan progres; Anda memantau kapan pun via WhatsApp & portal client.",
  "Serah terima & pasca — semua luaran diserahterimakan, disertai pendampingan pasca-penugasan.",
];

export default function CatalogServiceDetailPage({ slug }: { slug: string }) {
  const s = catalogServiceBySlug(slug);

  if (!s) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4 pt-24 text-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Layanan tidak ditemukan.
          </h1>
          <p className="mt-3 text-sm text-slate-900">
            Katalog tidak memiliki catatan atas layanan ini.
          </p>
          <div className="mt-6 flex justify-center">
            <LinkButton to="/layanan" withArrow>
              Kembali ke Katalog Layanan
            </LinkButton>
          </div>
        </div>
      </section>
    );
  }

  const cat = catalogCategoryById(s.categoryId);
  const faq = layananFaqItems(s);
  const related = catalogRelated(s);
  const siblings = catalogByCategory(s.categoryId);
  const idx = siblings.findIndex((x) => x.slug === s.slug);
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length];
  const next = siblings[(idx + 1) % siblings.length];

  // 1–2 kata terakhir nama layanan diangkat ke gradien emas.
  const nameWords = s.name.split(" ");
  const goldCount = nameWords.length >= 3 ? 2 : 1;
  const head = nameWords.slice(0, -goldCount).join(" ");
  const gold = nameWords.slice(-goldCount).join(" ");

  return (
    <>
      <PageHero
        eyebrow={`Katalog Layanan · ${cat?.name ?? ""}`}
        title={
          <>
            {head}
            {head ? " " : ""}
            <span className="text-gradient-gold">{gold}</span>
          </>
        }
        sub={
          <>
            <span className="mb-3 block font-display text-[12px] font-semibold uppercase tracking-[0.28em] text-violet-700">
              {s.enName}
            </span>
            {s.tagline}
          </>
        }
        crumbs={[
          { label: "Beranda", to: "/" },
          { label: "Katalog Layanan", to: "/layanan" },
          { label: s.name },
        ]}
        meta={[
          s.duration,
          `Mulai ${s.priceFrom}`,
          "Penanggung jawab bernama",
          "Peta jalan 48 jam",
        ]}
      >
        <LinkButton to="/contact" withArrow>
          Konsultasikan Layanan Ini
        </LinkButton>
        <a
          href={`${BRAND.whatsappHref}?text=${encodeURIComponent(
            `Halo GUNARA, saya tertarik dengan layanan ${s.name} (${s.priceFrom}). Mohon penawarannya.`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-emerald-300 bg-emerald-50 px-8 py-3.5 text-sm font-bold text-emerald-600 backdrop-blur transition-all duration-300 hover:border-emerald-500/60 hover:bg-emerald-100"
        >
          WhatsApp {BRAND.phone}
        </a>
        <LinkButton to={`/services/${cat?.practiceNum ?? "01"}`} variant="ghost">
          {cat ? `Praktik induk ${cat.practiceNum}` : "Praktik Induk"}
        </LinkButton>
      </PageHero>

      {/* Ikhtisar */}
      <section className="mx-auto max-w-4xl px-4 pb-6 sm:px-6" aria-label="Ikhtisar">
        <Reveal>
          <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
            {s.description}
          </p>
        </Reveal>
      </section>

      {/* Luaran + Persyaratan */}
      <section
        className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8"
        aria-label="Luaran dan persyaratan"
      >
        <Reveal className="h-full">
          <div className="glass h-full rounded-3xl p-7 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-xl font-bold text-slate-900">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300 bg-violet-50 text-violet-600">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              Luaran yang Anda Terima
            </h2>
            <ul className="mt-6 space-y-3.5">
              {s.deliverables.map((d, i) => (
                <li
                  key={d}
                  className="flex items-start gap-3.5 text-[15px] leading-relaxed text-slate-600"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-violet-500/50 text-[11px] font-bold text-violet-600">
                    {i + 1}
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="h-full">
          <div className="glass h-full rounded-3xl p-7 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-xl font-bold text-slate-900">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300 bg-violet-50 text-violet-600">
                <ListChecks className="h-5 w-5" aria-hidden="true" />
              </span>
              Persyaratan dari Anda
            </h2>
            <ul className="mt-6 space-y-3.5">
              {s.requirements.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-600"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-violet-600"
                    aria-hidden="true"
                  />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Protokol penugasan */}
      <section
        className="mx-auto max-w-4xl px-4 pb-10 sm:px-6"
        aria-label="Alur penugasan"
      >
        <SectionHeading
          eyebrow="Protokol Penugasan"
          title={
            <>
              Bagaimana penugasan <span className="text-gradient-gold">berjalan.</span>
            </>
          }
        />
        <ol className="mt-10 space-y-4">
          {ALUR_PENUGASAN.map((p, i) => (
            <li key={p.slice(0, 24)}>
              <Reveal delay={i * 0.08}>
                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-[13px] font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-[15px] leading-relaxed text-slate-600">{p}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ — satu sumber data dengan JSON-LD layananFaqLd */}
      <section
        className="mx-auto max-w-4xl px-4 py-10 sm:px-6"
        aria-label="Pertanyaan umum layanan"
      >
        <SectionHeading
          eyebrow="FAQ Layanan"
          title={
            <>
              Pertanyaan umum seputar{" "}
              <span className="text-gradient-gold">layanan ini.</span>
            </>
          }
        />
        <Accordion type="single" collapsible className="mt-10">
          {faq.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left font-display text-base font-bold text-slate-900 hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {f.a.map((ans, i) =>
                    ans.startsWith("<ul>") ? (
                      <div
                        key={i}
                        className="text-sm leading-relaxed text-slate-600 [&_li]:list-disc [&_li]:marker:text-violet-500 [&_li]:ml-5 [&_li]:pl-1 [&_ul]:space-y-1.5"
                        dangerouslySetInnerHTML={{ __html: ans }}
                      />
                    ) : (
                      <p key={i} className="text-sm leading-relaxed text-slate-600">
                        {ans}
                      </p>
                    ),
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Layanan terkait */}
      {related.length > 0 ? (
        <section
          className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
          aria-label="Layanan terkait"
        >
          <SectionHeading
            eyebrow="Layanan Terkait"
            title={
              <>
                Tetap dalam{" "}
                <span className="text-gradient-gold">
                  {cat?.name ?? "kategori yang sama"}.
                </span>
              </>
            }
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {related.map((r, i) => (
              <Reveal key={r.slug} delay={i * 0.08} className="h-full">
                <a
                  href={`#/layanan/${r.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50"
                  aria-label={`Buka layanan ${r.name}`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-500">
                    {r.enName}
                  </span>
                  <span className="mt-1 block font-display text-base font-bold text-slate-900">
                    {r.name}
                  </span>
                  <span className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
                    {r.tagline}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-violet-600">
                    Mulai {r.priceFrom}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Prev / next dalam kategori */}
      {siblings.length > 1 ? (
        <nav
          className="mx-auto flex max-w-7xl flex-col items-stretch justify-between gap-4 px-4 pb-8 sm:flex-row sm:px-6 lg:px-8"
          aria-label="Navigasi layanan"
        >
          <a
            href={`#/layanan/${prev.slug}`}
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-violet-500/50"
          >
            <span
              className="text-2xl text-slate-400 transition-colors group-hover:text-violet-600"
              aria-hidden="true"
            >
              ←
            </span>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-900">
                Layanan sebelumnya
              </span>
              <span className="block font-display text-sm font-bold text-slate-700">
                {prev.name}
              </span>
            </span>
          </a>
          <a
            href={`#/layanan/${next.slug}`}
            className="group flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-right transition-all duration-300 hover:border-violet-500/50"
          >
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-900">
                Layanan berikutnya
              </span>
              <span className="block font-display text-sm font-bold text-slate-700">
                {next.name}
              </span>
            </span>
            <span
              className="text-2xl text-slate-400 transition-colors group-hover:text-violet-600"
              aria-hidden="true"
            >
              →
            </span>
          </a>
        </nav>
      ) : null}

      <Reveal className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ScrollText className="h-3.5 w-3.5" aria-hidden="true" />
          {s.name} · {cat?.name ?? "Katalog Layanan"} ·{" "}
          {cat ? `Praktik ${cat.practiceNum}` : "GUNARA CORPORATION"} · Piagam
          GUNARA 2001
        </div>
      </Reveal>

      <CTABand />
    </>
  );
}
