/**
 * GUNARA JSON-LD builders — structured data schema.org untuk Google Rich Results.
 * ----------------------------------------------------------------------------
 * Semua builder murni (pure) — aman dipakai di Server Component maupun client.
 * Dirender lewat <JsonLd /> (src/components/seo/json-ld.tsx).
 *
 * Global (layout):  Organization + WebSite + 3 ProfessionalService (NAP footer)
 * Per rute:         BreadcrumbList (detail), Service, Article, FAQPage
 */

import { BRAND, OWNER } from "@/data/brand";
import { COUNCILS, SERVICES } from "@/data/content";
import { slugify } from "@/data/extended-types";
import { INDUSTRIES } from "@/data/industries";
import { INSIGHTS } from "@/data/insights";
import { PERIZINAN, PERIZINAN_CATEGORIES } from "@/data/perizinan";
import {
  COMPETITOR_SITES,
  PRICE_COMPARISONS,
  PRICE_RESEARCH_DATE,
} from "@/data/price-comparison";
import { FAQS } from "@/data/legal";
import {
  CATALOG_CATEGORIES,
  SERVICES_CATALOG,
  type CatalogService,
} from "@/data/service-catalog";
import { abs, SITE_LEGAL, SITE_NAME, SITE_URL } from "@/lib/seo";

type LdObject = Record<string, unknown>;

const PHONE_INTL = BRAND.phoneHref.replace(/^tel:/, ""); // +6281316516524

/** Bullets HTML untuk jawaban FAQ — dipakai perizinan & layanan katalog. */
const bullets = (items: readonly string[]) =>
  `<ul>${items.map((s) => `<li>${s}</li>`).join("")}</ul>`;

/** Entitas Person pemilik sistem — dirujuk Organization, WebSite, dan /kredit. */
export function personLd(): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#owner`,
    name: OWNER.name,
    alternateName: [...OWNER.alternateNames],
    givenName: "Muhammad Lutfi",
    familyName: "Azmi",
    honorificPrefix: "H.",
    jobTitle: OWNER.role,
    description: OWNER.about,
    knowsAbout: [
      "konsultan perizinan",
      "perizinan usaha Indonesia",
      "manajemen bisnis",
      "strategi ekspansi pasar",
      "digital business management",
    ],
    url: abs("/kredit"),
    mainEntityOfPage: abs("/kredit"),
    worksFor: { "@id": `${SITE_URL}/#organization` },
    founderOf: { "@id": `${SITE_URL}/#organization` },
    knowsLanguage: ["id", "en"],
    sameAs: [
      ...OWNER.socials.map((s) => s.url),
      ...OWNER.entities.filter((e) => e.url).map((e) => e.url),
    ],
  };
}

/**
 * ProfilePage — HANYA di halaman /kredit: halaman indeksabel yang didedikasikan
 * untuk identitas pemilik, mengikat semua sosial & entitas pendukung.
 */
export function profilePageLd(): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/kredit#profilepage`,
    url: abs("/kredit"),
    name: `Kredit & Kepemilikan — ${OWNER.name}`,
    inLanguage: "id-ID",
    mainEntity: { "@id": `${SITE_URL}/#owner` },
    about: { "@id": `${SITE_URL}/#owner` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

/** Organisasi induk — muncul di seluruh halaman (logo & NAP terlihat di footer). */
export function organizationLd(): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_LEGAL,
    alternateName: [SITE_NAME, "GUNARA CONSULTAN", "Gunara Corporation"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: abs("/logo.svg"),
      caption: SITE_LEGAL,
    },
    foundingDate: String(BRAND.founded),
    description: BRAND.promise,
    slogan: BRAND.tagline,
    email: BRAND.email,
    telephone: PHONE_INTL,
    address: BRAND.addresses.map((a) => ({
      "@type": "PostalAddress",
      streetAddress: a.value,
      addressLocality: a.value.includes("Jakarta") ? "Jakarta" : "Tasikmalaya",
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    })),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: PHONE_INTL,
        email: BRAND.email,
        availableLanguage: ["id", "en"],
        areaServed: ["ID", "World"],
      },
    ],
    areaServed: [
      { "@type": "Country", name: "Indonesia" },
      { "@type": "Place", name: "190 negara (jaringan global)" },
    ],
    knowsLanguage: ["id", "en"],
    founder: { "@id": `${SITE_URL}/#owner` },
    sameAs: [
      ...OWNER.socials.map((s) => s.url),
      ...OWNER.entities.filter((e) => e.url).map((e) => e.url),
    ],
    subOrganization: OWNER.entities.map((e) => ({
      "@type": "Organization",
      name: e.name,
      url: e.url || undefined,
    })),
  };
}

