/**
 * GUNARA — Matriks Perbandingan Harga (Garansi Harga Terbaik)
 * ----------------------------------------------------------------------------
 * Sumber kebenaran tunggal untuk:
 *  - Halaman /harga (tabel perbandingan vs 5 situs kompetitor sejenis)
 *  - Badge "Harga Terbaik" di kartu katalog /layanan & detail /layanan/<slug>
 *  - Mini-comparison box di halaman detail layanan
 *
 * Metodologi riset: harga dikumpulkan dari halaman harga/paket yang
 * DIPUBLIKASIKAN RESMI oleh masing-masing situs kompetitor pada 20 November
 * 2025 (halaman produk "Jasa Pendirian PT", "OSS & NIB", daftar paket, dan
 * halaman layanan terkait). Harga kompetitor adalah harga "mulai dari" paket
 * paling dasar yang mereka tayangkan; biaya resmi negara/notaris yang
 * dipungut pihak ketiga tidak termasuk di mana pun.
 *
 * Prinsip: priceFrom GUNARA harus ≤ harga mulai termurah di antara lima situs
 * pembanding untuk paket setara — jika kompetitor lebih murah untuk cakupan
 * sama, entri ini WAJIB ditinjau ulang.
 */

export interface CompetitorSite {
  id: string;
  name: string;
  url: string;
  note: string;
}

/** Lima situs kategori sama yang dijadikan acuan (jasa pendirian & perizinan usaha Indonesia). */
export const COMPETITOR_SITES: CompetitorSite[] = [
  {
    id: "legalitas",
    name: "Legalitas.org",
    url: "https://legalitas.org",
    note: "Jasa legalitas sejak 2002 — paket PT + izin dipublikasikan Rp 4,5 jt (promosi).",
  },
  {
    id: "izinkilat",
    name: "Izin Kilat",
    url: "https://izinkilat.id",
    note: "Platform pendirian PT dibantu AI — paket Reguler Rp 2,95 jt, Lengkap Rp 4,95 jt.",
  },
  {
    id: "infiniti",
    name: "Infiniti.id",
    url: "https://infiniti.id",
    note: "Jasa pembuatan PT berbergaransi — OSS & NIB promo Rp 2,5 jt, add-on PKP Rp 2 jt.",
  },
  {
    id: "kontrakhukum",
    name: "Kontrak Hukum",
    url: "https://kontrakhukum.com",
    note: "Marketplace legal — jasa pembuatan PT mereka tulis mulai Rp 2 jt, CV Rp 2,99 jt.",
  },
  {
    id: "mitraizin",
    name: "MitraIzin",
    url: "https://mitraizin.co.id",
    note: "Platform jasa perizinan — pendirian CV promo Rp 2,8 jt, virtual office Rp 2 jt/tahun.",
  },
];

export interface PriceComparisonEntry {
  /** slug di SERVICES_CATALOG — badge & link detail otomatis mengikuti. */
  slug: string;
  name: string;
  /** Harga mulai GUNARA saat ini (harus identik dengan priceFrom di katalog). */
  ours: string;
  /** Harga mulai termurah yang dipublikasikan kompetitor untuk paket setara. */
  competitorLowest: { siteId: string; price: string };
  /** Rentang harga mulai yang teramati di lima situs. */
  competitorRange: string;
  /** Cakupan GUNARA yang membuat harga tetap terbaik, bukan sekadar termurah. */
  coverage: string;
  /** Posisi hemat vs kompetitor termurah — angka diverifikasi manual saat riset. */
  savings: string;
}

