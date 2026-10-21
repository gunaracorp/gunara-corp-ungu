import type { MetadataRoute } from "next";
import { allPublicPaths, abs } from "@/lib/seo";
import { INSIGHTS } from "@/data/insights";

/**
 * Sitemap XML lengkap — semua rute publik (~144 URL):
 * firma, 12 praktik, 36+ perizinan, 46 dewan, 12 industri, wawasan, dst.
 * Rute privat (vvip/member/admin) sengaja tidak pernah ikut.
 *
 * lastModified: artikel wawasan memakai tanggal terbit masing-masing
 * (sinyal kesegaran akurat), rute lain memakai waktu build.
 */

type Entry = MetadataRoute.Sitemap[number];

const GUNARA: [string, number, Entry["changeFrequency"]][] = [
  ["/", 1.0, "weekly"],
  ["/layanan", 0.9, "weekly"],
  ["/services", 0.9, "monthly"],
  ["/perizinan", 0.9, "weekly"],
  ["/about", 0.8, "monthly"],
  ["/contact", 0.8, "monthly"],
  ["/councils", 0.7, "monthly"],
  ["/industries", 0.7, "monthly"],
  ["/insights", 0.7, "weekly"],
  ["/method", 0.6, "monthly"],
  ["/results", 0.6, "monthly"],
  ["/faq", 0.6, "monthly"],
  ["/resources", 0.6, "weekly"],
  ["/careers", 0.5, "monthly"],
  ["/leadership", 0.5, "monthly"],
  ["/offices", 0.5, "monthly"],
  ["/newsroom", 0.5, "weekly"],
  ["/responsibility", 0.4, "monthly"],
  ["/sitemap", 0.3, "monthly"],
  ["/privacy", 0.2, "yearly"],
  ["/terms", 0.2, "yearly"],
  ["/cookies", 0.2, "yearly"],
];

const DETAIL: Record<string, [number, Entry["changeFrequency"]]> = {
  layanan: [0.8, "monthly"],
  services: [0.8, "monthly"],
  perizinan: [0.8, "monthly"],
  industries: [0.6, "monthly"],
  insights: [0.6, "weekly"],
  councils: [0.4, "monthly"],
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: Entry["changeFrequency"]): Entry => ({
    url: abs(path),
    lastModified: now,
    changeFrequency,
    priority,
  });

  const entries: Entry[] = GUNARA.map(([p, pr, cf]) => entry(p, pr, cf));

  for (const path of allPublicPaths()) {
    const [seg1] = path.slice(1).split("/");
    const cfg = DETAIL[seg1];
    // Hanya rute detail (bersub-segmen) — rute indeks sudah tercakup di GUNARA.
    if (cfg && path.split("/").length > 2) entries.push(entry(path, cfg[0], cfg[1]));
  }

  // Artikel wawasan — lastmod akurat dari tanggal terbit (bukan waktu build).
  for (const i of INSIGHTS) {
    const path = `/insights/${i.slug}`;
    if (!entries.some((e) => e.url === abs(path))) continue;
    const found = entries.find((e) => e.url === abs(path));
    if (found) found.lastModified = new Date(i.date);
  }

  return entries;
}
