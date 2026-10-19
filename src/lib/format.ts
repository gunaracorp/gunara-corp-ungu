/**
 * Util format client-safe (tanpa dependensi server/Prisma) —
 * dipakai bersama oleh komponen UI portal & panel.
 */

/** Format Rupiah tanpa desimal: 12.500.000 */
export function rupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Math.round(n));
}

/** Ukuran berkas yang rapi: B / KB / MB */
export function ukuranBerkas(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
