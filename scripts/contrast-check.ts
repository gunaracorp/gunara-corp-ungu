/**
 * WCAG 2.2 contrast checker — GUNARA "Zamrud Keberangkatan" palette.
 * Relative luminance per WCAG formula; ratios reported to 2 decimals.
 */
type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255) as RGB;
}
function lum([r, g, b]: RGB): number {
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a: string, b: string): number {
  const [l1, l2] = [lum(hexToRgb(a)), lum(hexToRgb(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const cases: Array<[string, string, number, string]> = [
  // [fg, bg, target, label]
  ["#ffffff", "#047857", 4.5, "CTA primary: putih di atas Zamrud #047857"],
  ["#047857", "#ffffff", 4.5, "Teks/link Zamrud #047857 di atas putih"],
  ["#ffffff", "#065f46", 4.5, "Hover CTA: putih di atas Zamrud tua #065f46"],
  ["#ffffff", "#0f766e", 4.5, "Putih di atas Teal #0f766e (sekunder)"],
  ["#ffffff", "#0e7490", 4.5, "Putih di atas Laut #0e7490 (info/CTA ujung)"],
  ["#ffffff", "#155e75", 4.5, "Putih di atas Laut dalam #155e75"],
  ["#0f172a", "#ffffff", 4.5, "Heading #0f172a di atas putih"],
  ["#0f172a", "#faf9f4", 4.5, "Heading #0f172a di atas gading #faf9f4"],
  ["#334155", "#ffffff", 4.5, "Body #334155 di atas putih"],
  ["#334155", "#faf9f4", 4.5, "Body #334155 di atas gading"],
  ["#64748b", "#ffffff", 4.5, "Muted #64748b di atas putih"],
  ["#64748b", "#faf9f4", 4.5, "Muted #64748b di atas gading"],
  ["#b45309", "#ffffff", 4.5, "Emas teks #b45309 di atas putih"],
  ["#b45309", "#fef3c7", 4.5, "Emas teks #b45309 di atas badge #fef3c7"],
  ["#047857", "#ecfdf5", 4.5, "Teks Zamrud di atas badge #ecfdf5"],
  ["#065f46", "#d1fae5", 4.5, "Teks Zamrud tua di atas badge #d1fae5"],
  ["#be123c", "#ffffff", 4.5, "Error #be123c di atas putih"],
  ["#0e7490", "#ffffff", 4.5, "Info #0e7490 di atas putih"],
  ["#a16207", "#fef9c3", 4.5, "Warning teks #a16207 di atas #fef9c3"],
  ["#ffffff", "#03301f", 4.5, "Putih di atas Zamrud malam #03301f (footer gelap)"],
  // Large text / non-text (3:1)
  ["#047857", "#ffffff", 3.0, "Non-text: fokus ring Zamrud vs putih (3:1)"],
  ["#059669", "#ffffff", 3.0, "Non-text: grafis #059669 vs putih (3:1)"],
  ["#d97706", "#ffffff", 3.0, "Non-text: emas grafis #d97706 vs putih (3:1)"],
  // Info-only prints (not gatekeep)
  ["#10b981", "#ffffff", 3.0, "INFO: #10b981 vs putih"],
  ["#0d9488", "#ffffff", 3.0, "INFO: #0d9488 vs putih"],
  ["#06b6d4", "#ffffff", 3.0, "INFO: #06b6d4 vs putih"],
  ["#22d3ee", "#ffffff", 3.0, "INFO: #22d3ee vs putih"],
  ["#a7f3d0", "#ffffff", 3.0, "INFO: scrollbar #a7f3d0 vs putih"],
];

let pass = 0, fail = 0;
for (const [fg, bg, target, label] of cases) {
  const r = ratio(fg, bg);
  const ok = r >= target;
  ok ? pass++ : fail++;
  console.log(`${ok ? "LULUS " : "GAGAL "} ${r.toFixed(2)}:1 (target ${target}:1) — ${label}`);
}
console.log(`\nTotal: ${pass} lulus, ${fail} gagal dari ${cases.length} kombinasi.`);
