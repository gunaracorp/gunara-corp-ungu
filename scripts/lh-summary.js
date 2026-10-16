#!/usr/bin/env node
// lh-summary.js — ringkas hasil Lighthouse JSON: skor, metrik inti, peluang & diagnostic utama.
const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('usage: node lh-summary.js <report.json>'); process.exit(1); }
const r = JSON.parse(fs.readFileSync(file, 'utf8'));

const fmtMs = v => (v >= 1000 ? (v / 1000).toFixed(2) + ' s' : Math.round(v) + ' ms');
const cat = r.categories;
const line = k => {
  const a = cat[k];
  return a ? `${a.score === null ? 'n/a' : Math.round(a.score * 100)}` : '-';
};
console.log(`\n===== ${r.finalDisplayedUrl} [${r.configSettings.formFactor}, emulasi ${r.configSettings.screenEmulation.mobile ? 'Moto G Power' : 'desktop'}] =====`);
console.log(`Skor  → Performance: ${line('performance')} | A11y: ${line('accessibility')} | Best-Practices: ${line('best-practices')} | SEO: ${line('seo')}`);

const m = r.audits;
const metrics = [
  ['first-contentful-paint', 'FCP'], ['largest-contentful-paint', 'LCP'],
  ['total-blocking-time', 'TBT'], ['cumulative-layout-shift', 'CLS'],
  ['speed-index', 'SI'], ['interactive', 'TTI (lab)'],
];
console.log('Metrik:');
for (const [id, label] of metrics) {
  if (m[id]) console.log(`  ${label.padEnd(10)} ${fmtMs(m[id].numericValue).padEnd(9)} (target ${m[id].displayValue || '-'})`);
}

const show = (ids, title) => {
  const rows = ids
    .map(id => m[id])
    .filter(a => a && a.score !== null && a.score < 0.9 && a.details && (a.details.overallSavingsMs > 0 || a.details.overallSavingsBytes > 0 || (a.numericValue > 0)))
    .sort((a, b) => (b.details.overallSavingsMs || 0) - (a.details.overallSavingsMs || 0))
    .slice(0, 8);
  if (!rows.length) return;
  console.log(`${title}:`);
  for (const a of rows) {
    const ms = a.details.overallSavingsMs ? ` ~${Math.round(a.details.overallSavingsMs)}ms` : '';
    const kb = a.details.overallSavingsBytes ? ` ~${Math.round(a.details.overallSavingsBytes / 1024)}KB` : '';
    console.log(`  [${Math.round(a.score * 100)}] ${a.title}${ms}${kb}`);
  }
};
show(['render-blocking-resources', 'unused-javascript', 'unused-css-rules', 'modern-image-formats', 'uses-optimized-images', 'uses-responsive-images', 'offscreen-images', 'uses-text-compression', 'uses-webp-images', 'mainthread-work-breakdown', 'bootup-time', 'dom-size', 'font-display', 'third-party-summary', 'lcp-lazy-loaded', 'prioritize-lcp-image', 'uses-long-cache-ttl', 'total-byte-weight', 'duplicated-javascript', 'legacy-javascript'], 'Peluang / Diagnostic');

// Elemen LCP untuk konteks
const lcpEl = m['largest-contentful-paint-element'];
if (lcpEl && lcpEl.details && lcpEl.details.items && lcpEl.details.items[0] && lcpEl.details.items[0].items && lcpEl.details.items[0].items[0]) {
  const node = lcpEl.details.items[0].items[0].node;
  if (node) console.log(`Elemen LCP: ${String(node.selector || node.snippet || '').slice(0, 120)}`);
}
