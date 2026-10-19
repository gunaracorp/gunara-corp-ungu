import { db } from "@/lib/db";

/**
 * Audit Log GUNARA — jejak aktivitas seluruh ekosistem.
 *
 * Setiap aksi penting (login, proyek, tiket, invoice, dokumen, tier, WA)
 * dicatat ke tabel AuditEvent. Visibilitas penuh hanya di Panel CEO
 * (GOD MODE built-in). Penulisan bersifat best-effort: kegagalan DB
 * tidak pernah menggagalkan aksi utama pemanggil.
 */

export type AuditRole = "admin" | "karyawan" | "client" | "sistem";

export interface AuditInput {
  actor: string;
  actorRole: AuditRole;
  action: string;
  target?: string | null;
  detail?: string | null;
}

export async function audit(entry: AuditInput): Promise<void> {
  try {
    await db.auditEvent.create({
      data: {
        actor: entry.actor,
        actorRole: entry.actorRole,
        action: entry.action,
        target: entry.target ?? null,
        detail: entry.detail ?? null,
      },
    });
  } catch {
    /* best-effort — jangan ganggu alur utama */
  }
}

/** Label aksi yang rapi untuk UI. */
export const AUDIT_LABEL: Record<string, string> = {
  login: "Masuk (login)",
  logout: "Keluar (logout)",
  tiket_buat: "Buat tiket dukungan",
  tiket_balas: "Balas tiket",
  tiket_status: "Ubah status tiket",
  tiket_assign: "Tugaskan penangan tiket",
  invoice_buat: "Buat invoice",
  invoice_status: "Ubah status invoice",
  invoice_hapus: "Hapus invoice",
  proyek_buat: "Buat proyek",
  proyek_status: "Ubah status proyek",
  pengumuman: "Terbitkan pengumuman",
  dokumen_unggah: "Unggah dokumen",
  dokumen_hapus: "Hapus dokumen",
  tier_aktivasi: "Aktivasi kode tier",
  tier_set: "Set tier akun",
  wa_kirim: "Kirim notifikasi WA",
  ekspor_csv: "Ekspor data CSV",
  akun_buat: "Buat akun",
  akun_hapus: "Hapus akun",
<<<<<<< HEAD
=======
  i18n_generate: "Terjemahan AI dibuat",
  i18n_override: "Sunting terjemahan (override)",
>>>>>>> 0d391b0 (updatesterbaru)
};

export function auditLabel(action: string): string {
  return AUDIT_LABEL[action] ?? action;
}

export function serAudit(a: {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string | null;
  detail: string | null;
  createdAt: Date;
}) {
  return {
    id: a.id,
    actor: a.actor,
    actorRole: a.actorRole,
    action: a.action,
    target: a.target,
    detail: a.detail,
    createdAt: a.createdAt.toISOString(),
  };
}
