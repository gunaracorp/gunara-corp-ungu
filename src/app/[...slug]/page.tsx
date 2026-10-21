import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteApp from "@/components/site/app";
import { JsonLd } from "@/components/seo/json-ld";
import { pageLd } from "@/lib/seo-ld";
import { buildRouteMeta, isKnownSlug, staticParamsList } from "@/lib/seo";
import { isConsoleSegment } from "@/lib/routes";

/**
 * Rute path nyata untuk SEMUA halaman publik — pendorong SEO utama.
 * ----------------------------------------------------------------------------
 * Google tidak mengindeks konten di balik hash (#/faq). Rute ini menghadirkan
 * URL kanonik yang ter-SSR penuh ("topkonsultan.web.id/faq") dengan konten
 * nyata di HTML, metadata unik per rute, dan JSON-LD terkait.
 *
 * SPA tetap berjalan normal: server merender tampilan sesuai path, lalu
 * navigasi hash (#/…) melanjutkan tanpa reload (lihat lib/router.tsx).
 *
 * PEMISAHAN PUBLIK vs INTERNAL: segmen konsol (admin, karyawan, client,
 * member, vvip) juga dilayani di path nyata agar dapat dibookmark, tetapi
 * SELALU noindex — tidak pernah masuk sitemap, tidak pernah mendapat
 * canonical, dan diblokir robots.txt. Shell konsol yang berbeda dipilih
 * otomatis oleh SiteApp (lihat lib/routes.ts).
 *
 * 404 ditangani MANUAL lewat notFound() — bukan `dynamicParams = false`.
 * (dynamicParams=false memicu NoFallbackError internal Next 16 yang
 * menjatuhkan server standalone saat melayani 404; notFound() memproduksi
 * status 404 yang sama lewat jalur normal.)
 */

export function generateStaticParams() {
  return staticParamsList();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Ruang internal: selalu noindex + nofollow, tanpa canonical, tanpa OG.
  if (isConsoleSegment(slug[0])) {
    return {
      title: { absolute: "Area Internal — Gunara Corporation" },
      robots: { index: false, follow: false, nocache: true },
    };
  }

  if (!isKnownSlug(slug)) return {};
  return buildRouteMeta(slug);
}

export default async function PublicRoutePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  // Ruang internal boleh dilayani di path nyata, tetapi tanpa JSON-LD publik.
  if (isConsoleSegment(slug[0])) {
    return <SiteApp initialPath={"/" + slug.join("/")} />;
  }

  if (!isKnownSlug(slug)) notFound();
  const ld = pageLd(slug);
  return (
    <>
      {ld.length > 0 ? <JsonLd data={ld} /> : null}
      <SiteApp initialPath={"/" + slug.join("/")} />
    </>
  );
}
