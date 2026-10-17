"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { ABOUT_CARDS } from "@/data/content";
import { LEADERS } from "@/data/leadership";
import { TIMELINE } from "@/data/timeline";
import { BRAND } from "@/data/brand";
import { Reveal, SectionHeading, TiltCard } from "@/components/landing/motion";
import OfficeClocks from "@/components/site/office-clocks";
import { CTABand, LinkButton, PageHero } from "@/components/site/ui";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang Perusahaan"
        title={
          <>
            Bukan sekadar konsultan.{" "}
            <span className="text-gradient-gold">Sebuah peradaban keahlian.</span>
          </>
        }
        sub={`Didirikan ${BRAND.founded} di Jakarta sebagai gerbang tunggal konsultasi & perizinan internasional. Satu pakta, tanpa ego, jawaban mutlak — diasah lebih dari dua dekade dan disampaikan di ${BRAND.countries} negara.`}
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Tentang Kami" }]}
        meta={[`Berdiri ${BRAND.founded} · Jakarta`, "46 Dewan Pakar", "6.900 tahun gabungan"]}
      >
        <LinkButton to="/councils" withArrow>
          Temui 46 Dewan Pakar
        </LinkButton>
        <LinkButton to="/results" variant="ghost">
          Lihat Bukti & Hasil
        </LinkButton>
      </PageHero>

      {/* The story */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8" aria-label="Kisah pendirian firma">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-violet-200">
              <Image
                src="/images/menara-top.jpg"
                alt="Kantor pusat GUNARA CORPORATION — kantor PHI Kwitang, Jakarta"
                width={1344}
                height={768}
                className="h-auto w-full object-cover"
                priority={false}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent p-6">
                <p className="font-display text-lg font-bold text-slate-900">
                  Kantor PHI Kwitang, Jakarta Pusat
                </p>
                <p className="text-xs uppercase tracking-[0.25em] text-violet-700">
                  Jaringan kantor Tasikmalaya · Jakarta sejak {BRAND.founded}
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="font-display text-3xl font-bold leading-tight text-slate-900">
                Pakta sebelum praktik.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 leading-relaxed text-slate-500">
                Pada {BRAND.founded}, empat puluh enam pakar — masing-masing
                otoritas definitif di disiplinnya — berkumpul di Jakarta dan
                mendirikan {BRAND.legal}. Diagnosis mereka atas dunia konsultasi
                & perizinan tanpa kompromi: nasihat terpecah di antara para
                spesialis, masing-masing buta terhadap keseluruhan, masing-masing
                berlindung di balik dalih. Mereka bersumpah untuk kebalikannya:
                satu gerbang tunggal, satu jawaban, akuntabilitas yang
                ditandatangani dengan satu nama.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-4 leading-relaxed text-slate-500">
                Lebih dari dua dekade kemudian, pakta itu tetap mengatur
                segalanya. Para dewan tidak sekadar menimbun pengetahuan —
                mereka menyulingnya dari guru ke murid, lintas generasi; itulah
                mengapa satu dewan membawa 150 tahun penguasaan tanpa putus. Dan
                kredo firma tidak pernah berubah:{" "}
                <span className="font-semibold text-violet-700">
                  &ldquo;Mustahil&rdquo; adalah brief favorit kami.
                </span>
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Kerahasiaan tingkat “mitra senyap” sejak hari pertama",
                  "Satu Mitra Utama untuk setiap penugasan",
                  "46 disiplin ilmu, tanpa alih tangan",
                  "Layanan mengikuti matahari di 10 hub dunia",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                  >
                    <ArrowRight className="h-4 w-4 shrink-0 text-violet-600" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6" aria-label="Linimasa firma">
        <SectionHeading
          eyebrow={`Sejak ${BRAND.founded}, delapan titik balik`}
          title={
            <>
              Memori <span className="text-gradient-gold">firma.</span>
            </>
          }
        />
        <div className="relative mt-14">
          <div
            className="absolute left-[19px] top-2 h-[calc(100%-16px)] w-px bg-gradient-to-b from-violet-600/60 via-zinc-800 to-transparent md:left-1/2"
            aria-hidden="true"
          />
          {TIMELINE.map((t, i) => {
            const left = i % 2 === 0;
            return (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`relative mb-8 flex md:mb-12 ${left ? "md:justify-start" : "md:justify-end"}`}
              >
                <span
                  className="absolute left-[19px] top-7 z-10 -translate-x-1/2 md:left-1/2"
                  aria-hidden="true"
                >
                  <span className="block h-3.5 w-3.5 rounded-full border-2 border-violet-500 bg-white shadow-[0_0_12px_rgba(139,92,246,0.9)]" />
                </span>
                <div
                  className={`glass ml-10 w-full rounded-2xl p-6 md:ml-0 md:w-[calc(50%-3rem)] ${
                    left ? "" : ""
                  }`}
                >
                  <span className="font-display text-2xl font-bold text-gradient-gold">{t.year}</span>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-slate-900">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{t.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Leadership */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Kepemimpinan firma">
        <SectionHeading
          eyebrow="Para ketua dewan"
          title={
            <>
              Kepemimpinan yang <span className="text-gradient-gold">menjawab dengan nama.</span>
            </>
          }
          sub="Setiap penugasan Mitra Utama diikrarkan di atas piagam pendirian. Inilah para ketua yang akan benar-benar Anda temui."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LEADERS.map((l, i) => {
            if (l.featured) {
              return (
                <Reveal key={l.name} delay={0} className="sm:col-span-2 lg:col-span-3">
                  <TiltCard className="h-full">
                    <article className="group grid h-full overflow-hidden rounded-2xl border border-violet-300 bg-gradient-to-br from-zinc-900/80 via-zinc-900/40 to-transparent transition-all duration-300 hover:border-violet-500/60 hover:shadow-[0_32px_80px_-32px_rgba(139,92,246,0.45)] lg:grid-cols-[340px_1fr]">
                      <div className="relative h-80 overflow-hidden bg-white lg:h-full">
                        {l.image ? (
                          <Image
                            src={l.image}
                            alt={`Potret ${l.name}, ${l.role}`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 340px"
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="flex h-28 w-28 items-center justify-center rounded-full border border-violet-300 bg-gradient-to-br from-violet-100 to-transparent font-display text-4xl font-bold text-gradient-gold">
                              {l.initials}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent lg:bg-gradient-to-r" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col justify-center p-6 sm:p-10">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-600">
                          {l.council}
                        </p>
                        <h3 className="mt-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                          {l.name}
                        </h3>
                        <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-violet-700">
                          {l.role}
                        </p>
                        {l.enRole ? (
                          <p className="mt-0.5 text-xs italic text-slate-900">{l.enRole}</p>
                        ) : null}
                        <Quote className="mt-5 h-5 w-5 text-violet-600/40" aria-hidden="true" />
                        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-slate-600">
                          {l.bio}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {["Tasikmalaya · Jawa Barat", "Konsultan Bisnis Senior", "Berpartner dengan McKinsey"].map(
                            (chip) => (
                              <span
                                key={chip}
                                className="rounded-full border border-violet-300 bg-violet-50/60 px-3 py-1 text-[11px] font-medium text-violet-700/90"
                              >
                                {chip}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </article>
                  </TiltCard>
                </Reveal>
              );
            }
            return (
            <Reveal key={l.name} delay={(i % 3) * 0.08} className="h-full">
              <TiltCard className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(139,92,246,0.22)]">
                  <div className="relative h-64 overflow-hidden bg-white">
                    {l.image ? (
                      <Image
                        src={l.image}
                        alt={`Potret ${l.name}, ${l.role}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="flex h-24 w-24 items-center justify-center rounded-full border border-violet-300 bg-gradient-to-br from-violet-100 to-transparent font-display text-3xl font-bold text-gradient-gold">
                          {l.initials}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-500">
                      {l.council}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold text-slate-900">{l.name}</h3>
                    <p className="mt-0.5 text-[13px] font-medium text-slate-500">{l.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-900">{l.bio}</p>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
            );
          })}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <LinkButton to="/leadership" withArrow>
              Kenali seluruh jajaran pimpinan &amp; tata kelola
            </LinkButton>
            <p className="text-xs text-slate-400">
              Piagam tata kelola, mekanisme penunjukan Mitra Utama, dan profil lengkap para pimpinan firma.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Nilai-nilai yang kami ikrarkan">
        <SectionHeading
          eyebrow="Piagam yang mengikat"
          title={
            <>
              Yang kami <span className="text-gradient-gold">ikrarkan.</span>
            </>
          }
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08} className="h-full">
              <TiltCard className="h-full">
                <div className="glass group flex h-full flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:gold-ring">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <c.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{c.desc}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <blockquote className="mx-auto mt-12 max-w-3xl rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600/[0.06] to-transparent p-8 text-center sm:p-10">
            <Quote className="mx-auto h-7 w-7 text-violet-600" aria-hidden="true" />
            <p className="mt-4 font-display text-xl italic leading-relaxed text-slate-700 sm:text-2xl">
              &ldquo;Beri kami 46 menit. 46 Dewan Pakar akan memberi Anda
              dekade berikutnya.&rdquo;
            </p>
            <cite className="mt-3 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 not-italic">
              — Piagam Pendirian, Pasal 1
            </cite>
          </blockquote>
        </Reveal>
      </section>

      <OfficeClocks />
      <CTABand />
    </>
  );
}