/** Situs — membantu Google memahami entitas utama & bahasa situs. */
export function websiteLd(): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_LEGAL,
    alternateName: SITE_NAME,
    inLanguage: "id-ID",
    publisher: { "@id": `${SITE_URL}/#organization` },
    creator: { "@id": `${SITE_URL}/#owner` },
    author: { "@id": `${SITE_URL}/#owner` },
    description: BRAND.promise,
  };
}

/** Tiga kantor fisik (NAP) — sinyal Local SEO untuk pencarian "konsultan + kota". */
export function localBusinessLd(): LdObject[] {
  const branches = BRAND.addresses.slice(0, 3); // 3 kantor fisik (IPHI = perwakilan, bukan kantor layanan)
  return branches.map((b, idx) => {
    const isJakarta = b.value.includes("Jakarta");
    return {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#office-${idx + 1}`,
      name: `${SITE_LEGAL} — ${b.label}`,
      branchOf: { "@id": `${SITE_URL}/#organization` },
      url: abs("/offices"),
      image: abs("/images/hq.png"),
      logo: abs("/logo.svg"),
      telephone: PHONE_INTL,
      email: BRAND.email,
      priceRange: "$$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: b.value,
        addressLocality: isJakarta ? "Jakarta" : "Tasikmalaya",
        addressRegion: isJakarta ? "DKI Jakarta" : "Jawa Barat",
        addressCountry: "ID",
      },
      areaServed: "ID",
      knowsLanguage: ["id", "en"],
    };
  });
}

/** FAQ — HANYA di halaman /faq (kontennya terlihat di halaman itu; pedoman Google). */
export function faqPageLd(): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faqpage`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * FAQ per jenis izin — HANYA dirender pada halaman detail izin terkait,
 * dengan jawaban yang identik dengan FAQ terlihat di halaman tersebut
 * (pedoman Google: markup harus mencerminkan konten yang tampak).
 *
 * Sumber jawaban murni dari data katalog perizinan (timeline, syarat,
 * priceNote, protokol, masa berlaku) — bukan teks generik.
 */
export function perizinanFaqLd(p: {
  slug: string;
  name: string;
  agency: string;
  timeline: string;
  validity: string;
  priceNote: string;
  requirements: readonly string[];
  process: readonly { step: string; text: string }[];
}): LdObject {
  const qa: { q: string; a: string }[] = [
    {
      q: `Berapa lama proses pengurusan ${p.name}?`,
      a: `Estimasi waktu pengurusan ${p.name} adalah ${p.timeline}, dihitung sejak dokumen lengkap. GUNARA menyusun peta jalan perizinan dalam 48 jam pertama dan menugaskan satu penanggung jawab bernama sampai izin terbit.`,
    },
    {
      q: `Apa saja persyaratan ${p.name}?`,
      a: bullets(p.requirements),
    },
    {
      q: `Berapa biaya pengurusan ${p.name}?`,
      a: `${p.priceNote} Penagihan resmi GUNARA CORPORATION atas nama Senior Konsultan — honor berpijak pada keberhasilan klien.`,
    },
    {
      q: `Bagaimana protokol pengurusan ${p.name} di GUNARA?`,
      a: bullets(p.process.map((s) => `${s.step}. ${s.text}`)),
    },
    {
      q: `Berapa lama masa berlaku ${p.name} dan di mana izinnya diterbitkan?`,
      a: `${p.name} diterbitkan oleh ${p.agency} dengan masa berlaku ${p.validity}. GUNARA juga membantu pemantauan jatuh tempo dan pengurusan perpanjangan.`,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/perizinan/${p.slug}#faqpage`,
    mainEntity: qa.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}

/** Data FAQ yang sama — dipakai UI (perizinan-detail) agar markup = tampilan. */
export function perizinanFaqItems(p: {
  name: string;
  agency: string;
  timeline: string;
  validity: string;
  priceNote: string;
  requirements: readonly string[];
  process: readonly { step: string; text: string }[];
}): { q: string; a: string[] }[] {
  return [
    {
      q: `Berapa lama proses pengurusan ${p.name}?`,
      a: [
        `Estimasi waktu pengurusan ${p.name} adalah ${p.timeline}, dihitung sejak dokumen lengkap. GUNARA menyusun peta jalan perizinan dalam 48 jam pertama dan menugaskan satu penanggung jawab bernama sampai izin terbit.`,
      ],
    },
    { q: `Apa saja persyaratan ${p.name}?`, a: [...p.requirements] },
    {
      q: `Berapa biaya pengurusan ${p.name}?`,
      a: [
        `${p.priceNote} Penagihan resmi GUNARA CORPORATION atas nama Senior Konsultan — honor berpijak pada keberhasilan klien.`,
      ],
    },
    {
      q: `Bagaimana protokol pengurusan ${p.name} di GUNARA?`,
      a: p.process.map((s) => `${s.step}. ${s.text}`),
    },
    {
      q: `Berapa lama masa berlaku ${p.name} dan di mana izinnya diterbitkan?`,
      a: [
        `${p.name} diterbitkan oleh ${p.agency} dengan masa berlaku ${p.validity}. GUNARA juga membantu pemantauan jatuh tempo dan pengurusan perpanjangan.`,
      ],
    },
  ];
}

