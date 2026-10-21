"use client";

/**
 * /leadership — Pimpinan & Tata Kelola.
 * Halaman kepemimpinan penuh: pendiri, jajaran direksi & mitra senior,
 * piagam tata kelola, dan mekanisme akuntabilitas Partner-in-Chief.
 */

import Image from "next/image";
import { Award, BadgeCheck, FileCheck2, Quote, Scale, ShieldCheck, Target, Users2 } from "lucide-react";
import { LEADERS } from "@/data/leadership";
import { BRAND } from "@/data/brand";
import { Reveal, SectionHeading, TiltCard } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero, StatBand } from "@/components/site/ui";

const GOVERNANCE = [
  {
    icon: Target,
    title: "Satu jawaban, tanpa ego",
    desc: "Setiap penugasan dijawab oleh satu Mitra Utama yang memimpin Dewan terkait. Klien tidak pernah diturunkan ke komite tanpa wajah — ada satu nama yang memikul akuntabilitas penuh atas kualitas putusan.",
  },
  {
    icon: Scale,
    title: "Putusan berpijak pada bukti",
    desc: "Setiap rekomendasi wajib selamat dari war-game internal sebelum menyentuh ruang direksi klien. Pendapat yang tak tertahan uji tidak naik ke atas meja — apa pun pejabatnya yang mengucapkan.",
  },
  {
    icon: FileCheck2,
    title: "Honor berbasis keberhasilan",
    desc: "Struktur honor kami mengikat kepentingan firma pada keberhasilan klien: tidak ada putusan, tidak ada fee. Kami tidak diupah untuk menghasilkan slide — kami diupah untuk menyelesaikan.",
  },
  {
    icon: ShieldCheck,
    title: "Kerahasiaan berlapis lembaga",
    desc: "Batas kerahasiaan berlaku lintas Dewan dan lintas kantor: data klien dipisahkan per penugasan, akses internal dicatat, dan setiap pelanggaran adalah pelanggaran yang memutuskan karier.",
  },
] as const;

const APPOINTMENT = [
  {
    step: "01",
    title: "Kurasi Dewan",
    desc: "Kandidat mitra dinilai lintas Dewan: rekam jejak penugasan, kedalaman disiplin, dan integritas yang diuji di bawah tekanan nyata — bukan sekadar gelar dan lama kerja.",
  },
  {
    step: "02",
    title: "Piagam Partner-in-Chief",
    desc: "Penunjukan Mitra Utama diikrarkan di atas piagam pendirian: nama, mandat, dan batas kewenangannya tercatat — dapat diperiksa klien kapan pun penugasan berjalan.",
  },
  {
    step: "03",
    title: "Audit antar-Dewan",
    desc: "Setiap penugasan besar diaudit silang oleh Dewan lain yang tak terlibat. Tidak ada jalan pintas yang selamat dari rekan yang berbeda meja namun sama standar.",
  },
  {
    step: "04",
    title: "Sanksi tanpa kecuali",
    desc: "Pelanggaran etika berujung pemberhentian, terlepas dari senioritas. Reputasi 6.900 tahun pengalaman gabungan lebih berharga daripada satu penugasan apa pun.",
  },
] as const;

