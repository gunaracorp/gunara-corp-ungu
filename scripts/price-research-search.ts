/* Riset harga kompetitor — tahap 1: cari situs kompetitor & halaman harga */
import ZAI from "z-ai-web-dev-sdk";
import { writeFileSync } from "node:fs";

const QUERIES = [
  'jasa pendirian PT murah harga 2025 Indonesia',
  'biaya jasa pendirian PT perusahaan 2025',
  'harga jasa pendaftaran merek DJKI 2025',
  'biaya jasa sertifikasi halal BPJPH 2025',
  'biaya jasa KITAS RPTKA Indonesia 2025',
  'jasa NIB OSS RBA harga',
  'harga jasa pengurusan izin usaha terpercaya',
];

async function main() {
  const zai = await ZAI.create();
  const all: Record<string, unknown[]> = {};
  for (const q of QUERIES) {
    try {
      const results = (await zai.functions.invoke('web_search', {
        query: q,
        num: 10,
      })) as unknown[];
      all[q] = results;
      console.log(`\n=== ${q} ===`);
      for (const r of results as { name?: string; url?: string; snippet?: string }[]) {
        console.log(`- ${r.name} | ${r.url}`);
        if (r.snippet) console.log(`  ${String(r.snippet).slice(0, 200)}`);
      }
    } catch (e) {
      console.error(`FAIL "${q}": ${(e as Error).message}`);
    }
  }
  writeFileSync('/home/z/my-project/notes/competitor-search-results.json', JSON.stringify(all, null, 2));
}
main();