/** Service — untuk detail layanan katalog (/layanan/<slug>). */
export function catalogServiceLd(s: CatalogService): LdObject {
  const cat = CATALOG_CATEGORIES.find((c) => c.id === s.categoryId);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/layanan/${s.slug}#service`,
    name: s.name,
    alternateName: s.enName,
    serviceType: cat?.name ?? "Konsultan Bisnis",
    description: `${s.tagline} ${s.description}`,
    provider: PROVIDER,
    category: cat?.name,
    areaServed: { "@type": "Country", name: "Indonesia" },
    url: abs(`/layanan/${s.slug}`),
    ...(s.tags.length ? { keywords: s.tags.join(", ") } : {}),
  };
}

/** Katalog layanan — satu ItemList di halaman /layanan. */
export function layananCatalogLd(): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Katalog Layanan GUNARA — 120+ Layanan dalam 12 Kategori",
    numberOfItems: SERVICES_CATALOG.length,
    itemListElement: SERVICES_CATALOG.map((s, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: s.name,
      url: abs(`/layanan/${s.slug}`),
    })),
  };
}

/** FAQ per layanan katalog — jawaban identik dengan FAQ terlihat di halaman. */
export function layananFaqLd(s: CatalogService): LdObject {
  const qa = layananFaqItems(s);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/layanan/${s.slug}#faqpage`,
    mainEntity: qa.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a.join(" ") },
    })),
  };
}

/** Data FAQ layanan katalog — dipakai UI (layanan-detail) agar markup = tampilan. */
export function layananFaqItems(s: CatalogService): { q: string; a: string[] }[] {
  const cat = CATALOG_CATEGORIES.find((c) => c.id === s.categoryId);
  return [
    {
      q: `Apa saja yang termasuk jasa ${s.name} di GUNARA?`,
      a: [bullets(s.deliverables)],
    },
    {
      q: `Berapa lama dan berapa biaya ${s.name}?`,
      a: [
        `Estimasi proses ${s.duration} sejak dokumen lengkap, dengan biaya mulai ${s.priceFrom}. Penawaran final mengikuti kompleksitas kasus — transparan tanpa biaya siluman, dan peta jalan pertama dikirim dalam 48 jam.`,
      ],
    },
    {
      q: `Apa persyaratan memulai ${s.name}?`,
      a: [bullets(s.requirements)],
    },
    {
      q: `Mengapa memilih GUNARA untuk ${cat?.name.toLowerCase() ?? "layanan"} ini?`,
      a: [
        `Setiap penugasan ditangani penanggung jawab bernama di bawah 46 Dewan Pakar ${SITE_LEGAL} — 1.524 perusahaan telah ditangani dengan tingkat kekeliruan dokumen 0,03%. Anda memantau progres kapan pun via WhatsApp dan portal client.`,
      ],
    },
  ];
}

/** Breadcrumb — di setiap halaman detail. */
export function breadcrumbLd(
  items: { name: string; path: string }[],
): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

const PROVIDER = { "@id": `${SITE_URL}/#organization` };

/** Service — untuk detail praktik layanan. */
export function serviceLd(s: {
  num: string;
  title: string;
  desc: string;
  tags?: readonly string[];
}): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services/${s.num}#service`,
    name: s.title,
    serviceType: s.title,
    description: s.desc,
    provider: PROVIDER,
    areaServed: [{ "@type": "Country", name: "Indonesia" }, { "@type": "Place", name: "Global" }],
    url: abs(`/services/${s.num}`),
    ...(s.tags?.length ? { keywords: s.tags.join(", ") } : {}),
  };
}

