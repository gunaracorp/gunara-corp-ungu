import { timingSafeEqual } from "crypto";

/**
 * Gerbang VVIP — Oracle AI hanya untuk Member VVIP.
 *
 * Kode akses dapat di-rotate kapan pun lewat env var VVIP_ACCESS_CODE
 * (mis. di Vercel → Settings → Environment Variables) tanpa deploy ulang kode.
 * Bila env tidak diisi, kode default di bawah dipakai (nyaman, tetap aman
 * karena perbandingan dilakukan di server, tidak pernah dikirim ke browser).
 */
export const DEFAULT_VVIP_CODE = "TOP-VVIP-2026";

export function expectedVvipCode(): string {
  return (process.env.VVIP_ACCESS_CODE ?? DEFAULT_VVIP_CODE).trim();
}

/** Perbandingan tahan-timing agar brute-force tidak dapat membedakan posisi karakter. */
export function vvipCodeMatches(provided: string): boolean {
  const a = Buffer.from(provided.trim().toUpperCase());
  const b = Buffer.from(expectedVvipCode().toUpperCase());
  if (a.length !== b.length) {
    // Buang waktu sebanding jalur valid supaya panjang kode tidak bocor.
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}
