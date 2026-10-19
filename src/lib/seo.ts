/**
 * GUNARA SEO Core — single source of truth untuk metadata seluruh situs.
 * ----------------------------------------------------------------------------
 * Dipakai bersama oleh:
 *  - src/app/layout.tsx          (metadata root + default)
 *  - src/app/[...slug]/page.tsx  (generateMetadata per rute SSR)
 *  - src/components/site/app.tsx (judul dinamis SPA — paritas dengan SSR)
 *  - src/app/sitemap.ts          (peta URL untuk Google)
 *
 * Prinsip: satu rute = satu title = satu description unik = satu canonical.
 */

import type { Metadata } from "next";
import { BRAND } from "@/data/brand";
import { COUNCILS, SERVICES } from "@/data/content";
import { slugify } from "@/data/extended-types";
import { INDUSTRIES } from "@/data/industries";
import { INSIGHTS } from "@/data/insights";
import { PERIZINAN } from "@/data/perizinan";

/** Domain produksi — override via NEXT_PUBLIC_SITE_URL di Vercel. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://topkonsultan.web.id"
).replace(/\/+$/, "");

export const SITE_NAME = "Gunara Consultan";
export const SITE_LEGAL = BRAND.legal;
export const BASE_TITLE = `${SITE_LEGAL} — ${BRAND.tagline}`;

export const BASE_DESCRIPTION =
  "Gunara Corporation (Gunara Consultan) — konsultan perizinan yang telah menangani 1.524 perusahaan: lokal & nasional, global & dalam negeri, daerah & pusat. Pendirian PT/PMA, NIB OSS RBA, BPOM, halal, SNI, KITAS, PSE, OJK. Respons Senior Konsultan dalam 48 jam.";

/** Gambar sosial bermerek — dilayani route handler /opengraph-image. */
export const OG_IMAGES = [
  { url: "/opengraph-image", width: 1200, height: 630, alt: BASE_TITLE },
];

/**
 * OG image per rute — /api/og merender kartu dengan judul halaman itu sendiri
 * (CTR lebih tinggi dibanding satu gambar global untuk semua halaman).
 */
export function routeOgImages(
  title: string,
  kicker: string,
  description: string,
) {
  const params = new URLSearchParams({
    title,
    kicker,
    desc: description.length > 150 ? `${description.slice(0, 147).trimEnd()}…` : description,
  });
  return [
    { url: `/api/og?${params.toString()}`, width: 1200, height: 630, alt: title },
  ];
}

/** Absolutkan path menjadi URL produksi. */
export const abs = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Judul detail — dipakai SSR (generateMetadata) dan SPA (document.title). */
export const serviceTitle = (s: { title: string }) => `${s.title} — ${SITE_NAME}`;
export const perizinanTitle = (p: { name: string }) =>
  `${p.name} — Gerbang Perizinan — ${SITE_NAME}`;
export const councilTitle = (c: { name: string }) => `Dewan ${c.name} — ${SITE_NAME}`;
export const industryTitle = (i: { name: string }) => `${i.name} — ${SITE_NAME}`;
export const insightTitle = (i: { title: string }) => `${i.title} — ${SITE_NAME}`;

/**
 * Metadata statis per rute tingkat atas — deskripsi unik per halaman
 * (praktik terbaik Google: jangan pernah duplikasi description).
 */
