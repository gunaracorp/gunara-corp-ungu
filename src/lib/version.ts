/**
 * GUNARACORP — VERSION REGISTRY (Single Source of Truth)
 * ======================================================
 * Setiap rilis WAJIB terdaftar di tiga tempat yang saling terkait:
 *   1. RELEASES (berkas ini) — data versi programatik
 *   2. CHANGELOG.md          — riwayat manusia (format "Keep a Changelog")
 *   3. worklog.md §1         — registri rilis operasional (tag per entri kerja)
 *
 * ATURAN NAIK VERSI — Semantic Versioning 2.0.0 (semver.org):
 *   MAJOR — perubahan identitas merek / struktur yang memutus kompatibilitas
 *   MINOR — fitur, halaman, atau integrasi baru yang kompatibel ke belakang
 *   PATCH — perbaikan bug, kebersihan permukaan publik, perbaikan dokumen
 *
 * KONSUMEN VERSI (semua membaca dari berkas ini / package.json):
 *   1. package.json        → "version"  (disinkronkan setiap rilis)
 *   2. GET /api/version    → metadata machine-readable (JSON)
 *   3. Footer situs publik → chip "GunaraCorp vX.Y.Z — Kode"
 *   4. README.md           → badge Release di kepala dokumen
 *
 * CATATAN TANGGAL: entri pra-v1.4.0 memakai presisi bulan (2026-10) karena
 * riwayat kalender harian tidak terekam sebelum sistem versi diaktifkan.
 * JANGAN mengarang tanggal presisi untuk rilis lama.
 */

export const APP_VERSION = "1.4.0";

export const VERSION_META = {
  service: "gunaracorp",
  version: APP_VERSION,
  codename: "Kronika",
  /** Satu baris makna nama kode rilis aktif. */
  codenameMeaning: "Kronika — kitab pencatatan; rilis pendirian tata kelola versi",
  releasedAt: "2026-10-22",
  channel: "stable",
  semver: "2.0.0",
  owner: "Gunara Corporation",
} as const;

export interface ReleaseEntry {
  /** Versi SemVer, mis. "1.4.0". */
  version: string;
  /** Nama kode rilis (konvensi: satu kata, bernuansa Nusantara/kitab). */
  codename: string;
  /** "YYYY-MM-DD" untuk rilis ≥ v1.4.0; "YYYY-MM" untuk yang lebih lama. */
  date: string;
  channel: "stable" | "pre";
  /** [ringkasan ID, ringkasan EN] — maksimal ±15 kata per bahasa. */
  highlights: [string, string];
}

