#!/usr/bin/env node
// lh-dig.js — bedah detail JSON Lighthouse: elemen LCP, JS terbesar, bootup, main-thread, payload.
const fs = require('fs');
const file = process.argv[2];
const r = JSON.parse(fs.readFileSync(file, 'utf8'));
const m = r.audits;

console.log(`\n########## ${file.replace(/^.*\//, '')} ##########`);

// 1. Elemen LCP
try {
  const items = m['largest-contentful-paint-element'].details.items;
  const node = items[0].items[0].node;
  console.log(`\n[LCP] selector: ${node.selector}`);
  console.log(`[LCP] snippet : ${String(node.snippet).slice(0, 220)}`);
  // fase LCP jika ada
  const phases = items[1] && items[1].items;
  if (phases) for (const p of phases) console.log(`[LCP fase] ${p.phase}: ${Math.round(p.timing)}ms (${Math.round(p.percent)}%)`);
} catch (e) { console.log('[LCP] detail tidak tersedia'); }

// 2. Bootup time — JS paling berat di main thread
try {
  const items = m['bootup-time'].details.items;
  console.log('\n[JS bootup] top 10 (main-thread):');
  for (const it of items.slice(0, 10)) console.log(`  ${String(it.url).replace(/^.*\//, '').slice(0, 60).padEnd(62)} total ${Math.round(it.total)}ms  script ${Math.round(it.scripting)}ms`);
} catch (e) {}

// 3. Unused JavaScript
try {
  const items = m['unused-javascript'].details.items;
  console.log('\n[Unused JS] top 10:');
  for (const it of items.slice(0, 10)) console.log(`  ${String(it.url).replace(/^.*\//, '').slice(0, 60).padEnd(62)} waste ${Math.round(it.wastedBytes / 1024)}KB / ${Math.round(it.totalBytes / 1024)}KB  (${Math.round(it.wastedPercent)}%)`);
} catch (e) {}

// 4. Main-thread breakdown
try {
  const items = m['mainthread-work-breakdown'].details.items;
  console.log('\n[Main-thread] breakdown:');
  for (const it of items.slice(0, 8)) console.log(`  ${it.groupLabel.padEnd(28)} ${Math.round(it.duration)}ms`);
} catch (e) {}

// 5. Payload total & resource terbesar
try {
  const items = m['network-requests'].details.items;
  const total = items.reduce((s, i) => s + i.transferSize, 0);
  console.log(`\n[Network] ${items.length} request, transfer total ${(total / 1024).toFixed(0)}KB`);
  const byType = {};
  for (const i of items) { byType[i.resourceType] = (byType[i.resourceType] || 0) + i.transferSize; }
  for (const [t, v] of Object.entries(byType).sort((a, b) => b[1] - a[1])) console.log(`  ${t.padEnd(14)} ${(v / 1024).toFixed(0)}KB`);
  console.log('[Network] 12 terbesar:');
  for (const i of items.slice().sort((a, b) => b.transferSize - a.transferSize).slice(0, 12)) console.log(`  ${(i.transferSize / 1024).toFixed(0).padStart(5)}KB  ${i.resourceType.padEnd(9)} ${String(i.url).replace(/^.*topkonsultan\.web\.id/, '').replace(/^https?:\/\/[^/]+/, '').slice(0, 70)}`);
} catch (e) {}

// 6. Gambar di luar viewport / lazy LCP
try {
  if (m['prioritize-lcp-image'] && m['prioritize-lcp-image'].score !== null && m['prioritize-lcp-image'].score < 1) console.log(`\n[LCP img] ${m['prioritize-lcp-image'].title} — ${m['prioritize-lcp-image'].displayValue || ''}`);
  if (m['lcp-lazy-loaded'] && m['lcp-lazy-loaded'].score !== null && m['lcp-lazy-loaded'].score < 1) console.log(`\n[LCP img] LCP di-lazyload!`);
} catch (e) {}