export const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/about": {
    title: `Tentang Kami — ${SITE_NAME}`,
    description:
      "Kenali GUNARA CORPORATION (Gunara Consultan) — konsultan perizinan yang telah menangani 1.524 perusahaan sejak 2001: lokal & nasional, global & dalam negeri, daerah & pusat. 46 Dewan Pakar, satu jawaban menyeluruh.",
  },
  "/services": {
    title: `12 Praktik Layanan — ${SITE_NAME}`,
    description:
      "12 praktik konsultasi kelas dunia: strategi, transformasi digital, perizinan, pajak, SDM, hingga ekspansi global. Satu Partner-in-Chief, satu jawaban menyeluruh.",
  },
  "/perizinan": {
    title: `Gerbang Perizinan — 36+ Jenis Izin — ${SITE_NAME}`,
    description:
      "Gerbang Perizinan 36+ jenis izin: NIB OSS RBA, BPOM, halal, SNI, KITAS, PSE, OJK, ISO. Peta jalan perizinan pertama dalam 48 jam, ketepatan dokumen 99,97%.",
  },
  "/councils": {
    title: `46 Dewan Pakar — ${SITE_NAME}`,
    description:
      "46 Dewan Pakar internasional — quantum strategy, AI, energi, modal, kota, longevity. Setiap dewan membawa 150 tahun penguasaan terdistilasi untuk satu jawaban absolut.",
  },
  "/industries": {
    title: `Industri — ${SITE_NAME}`,
    description:
      "Keahlian industri mendalam: keuangan, teknologi, energi, kesehatan, ritel, manufaktur, infrastruktur, pemerintahan, hingga ruang angkasa & industri perbatasan.",
  },
  "/insights": {
    title: `Wawasan — ${SITE_NAME}`,
    description:
      "Wawasan orisinal pimpinan GUNARA: strategi, AI, alokasi modal, talenta, kedaulatan, dan longevity — ditulis untuk pemimpin yang berani memutuskan.",
  },
  "/careers": {
    title: `Karier — ${SITE_NAME}`,
    description:
      "Karier di GUNARA: bergabung dengan firma konsultan internasional terlengkap. Jalur Partner, Akademi Dewan, dan pengalaman penugasan lintas 190 negara.",
  },
  "/method": {
    title: `Metode Oracle — ${SITE_NAME}`,
    description:
      "Metode Oracle: proses tiga gerbang dari brief hingga jawaban absolut — dewan disusun, bukti dikumpulkan, keputusan dieksekusi sampai desimal terakhir.",
  },
  "/results": {
    title: `Hasil & Bukti — ${SITE_NAME}`,
    description:
      "Hasil & bukti GUNARA: 1.524 perusahaan ditangani, 12.000+ penugasan, tingkat keberhasilan 99,97% — dari pendirian PT hingga ekspansi global ke 190 negara.",
  },
  "/contact": {
    title: `Kontak — ${SITE_NAME}`,
    description:
      "Hubungi GUNARA: WhatsApp +62 813-1651-6524 (24/7), halo@topkonsultan.web.id, 4 kantor resmi Tasikmalaya & Jakarta. Respons Partner-in-Chief dalam 48 jam.",
  },
  "/faq": {
    title: `Pertanyaan Umum — ${SITE_NAME}`,
    description:
      "Pertanyaan umum tentang layanan, perizinan, biaya, dan proses kerja GUNARA CONSULTAN — dijawab lugas dan menyeluruh di satu halaman.",
  },
  "/leadership": {
    title: `Pimpinan & Tata Kelola — ${SITE_NAME}`,
    description:
      "Pimpinan & tata kelola GUNARA: Senior Konsultan Tn. H. Gugun Gunara, MBA beserta jajaran eksekutif — seluruh penagihan atas nama Senior Konsultan, honor berpijak pada keberhasilan klien.",
  },
  "/offices": {
    title: `Kantor Kami — ${SITE_NAME}`,
    description:
      "4 kantor resmi GUNARA: Kantor Pusat Tasikmalaya I, Tasikmalaya II, Jakarta PHI Kwitang, dan Perwakilan IPHI Pusat — peta, arah, dan protokol kunjungan.",
  },
  "/newsroom": {
    title: `Ruang Media — ${SITE_NAME}`,
    description:
      "Ruang Media GUNARA: rilis pers, lembar fakta, media kit resmi, dan kebijakan wawancara — sumber kabar pertama GUNARA CORPORATION (Gunara Consultan).",
  },
  "/resources": {
    title: `Pusat Sumber Daya — ${SITE_NAME}`,
    description:
      "Pusat Sumber Daya GUNARA: checklist pendirian PT 2026, peta jalan perizinan OSS RBA, pustaka dokumen, dan templat — unduh resmi, gratis, tanpa syarat.",
  },
  "/responsibility": {
    title: `Tanggung Jawab & Dampak — ${SITE_NAME}`,
    description:
      "Tanggung jawab & dampak GUNARA: empat pilar integritas, UMKM, pendidikan, dan lingkungan — program Gerbang Sah pro bono serta Jalur Magang Akademi Dewan.",
  },
  "/sitemap": {
    title: `Peta Situs — ${SITE_NAME}`,
    description:
      "Peta situs lengkap GUNARA CONSULTAN: seluruh halaman firma, 12 praktik layanan, 36+ jenis perizinan, dewan pakar, industri, wawasan, dan sumber daya.",
  },
  "/privacy": {
    title: `Kebijakan Privasi — ${SITE_NAME}`,
    description:
      "Kebijakan Privasi GUNARA: bagaimana kami mengumpulkan, memakai, dan melindungi data pribadi Anda — selaras dengan UU PDP Indonesia.",
  },
  "/terms": {
    title: `Syarat & Ketentuan — ${SITE_NAME}`,
    description:
      "Syarat & Ketentuan penggunaan layanan GUNARA CORPORATION: lingkup penugasan, kewajiban klien, kerahasiaan, dan batasan tanggung jawab.",
  },
  "/cookies": {
    title: `Kebijakan Cookie — ${SITE_NAME}`,
    description:
      "Kebijakan Cookie GUNARA: jenis cookie yang dipakai situs, tujuan pemakaiannya, dan cara Anda mengendalikannya sepenuhnya.",
  },
