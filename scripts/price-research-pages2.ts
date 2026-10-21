/* Riset harga kompetitor — tahap 3: pendalaman halaman produk kompetitor */
import ZAI from "z-ai-web-dev-sdk";
import { writeFileSync } from "node:fs";

const PAGES = [
  { name: 'legalitas.org-NIB', url: 'https://legalitas.org/jasa-nib-oss' },
  { name: 'legalitas.org-KITAS', url: 'https://legalitas.org/jasa-kitas-pekerja' },
  { name: 'kontrakhukum-home', url: 'https://kontrakhukum.com/' },
  { name: 'kontrakhukum-artikel', url: 'https://kontrakhukum.com/article/budget-minim-ini-tips-mencari-jasa-pembuatan-pt-yang-murah' },
  { name: 'mitraizin-PT', url: 'https://mitraizin.co.id/jasa-pendirian-pt/' },
  { name: 'infiniti-NIB', url: 'https://infiniti.id/jasa-oss-nib' },
  { name: 'sribu-NIB', url: 'https://www.sribu.com/id/law-consultant/nib-creation' },
];

function extractPrices(html: string): string[] {
  const out = new Set<string>();
  const re = /(?:Rp\.?\s?)(\d{1,3}(?:\.\d{3})+|\d+(?:[.,]\d+)?)(\s?(?:juta|jt|rb|ribu|k\b|EUR|USD))?/gi;
  for (const m of html.matchAll(re)) {
    const ctxStart = Math.max(0, (m.index ?? 0) - 130);
    const ctx = html.slice(ctxStart, (m.index ?? 0) + m[0].length + 130).replace(/\s+/g, ' ');
    out.add(`Rp ${m[1]}${m[2] ?? ''}  ||  ...${ctx}...`);
  }
  return [...out];
}

async function main() {
  const zai = await ZAI.create();
  const report: Record<string, unknown> = {};
  for (const p of PAGES) {
    try {
      const res = (await zai.functions.invoke('page_reader', { url: p.url })) as {
        data?: { title?: string; html?: string };
      };
      const html = res.data?.html ?? '';
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ');
      const prices = extractPrices(text);
      report[p.name] = { title: res.data?.title, url: p.url, prices };
      console.log(`\n########## ${p.name} (${res.data?.title}) — ${prices.length} ##########`);
      for (const line of prices.slice(0, 45)) console.log('  ' + line);
    } catch (e) {
      report[p.name] = { url: p.url, error: (e as Error).message };
      console.error(`\n########## ${p.name} GAGAL: ${(e as Error).message}`);
    }
  }
  writeFileSync('/home/z/my-project/notes/competitor-price-extract-2.json', JSON.stringify(report, null, 2));
}
main();