/** Registri rilis — entri TERBARU di atas. Urutan = urutan historis. */
export const RELEASES: readonly ReleaseEntry[] = [
  {
    version: "1.4.0",
    codename: "Kronika",
    date: "2026-10-22",
    channel: "stable",
    highlights: [
      "Tata kelola versi: SemVer registry, CHANGELOG.md, API /api/version, chip versi di footer, README v3, paket di-rename gunaracorp",
      "Version governance: SemVer registry, CHANGELOG.md, /api/version endpoint, footer version chip, README v3, package renamed gunaracorp",
    ],
  },
  {
    version: "1.3.0",
    codename: "Zamrud Keberangkatan",
    date: "2026-10",
    channel: "stable",
    highlights: [
      "Sistem warna v2: zamrud #047857 identitas utama — audit 1.046 pemakaian, uji kontras WCAG 2.2 numerik, alias token @theme",
      "Color system v2: emerald #047857 brand — audited 1,046 usages, numeric WCAG 2.2 contrast gate, @theme token aliasing",
    ],
  },
  {
    version: "1.2.1",
    codename: "Gerbang Bersih",
    date: "2026-10",
    channel: "stable",
    highlights: [
      "Hotfix: seluruh pintu unduh internal dibuang dari permukaan publik (navbar desktop+mobile, footer); /unduh tetap internal",
      "Hotfix: all internal download entry points removed from public surface (desktop+mobile navbar, footer); /unduh kept internal",
    ],
  },
  {
    version: "1.2.0",
    codename: "Dunia Dua",
    date: "2026-10",
    channel: "stable",
    highlights: [
      "Pemisahan tegas Situs Publik vs Gunara Console (5 portal internal), path nyata noindex, README rewrite, audit penuh semua halaman",
      "Hard split Public Site vs Gunara Console (5 internal portals), noindex real paths, README rewrite, full site audit",
    ],
  },
  {
    version: "1.1.0",
    codename: "Katalog Raksasa",
    date: "2026-10",
    channel: "stable",
    highlights: [
      "Rebrand GUNARA CORPORATION, katalog 120 layanan + halaman /layanan, riset harga 5 kompetitor + garansi harga terbaik, SEO maksimal",
      "GUNARA CORPORATION rebrand, 120-service catalog + /layanan pages, 5-competitor pricing research + best-price guarantee, SEO maximized",
    ],
  },
  {
    version: "1.0.0",
    codename: "Summit",
    date: "2026-10",
    channel: "stable",
    highlights: [
      "RILIS STABIL PERTAMA: paket SEO internasional (255 URL SSG, sitemap, JSON-LD, OG) + perbaikan akar masalah performa Lighthouse",
      "FIRST STABLE RELEASE: international SEO package (255 SSG URLs, sitemap, JSON-LD, OG) + Lighthouse performance root-cause fixes",
    ],
  },
  {
    version: "0.9.0",
    codename: "Gerbang Terpilih",
    date: "2026-10",
    channel: "pre",
    highlights: [
      "Oracle menjadi lounge eksklusif VVIP berkode akses, dashboard CEO + member, 6 halaman internasional yang hilang dibangun",
      "Oracle became exclusive VVIP lounge with access code, CEO + member dashboards, 6 missing international-standard pages built",
    ],
  },
  {
    version: "0.8.0",
    codename: "Bright Executive",
    date: "2026-10",
    channel: "pre",
    highlights: [
      "Rebrand tema gelap → terang yang enak dipandang; identitas ungu-biru menjadi aksen",
      "Dark → bright executive theme rebrand; violet-blue identity kept as accent",
    ],
  },
  {
    version: "0.7.0",
    codename: "Skybridge",
    date: "2026-10",
    channel: "pre",
    highlights: [
      "Deploy produksi Vercel: AI berbasis env + fallback anti-rusak, anti 'No Production Deployment', README bilingual futuristik",
      "Vercel production deploy: env-based AI + safe fallback, anti 'No Production Deployment', futuristic bilingual README",
    ],
  },
  {
    version: "0.6.0",
    codename: "Identitas Ungu-Biru",
    date: "2026-10",
    channel: "pre",
    highlights: [
      "Kontak resmi (WA, email, 4 alamat), rebrand ungu-biru, logo mitra instansi resmi",
      "Official contacts (WhatsApp, email, 4 addresses), violet-blue rebrand, official agency partner logos",
    ],
  },
  {
    version: "0.5.0",
    codename: "Restorasi",
    date: "2026-10",
    channel: "pre",
    highlights: [
      "Repo topkonsultan terpasang & terverifikasi E2E di sandbox, branding 8 foto asli (optimasi 9MB→316KB), logo instansi RI",
      "topkonsultan repo installed & E2E-verified in sandbox, branding with 8 real photos (9MB→316KB), RI agency logos",
    ],
  },
  {
    version: "0.4.0",
    codename: "Kepemimpinan",
    date: "2026-10",
    channel: "pre",
    highlights: [
      "Gugun Gunara ditetapkan pimpinan perusahaan + README kelas dunia pertama",
      "Gugun Gunara established as company leader + first world-class README",
    ],
  },
  {
    version: "0.3.0",
    codename: "Gerbang Perizinan",
    date: "2026-10",
    channel: "pre",
    highlights: [
      "Katalog 36 izin (8 kategori), terjemahan Indonesia premium menyeluruh, rebrand PT TOP KONSULTAN INTERNASIONAL",
      "36-permit catalog (8 categories), full premium Indonesian translation, rebrand to PT TOP KONSULTAN INTERNASIONAL",
    ],
  },
  {
    version: "0.2.0",
    codename: "Ekspansi",
    date: "2026-10",
    channel: "pre",
    highlights: [
      "One-pager menjadi website multi-halaman penuh — setiap tautan hidup",
      "One-pager expanded into a full multi-page website — every link alive",
    ],
  },
  {
    version: "0.1.0",
    codename: "Genesis",
    date: "2026-10",
    channel: "pre",
    highlights: [
      "Pembangunan pertama 'Omniprime Global Advisory': 46 Council of Experts, Oracle AI (Z.AI GLM), design system dark-luxury",
      "First build 'Omniprime Global Advisory': 46 Council of Experts, Oracle AI (Z.AI GLM), dark-luxury design system",
    ],
  },
];

/** "v1.4.0 — Kronika" — format tampil untuk chip/badge. */
export function formatVersion(meta: { version: string; codename: string } = VERSION_META): string {
  return `v${meta.version} — ${meta.codename}`;
}

/** Cari entri rilis berdasarkan versi, mis. getRelease("1.3.0"). */
export function getRelease(version: string): ReleaseEntry | undefined {
  return RELEASES.find((r) => r.version === version);
}
