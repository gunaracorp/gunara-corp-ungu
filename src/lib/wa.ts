import { db } from "@/lib/db";
import { COMPANY_WA, COMPANY_WA_LABEL, normalizePhone, waLink } from "@/lib/wa-const";

/**
 * Layanan Notifikasi WhatsApp GUNARA.
 *
 * Dua kanal pengiriman:
 * 1. Gateway cloud (opsional) — bila env `WA_GATEWAY_URL` + `WA_GATEWAY_TOKEN`
 *    diisi (format WhatsApp Cloud API Meta), pesan langsung dikirim.
 * 2. wa.me deep-link (default) — setiap notifikasi disimpan di DB dengan
 *    tautan https://wa.me/<nomor>?text=<pesan> siap klik dari dashboard
 *    (Panel CEO / Portal). Tanpa API key, bekerja di semua perangkat.
 *
 * Pemicu otomatis (dipanggil dari API proyek/pengumuman/dokumen/tier):
 * - Status proyek berubah  → WA ke client terkait + CEO
 * - Proyek baru dibuat     → WA ke karyawan penugasan + client
 * - Pengumuman baru        → WA ke seluruh audiens yang punya nomor
 * - Dokumen diunggah       → WA ke pihak proyek terkait
 * - Tier diaktifkan        → WA ke akun + CEO
 */

export { COMPANY_WA, COMPANY_WA_LABEL, normalizePhone, waLink } from "@/lib/wa-const";

export type WaEvent =
  | "proyek_status"
  | "proyek_baru"
  | "pengumuman"
  | "dokumen"
  | "tier"
  | "laporan"
  | "tiket"
  | "invoice"
  | "manual";

export interface WaRecipient {
  phone?: string | null;
  name?: string | null;
  role: "admin" | "karyawan" | "client";
}

export interface WaEntryInput extends WaRecipient {
  event: WaEvent;
  message: string;
  relatedRef?: string | null;
}

export interface WaItem {
  id: string;
  toPhone: string | null;
  toName: string | null;
  toRole: string;
  event: string;
  message: string;
  status: string;
  channel: string;
  relatedRef: string | null;
  link: string | null;
  createdAt: string;
  sentAt: string | null;
}

export function serWa(n: {
  id: string;
  toPhone: string | null;
  toName: string | null;
  toRole: string;
  event: string;
  message: string;
  status: string;
  channel: string;
  relatedRef: string | null;
  createdAt: Date;
  sentAt: Date | null;
}): WaItem {
  return {
    id: n.id,
    toPhone: n.toPhone,
    toName: n.toName,
    toRole: n.toRole,
    event: n.event,
    message: n.message,
    status: n.status,
    channel: n.channel,
    relatedRef: n.relatedRef,
    link: waLink(n.toPhone, n.message),
    createdAt: n.createdAt.toISOString(),
    sentAt: n.sentAt ? n.sentAt.toISOString() : null,
  };
}

async function kirimGateway(phone: string, message: string): Promise<boolean> {
  const url = process.env.WA_GATEWAY_URL?.trim();
  const token = process.env.WA_GATEWAY_TOKEN?.trim();
  if (!url || !token) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: message },
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Catat + kirim satu notifikasi WA. Status:
 * - "sent"   → gateway cloud berhasil
 * - "queued" → menunggu dikirim manual via tautan wa.me
 */
export async function queueWa(entry: WaEntryInput): Promise<WaItem> {
  const phone = entry.role === "admin" ? normalizePhone(entry.phone) ?? COMPANY_WA : normalizePhone(entry.phone);
  let status = "queued";
  let channel = "wa.me";
  if (phone && (await kirimGateway(phone, entry.message))) {
    status = "sent";
    channel = "gateway";
  }
  const row = await db.waNotification.create({
    data: {
      toPhone: phone,
      toName: entry.name ?? null,
      toRole: entry.role,
      event: entry.event,
      message: entry.message,
      status,
      channel,
      relatedRef: entry.relatedRef ?? null,
      sentAt: status === "sent" ? new Date() : null,
    },
  });
  return serWa(row);
}

/** Kirim ke banyak penerima sekaligus (blast). */
export async function queueWaBulk(entries: WaEntryInput[], limit = 200): Promise<WaItem[]> {
  const out: WaItem[] = [];
  for (const e of entries.slice(0, limit)) {
    out.push(await queueWa(e));
  }
  return out;
}

/* ── Template pesan (Bahasa Indonesia, gaya bisnis GUNARA) ─────────────── */