<<<<<<< HEAD
=======
  "/unduh": {
    title: `Pusat Unduhan — ${SITE_NAME}`,
    description:
      "Pusat Unduhan GUNARA: source code lengkap siap jalan, panduan super lengkap PDF, suplemen tutorial, dan panduan HTML interaktif.",
  },
  "/kredit": {
    title: `Kredit & Kepemilikan — Gugun Gunara`,
    description:
      "Sistem GUNARA oleh Gugun Gunara (Muhammad Lutfi Azmi — prabudanling, Santri Angon): master polymath, sage universal, the ultimate problem solver. Support system PT Top Konsultan Internasional (topkonsultan.web.id) & PT Digital Bisnis Manajemen (digiman.id) — plus enam kanal sosial resmi.",
  },
>>>>>>> 0d391b0 (updatesterbaru)
};

/** Judul SPA untuk tiap rute — diambil dari ROUTE_META agar selalu paritas SSR. */
export const ROUTE_TITLES: Record<string, string> = Object.fromEntries(
  Object.entries(ROUTE_META).map(([path, meta]) => [path, meta.title]),
);

/** Rute tingkat atas yang boleh diindeks (tanpa vvip/member/admin). */
export const TOP_PUBLIC_SEGMENTS = [
  "about",
  "services",
  "perizinan",
  "councils",
  "industries",
  "insights",
  "careers",
  "method",
  "results",
  "contact",
  "faq",
  "leadership",
  "offices",
  "newsroom",
  "resources",
  "responsibility",
  "sitemap",
  "privacy",
  "terms",
  "cookies",
<<<<<<< HEAD
=======
  "unduh",
  "kredit",
>>>>>>> 0d391b0 (updatesterbaru)
] as const;

/** Semua kombinasi rute publik — untuk generateStaticParams & sitemap. */
export function allPublicPaths(): string[] {
  const paths: string[] = ["/", ...TOP_PUBLIC_SEGMENTS.map((s) => `/${s}`)];
  for (const s of SERVICES) paths.push(`/services/${s.num}`);
  for (const p of PERIZINAN) paths.push(`/perizinan/${p.slug}`);
  for (const i of INDUSTRIES) paths.push(`/industries/${i.slug}`);
  for (const i of INSIGHTS) paths.push(`/insights/${i.slug}`);
  for (const c of COUNCILS) paths.push(`/councils/${slugify(c.name)}`);
  return paths;
}

/** Varian generateStaticParams untuk app/[...slug]/page.tsx. */
export function staticParamsList(): { slug: string[] }[] {
  return allPublicPaths()
    .filter((p) => p !== "/")
    .map((p) => ({ slug: p.slice(1).split("/") }));
}

/** Set rute publik yang dikenal — untuk guard 404 manual di catch-all. */
const KNOWN_PATH_SET: ReadonlySet<string> = new Set(
  allPublicPaths().filter((p) => p !== "/"),
);

/** true bila segmen slug adalah rute publik yang sah. */
export function isKnownSlug(slug: string[]): boolean {
  return KNOWN_PATH_SET.has("/" + slug.join("/"));
}

/**
 * Metadata per rute SSR — satu objek Metadata penuh:
 * title absolut, description unik, canonical, OpenGraph, Twitter, robots.
 */
