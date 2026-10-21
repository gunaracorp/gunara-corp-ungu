import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * robots.txt dinamis — mendorong crawling penuh untuk situs publik,
 * memblokir seluruh ruang internal (konsol: admin, karyawan, client,
 * member, vvip) & API, dan menunjuk sitemap XML untuk penemuan otomatis
 * 250+ URL publik. Halaman konsol juga memakai meta noindex sebagai
 * lapisan kedua (lihat app/[...slug]/page.tsx + lib/routes.ts).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/admin/*",
          "/karyawan",
          "/karyawan/*",
          "/client",
          "/client/*",
          "/member",
          "/member/*",
          "/vvip",
          "/vvip/*",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