export const waTemplates = {
  proyekStatus(opts: { refCode: string; title: string; status: string; progress: number; oleh: string }) {
    return [
      "🔴 *GUNARA CORPORATION* — Pembaruan Proyek",
      "",
      `Proyek *${opts.title}* (${opts.refCode}) telah diperbarui oleh ${opts.oleh}.`,
      `• Status : ${opts.status.toUpperCase()}`,
      `• Progres: ${opts.progress}%`,
      "",
      "Pantau detail lengkap di dashboard GUNARA Anda. Terima kasih.",
    ].join("\n");
  },
  proyekBaru(opts: { refCode: string; title: string; untuk: string }) {
    return [
      "🟣 *GUNARA CORPORATION* — Proyek Baru",
      "",
      `Anda mendapatkan penugasan/permintaan baru: *${opts.title}* (${opts.refCode}) untuk ${opts.untuk}.`,
      "",
      "Segera cek dashboard GUNARA untuk detail pekerjaan.",
    ].join("\n");
  },
  pengumuman(opts: { title: string; ringkas: string }) {
    return [
      "📢 *GUNARA CORPORATION* — Pengumuman",
      "",
      `*${opts.title}*`,
      opts.ringkas,
      "",
      "Baca selengkapnya di dashboard GUNARA Anda.",
    ].join("\n");
  },
  dokumen(opts: { nama: string; oleh: string; proyek?: string | null }) {
    return [
      "📎 *GUNARA CORPORATION* — Dokumen Baru",
      "",
      `*${opts.nama}* diunggah oleh ${opts.oleh}${opts.proyek ? ` pada proyek ${opts.proyek}` : ""}.`,
      "",
      "Unduh melalui menu Dokumen di dashboard GUNARA Anda.",
    ].join("\n");
  },
  tier(opts: { nama: string; tier: string }) {
    const god = opts.tier === "GOD";
    return [
      `⚡ *GUNARA CORPORATION* — Aktivasi Tier ${opts.tier === "GOD" ? "GOD MODE (MAX)" : opts.tier}`,
      "",
      `Selamat ${opts.nama}! Akun Anda telah ${god ? "mencapai *GOD MODE* — tier maksimal" : `diaktifkan ke tier *${opts.tier}*`}.`,
      "",
      god
        ? "Semua fitur premium kini terbuka: dokumen tak terbatas, laporan eksekutif, blast WA, dan lencana eksklusif."
        : "Keistimewaan baru Anda sudah aktif — cek dashboard untuk detailnya.",
    ].join("\n");
  },
  laporan(opts: { oleh: string; jenis: string }) {
    return [
      "📄 *GUNARA CORPORATION* — Laporan PDF Dibuat",
      "",
      `${opts.oleh} membuat laporan *${opts.jenis}*.`,
      "",
      "Unduh dari dashboard bila berhak, atau hubungi CEO/admin.",
    ].join("\n");
  },
  tiket(opts: { refCode: string; subjek: string; oleh: string; prioritas: string }) {
    return [
      "🎫 *GUNARA CORPORATION* — Tiket Dukungan Baru",
      "",
      `Tiket *${opts.subjek}* (${opts.refCode}) dibuat oleh ${opts.oleh}.`,
      `• Prioritas: ${opts.prioritas.toUpperCase()}`,
      "",
      "Segera tanggapi melalui menu Dukungan di dashboard GUNARA.",
    ].join("\n");
  },
  tiketBalas(opts: { refCode: string; oleh: string }) {
    return [
      "💬 *GUNARA CORPORATION* — Balasan Tiket",
      "",
      `Tiket ${opts.refCode} dibalas oleh ${opts.oleh}.`,
      "",
      "Buka menu Dukungan di dashboard untuk membaca balasan.",
    ].join("\n");
  },
  invoice(opts: { refCode: string; jumlah: string; jatuhTempo?: string | null; untuk: string }) {
    return [
      "🧾 *GUNARA CORPORATION* — Invoice",
      "",
      `Invoice *${opts.refCode}* untuk ${opts.untuk}.`,
      `• Total      : Rp ${opts.jumlah}`,
      `• Jatuh tempo: ${opts.jatuhTempo ?? "—"}`,
      "",
      "Unduh PDF invoice di dashboard GUNARA Anda. Terima kasih.",
    ].join("\n");
  },
  manual(pesan: string) {
    return pesan;
  },
};

/** Ringkas isi panjang untuk template pengumuman. */
export function ringkas(teks: string, max = 160): string {
  const flat = teks.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).trimEnd()}…`;
}