/** Service + OfferCatalog — untuk detail izin (halaman uang: perizinan). */
export function perizinanLd(p: {
  slug: string;
  name: string;
  enName: string;
  agency: string;
  tagline: string;
  categoryId: string;
}): LdObject {
  const cat = PERIZINAN_CATEGORIES.find((c) => c.id === p.categoryId);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/perizinan/${p.slug}#service`,
    name: p.name,
    alternateName: p.enName,
    serviceType: cat?.name ?? "Perizinan Usaha",
    description: p.tagline,
    provider: PROVIDER,
    category: p.agency,
    areaServed: { "@type": "Country", name: "Indonesia" },
    url: abs(`/perizinan/${p.slug}`),
  };
}

/** Article — untuk detail wawasan (peluang Rich Result artikel & sitelinks). */
export function articleLd(i: {
  slug: string;
  title: string;
  enTitle?: string;
  excerpt: string;
  cover: string;
  date: string;
  author: { name: string; role: string };
}): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/insights/${i.slug}#article`,
    headline: i.title,
    alternativeHeadline: i.enTitle,
    description: i.excerpt,
    image: abs(i.cover),
    datePublished: i.date,
    dateModified: i.date,
    inLanguage: "id-ID",
    author: { "@type": "Person", name: i.author.name, jobTitle: i.author.role },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(`/insights/${i.slug}`) },
  };
}

/** Katalog perizinan — satu ItemList di halaman indeks perizinan. */
export function perizinanCatalogLd(): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Gerbang Perizinan — 36+ Jenis Izin",
    numberOfItems: PERIZINAN.length,
    itemListElement: PERIZINAN.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: p.name,
      url: abs(`/perizinan/${p.slug}`),
    })),
  };
}

/** Katalog dewan — ItemList di halaman /councils. */
export function councilCatalogLd(): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "46 Dewan Pakar",
    numberOfItems: COUNCILS.length,
    itemListElement: COUNCILS.map((c, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: `Dewan ${c.name}`,
      url: abs(`/councils/${slugify(c.name)}`),
    })),
  };
}

/** Katalog industri — ItemList di halaman /industries. */
export function industryCatalogLd(): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Industri yang Dilayani",
    numberOfItems: INDUSTRIES.length,
    itemListElement: INDUSTRIES.map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: i.name,
      url: abs(`/industries/${i.slug}`),
    })),
  };
}

/**
 * FAQ halaman /harga — sumber tunggal UI (harga.tsx) dan JSON-LD FAQPage.
 */
export function hargaFaqItems(): { q: string; a: string[] }[] {
  return [
    {
      q: "Bagaimana GUNARA memastikan harganya paling kompetitif?",
      a: [
        `Kami melakukan riset harga berkala terhadap ${COMPETITOR_SITES.length} platform jasa pendirian & perizinan sejenis (per ${PRICE_RESEARCH_DATE}): Legalitas.org, Izin Kilat, Infiniti.id, Kontrak Hukum, dan MitraIzin. Harga yang dibandingkan adalah harga mulai yang mereka publikasikan sendiri untuk paket setara — bukan angka tidak resmi.`,
        `Hasilnya dipublikasikan terbuka di halaman ini: untuk ${PRICE_COMPARISONS.length} layanan kunci, harga mulai GUNARA berada di bawah harga mulai termurah lima situs tersebut, dengan cakupan pekerjaan yang lebih lengkap.`,
      ],
    },
    {
      q: "Apakah harga di katalog adalah harga final?",
      a: [
        "Harga yang tampil adalah harga mulai (starting price) — titik masuk paket dasar untuk setiap layanan. Rincian final selalu disampaikan dalam proposal tertulis sebelum penugasan, tanpa biaya tersembunyi.",
        "Kompleksitas seperti jumlah pemegang saham, KBLI tambahan, atau jumlah produk dapat menggeser harga ke atas dari angka mulai — dan itu kami sampaikan di awal, bukan di tengah jalan.",
      ],
    },
    {
      q: "Apakah biaya resmi negara sudah termasuk?",
      a: [
        "Tidak — dan kami selalu jujur soal itu. Biaya resmi negara (misalnya tarif pendaftaran merek DJKI Rp 2,8 juta/kelas untuk pemohon umum atau Rp 500 ribu/kelas untuk UMK, tarif BLU BPJPH, atau biaya notaris) dipungut pihak ketiga dan dirinci apa adanya dengan bukti setoran resmi.",
        "Yang kami janjikan: jasa profesional kami tidak pernah menimbun biaya resmi negara. Anda membayar tarif negara sebagaimana adanya — sepeser pun tidak kami tambahi.",
      ],
    },
    {
      q: "Bagaimana cara klaim Garansi Harga Terbaik?",
      a: [
        "Kirimkan tautan atau penawaran resmi kompetitor yang lebih murah untuk paket setara melalui WhatsApp resmi kami. Paket setara berarti lingkup pekerjaan serupa dengan masa proses yang banding.",
        "Tim kami memverifikasi maksimal 1×24 jam. Bila klaim sah, harga kami disamakan dan Anda menerima potongan tambahan 5% — sebagai permintaan maaf atas waktu yang Anda habiskan.",
      ],
    },
    {
      q: "Seberapa sering harga ini ditinjau?",
      a: [
        "Tinjauan harga dilakukan setiap kuartal, dan segera kapan pun tarif resmi negara berubah — misalnya penyesuaian tarif pendaftaran merek DJKI terbaru. Setiap perubahan harga kami langsung tercermin di katalog 120+ layanan tanpa menunggu siklus tinjauan.",
        "Tanggal riset terakhir selalu tercantum di halaman ini supaya Anda bisa memverifikasi kesegaran data.",
      ],
    },
  ];
}

