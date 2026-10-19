import { db } from "@/lib/db";
import { PdfBuilder, C } from "@/lib/pdf";
import { COMPANY_WA_LABEL } from "@/lib/wa";
import { rupiah, serInvoice } from "@/lib/invoice";

/**
 * Composer Laporan PDF GUNARA — menarik data dari DB dan menyusunnya
 * memakai PdfBuilder (lib/pdf.ts). Empat jenis laporan:
 *
 * - "ringkasan"  → Ringkasan Eksekutif perusahaan (CEO): statistik, proyek,
 *                  tim, dokumen, notifikasi WA + seksi GOD MODE.
 * - "karyawan"   → Laporan penugasan seorang karyawan.
 * - "client"     → Laporan progres layanan seorang client.
 * - "invoice"    → Invoice/tagihan resmi kepada client (kop GUNARA).
 */

export type ReportKind = "ringkasan" | "karyawan" | "client" | "invoice";

export interface ReportContext {
  kind: ReportKind;
  /** SubjectId (employeeId/clientId) untuk laporan karyawan/client. */
  subjectId?: string;
  /** ID invoice (untuk kind = "invoice"). */
  invoiceId?: string;
  /** Nama pembuat laporan (untuk meta & catatan kaki). */
  oleh: string;
  /** Tier akun pembuat (portal); "CEO" untuk admin. */
  tier: string;
  /** Seksi eksekutif GOD MODE (estimasi nilai, dsb.). */
  seksiEksekutif?: boolean;
}

const fmtDate = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Bangkok",
});
const fmtDT = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Bangkok",
});

const STATUS_LABEL: Record<string, string> = {
  baru: "Baru",
  berjalan: "Berjalan",
  review: "Review",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};
const PRIO_LABEL: Record<string, string> = {
  rendah: "Rendah",
  normal: "Normal",
  tinggi: "Tinggi",
  urgent: "Urgent",
};

export async function buildReportPdf(ctx: ReportContext): Promise<{ bytes: Uint8Array; fileName: string; judul: string }> {
  if (ctx.kind === "ringkasan") return buildRingkasan(ctx);
  if (ctx.kind === "karyawan") return buildKaryawan(ctx);
  if (ctx.kind === "invoice") return buildInvoice(ctx);
  return buildClient(ctx);
}

