import { SITE_NAME, SITE_URL, abs } from "@/lib/seo";
import { INSIGHTS } from "@/data/insights";

/**
 * GET /feed.xml — RSS 2.0 wawasan GUNARA.
 * ----------------------------------------------------------------------------
 * Manfaat SEO: penemuan konten baru lebih cepat oleh mesin pencari & pembaca
 * feed, sinyal kesegaran, dan jalur distribusi tambahan (Google News RSS,
 * agregator). Didaftarkan di layout.tsx via alternates.types sehingga
 * browser & crawler mendeteksi feed otomatis.
 */

export const runtime = "nodejs";
export const dynamic = "force-static";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function GET() {
  const lastBuild = INSIGHTS[0]?.date ?? new Date().toISOString().slice(0, 10);

  const items = INSIGHTS.map((i) => {
    const link = abs(`/insights/${i.slug}`);
    return `    <item>
      <title>${esc(i.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(i.date).toUTCString()}</pubDate>
      <category>${esc(i.category)}</category>
      <dc:creator>${esc(i.author.name)}</dc:creator>
      <description>${esc(i.excerpt)}</description>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`Wawasan ${SITE_NAME}`)}</title>
    <link>${SITE_URL}</link>
    <atom:link href="${abs("/feed.xml")}" rel="self" type="application/rss+xml"/>
    <description>${esc("Wawasan orisinal pimpinan GUNARA: strategi, perizinan, alokasi modal, dan ekspansi — ditulis untuk pemimpin yang berani memutuskan.")}</description>
    <language>id-ID</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${abs("/logo.svg")}</url>
      <title>${esc(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