/** JSON-LD halaman /harga — Breadcrumb + FAQPage + ItemList perbandingan. */
export function hargaPageLd(): LdObject[] {
  return [
    breadcrumbLd([
      { name: "Beranda", path: "/" },
      { name: "Harga Terbaik", path: "/harga" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${SITE_URL}/harga#faqpage`,
      mainEntity: hargaFaqItems().map((x) => ({
        "@type": "Question",
        name: x.q,
        acceptedAnswer: { "@type": "Answer", text: x.a.join(" ") },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Perbandingan Harga GUNARA vs 5 Situs Sejenis",
      description: `Harga mulai GUNARA vs harga mulai termurah lima platform sejenis, riset per ${PRICE_RESEARCH_DATE}.`,
      numberOfItems: PRICE_COMPARISONS.length,
      itemListElement: PRICE_COMPARISONS.map((c, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: `${c.name} — GUNARA mulai ${c.ours} (termurah kompetitor: ${c.competitorLowest.price})`,
        url: abs(`/layanan/${c.slug}`),
      })),
    },
  ];
}

/**
 * JSON-LD lengkap untuk satu rute SSR — breadcrumb + entitas utama.
 * Dipakai src/app/[...slug]/page.tsx.
 */
export function pageLd(slug: string[]): LdObject[] {
  const path = "/" + slug.join("/");
  const [seg1, seg2] = slug;
  const crumbs = (section: string, name: string) =>
    breadcrumbLd([
      { name: "Beranda", path: "/" },
      { name: section, path: `/${seg1}` },
      { name, path },
    ]);

  if (seg1 === "services" && seg2) {
    const s = SERVICES.find((x) => x.num === seg2);
    if (s) return [crumbs("12 Praktik Layanan", s.title), serviceLd(s)];
  }
  if (seg1 === "layanan" && seg2) {
    const s = SERVICES_CATALOG.find((x) => x.slug === seg2);
    if (s)
      return [
        crumbs("Katalog Layanan", s.name),
        catalogServiceLd(s),
        layananFaqLd(s),
      ];
  }
  if (seg1 === "perizinan" && seg2) {
    const p = PERIZINAN.find((x) => x.slug === seg2);
    if (p)
      return [
        crumbs("Gerbang Perizinan", p.name),
        perizinanLd(p),
        // Rich Result FAQ — jawaban identik dengan FAQ terlihat di halaman.
        perizinanFaqLd(p),
      ];
  }
  if (seg1 === "councils" && seg2) {
    const c = COUNCILS.find((x) => slugify(x.name) === seg2);
    if (c) return [crumbs("46 Dewan Pakar", `Dewan ${c.name}`)];
  }
  if (seg1 === "industries" && seg2) {
    const i = INDUSTRIES.find((x) => x.slug === seg2);
    if (i) return [crumbs("Industri", i.name)];
  }
  if (seg1 === "insights" && seg2) {
    const i = INSIGHTS.find((x) => x.slug === seg2);
    if (i) return [crumbs("Wawasan", i.title), articleLd(i)];
  }

  // Rute tingkat atas — FAQ mendapat FAQPage (kontennya SSR terlihat penuh).
  if (seg1 === "faq" && !seg2) return [faqPageLd()];
  if (seg1 === "harga" && !seg2) return hargaPageLd();
  if (seg1 === "layanan" && !seg2) return [layananCatalogLd()];
  if (seg1 === "perizinan" && !seg2) return [perizinanCatalogLd()];
  if (seg1 === "councils" && !seg2) return [councilCatalogLd()];
  if (seg1 === "industries" && !seg2) return [industryCatalogLd()];
  return [];
}
