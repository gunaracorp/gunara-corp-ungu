/**
 * Sistem Tier Portal GUNARA — STANDARD → PRO → ELITE → GOD (tier maks).
 *
 * Tier menentukan:
 * - Kuota unggah dokumen per akun
 * - Akses laporan PDF (PRO+) dan seksi eksekutif (GOD)
 * - Kuota blast WA (ELITE+; GOD tanpa batas praktis)
 * - Badge & keistimewaan di dashboard
 *
 * CEO/Panel CEO selalu berada di atas semua tier (GOD MODE built-in).
 */

export const TIERS_PORTAL = ["STANDARD", "PRO", "ELITE", "GOD"] as const;
export type PortalTier = (typeof TIERS_PORTAL)[number];

export const TIER_CODE_TIERS = ["PRO", "ELITE", "GOD"] as const;
export type TierCodeTier = (typeof TIER_CODE_TIERS)[number];

export interface TierMeta {
  tier: PortalTier;
  label: string;
  level: number;
  /** Kuota dokumen (null = tak terbatas). */
  quotaDokumen: number | null;
  /** Boleh membuat laporan PDF. */
  laporanPdf: boolean;
  /** Laporan PDF mendapat seksi eksekutif (estimasi nilai, prioritas GOD). */
  seksiEksekutif: boolean;
  /** Boleh blast WA ke banyak penerima (portal); CEO selalu boleh. */
  blastWa: boolean;
  badge: string;
  glow: string;
  perkawanan: string[];
}

export const TIER_META: Record<PortalTier, TierMeta> = {
  STANDARD: {
    tier: "STANDARD",
    label: "Standard",
    level: 1,
    quotaDokumen: 5,
    laporanPdf: false,
    seksiEksekutif: false,
    blastWa: false,
    badge: "bg-slate-500/10 text-slate-600 border-slate-300",
    glow: "",
    perkawanan: ["5 dokumen", "Dashboard proyek penuh", "Notifikasi WA masuk"],
  },
  PRO: {
    tier: "PRO",
    label: "Pro",
    level: 2,
    quotaDokumen: 25,
    laporanPdf: true,
    seksiEksekutif: false,
    blastWa: false,
    badge: "bg-sky-500/10 text-sky-700 border-sky-300",
    glow: "",
    perkawanan: ["25 dokumen", "Laporan PDF proyek", "Prioritas review"],
  },
  ELITE: {
    tier: "ELITE",
    label: "Elite",
    level: 3,
    quotaDokumen: 100,
    laporanPdf: true,
    seksiEksekutif: false,
    blastWa: true,
    badge: "bg-amber-500/10 text-amber-700 border-amber-300",
    glow: "",
    perkawanan: ["100 dokumen", "Laporan PDF lengkap", "Blast WA terjadwal"],
  },
  GOD: {
    tier: "GOD",
    label: "GOD MODE",
    level: 4,
    quotaDokumen: null,
    laporanPdf: true,
    seksiEksekutif: true,
    blastWa: true,
    badge: "border-fuchsia-300 bg-gradient-to-r from-rose-500/10 via-fuchsia-500/10 to-violet-500/10 text-fuchsia-700",
    glow: "shadow-[0_0_24px_-6px_rgba(217,70,239,0.55)]",
    perkawanan: [
      "Dokumen tak terbatas",
      "Laporan PDF eksekutif + estimasi nilai",
      "Blast WA tak terbatas",
      "Lencana GOD MODE eksklusif",
    ],
  },
};

export function isPortalTier(t: string): t is PortalTier {
  return (TIERS_PORTAL as readonly string[]).includes(t);
}

export function tierMeta(t: string): TierMeta {
  return isPortalTier(t) ? TIER_META[t] : TIER_META.STANDARD;
}

export function tierLevel(t: string): number {
  return tierMeta(t).level;
}

/** GOD MODE = tier maksimal. */
export function isGodMode(t: string): boolean {
  return t === "GOD";
}

export function canGeneratePdf(tier: string): boolean {
  return tierMeta(tier).laporanPdf;
}

/** Kuota dokumen tersisa; null = tak terbatas. */
export function dokumenTersisa(tier: string, terpakai: number): number | null {
  const q = tierMeta(tier).quotaDokumen;
  if (q === null) return null;
  return Math.max(0, q - terpakai);
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Kode aktivasi tier, contoh: GUNARA-GOD-7K2M-Q4XR */
export function generateTierCode(tier: string): string {
  const t = (TIER_CODE_TIERS as readonly string[]).includes(tier) ? tier : "PRO";
  const pick = (n: number) =>
    Array.from({ length: n }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
  return `GUNARA-${t}-${pick(4)}-${pick(4)}`;
}