export default function LeadershipPage() {
  const featured = LEADERS.find((l) => l.featured) ?? LEADERS[0];
  const rest = LEADERS.filter((l) => !l.featured);
  const executives = rest.filter((l) => /Direktur|Kepala|Wakil/i.test(l.role) && !/Mitra Senior/i.test(l.role));
  const partners = rest.filter((l) => !executives.includes(l));

  return (
    <>
      <PageHero
        eyebrow="Pimpinan & Tata Kelola"
        title={
          <>
            Kepemimpinan yang{" "}
            <span className="text-gradient-gold">menjawab dengan nama.</span>
          </>
        }
        sub="Di belakang 12.000+ penugasan dan tingkat keberhasilan 99,97% ada manusia-manusia yang menandatangani putusan dengan reputasi mereka sendiri. Kenali mereka — sebelum Anda memberi mandat."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Pimpinan & Tata Kelola" }]}
        meta={[`${LEADERS.length} pimpinan & mitra senior`, "46 Dewan Pakar", "Sejak 2001", "6.900 tahun pengalaman gabungan"]}
      >
        <LinkButton to="/contact" withArrow>
          Bicara dengan Dewan
        </LinkButton>
        <LinkButton to="/about" variant="ghost">
          Cerita firma
        </LinkButton>
      </PageHero>

      {/* Pendiri — kartu full width */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8" aria-label="Pendiri">
        <Reveal>
          <TiltCard>
            <article className="group grid overflow-hidden rounded-3xl border border-violet-300 bg-gradient-to-br from-zinc-900/80 via-zinc-900/40 to-transparent transition-all duration-300 hover:border-violet-500/60 hover:shadow-[0_32px_80px_-32px_rgba(13,148,136,0.45)] lg:grid-cols-[360px_1fr]">
              <div className="relative h-80 overflow-hidden bg-white lg:h-full">
                <Image
                  src={featured.image ?? "/images/founder-gugun-gunara.jpg"}
                  alt={`Potret ${featured.name}, ${featured.role}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 360px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent lg:bg-gradient-to-r" aria-hidden="true" />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-600">
                  {featured.council}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                  {featured.name}
                </h2>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-violet-700">
                  {featured.role}
                </p>
                <p className="mt-0.5 text-xs italic text-slate-500">{featured.enRole}</p>
                <Quote className="mt-5 h-5 w-5 text-violet-600/40" aria-hidden="true" />
                <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-slate-600">
                  {featured.bio}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Berpartner dengan McKinsey", "Tiga dekade lintas industri", "46 Dewan Pakar di bawah satu piagam"].map(
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
      </section>

      {/* Jajaran eksekutif */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Jajaran eksekutif">
        <SectionHeading
          eyebrow="Direksi & kepala fungsi"
          title={
            <>
              Meja eksekutif yang <span className="text-gradient-gold">mengawal operasi harian.</span>
            </>
          }
          sub="Mereka yang memastikan setiap penugasan bergerak presisi: perizinan, strategi, keuangan, teknologi, dan manusia di baliknya."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {executives.map((l, i) => (
            <Reveal key={l.name} delay={(i % 3) * 0.08} className="h-full">
              <TiltCard className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(13,148,136,0.22)]">
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
                    <p className="mt-0.5 text-[13px] font-semibold text-violet-700">{l.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{l.bio}</p>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mitra senior dewan */}
      <section className="border-y border-slate-200 bg-gradient-to-b from-violet-600/[0.04] to-transparent py-16 sm:py-20" aria-label="Mitra senior dewan pakar">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Mitra senior — Dewan Pakar"
            title={
              <>
                Otak-otak yang berdiri <span className="text-gradient-gold">di balik Oracle.</span>
              </>
            }
            sub="Para mitra senior yang memimpin Dewan-dewan pakar internasional — arsitek putusan untuk klien di 190 negara."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((l, i) => (
              <Reveal key={l.name} delay={(i % 3) * 0.08} className="h-full">
                <TiltCard className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(13,148,136,0.22)]">
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
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{l.bio}</p>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stat */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Skala firma dalam angka">
        <Reveal>
          <StatBand
            stats={[
              { value: "2001", label: "Tahun pendirian" },
              { value: "12.000+", label: "Penugasan dituntaskan" },
              { value: "99,97%", label: "Tingkat keberhasilan" },
            ]}
          />
        </Reveal>
      </section>

      {/* Tata kelola */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Piagam tata kelola">
        <SectionHeading
          eyebrow="Piagam tata kelola"
          title={
            <>
              Empat pilar yang <span className="text-gradient-gold">tidak bisa ditawar.</span>
            </>
          }
          sub="Tata kelola bukan halaman etika yang dibaca saat crisis — di GUNARA ia adalah sistem operasi harian yang menentukan siapa berbicara, siapa memutuskan, dan siapa menanggung akibat."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {GOVERNANCE.map((g, i) => (
            <Reveal key={g.title} delay={(i % 2) * 0.08} className="h-full">
              <TiltCard className="h-full">
                <div className="glass group flex h-full flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:gold-ring sm:p-8">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <g.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900 sm:text-lg">{g.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{g.desc}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mekanisme penunjukan */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20" aria-label="Mekanisme penunjukan mitra">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Akuntabilitas berjenjang"
            title={
              <>
                Bagaimana seorang Mitra Utama <span className="text-gradient-gold">ditempa.</span>
              </>
            }
            sub="Gelar Mitra Utama di GUNARA bukan promosi karier — ia adalah penugasan yang diperoleh melalui empat gerbang, dan dapat dicabut lewat mekanisme yang sama ketatnya."
          />
          <ol className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {APPOINTMENT.map((a, i) => (
              <Reveal key={a.step} delay={i * 0.08} className="h-full">
                <li className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(13,148,136,0.22)]">
                  <span className="font-display text-4xl font-bold text-violet-600/15 transition-colors duration-300 group-hover:text-violet-600/30" aria-hidden="true">
                    {a.step}
                  </span>
                  <h3 className="mt-2 font-display text-base font-bold text-slate-900">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.desc}</p>
                  <BadgeCheck
                    className="mt-4 h-5 w-5 text-violet-600/50 transition-colors duration-300 group-hover:text-violet-600"
                    aria-hidden="true"
                  />
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <blockquote className="mx-auto mt-12 max-w-3xl rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600/[0.06] to-transparent p-8 text-center sm:p-10">
              <Quote className="mx-auto h-7 w-7 text-violet-600" aria-hidden="true" />
              <p className="mt-4 font-display text-xl italic leading-relaxed text-slate-700 sm:text-2xl">
                &ldquo;Tidak ada satu pun penugasan di firma ini yang berjalan tanpa
                satu nama yang bersedia dipertanggungjawabkannya.&rdquo;
              </p>
              <cite className="mt-3 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 not-italic">
                Adrian Voss — Managing Partner &amp; Ketua Dewan Pakar
              </cite>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Penghargaan & afiliasi */}
      <section className="border-t border-slate-200 bg-gradient-to-b from-violet-600/[0.04] to-transparent py-16 sm:py-20" aria-label="Penghargaan dan afiliasi">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Kredensial lembaga"
            title={
              <>
                Dipercaya lembaga, <span className="text-gradient-gold">diukur lewat hasil.</span>
              </>
            }
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Award,
                title: "Afiliasi & akreditasi resmi",
                desc: "Anggota dan afiliasi lembaga profesi — IPHI (Ikatan Penasihat Hukum Indonesia) dan jaringan lembaga sertifikasi terakreditasi lintas sektor.",
              },
              {
                icon: Users2,
                title: "Kemitraan pemerintah",
                desc: "Kerja langsung dengan OSS RBA, BKPM, Kemenkumham, BPOM, BPJPH, Komdigi, OJK-terkait, dan kementerian teknis lainnya di seluruh rantai perizinan.",
              },
              {
                icon: Scale,
                title: "Standar internasional",
                desc: "Praktik penugasan mengikuti disiplin firma raksasa dunia — war-game, audit silang, honor berbasis hasil — dengan akar, kecepatan, dan harga Indonesia.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} className="h-full">
                <div className="glass group flex h-full flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:gold-ring">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <c.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-900">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
              Ingin memastikan siapa yang duduk di meja Anda? Tanyakan langsung saat briefing —{" "}
              <a
                href={`${BRAND.whatsappHref}?text=${encodeURIComponent("Halo Gunara Consultan, saya ingin mengetahui Mitra Utama yang akan mengawal penugasan saya.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-violet-700 underline decoration-violet-400/40 underline-offset-2 transition-colors hover:text-violet-600"
              >
                kirim pertanyaan Anda via WhatsApp
              </a>{" "}
              — kami jawab dengan nama, bukan dengan jabatan.
            </p>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