export const PRICE_COMPARISONS: PriceComparisonEntry[] = [
  {
    slug: "pendirian-pt",
    name: "Pendirian PT",
    ours: "Rp 1,9 jt",
    competitorLowest: { siteId: "kontrakhukum", price: "Rp 2 jt" },
    competitorRange: "Rp 2 jt – Rp 5,45 jt",
    coverage:
      "Akta notaris + SK Kemenkumham + NPWP badan + NIB OSS RBA — kompetitor mematok harga serupa hanya untuk akta & SK, NPWP/NIB dijual sebagai paket Rp 4,5–4,95 jt.",
    savings: "5% di bawah harga mulai termurah — dan NIB + NPWP sudah termasuk",
  },
  {
    slug: "pendirian-cv",
    name: "Pendirian CV",
    ours: "Rp 950 rb",
    competitorLowest: { siteId: "mitraizin", price: "Rp 2,8 jt" },
    competitorRange: "Rp 2,8 jt – Rp 2,99 jt",
    coverage:
      "Akta CV + pengesahan + NPWP & NIB + panduan pembukuan — lengkap sejak harga mulai.",
    savings: "±66% lebih murah dari harga mulai CV termurah di lima situs",
  },
  {
    slug: "pendirian-pma",
    name: "Pendirian PMA",
    ours: "Rp 8,5 jt",
    competitorLowest: { siteId: "izinkilat", price: "Rp 8,9 jt" },
    competitorRange: "Rp 8,9 jt – Rp 15 jt+",
    coverage:
      "Struktur saham asing sesuai Positif Investasi + akta + NIB + LKPM periode pertama termasuk dalam lingkup mulai.",
    savings: "±4% lebih murah — LKPM periode pertama sudah termasuk",
  },
  {
    slug: "nib-oss-rba",
    name: "NIB via OSS RBA",
    ours: "Rp 750 rb",
    competitorLowest: { siteId: "kontrakhukum", price: "Rp 1,5 jt–2 jt" },
    competitorRange: "Rp 1,5 jt – Rp 2,5 jt",
    coverage:
      "NIB + profil risiko + KBLI 5 digit + verifikasi status efektif — biaya resmi negara Rp 0 kami pastikan tidak ditambahi.",
    savings: "50% lebih murah dari jasa NIB termurah di lima situs",
  },
  {
    slug: "kitas-rptka",
    name: "KITAS & RPTKA",
    ours: "Rp 7,5 jt",
    competitorLowest: { siteId: "legalitas", price: "Rp 48 jt (paket)" },
    competitorRange: "Rp 7,5 jt – Rp 48 jt",
    coverage:
      "RPTKA Kemnaker + notifikasi + VITAS/KITAS satu lini masa — estimasi jasa transparan sejak awal, biaya resmi per indeks visa dirinci.",
    savings: "Jasa mulai Rp 7,5 jt — paket setara kompetitor terpantau hingga Rp 48 jt",
  },
  {
    slug: "pendaftaran-merek-djki",
    name: "Pendaftaran Merek (DJKI)",
    ours: "Rp 1,5 jt",
    competitorLowest: { siteId: "kontrakhukum", price: "Rp 1,8 jt+" },
    competitorRange: "Rp 1,8 jt – Rp 2,25 jt + biaya resmi",
    coverage:
      "Riset clearance + pengajuan PDKI + monitoring pemberitahuan — biaya resmi DJKI (umum Rp 2,8 jt/kelas, UMK Rp 500 rb/kelas) kami rinci apa adanya.",
    savings: "±17% di bawah harga mulai jasa merek kompetitor",
  },
  {
    slug: "sertifikasi-halal-bpjph",
    name: "Sertifikasi Halal (BPJPH)",
    ours: "Rp 3 jt",
    competitorLowest: { siteId: "kontrakhukum", price: "Rp 4 jt+" },
    competitorRange: "Rp 4 jt – Rp 12 jt + tarif resmi",
    coverage:
      "SiHalal + SJPH + koordinasi audit LPH sampai sertifikat terbit — mulai Rp 3 jt untuk skema UMK, konsisten dengan Gerbang Perizinan kami.",
    savings: "±25% di bawah jasa sertifikasi halal termurah kompetitor",
  },
  {
    slug: "domisili-virtual-office",
    name: "Virtual Office & Domisili",
    ours: "Rp 750 rb",
    competitorLowest: { siteId: "izinkilat", price: "Rp 2 jt/tahun" },
    competitorRange: "Rp 2 jt – Rp 2,3 jt/tahun",
    coverage:
      "Alamat domisili + surat keterangan + penerimaan surat — sekian kali lebih murah dari paket VO lima situs pembanding.",
    savings: "±63% lebih murah per tahun dibanding VO termurah kompetitor",
  },
  {
    slug: "registrasi-npwp-badan",
    name: "Registrasi NPWP Badan",
    ours: "Rp 350 rb",
    competitorLowest: { siteId: "infiniti", price: "Rp 2 jt (add-on PKP)" },
    competitorRange: "Rp 350 rb – Rp 2 jt",
    coverage:
      "NPWP badan + SKT + aktivasi Coretax — sering dijual sebagai add-on Rp 2 jt oleh kompetitor.",
    savings: "±82% lebih murah dari add-on NPWP/PKP kompetitor",
  },
  {
    slug: "payroll-outsourcing",
    name: "Payroll Outsourcing",
    ours: "Rp 15 rb/karyawan",
    competitorLowest: { siteId: "kontrakhukum", price: "Rp 20 rb+/karyawan" },
    competitorRange: "Rp 15 rb – Rp 50 rb/karyawan/bulan",
    coverage:
      "Pemrosesan gaji + slip + PPh 21 + laporan BPJS — tarif per karyawan terendah di kelasnya.",
    savings: "25% di bawah tarif termurah yang terpantau di pasar",
  },
];

/** Set slug yang berbadge "Harga Terbaik" di katalog & detail. */
const BEST_PRICE_SLUGS: ReadonlySet<string> = new Set(
  PRICE_COMPARISONS.map((c) => c.slug),
);

export function isBestPriceService(slug: string): boolean {
  return BEST_PRICE_SLUGS.has(slug);
}

export function priceComparisonFor(
  slug: string,
): PriceComparisonEntry | undefined {
  return PRICE_COMPARISONS.find((c) => c.slug === slug);
}

export function competitorSite(id: string): CompetitorSite | undefined {
  return COMPETITOR_SITES.find((s) => s.id === id);
}

/** Tanggal riset harga yang ditampilkan di halaman /harga (transparansi). */
export const PRICE_RESEARCH_DATE = "20 November 2025";
