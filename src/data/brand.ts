/**
 * GUNARA CORPORATION — single source of brand truth.
 * Every component, page and document pulls identity facts from here so the
 * brand can never drift.
 */

export const BRAND = {
  /** Full legal entity name */
  legal: "GUNARA CORPORATION",
  /** Wordmark line 1 */
  name: "GUNARA CONSULTAN",
  /** Wordmark line 2 */
  sub: "CORPORATION",
  /** Monogram / logo seed */
  monogram: "GC",

  /** Pimpinan tertinggi — Senior Konsultan; seluruh penagihan atas namanya */
  leader: "Tn. H. Gugun Gunara, MBA",
  leaderShort: "Gugun Gunara, MBA",
  leaderRole: "Senior Konsultan",
  leaderRoleEn: "Senior Consultant",
  billing:
    "Seluruh penawaran, invoice, dan pembayaran ditujukan atas nama Senior Konsultan, Tn. H. Gugun Gunara, MBA.",

  tagline: "Konsultasi & Perizinan Terlengkap di Dunia",
  taglineEn: "The World's Most Complete Consulting & Licensing House",

  promise:
    "Satu gerbang untuk segala izin, strategi, dan eksekusi — dari pendirian PT hingga ekspansi 190 negara.",
  promiseEn:
    "One gateway for every license, strategy and execution — from company incorporation to 190-country expansion.",

  founded: 2001,
  hq: "Tasikmalaya · Jakarta, Indonesia",

  /** Official business line — WhatsApp & telepon satu nomor, aktif 24/7 */
  phone: "+62 813-1651-6524",
  phoneHref: "+6281316516524",
  whatsapp: "+62 813-1651-6524",
  whatsappHref: "https://wa.me/6281316516524",
  whatsappIntl: "6281316516524",
  email: "halo@topkonsultan.web.id",
  emailGlobal: "halo@topkonsultan.web.id",

  /** Kantor pusat — Alamat I */
  address:
    "Perumahan Arjamukti Kencana Raya Blok B7 No. 2, Leuwisari, Arjasari, Tasikmalaya, Jawa Barat",

  /** Empat kantor resmi — tampil di footer, halaman kontak, dan Kantor Kami */
  addresses: [
    {
      label: "Kantor Pusat — Tasikmalaya I",
      short: "Arjamukti, Arjasari",
      value:
        "Perumahan Arjamukti Kencana Raya Blok B7 No. 2, Leuwisari, Arjasari, Kab. Tasikmalaya, Jawa Barat",
    },
    {
      label: "Kantor Tasikmalaya II",
      short: "Andalusia Garden, Mangkubumi",
      value:
        "Perumahan Andalusia Garden, Cluster Granada No. 11, Mangkubumi, Kota Tasikmalaya, Jawa Barat",
    },
    {
      label: "Kantor Jakarta",
      short: "PHI Kwitang, Jakarta Pusat",
      value: "Kantor PHI Kwitang, Kwitang, Senen, Jakarta Pusat, DKI Jakarta",
    },
    {
      label: "Perwakilan IPHI Pusat",
      short: "Ikatan Penasihat Hukum Indonesia",
      value: "Sekretariat IPHI Pusat — Ikatan Penasihat Hukum Indonesia, Jakarta",
    },
  ] as const,

  /** Signature numbers — keep in sync with STATS in content.ts */
  companies: "1.524",
  companiesCaption:
    "Lokal & nasional · global & dalam negeri · daerah & pusat",
  councils: 46,
  yearsMastery: 150,
  yearsCombined: "6.900",
  countries: 190,
  projects: "12.000+",
  success: "99,97%",
  /** Indonesian formatting of the combined expertise promise */
  firstInsightHours: 48,
} as const;

/**
 * OWNER — identitas pribadi pencipta & pemilik sistem (single source of truth).
 * Dipakai oleh: JSON-LD (Person/ProfilePage), metadata layout, footer credit,
 * halaman /kredit, dan README. Nama naik di Google lewat entitas terhubung.
 */
export const OWNER = {
  /** Nama publik / persona utama */
  name: "Gugun Gunara",
  /** Nama lengkap asli */
  fullName: "Muhammad Lutfi Azmi",
  /** Handle / jejak digital utama */
  alias: "prabudanling",
  /** Komunitas / marka jejak */
  community: "Santri Angon",
  /** Semua nama yang dipakai Google untuk mengaitkan entitas */
  alternateNames: [
    "Muhammad Lutfi Azmi",
    "prabudanling",
    "Santri Angon",
    "H. Gugun Gunara MBA",
    "Gunzz Krenzz",
    "bossdanling",
    "gunaracorp",
  ],
  /** Gelar personal — dari sosok master polymath itu sendiri */
  titles: [
    "Master Polymath",
    "Sage Universal",
    "The Ultimate Problem Solver",
  ],
  role: "Pencipta & Pemilik Sistem GUNARA CORPORATION",
  roleEn: "Creator & Owner of the GUNARA CORPORATION System",
  about:
    "Gugun Gunara (Muhammad Lutfi Azmi — prabudanling) adalah master polymath, sage universal, dan the ultimate problem solver: arsitek di balik GUNARA CORPORATION, PT Top Konsultan Internasional, dan PT Digital Bisnis Manajemen.",
  aboutEn:
    "Gugun Gunara (Muhammad Lutfi Azmi — prabudanling) is a master polymath, sage universal and the ultimate problem solver: the architect behind GUNARA CORPORATION, PT Top Konsultan Internasional, and PT Digital Bisnis Manajemen.",

  /** Enam kanal sosial resmi — sameAs JSON-LD + footer + halaman kredit */
  socials: [
    { name: "Facebook", handle: "bossdanling", url: "https://www.facebook.com/bossdanling" },
    { name: "X (Twitter)", handle: "gunzz_krenzz", url: "https://x.com/gunzz_krenzz" },
    { name: "Instagram", handle: "prabudanling", url: "https://www.instagram.com/prabudanling" },
    { name: "TikTok", handle: "gunaracorp", url: "https://www.tiktok.com/@gunaracorp" },
    { name: "Threads", handle: "prabudanling", url: "https://www.threads.com/@prabudanling" },
    { name: "Reddit", handle: "prabudanling", url: "https://www.reddit.com/user/prabudanling/" },
  ] as const,

  /** Entitas & jaringan perusahaan pendukung sistem */
  entities: [
    {
      name: "PT Top Konsultan Internasional",
      site: "topkonsultan.web.id",
      url: "https://topkonsultan.web.id",
      role: "Support system utama — induk GUNARA CORPORATION",
    },
    {
      name: "PT Digital Bisnis Manajemen",
      site: "digiman.id",
      url: "https://digiman.id",
      role: "Support system digital & manajemen bisnis",
    },
    {
      name: "Santri Angon",
      site: "",
      url: "",
      role: "Marka & komunitas jejak digital",
    },
  ] as const,

  /** Baris kredit siap pakai */
  creditLine:
    "by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon",
  supportLine:
    "Support system: PT Top Konsultan Internasional (topkonsultan.web.id) · PT Digital Bisnis Manajemen (digiman.id)",
} as const;

export type Owner = typeof OWNER;
