/**
 * Konstanta & util murni WhatsApp — aman diimpor dari client components
 * (tanpa dependensi database). Logika antrean/gateway ada di lib/wa.ts.
 */

export const COMPANY_WA = "6281316516524"; // kanal bisnis resmi GUNARA (data/brand.ts)
export const COMPANY_WA_LABEL = "+62 813-1651-6524";

/** Normalisasi nomor Indonesia → format internasional tanpa + (62…). */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let d = raw.replace(/[^\d]/g, "");
  if (!d) return null;
  if (d.startsWith("0")) d = `62${d.slice(1)}`;
  else if (d.startsWith("8")) d = `62${d}`;
  else if (d.startsWith("620")) d = `62${d.slice(3)}`;
  if (!/^62\d{8,13}$/.test(d)) return null;
  return d;
}

/** Tautan wa.me siap klik dengan pesan terisi. */
export function waLink(phone: string | null | undefined, message: string): string | null {
  const p = normalizePhone(phone);
  if (!p) return null;
  return `https://wa.me/${p}?text=${encodeURIComponent(message)}`;
}
