/**
 * GUNARA JSON-LD builders — structured data schema.org untuk Google Rich Results.
 * ----------------------------------------------------------------------------
 * Semua builder murni (pure) — aman dipakai di Server Component maupun client.
 * Dirender lewat <JsonLd /> (src/components/seo/json-ld.tsx).
 *
 * Global (layout):  Organization + WebSite + 3 ProfessionalService (NAP footer)
 * Per rute:         BreadcrumbList (detail), Service, Article, FAQPage
 */

import { BRAND } from "@/data/brand";
import { COUNCILS, SERVICES } from "@/data/content";
import { slugify } from "@/data/extended-types";
import { INDUSTRIES } from "@/data/industries";
import { INSIGHTS } from "@/data/insights";
import { PERIZINAN, PERIZINAN_CATEGORIES } from "@/data/perizinan";
import { FAQS } from "@/data/legal";
import { abs, SITE_LEGAL, SITE_NAME, SITE_URL } from "@/lib/seo";

type LdObject = Record<string, unknown>;

const PHONE_INTL = BRAND.phoneHref.replace(/^tel:/, ""); // +6281316516524

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
  if (seg1 === "perizinan" && seg2) {
    const p = PERIZINAN.find((x) => x.slug === seg2);
    if (p) return [crumbs("Gerbang Perizinan", p.name), perizinanLd(p)];
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
  if (seg1 === "perizinan" && !seg2) return [perizinanCatalogLd()];
  if (seg1 === "councils" && !seg2) return [councilCatalogLd()];
  if (seg1 === "industries" && !seg2) return [industryCatalogLd()];
  return [];
}
