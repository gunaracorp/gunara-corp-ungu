"use client";

/**
 * /responsibility — Tanggung Jawab & Dampak.
 * Tata kelola etika, pemberdayaan usaha, investasi pada manusia,
 * dan tanggung jawab lingkungan — komitmen firma yang terukur.
 */

import { BookOpen, Globe2, HandHeart, Leaf, Recycle, Scale, ShieldCheck, Sprout, Users2, Volume2 } from "lucide-react";
import { BRAND } from "@/data/brand";
import { Reveal, SectionHeading, TiltCard } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero, StatBand } from "@/components/site/ui";

const PILLARS = [
  {
    icon: Scale,
    eyebrow: "Tata kelola",
    title: "Integritas tanpa klausul kecil",
    desc: "Kami menolak penugasan yang menuntut jalan pintas — berapa pun feenya. Nol toleransi terhadap suap diturunkan ke kontrak kerja setiap anggota, klien diberi kanal pelaporan langsung ke Direktur Utama, dan setiap dugaan pelanggaran diaudit oleh Dewan yang tak terlibat. Reputasi 6.900 tahun pengalaman gabungan bukan aset yang boleh dipertaruhkan untuk satu mandat.",
  },
  {
    icon: Sprout,
    eyebrow: "Pemberdayaan",
    title: "UMKM naik kelas dengan izin yang benar",
    desc: "Sebagian besar UMKM tidak kalah oleh pasar — ia terhenti karena dokumen: NIB yang salah KBLI, sertifikasi halal yang tertunda, SNI yang mengintimidasi. Program pro bono kami mengawal pemilik usaha kecil melewati gerbang perizinan pertama secara gratis setiap kuartal, karena ekonomi yang sehat dimulai dari usaha yang sah dan diakui.",
  },
  {
    icon: BookOpen,
    eyebrow: "Pendidikan",
    title: "Akademi Dewan untuk generasi polymath",
    desc: "Kami tidak menunggu talenta jadi — kami menumbuhkannya. Jalur magang Dewan, kelas regulasi terbuka, dan pendampingan karier muda konsultan menjadi mesin regenerasi firma sekaligus kontribusi kami pada profesi. Alumni akademi tersebar di Dewan-dewan internasional dan mengajar kembali di akademi.",
  },
  {
    icon: Leaf,
    eyebrow: "Lingkungan",
    title: "Kertas-tuntas, bukan kertas-kertas",
    desc: "Rantai perizinan yang kami bangun hampir seluruhnya digital: arsip penugasan, tanda tangan, dan pelaporan berjalan tanpa cetakan. Kebijakan perjalanan kami mengutamakan agenda tergabung, dan setiap penugasan besar memasukkan komitmen lingkungan (persetujuan lingkungan, AMDAL) sebagai jalur sah yang dihormati — bukan rintangan yang dicari pintunya.",
  },
] as const;

const COMMITMENTS = [
  {
    icon: ShieldCheck,
    title: "Etika data di atas trend",
    desc: "Kami tidak menjual, menyewakan, atau memperkaya diri dari data klien. Berlangganan Dispatch tanpa pelacak, formulir hanya meminta yang dibutuhkan, dan hak menghapus data Anda dihormati tanpa drama.",
  },
  {
    icon: Volume2,
    title: "Kejujuran atas batas kemampuan",
    desc: "Bila penugasan berada di luar jangkauan kami, kami mengatakannya di menit pertama — dan merekomendasikan yang lebih tepat. Klien yang kecewa bukan karena kami gagal, melainkan karena kami berkata ya pada yang mustahil.",
  },
  {
    icon: Globe2,
    title: "Standar yang sama di 190 negara",
    desc: "Kualitas jawaban tidak bergantung pada ukuran klien atau negara asalnya. Briefing UMKM Tasikmalaya diperlakukan dengan disiplin war-game yang sama dengan mandat korporasi New York.",
  },
] as const;

