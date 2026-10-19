import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/export?type=karyawan|client|proyek|tiket|invoice|dokumen|wa|audit
 * — ekspor data ke CSV (Excel-compatible, delimiter koma, BOM UTF-8).
 * Khusus Panel CEO (GOD MODE built-in). Setiap ekspor tercatat di Audit Log.
 */

function csvEscape(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(row.map(csvEscape).join(","));
  return `\uFEFF${lines.join("\r\n")}\r\n`; // BOM agar Excel membaca UTF-8
}

const fmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Bangkok",
});
const dt = (d: Date | null) => (d ? fmt.format(d) : "");

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? "proyek";

  try {
    let csv = "";
    let name = type;

    if (type === "karyawan") {
      const rows = await db.employee.findMany({ orderBy: { createdAt: "desc" } });
      csv = toCsv(
        ["Nama", "Email", "Telepon", "Jabatan", "Departemen", "Kode", "Tier", "Status", "Terdaftar"],
        rows.map((e) => [e.name, e.email ?? "", e.phone ?? "", e.position, e.department, e.code, e.tier, e.status, dt(e.createdAt)])
      );
    } else if (type === "client") {
      const rows = await db.clientAccount.findMany({ orderBy: { createdAt: "desc" } });
      csv = toCsv(
        ["Nama", "Email", "Telepon", "Perusahaan", "Industri", "Kode", "Tier", "Status", "Terdaftar"],
        rows.map((c) => [c.name, c.email ?? "", c.phone ?? "", c.company ?? "", c.industry ?? "", c.code, c.tier, c.status, dt(c.createdAt)])
      );
    } else if (type === "proyek") {
      const rows = await db.project.findMany({ orderBy: { updatedAt: "desc" } });
      csv = toCsv(
        ["Kode", "Judul", "Client", "Status", "Prioritas", "Progres %", "Tenggat", "Dibuat", "Diperbarui"],
        rows.map((p) => [p.refCode, p.title, p.clientName, p.status, p.priority, p.progress, dt(p.dueDate), dt(p.createdAt), dt(p.updatedAt)])
      );
    } else if (type === "tiket") {
      const rows = await db.ticket.findMany({ orderBy: { createdAt: "desc" } });
      csv = toCsv(
        ["Kode", "Subjek", "Kategori", "Prioritas", "Status", "Pembuat", "Peran", "Penangan", "Dibuat"],
        rows.map((t) => [t.refCode, t.subject, t.category, t.priority, t.status, t.creatorName, t.creatorRole, t.assigneeName ?? "", dt(t.createdAt)])
      );
    } else if (type === "invoice") {
      const rows = await db.invoice.findMany({ orderBy: { createdAt: "desc" } });
      csv = toCsv(
        ["Kode", "Client", "Proyek", "Total (Rp)", "Status", "Jatuh Tempo", "Diterbitkan"],
        rows.map((i) => [i.refCode, i.clientName, i.projectRef ?? "", i.amount, i.status, dt(i.dueDate), dt(i.createdAt)])
      );
    } else if (type === "dokumen") {
      const rows = await db.documentFile.findMany({ orderBy: { createdAt: "desc" } });
      csv = toCsv(
        ["Nama Berkas", "Ukuran (KB)", "Proyek", "Pengunggah", "Peran", "Visibilitas", "Tanggal"],
        rows.map((d) => [d.originalName, (d.size / 1024).toFixed(0), d.projectRef ?? "", d.uploaderName, d.uploaderRole, d.visibility, dt(d.createdAt)])
      );
    } else if (type === "wa") {
      const rows = await db.waNotification.findMany({ orderBy: { createdAt: "desc" }, take: 2000 });
      csv = toCsv(
        ["Waktu", "Tujuan", "Nama", "Peran", "Peristiwa", "Status", "Kanal", "Ref"],
        rows.map((w) => [dt(w.createdAt), w.toPhone ?? "", w.toName ?? "", w.toRole, w.event, w.status, w.channel, w.relatedRef ?? ""])
      );
    } else if (type === "audit") {
      const rows = await db.auditEvent.findMany({ orderBy: { createdAt: "desc" }, take: 3000 });
      csv = toCsv(
        ["Waktu", "Aktor", "Peran", "Aksi", "Target", "Detail"],
        rows.map((a) => [dt(a.createdAt), a.actor, a.actorRole, a.action, a.target ?? "", a.detail ?? ""])
      );
      name = "audit-log";
    } else {
      return NextResponse.json({ ok: false, error: "Jenis ekspor tidak dikenal." }, { status: 400 });
    }

    await audit({
      actor: "CEO / Admin",
      actorRole: "admin",
      action: "ekspor_csv",
      target: type,
      detail: `${csv.split("\r\n").length - 2} baris`,
    }).catch(() => undefined);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="GUNARA-${name}-${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Gagal mengekspor data." }, { status: 503 });
  }
}
