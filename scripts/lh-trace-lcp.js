#!/usr/bin/env node
// lh-trace-lcp.js — dari trace mentah Lighthouse: kapan elemen LCP pertama kali di-paint,
// long tasks 0-5s, dan frame paint events.
const fs = require('fs');
const trace = JSON.parse(fs.readFileSync(process.argv[2] || '/home/z/my-project/lighthouse/trace-run-0.trace.json', 'utf8'));
const evs = trace.traceEvents || trace;

const ts0 = evs.find(e => e.name === 'navigationStart' || e.name === 'ResourceSendRequest')?.ts || evs[0].ts;
const rel = ts => (ts - ts0) / 1000; // ms

// 1. Long tasks
const tasks = evs.filter(e => e.name === 'RunTask' && e.dur > 50000);
console.log('Long tasks (>50ms):');
for (const t of tasks.slice(0, 15)) console.log(`  ${rel(t.ts).toFixed(0)}ms +${(t.dur / 1000).toFixed(0)}ms`);

// 2. Paint events (first paint, first contentful paint, largest contentful paint updates)
const paints = evs.filter(e => e.name === 'paintTiming' || /largestContentfulPaint|firstPaint|firstContentfulPaint/i.test(e.name));
console.log('\nPaint/LCP events:');
for (const p of paints.slice(0, 12)) {
  const d = p.args && p.args.data || {};
  console.log(`  ${rel(p.ts).toFixed(0)}ms  ${p.name}  ${JSON.stringify(d).slice(0, 140)}`);
}

// 3. major layout / style recalc
const recalc = evs.filter(e => e.name === 'ScheduleStyleRecalculation' || e.name === 'RecalculateStyles' && e.dur > 100000);
console.log('\nRecalculateStyles >100ms:');
for (const t of recalc.slice(0, 8)) console.log(`  ${rel(t.ts).toFixed(0)}ms +${(t.dur / 1000).toFixed(0)}ms`);

// 4. UpdateLayerTree / Frame
const frames = evs.filter(e => e.name === 'RequestAnimationFrame' || e.name === 'FireAnimationFrame');
console.log(`\nRAF events: ${frames.length}`);