function ringkasTeks(s: string, max = 110): string {
  const flat = s.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).trimEnd()}…`;
}

/* ── Laporan Ringkasan Eksekutif (CEO) ──────────────────────────────────── */

async function buildRingkasan(ctx: ReportContext) {
  const [employees, clients, projects, docs, waRows, announcements, contacts] = await Promise.all([
    db.employee.findMany({ orderBy: { createdAt: "desc" } }),
    db.clientAccount.findMany({ orderBy: { createdAt: "desc" } }),
    db.project.findMany({ orderBy: { updatedAt: "desc" }, take: 60 }),
    db.documentFile.findMany({ orderBy: { createdAt: "desc" }, take: 300 }),
    db.waNotification.findMany({ orderBy: { createdAt: "desc" }, take: 300 }),
    db.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 300 }),
  ]);

  const now = new Date();
  const judul = "Ringkasan Eksekutif Perusahaan";
  const pdf = new PdfBuilder();
  pdf.coverBand(judul, [
    `Tanggal: ${fmtDate.format(now)}`,
    `Disusun oleh: ${ctx.oleh}`,
    "Klasifikasi: RAHASIA — INTERNAL",
  ]);

  const aktif = projects.filter((p) => p.status === "berjalan" || p.status === "review").length;
  const selesai = projects.filter((p) => p.status === "selesai").length;
  const godCount = employees.filter((e) => e.tier === "GOD").length + clients.filter((c) => c.tier === "GOD").length;

  pdf.heading("A. Statistik Utama");
  pdf.statBoxes(
    [
      { label: "Proyek total", value: String(projects.length), hint: `${aktif} aktif · ${selesai} selesai`, color: C.violet },
      { label: "Karyawan", value: String(employees.length), hint: `${employees.filter((e) => e.status === "active").length} aktif`, color: C.emerald },
      { label: "Client", value: String(clients.length), hint: `${clients.filter((c) => c.status === "active").length} aktif`, color: C.amber },
      { label: "Dokumen", value: String(docs.length), hint: "terarsip di ekosistem", color: C.violet },
      { label: "Notifikasi WA", value: String(waRows.length), hint: `${waRows.filter((w) => w.status === "sent").length} terkirim`, color: C.emerald },
      { label: "Akun GOD MODE", value: String(godCount), hint: "tier maksimal", color: C.rose },
    ],
    3
  );

  pdf.heading("B. Portofolio Proyek");
  pdf.table(
    ["Kode", "Judul", "Client", "Status", "Progres"],
    projects.slice(0, 25).map((p) => ({
      cells: [
        p.refCode,
        ringkasTeks(p.title, 42),
        ringkasTeks(p.clientName, 24),
        STATUS_LABEL[p.status] ?? p.status,
        `${p.progress}%`,
      ],
      color: p.status === "selesai" ? C.emerald : C.text,
    })),
    [14, 40, 26, 12, 8]
  );

  pdf.heading("C. Tim & Klien");
  pdf.table(
    ["Nama", "Peran", "Kontak", "Tier", "Status"],
    [
      ...employees.map((e) => ({
        cells: [e.name, `${e.position} · ${e.department}`, e.phone ?? e.email ?? "—", e.tier, e.status],
      })),
      ...clients.map((c) => ({
        cells: [c.name, `Client${c.company ? ` · ${c.company}` : ""}`, c.phone ?? c.email ?? "—", c.tier, c.status],
        color: C.violetDark ?? C.text,
      })),
    ],
    [24, 30, 24, 11, 11]
  );

  pdf.heading("D. Aktivitas Notifikasi WhatsApp");
  pdf.table(
    ["Waktu", "Tujuan", "Peristiwa", "Status"],
    waRows.slice(0, 15).map((w) => ({
      cells: [
        fmtDT.format(w.createdAt),
        `${w.toName ?? w.toPhone ?? COMPANY_WA_LABEL} (${w.toRole})`,
        w.event,
        w.status === "sent" ? "Terkirim" : w.status === "failed" ? "Gagal" : "Antre (wa.me)",
      ],
      color: w.status === "sent" ? C.emerald : C.text,
    })),
    [22, 40, 20, 18]
  );

  pdf.heading("E. Pengumuman Terakhir");
  pdf.table(
    ["Judul", "Audiens", "Tanggal"],
    announcements.map((a) => ({
      cells: [ringkasTeks(a.title, 56), a.audience, fmtDT.format(a.createdAt)],
    })),
    [56, 20, 24]
  );

  if (ctx.seksiEksekutif) {
    pdf.heading("F. GOD MODE — Analisis Eksekutif");
    const briefMasuk = contacts.length;
    const perTier = ["GOD", "ELITE", "PRO", "STANDARD"].map((t) => ({
      t,
      n: employees.filter((e) => e.tier === t).length + clients.filter((c) => c.tier === t).length,
    }));
    const rataProgres = projects.length
      ? Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length)
      : 0;
    pdf.kv("Tiket brief / pesan masuk:", `${briefMasuk} (belum termasuk follow-up WA)`);
    pdf.kv("Rata-rata progres portofolio:", `${rataProgres}%`);
    pdf.kv(
      "Distribusi tier ekosistem:",
      perTier.map((x) => `${x.t}: ${x.n}`).join(" · ")
    );
    pdf.kv(
      "Estimasi nilai portofolio:",
      `${projects.filter((p) => p.status !== "dibatalkan").length} proyek berjalan — nilai kontrak terekam pada data brief client`
    );
    pdf.spacer(4);
    pdf.text(
      "Rekomendasi: aktifkan GOD MODE bagi manajer proyek kunci agar laporan eksekutif dan blast WA tersedia di seluruh rantai komando. Gunakan Panel CEO → tab Ekosistem untuk menerbitkan kode aktivasi tier.",
      { size: 9.5, color: C.text }
    );
  }

  const bytes = pdf.build();
  return {
    bytes,
    judul,
    fileName: `GUNARA-Ringkasan-Eksekutif-${now.toISOString().slice(0, 10)}.pdf`,
  };
}

/* ── Laporan Karyawan ───────────────────────────────────────────────────── */

async function buildKaryawan(ctx: ReportContext) {
  const emp = await db.employee.findUnique({ where: { id: ctx.subjectId } });
  if (!emp) throw new Error("karyawan-tidak-ditemukan");
  const projects = await db.project.findMany({
    where: { employeeId: emp.id },
    orderBy: { updatedAt: "desc" },
    take: 60,
  });
  const docs = await db.documentFile.findMany({
    where: { uploaderId: emp.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const now = new Date();
  const judul = `Laporan Penugasan — ${emp.name}`;
  const pdf = new PdfBuilder();
  pdf.coverBand(judul, [
    `${emp.position} · ${emp.department}`,
    `Tier: ${emp.tier === "GOD" ? "GOD MODE (MAX)" : emp.tier}`,
    `Tanggal: ${fmtDate.format(now)}`,
  ]);

  pdf.heading("A. Statistik Pekerjaan");
  pdf.statBoxes(
    [
      { label: "Proyek ditugaskan", value: String(projects.length), color: C.violet },
      { label: "Berjalan", value: String(projects.filter((p) => p.status === "berjalan").length), color: C.amber },
      { label: "Selesai", value: String(projects.filter((p) => p.status === "selesai").length), color: C.emerald },
      { label: "Dokumen diunggah", value: String(docs.length), color: C.violet },
    ],
    4
  );

  pdf.heading("B. Rincian Proyek");
  if (projects.length === 0) {
    pdf.text("Belum ada proyek yang ditugaskan.", { size: 10 });
  } else {
    pdf.table(
      ["Kode", "Judul", "Client", "Status", "Progres", "Tenggat"],
      projects.map((p) => ({
        cells: [
          p.refCode,
          ringkasTeks(p.title, 36),
          ringkasTeks(p.clientName, 20),
          STATUS_LABEL[p.status] ?? p.status,
          `${p.progress}%`,
          p.dueDate ? fmtDT.format(p.dueDate) : "—",
        ],
      })),
      [13, 34, 20, 12, 9, 12]
    );
  }

  pdf.heading("C. Riwayat Unggahan Dokumen");
  if (docs.length === 0) {
    pdf.text("Belum ada dokumen yang diunggah.", { size: 10 });
  } else {
    pdf.table(
      ["Nama Dokumen", "Proyek", "Ukuran", "Tanggal"],
      docs.slice(0, 20).map((d) => ({
        cells: [ringkasTeks(d.originalName, 40), d.projectRef ?? "—", `${(d.size / 1024).toFixed(0)} KB`, fmtDT.format(d.createdAt)],
      })),
      [42, 20, 12, 26]
    );
  }

  const bytes = pdf.build();
  return {
    bytes,
    judul,
    fileName: `GUNARA-Laporan-Karyawan-${emp.name.replace(/\s+/g, "-")}-${now.toISOString().slice(0, 10)}.pdf`,
  };
}

/* ── Invoice PDF ─────────────────────────────────────────────────────── */

async function buildInvoice(ctx: ReportContext) {
  if (!ctx.invoiceId) throw new Error("invoice-id-kosong");
  const row = await db.invoice.findUnique({ where: { id: ctx.invoiceId } });
  if (!row) throw new Error("invoice-tidak-ditemukan");
  const inv = serInvoice(row);

  const now = new Date();
  const judul = `Invoice ${inv.refCode}`;
  const pdf = new PdfBuilder();
  pdf.coverBand("INVOICE — GUNARA CORPORATION", [
    `No. Invoice : ${inv.refCode}`,
    `Diterbitkan : ${fmtDate.format(now)}`,
    `Status      : ${inv.status.toUpperCase()}`,
  ]);

  pdf.heading("A. Informasi Tagihan");
  pdf.kv("Kepada:", inv.clientName);
  if (inv.projectRef) pdf.kv("Proyek terkait:", inv.projectRef);
  if (inv.dueDate) pdf.kv("Jatuh tempo:", fmtDate.format(new Date(inv.dueDate)));
  pdf.kv("Total tagihan:", `Rp ${rupiah(inv.amount)}`);

  pdf.heading("B. Rincian Biaya");
  pdf.table(
    ["Uraian", "Qty", "Harga Satuan", "Jumlah"],
    inv.items.map((it) => ({
      cells: [ringkasTeks(it.desc, 46), String(it.qty), `Rp ${rupiah(it.price)}`, `Rp ${rupiah(it.qty * it.price)}`],
    })),
    [46, 10, 22, 22]
  );
  pdf.spacer(4);
  pdf.kv("TOTAL", `Rp ${rupiah(inv.amount)}`);

  if (inv.note) {
    pdf.heading("C. Catatan");
    pdf.text(inv.note, { size: 9.5, color: C.text });
  }

  pdf.spacer(6);
  pdf.text(
    `Pembayaran: konfirmasi ke WhatsApp ${COMPANY_WA_LABEL} dengan menyebut nomor invoice ${inv.refCode}.\nDokumen ini sah tanpa tanda tangan basah — diterbitkan elektronik oleh sistem GUNARA CORPORATION.`,
    { size: 9, color: C.text }
  );

  const bytes = pdf.build();
  return {
    bytes,
    judul,
    fileName: `GUNARA-Invoice-${inv.refCode}.pdf`,
  };
}

/* ── Laporan Client ─────────────────────────────────────────────────────── */

async function buildClient(ctx: ReportContext) {
  const client = await db.clientAccount.findUnique({ where: { id: ctx.subjectId } });
  if (!client) throw new Error("client-tidak-ditemukan");
  const projects = await db.project.findMany({
    where: { clientId: client.id },
    orderBy: { updatedAt: "desc" },
    take: 60,
  });
  const docs = await db.documentFile.findMany({
    where: { uploaderId: client.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const now = new Date();
  const judul = `Laporan Layanan — ${client.name}`;
  const pdf = new PdfBuilder();
  pdf.coverBand(judul, [
    client.company ? client.company : "Klien Perorangan",
    `Tier: ${client.tier === "GOD" ? "GOD MODE (MAX)" : client.tier}`,
    `Tanggal: ${fmtDate.format(now)}`,
  ]);

  pdf.heading("A. Ringkasan Layanan Anda");
  pdf.statBoxes(
    [
      { label: "Total permintaan", value: String(projects.length), color: C.violet },
      { label: "Sedang berjalan", value: String(projects.filter((p) => p.status === "berjalan" || p.status === "review").length), color: C.amber },
      { label: "Selesai", value: String(projects.filter((p) => p.status === "selesai").length), color: C.emerald },
      { label: "Dokumen terkirim", value: String(docs.length), color: C.violet },
    ],
    4
  );

  pdf.heading("B. Status Proyek Anda");
  if (projects.length === 0) {
    pdf.text("Belum ada permintaan layanan yang tercatat.", { size: 10 });
  } else {
    pdf.table(
      ["Kode", "Layanan", "Status", "Progres", "Terakhir diperbarui"],
      projects.map((p) => ({
        cells: [
          p.refCode,
          ringkasTeks(p.title, 40),
          STATUS_LABEL[p.status] ?? p.status,
          `${p.progress}%`,
          fmtDT.format(p.updatedAt),
        ],
      })),
      [13, 40, 13, 9, 25]
    );
  }

  pdf.heading("C. Catatan Kolaborasi Terbaru");
  const updates = await db.projectUpdate.findMany({
    where: { projectId: { in: projects.map((p) => p.id) } },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  if (updates.length === 0) {
    pdf.text("Belum ada catatan kolaborasi.", { size: 10 });
  } else {
    pdf.table(
      ["Waktu", "Oleh", "Catatan"],
      updates.map((u) => ({
        cells: [fmtDT.format(u.createdAt), `${u.author} (${u.authorRole})`, ringkasTeks(u.message, 64)],
      })),
      [22, 26, 52]
    );
  }

  pdf.spacer(6);
  pdf.text(
    `Butuh bantuan lebih lanjut? Hubungi tim GUNARA via WhatsApp ${COMPANY_WA_LABEL} — respons cepat 24/7.`,
    { size: 9.5, color: C.text }
  );

  const bytes = pdf.build();
  return {
    bytes,
    judul,
    fileName: `GUNARA-Laporan-Layanan-${client.name.replace(/\s+/g, "-")}-${now.toISOString().slice(0, 10)}.pdf`,
  };
}
