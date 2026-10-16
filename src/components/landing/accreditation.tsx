import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { Reveal, SectionHeading } from "./motion";

/* ----------------------------------------------------------------------------
 * Galeri Akreditasi & Penyerahan Sertifikat — bukti nyata di lapangan.
 * Potret proses akreditasi & penyerahan dokumen resmi kepada klien TOP.
 * -------------------------------------------------------------------------- */

type Proof = {
  src: string;
  alt: string;
  title: string;
  desc: string;
  tag: string;
  width: number;
  height: number;
};

const PROOFS: Proof[] = [
  {
    src: "/images/penyerahan-ppiu-ashanty.jpg",
    alt: "Penyerahan sertifikat PPIU berbingkai kepada PT Ashanty Perdana Pratiwi",
    title: "Sertifikat PPIU — Certificate of Confidence",
    desc: "Izin PPIU resmi berbingkai emas: standar IATA–KAN yang diserahterimakan langsung kepada PT Ashanty Perdana Pratiwi.",
    tag: "Penyerahan",
    width: 1400,
    height: 1215,
  },
  {
    src: "/images/akreditasi-kanwil-jatim.jpg",
    alt: "Sidang akreditasi bersama Kanwil Kementerian Agama Jawa Timur",
    title: "Akreditasi Kanwil Kemenag Jawa Timur",
    desc: "Sidang akreditasi kantor wilayah Jawa Timur — pendampingan penuh dari persiapan dokumen hingga vonis akreditasi.",
    tag: "Akreditasi",
    width: 1400,
    height: 950,
  },
  {
    src: "/images/penyerahan-bpw-ashanty.jpg",
    alt: "Penyerahan sertifikat Biro Perjalanan Wisata kepada PT Ashanty Perdana Pratiwi",
    title: "Sertifikat Biro Perjalanan Wisata",
    desc: "Legalitas BPW resmi menempel — pintu masuk bisnis perjalanan wisata yang sah dan berstandar nasional.",
    tag: "Penyerahan",
    width: 1400,
    height: 1050,
  },
  {
    src: "/images/akreditasi-ppiu-ashanty.jpg",
    alt: "Tim gabungan TOP Konsultan Nusantara dan Ashanty merayakan akreditasi PPIU",
    title: "Akreditasi PPIU — Ashanty Perdana Pratiwi",
    desc: "Tim gabungan TOP Konsultan Nusantara & Ashanty menutup proses akreditasi dengan dua ibu jari — dan dokumen yang sah.",
    tag: "Akreditasi",
    width: 1280,
    height: 850,
  },
  {
    src: "/images/akreditasi-ppiu-riff.jpg",
    alt: "Riffy Group resmi terakreditasi PPIU bersama TOP Konsultan Nusantara",
    title: "Akreditasi PPIU — Riff Religi Travelindo",
    desc: "Riffy Group menuntaskan akreditasi PPIU layanan religi — travel umrah yang berangkat dengan payung hukum penuh.",
    tag: "Akreditasi",
    width: 1280,
    height: 960,
  },
];

export default function Accreditation() {
  return (
    <section
      id="akreditasi"
      className="relative scroll-mt-20 border-t border-slate-200 py-24 sm:py-28"
      aria-label="Galeri akreditasi dan penyerahan sertifikat"
    >
      <div
        className="pointer-events-none absolute -right-40 top-24 h-96 w-96 rounded-full bg-violet-600/[0.06] blur-[130px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Diakui, bukan sekadar klaim"
          title={
            <>
              Setiap Sertifikat <span className="text-gradient-gold">Adalah Bukti.</span>
            </>
          }
          sub="Potret langsung proses akreditasi dan penyerahan dokumen resmi kepada klien — PPIU, Biro Perjalanan Wisata, hingga akreditasi kantor wilayah. Klien nyata, dokumen nyata, penyelesaian nyata."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {PROOFS.map((p, i) => (
            <Reveal key={p.src} delay={i * 0.08} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(139,92,246,0.22)]">
                <span
                  className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-violet-500/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-900">
                    {p.desc}
                  </p>
                  <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
                    <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                    {p.tag}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}

          {/* Kartu segel mitra — logo master emas */}
          <Reveal delay={PROOFS.length * 0.08} className="h-full">
            <article className="group relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 p-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/60 hover:shadow-[0_24px_60px_-24px_rgba(139,92,246,0.45)]">
              <span
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/80 to-transparent"
                aria-hidden="true"
              />
              <div className="relative h-40 w-40 shrink-0">
                <Image
                  src="/images/logo-pusat-perizinan.png"
                  alt="Segel emas Pusat Perizinan ID — mitra eksekusi sertifikasi dan akreditasi"
                  width={800}
                  height={800}
                  sizes="160px"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  priority={false}
                />
              </div>
              <h3 className="mt-6 font-display text-base font-bold text-slate-900">
                Segel Eksekusi Pusat Perizinan.ID
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-900">
                Mitra eksekusi sertifikasi &amp; akreditasi — layanan perizinan
                penuh sejak 2009, di bawah satu gerbang emas yang sama.
              </p>
              <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Mitra Resmi
              </span>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