export function buildRouteMeta(slug: string[]): Metadata {
  const path = "/" + slug.join("/");
  const [seg1, seg2] = slug;

  // ── Detail: Layanan ──────────────────────────────────────────────────────
  if (seg1 === "services" && seg2) {
    const s = SERVICES.find((x) => x.num === seg2);
    if (s) {
      const description = `${s.desc} Bagian dari 12 praktik konsultasi ${SITE_LEGAL} untuk perusahaan yang menuntut hasil terukur sampai desimal terakhir.`;
      return {
        title: { absolute: serviceTitle(s) },
        description,
        keywords: [s.title, s.enName ?? "", "praktik konsultasi", ...s.tags].filter(
          Boolean,
        ),
        alternates: { canonical: path },
        openGraph: {
          title: serviceTitle(s),
          description,
          url: path,
          type: "website",
          images: routeOgImages(s.title, "12 Praktik Layanan", description),
        },
        twitter: { title: serviceTitle(s), description, images: [routeOgImages(s.title, "12 Praktik Layanan", description)[0].url] },
      };
    }
  }

  // ── Detail: Perizinan ────────────────────────────────────────────────────
  if (seg1 === "perizinan" && seg2) {
    const p = PERIZINAN.find((x) => x.slug === seg2);
    if (p) {
      const description = `${p.tagline} ${p.name} (${p.enName}) ditangani penuh oleh GUNARA: penyusunan dokumen, pengurusan, hingga terbit. Konsultasi via WhatsApp 24/7.`;
      return {
        title: { absolute: perizinanTitle(p) },
        description,
        keywords: [p.name, p.enName, p.agency, "izin", "perizinan Indonesia", "NIB OSS RBA"],
        alternates: { canonical: path },
        openGraph: {
          title: perizinanTitle(p),
          description,
          url: path,
          type: "website",
          images: routeOgImages(p.name, "Gerbang Perizinan", description),
        },
        twitter: { title: perizinanTitle(p), description, images: [routeOgImages(p.name, "Gerbang Perizinan", description)[0].url] },
      };
    }
  }

  // ── Detail: Dewan Pakar ──────────────────────────────────────────────────
  if (seg1 === "councils" && seg2) {
    const c = COUNCILS.find((x) => slugify(x.name) === seg2);
    if (c) {
      const description = `${c.blurb} Dewan ${c.name} adalah satu dari 46 Dewan Pakar ${SITE_LEGAL} — 150 tahun penguasaan terdistilasi.`;
      return {
        title: { absolute: councilTitle(c) },
        description,
        keywords: [c.name, c.category, "dewan pakar", "konsultan internasional"],
        alternates: { canonical: path },
        openGraph: {
          title: councilTitle(c),
          description,
          url: path,
          type: "website",
          images: routeOgImages(`Dewan ${c.name}`, "46 Dewan Pakar", description),
        },
        twitter: { title: councilTitle(c), description, images: [routeOgImages(`Dewan ${c.name}`, "46 Dewan Pakar", description)[0].url] },
      };
    }
  }

  // ── Detail: Industri ─────────────────────────────────────────────────────
  if (seg1 === "industries" && seg2) {
    const i = INDUSTRIES.find((x) => x.slug === seg2);
    if (i) {
      const base = `${i.tagline} ${i.description[0] ?? ""}`;
      const description = base.length > 165 ? `${base.slice(0, 162).trimEnd()}…` : base;
      return {
        title: { absolute: industryTitle(i) },
        description,
        keywords: [i.name, i.enName ?? "", "industri", "konsultan"],
        alternates: { canonical: path },
        openGraph: {
          title: industryTitle(i),
          description,
          url: path,
          type: "website",
          images: routeOgImages(i.name, "Industri", description),
        },
        twitter: { title: industryTitle(i), description, images: [routeOgImages(i.name, "Industri", description)[0].url] },
      };
    }
  }

  // ── Detail: Wawasan (Article) ────────────────────────────────────────────
  if (seg1 === "insights" && seg2) {
    const i = INSIGHTS.find((x) => x.slug === seg2);
    if (i) {
      const description =
        i.excerpt.length > 165 ? `${i.excerpt.slice(0, 162).trimEnd()}…` : i.excerpt;
      return {
        title: { absolute: insightTitle(i) },
        description,
        keywords: [i.title, i.enTitle ?? "", i.category, "wawasan GUNARA"],
        alternates: { canonical: path },
        openGraph: {
          title: insightTitle(i),
          description,
          url: path,
          type: "article",
          publishedTime: i.date,
          authors: [i.author.name],
          images: [{ url: abs(i.cover) }, ...OG_IMAGES],
        },
        twitter: { title: insightTitle(i), description, images: [abs(i.cover)] },
      };
    }
  }

  // ── Rute tingkat atas ────────────────────────────────────────────────────
  const meta = ROUTE_META[path];
  if (!meta) return {};
  const section = meta.title.replace(` — ${SITE_NAME}`, "");
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: path,
      type: "website",
      images: routeOgImages(section, SITE_LEGAL, meta.description),
    },
    twitter: {
      title: meta.title,
      description: meta.description,
      images: [routeOgImages(section, SITE_LEGAL, meta.description)[0].url],
    },
  };
}