export default function ResponsibilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Tanggung Jawab & Dampak"
        title={
          <>
            Sukses yang tidak <span className="text-gradient-gold">dipinjam dari masa depan.</span>
          </>
        }
        sub="Firma ini hidup dari kepercayaan — dan kepercayaan tidak dibeli dengan iklan. Ia dipelihara dengan cara kami memperlakukan klien, orang-orang kami, usaha kecil, dan lingkungan tempat seluruh izin itu akhirnya berdiri."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Tanggung Jawab & Dampak" }]}
        meta={["Nol toleransi suap", "Pro bono UMKM per kuartal", "Rantai kerja hampir tanpa kertas"]}
      >
        <LinkButton to="/contact" withArrow>
          Diskusikan kemitraan dampak
        </LinkButton>
        <LinkButton to="/about" variant="ghost">
          Cerita firma
        </LinkButton>
      </PageHero>

      {/* Angka dampak */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8" aria-label="Dampak dalam angka">
        <Reveal>
          <StatBand
            stats={[
              { value: "25", label: "Tahun menjaga reputasi" },
              { value: "4/kuartal", label: "Sesi pro bono UMKM" },
              { value: "0", label: "Kasus pelanggaran etika terbukti" },
            ]}
          />
        </Reveal>
      </section>

      {/* Empat pilar */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Empat pilar tanggung jawab">
        <SectionHeading
          eyebrow="Empat pilar"
          title={
            <>
              Tempat kami <span className="text-gradient-gold">berdiri paling teguh.</span>
            </>
          }
          sub="Bukan halaman etika yang ditulis karena diminta — keempat pilar ini mengikat cara kami memilih klien, menjalankan penugasan, dan mengukur diri sendiri."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.08} className="h-full">
              <TiltCard className="h-full">
                <article className="group flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(139,92,246,0.22)] sm:p-8">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-13 w-13 items-center justify-center rounded-2xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 p-3 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                      <p.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-600">
                      {p.eyebrow}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 sm:text-xl">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.desc}</p>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Komitmen lintas penugasan */}
      <section className="border-y border-slate-200 bg-gradient-to-b from-violet-600/[0.04] to-transparent py-16 sm:py-20" aria-label="Komitmen lintas penugasan">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Komitmen yang terasa"
            title={
              <>
                Hal-hal kecil yang <span className="text-gradient-gold">jarang diiklankan.</span>
              </>
            }
            sub="Tiga keputusan yang tidak muncul di brosur mana pun — namun menentukan bagaimana rasanya bekerja dengan kami."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {COMMITMENTS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} className="h-full">
                <div className="glass group flex h-full flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:gold-ring sm:p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <c.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-900 sm:text-lg">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Program unggulan */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Program unggulan">
        <SectionHeading
          eyebrow="Program unggulan"
          title={
            <>
              Dua pintu yang selalu <span className="text-gradient-gold">kami buka.</span>
            </>
          }
          sub="Dua program berjalan sepanjang tahun — satu untuk pemilik usaha, satu untuk pencari jalan masuk ke profesi ini."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal className="h-full">
            <article className="flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-violet-300 bg-gradient-to-br from-violet-600/[0.08] via-white to-white p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex h-13 w-13 items-center justify-center rounded-2xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 p-3 text-violet-600">
                  <HandHeart className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  Gratis per kuartal
                </span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
                  Gerbang Sah — pendampingan izin UMKM
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Setiap kuartal, Dewan Perizinan kami menyisihkan slot khusus bagi pemilik usaha mikro, kecil,
                  dan menengah: pemeriksaan legalitas, pemetaan izin yang benar, dan pengurusan NIB — tanpa honor
                  konsultasi. Prioritas untuk usaha yang bergerak di bidang pangan, kreatif, dan jasa ekspor.
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                  {[
                    "Pemeriksaan legalitas & KBLI usaha Anda",
                    "Pengurusan NIB dan izin dasar di OSS RBA",
                    "Pendampingan sertifikasi halal / SNI yang wajib",
                  ].map((li) => (
                    <li key={li} className="flex items-start gap-2.5">
                      <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={`${BRAND.whatsappHref}?text=${encodeURIComponent("Halo Gunara Consultan, saya pemilik usaha UMKM dan ingin mendaftar program pro bono Gerbang Sah.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 px-7 py-3 text-sm font-bold text-white transition-transform duration-300 hover:scale-[1.04] active:scale-95"
              >
                Daftar program Gerbang Sah
              </a>
            </article>
          </Reveal>

          <Reveal delay={0.08} className="h-full">
            <article className="flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex h-13 w-13 items-center justify-center rounded-2xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 p-3 text-violet-600">
                  <Users2 className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-violet-300 bg-violet-50/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">
                  Seleksi terbuka
                </span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
                  Jalur Magang Akademi Dewan
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Lulusan terbaik dari segala latar belakang — hukum, keuangan, teknologi, pemerintahan — magang
                  langsung di bawah Dewan yang sesuai minatnya: ikut briefing, menyusun dokumen nyata, dan
                  menghadapi war-game. Kontrak penuh menanti yang bertahan melewati standar Dewan.
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                  {[
                    "Mentor satu-per-satu dari Mitra senior",
                    "Terlibat penugasan nyata sejak bulan pertama",
                    "Sertifikat akademi yang diakui jaringan Dewan",
                  ].map((li) => (
                    <li key={li} className="flex items-start gap-2.5">
                      <Recycle className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
              <LinkButton to="/careers" variant="ghost" className="mt-auto self-start">
                Lihat jalur karier
              </LinkButton>
            </article>
          </Reveal>
        </div>
      </section>

      {/* Ajakan pelaporan */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20" aria-label="Kanal integritas">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600/[0.06] to-transparent p-8 text-center sm:p-10">
              <Scale className="mx-auto h-8 w-8 text-violet-600" aria-hidden="true" />
              <h2 className="mt-4 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                Melihat yang tidak pantas? <span className="text-gradient-gold">Katakan.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Kanal integritas kami terbuka untuk klien, mitra, dan masyarakat:{" "}
                <a
                  href={`mailto:${BRAND.email}?subject=Kanal%20Integritas%20TOP`}
                  className="font-semibold text-violet-700 underline decoration-violet-400/40 underline-offset-2 transition-colors hover:text-violet-600"
                >
                  {BRAND.email}
                </a>{" "}
                dengan subjek &ldquo;Kanal Integritas&rdquo;. Laporan ditangani langsung oleh Direktur Utama,
                identitas pelapor dilindungi, dan setiap laporan yang layak memicu audit oleh Dewan yang
                independen. Kami berhutang pada siapa pun yang menjaga nama firma ini.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
