"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/data/legal";
import { Reveal, SectionHeading } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero } from "@/components/site/ui";

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Pertanyaan, dijawab tuntas"
        title={
          <>
            Pertanyaan <span className="text-gradient-gold">Umum.</span>
          </>
        }
        sub="Sepuluh pertanyaan yang selalu diajukan calon klien — dijawab seperti para dewan menjawab segalanya: presisi, jujur, dan tertulis."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Pertanyaan Umum" }]}
        meta={["10 jawaban", "Hukum 48 jam di dalamnya", "Nol basa-basi"]}
      />

      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6" aria-label="Pertanyaan yang sering diajukan">
        <SectionHeading
          eyebrow="Tanyakan, dan terjawab"
          title={
            <>
              Semuanya sebelum <span className="text-gradient-gold">rapat pertama.</span>
            </>
          }
        />

        <Reveal delay={0.1} className="mt-12">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`faq-${i}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 transition-colors data-[state=open]:border-violet-500/50"
              >
                <AccordionTrigger className="py-5 text-left hover:no-underline">
                  <span className="flex items-start gap-3 pr-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-violet-500/50 text-[11px] font-bold text-violet-600">
                      {i + 1}
                    </span>
                    <span className="font-display text-[15px] font-bold text-slate-900 sm:text-base">
                      {f.q}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-9">
                  <p className="text-sm leading-relaxed text-slate-500">{f.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600/[0.06] to-transparent p-8 text-center">
            <p className="max-w-xl font-display text-xl italic leading-relaxed text-slate-700">
              &ldquo;Pertanyaan yang tak ada di daftar ini? Oracle — kecerdasan
              46 Dewan Pakar — menunggu Anda di lounge Member VVIP.&rdquo;
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <LinkButton to="/contact" withArrow>
                Tanya langsung ke Dewan
              </LinkButton>
              <LinkButton to="/results" variant="ghost">
                Lihat buktinya
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </section>

      <CTABand />
    </>
  );
}
