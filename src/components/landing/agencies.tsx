import Image from "next/image";
import { Reveal, SectionHeading } from "./motion";

/* ----------------------------------------------------------------------------
 * Jaringan Instansi — kementerian & lembaga yang dihadapi langsung dalam
 * pengurusan izin. Bukan klaim kemitraan: rekam jejak pengurusan nyata.
 * -------------------------------------------------------------------------- */

type Agency = {
  slug: string;
  name: string;
  scope: string;
  w: number;
  h: number;
};

const AGENCIES: Agency[] = [
  { slug: "kemenkumham", name: "Kementerian Hukum", scope: "PT · PMA · Yayasan", w: 960, h: 1050 },
  { slug: "bkpm", name: "Kementerian Investasi / BKPM", scope: "NIB · OSS-RBA · PMA", w: 960, h: 213 },
  { slug: "kemendag", name: "Kementerian Perdagangan", scope: "SIUP · API · Bappebti", w: 480, h: 320 },
  { slug: "kemenkeu", name: "Kementerian Keuangan", scope: "NPWP · Bea Cukai", w: 960, h: 868 },
  { slug: "kemenimipas", name: "Kementerian Imigrasi & Pemasyarakatan", scope: "KITAS · KITAP · Paspor", w: 960, h: 960 },
  { slug: "kemnaker", name: "Kementerian Ketenagakerjaan", scope: "Wajib Lapor · RPTKA", w: 960, h: 960 },
  { slug: "kemenkes", name: "Kementerian Kesehatan", scope: "Izin Edar · Alkes", w: 960, h: 717 },
  { slug: "bpom", name: "Badan POM", scope: "BPOM MD · Notifikasi", w: 960, h: 882 },
  { slug: "kemenag", name: "Kementerian Agama", scope: "Sertifikat Halal (BPJPH)", w: 960, h: 914 },
  { slug: "bsn", name: "Badan Standardisasi Nasional", scope: "SNI", w: 960, h: 212 },
  { slug: "kemenpar", name: "Kementerian Pariwisata", scope: "PPIU · BPW · TUPU", w: 960, h: 960 },
  { slug: "kemenhub", name: "Kementerian Perhubungan", scope: "Angkutan · Logistik", w: 330, h: 384 },
  { slug: "kemenperin", name: "Kementerian Perindustrian", scope: "IUI · Standar Industri", w: 960, h: 640 },
  { slug: "kemendagri", name: "Kementerian Dalam Negeri", scope: "Domisili · Perizinan Pemda", w: 330, h: 426 },
  { slug: "kemenpu", name: "Kementerian Pekerjaan Umum", scope: "PBG · SLF · Infrastruktur", w: 480, h: 480 },
  { slug: "atr-bpn", name: "Kementerian ATR / BPN", scope: "Sertifikat Tanah · HGB", w: 480, h: 471 },
  { slug: "klh", name: "Kementerian Lingkungan Hidup", scope: "AMDAL · UKL-UPL", w: 960, h: 953 },
  { slug: "kesdm", name: "Kementerian ESDM", scope: "Listrik · Tambang · EBT", w: 479, h: 480 },
  { slug: "djki", name: "DJKI — Kekayaan Intelektual", scope: "Merek · Paten · Hak Cipta", w: 960, h: 258 },
  { slug: "komdigi", name: "Kementerian Komunikasi & Digital", scope: "PSE · Layanan Digital", w: 960, h: 696 },
  { slug: "ojk", name: "Otoritas Jasa Keuangan", scope: "Izin OJK · Fintech", w: 300, h: 91 },
  { slug: "kemenkop", name: "Kementerian Koperasi", scope: "Badan Hukum Koperasi", w: 480, h: 151 },
  { slug: "kemendesa", name: "Kementerian Desa & PDT", scope: "Izin Usaha Desa", w: 480, h: 480 },
];

export default function Agencies() {
  return (
    <section
      id="instansi"
      className="relative scroll-mt-20 border-t border-slate-200 py-24 sm:py-28"
      aria-label="Jaringan instansi pemerintah yang dihadapi dalam pengurusan izin"
    >
      <div
        className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-violet-600/[0.06] blur-[130px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Jaringan instansi resmi"
          title={
            <>
              Satu Meja dengan <span className="text-gradient-gold">Semua Instansi.</span>
            </>
          }
          sub="Pengurusan izin berarti hadir di meja 23 kementerian dan lembaga ini setiap hari. Bukan sekadar daftar nama — melainkan peta instansi resmi yang kami hadapi langsung di balik 36 jenis izin yang kami urus untuk Anda."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {AGENCIES.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 6) * 0.06} className="h-full">
              <div className="group flex h-full flex-col items-center rounded-xl border border-slate-200/70 bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/60 hover:shadow-[0_20px_50px_-20px_rgba(139,92,246,0.28)]">
                <div className="flex h-16 w-full items-center justify-center">
                  <Image
                    src={`/images/agencies/${a.slug}.png`}
                    alt={`Logo resmi ${a.name}`}
                    width={a.w}
                    height={a.h}
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                    className="max-h-16 w-auto object-contain"
                  />
                </div>
                <p className="mt-3 font-display text-[11px] font-bold leading-tight text-zinc-900">
                  {a.name}
                </p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-900">
                  {a.scope}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Perhimpunan profesi — PHI Kwitang & IPHI Pusat */}
        <Reveal delay={0.12}>
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3 rounded-2xl border border-violet-200 bg-violet-600/[0.05] px-6 py-4 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900">
              Terhubung dengan perhimpunan profesi
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-white/60 px-4 py-1.5 text-[12px] font-bold text-violet-700">
              Kantor PHI Kwitang — Jakarta
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-white/60 px-4 py-1.5 text-[12px] font-bold text-violet-700">
              IPHI Pusat — Ikatan Penasihat Hukum Indonesia
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-slate-400">
            Seluruh logo adalah milik resmi instansi masing-masing dan ditampilkan
            semata untuk menggambarkan cakupan pengurusan perizinan — bukan sebagai
            bentuk dukungan atau afiliasi resmi.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
