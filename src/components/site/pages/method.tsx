"use client";

import { Armchair, Brain, Clock3, DraftingCompass, Fingerprint, Radar, Rocket, ShieldCheck, Users } from "lucide-react";
import Methodology from "@/components/landing/methodology";
import { Reveal } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero, StatBand } from "@/components/site/ui";

const PRINCIPLES = [
  {
    icon: Radar,
    title: "Tak ada yang luput diuji",
    text: "Data, sejarah, fisika, politik, psikologi — para dewan menginterogasi tantangan Anda dari 46 arah sebelum satu kata pun nasihat diperkenankan.",
  },
  {
    icon: Fingerprint,
    title: "Satu suara yang bertanggung jawab",
    text: "Setiap mandat memiliki Mitra Utama yang bernama. Komite hanya menasihati; firma menjawab — dan jawaban itu membawa tanda tangan.",
  },
  {
    icon: Brain,
    title: "Melampaui, bukan berkompromi",
    text: "Daftar opsi yang sudah terlihat kami tolak. Kami merekayasa opsi yang tak mampu dilihat pihak lain — itulah inti menghadirkan para jenius.",
  },
  {
    icon: ShieldCheck,
    title: "Kebenaran di atas kenyamanan",
    text: "Anda akan mendengar apa yang dituntut bukti, dalam bahasa yang dipahami dewan direksi Anda. Menyanjung adalah satu-satunya layanan yang tak pernah kami tawarkan.",
  },
  {
    icon: Clock3,
    title: "Hukum 48 jam",
    text: "Brief yang disampaikan dengan benar mendapatkan wawasan substantif pertama dalam 48 jam. Hanya tiga kali meleset dalam 12.000 penugasan — dan kami mengingat mana saja.",
  },
  {
    icon: Armchair,
    title: "Dieksekusi, bukan sekadar slide",
    text: "Protokol berakhir ketika lintasan keberhasilan terbukti dalam angka Anda. Laporan yang tidak mengubah apa pun adalah penugasan yang gagal.",
  },
];

export default function MethodPage() {
  return (
    <>
      <PageHero
        eyebrow="Protokol Oracle"
        title={
          <>
            Bagaimana jawaban mutlak <span className="text-gradient-gold">ditempa.</span>
          </>
        }
        sub="Lima babak, nol menebak-nebak. Disempurnakan melalui 6.900 tahun penguasaan gabungan para dewan — esensinya tak pernah berubah sejak pendirian di Jakarta, 2001."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Protokol Oracle" }]}
        meta={["Lima fase", "Satu Mitra Utama", "Wawasan pertama 48 jam"]}
      >
        <LinkButton to="/contact" withArrow>
          Uji Brief Anda lewat Protokol
        </LinkButton>
        <LinkButton to="/councils" variant="ghost">
          Temui 46 Dewan Pakar
        </LinkButton>
      </PageHero>

      <StatBand
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
        stats={[
          { value: "12.000+", label: "penugasan melalui Protokol" },
          { value: "99,97%", label: "tingkat keberhasilan" },
          { value: "48 jam", label: "wawasan pertama terjamin" },
        ]}
      />

      <Methodology />

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8" aria-label="Prinsip firma">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.08} className="h-full">
              <article className="glass group h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:gold-ring">
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <p.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-center gap-6 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600/[0.06] to-transparent p-8 text-center sm:p-10">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-violet-300 bg-violet-50 text-violet-600">
              <DraftingCompass className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="max-w-2xl font-display text-xl italic leading-relaxed text-slate-700 sm:text-2xl">
              &ldquo;Kami tidak menjual jam. Kami menjual momen ketika masalah
              Anda berhenti menjadi masalah.&rdquo;
            </p>
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900">
              <Users className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
              Piagam Firma, Pasal VII
            </span>
            <LinkButton to="/results" variant="ghost" withArrow>
              Lihat putusan Protokol
            </LinkButton>
            <span className="sr-only">
              <Rocket aria-hidden="true" />
            </span>
          </div>
        </Reveal>
      </section>

      <CTABand />
    </>
  );
}
