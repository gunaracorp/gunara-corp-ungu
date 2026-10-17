import type { Office } from "@/data/extended-types";

/**
 * Empat kantor resmi GUNARA CORPORATION —
 * dua kantor Tasikmalaya (pusat), Jakarta (PHI Kwitang),
 * dan perwakilan IPHI Pusat. Semua berbagi zona WIB.
 * Koordinat (x, y) siap dipakai peta jika diperlukan.
 */
export const OFFICES: Office[] = [
  {
    city: "Tasikmalaya I — Kantor Pusat",
    country: "Indonesia",
    address:
      "Perumahan Arjamukti Kencana Raya Blok B7 No. 2, Leuwisari, Arjasari, Kab. Tasikmalaya, Jawa Barat",
    timezone: "Asia/Jakarta",
    x: 74,
    y: 64,
    flagship: true,
  },
  {
    city: "Tasikmalaya II",
    country: "Indonesia",
    address:
      "Perumahan Andalusia Garden, Cluster Granada No. 11, Mangkubumi, Kota Tasikmalaya, Jawa Barat",
    timezone: "Asia/Jakarta",
    x: 76,
    y: 66,
  },
  {
    city: "Jakarta — Kantor PHI Kwitang",
    country: "Indonesia",
    address: "Kantor PHI Kwitang, Kwitang, Senen, Jakarta Pusat, DKI Jakarta",
    timezone: "Asia/Jakarta",
    x: 72,
    y: 58,
  },
  {
    city: "IPHI Pusat",
    country: "Indonesia",
    address:
      "Sekretariat IPHI Pusat — Ikatan Penasihat Hukum Indonesia, Jakarta",
    timezone: "Asia/Jakarta",
    x: 70,
    y: 56,
  },
];
