/* Riset harga kompetitor — tahap 2: baca halaman harga 5 kompetitor */
import ZAI from "z-ai-web-dev-sdk";
import { writeFileSync } from "node:fs";

const PAGES = [
  { name: 'legalitas.org', url: 'https://legalitas.org/perseroan-terbatas' },
  { name: 'kontrakhukum.com', url: 'https://kontrakhukum.com/harga/' },
  { name: 'mitraizin.co.id', url: 'https://mitraizin.co.id/' },
  { name: 'infiniti.id', url: 'https://infiniti.id/jasa-pembuatan-pt' },
  { name: 'izinkilat.id', url: 'https://izinkilat.id/jasa-pembuatan-pt' },
];

function extractPrices(html: string): string[] {
  const out = new Set<string>();
  // Rp patterns incl. juta/jt/rb formats and dot/thousand separators
  const re = /(?:Rp\.?\s?)(\d{1,3}(?:\.\d{3})+|\d+(?:[.,]\d+)?)(\s?(?:juta|jt|rb|ribu|k\b|EUR|USD))?/gi;
  const matches = html.matchAll(re);
  for (const m of matches) {
    const ctxStart = Math.max(0, (m.index ?? 0) - 120);
    const ctx = html.slice(ctxStart, (m.index ?? 0) + m[0].length + 120).replace(/\s+/g, ' ');
    out.add(`Rp ${m[1]}${m[2] ?? ''}  ||  ...${ctx}...`);
  }
  return [...out];
}

async function main() {
  const zai = await ZAI.create();
  const report: Record<string, { title?: string; prices: string[]; error?: string }> = {};
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
      report[p.name] = { title: res.data?.title, prices };
      console.log(`\n########## ${p.name} (${res.data?.title}) — ${prices.length} harga ditemukan ##########`);
      for (const line of prices.slice(0, 60)) console.log('  ' + line);
    } catch (e) {
      report[p.name] = { prices: [], error: (e as Error).message };
      console.error(`\n########## ${p.name} GAGAL: ${(e as Error).message}`);
    }
  }
  writeFileSync('/home/z/my-project/notes/competitor-price-extract.json', JSON.stringify(report, null, 2));
}
main();
