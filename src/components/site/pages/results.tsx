"use client";

import Comparison from "@/components/landing/comparison";
import Results from "@/components/landing/results";
import Testimonials from "@/components/landing/testimonials";
import { Reveal } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero } from "@/components/site/ui";

export default function ResultsPage() {
  return (
    <>
      <PageHero
        eyebrow="Bukti nyata"
        title={
          <>
            Brief mustahil. <span className="text-gradient-gold">Tuntas.</span>
          </>
        }
        sub="Sebagian kecil dari 12.000+ penugasan, dan perhitungan jujur dibanding rumah-rumah yang sudah Anda kenal. Nama klien dianonimkan — mereka meminta, kami menghormati; angka tetap berbicara."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Hasil & Bukti" }]}
        meta={["12.000+ penugasan", "99,97% tingkat keberhasilan", "190 negara"]}
      >
        <LinkButton to="/contact" withArrow>
          Bawa tantangan mustahil Anda
        </LinkButton>
        <LinkButton to="/method" variant="ghost">
          Bagaimana putusan ditempa
        </LinkButton>
      </PageHero>

      <Results />
      <Comparison />

      <Reveal className="mx-auto max-w-4xl px-4 pb-4 sm:px-6">
        <blockquote className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600/[0.06] to-transparent p-8 text-center sm:p-10">
          <p className="font-display text-xl italic leading-relaxed text-slate-700 sm:text-2xl">
            &ldquo;Mereka menjawab dalam 48 jam apa yang tak mampu dijawab
            empat firma konsultan dalam empat tahun.&rdquo;
          </p>
          <cite className="mt-4 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 not-italic">
            Putri Maheswari — Ketua Dewan Komisaris, Nusantara Financial Holdings
          </cite>
        </blockquote>
      </Reveal>

      <Testimonials />
      <CTABand />
    </>
  );
}
