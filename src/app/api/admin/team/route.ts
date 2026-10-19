import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import {
  generateClientCode,
  generateEmployeeCode,
  generateProjectRef,
} from "@/lib/store";
import { generateTierCode, TIER_CODE_TIERS } from "@/lib/tiers";
import { queueWa, queueWaBulk, ringkas, waTemplates } from "@/lib/wa";
import { audit, serAudit } from "@/lib/audit";
import {
  generateInvoiceRef,
  INVOICE_STATUS,
  parseItems,
  rupiah,
  serInvoice,
  totalOf,
} from "@/lib/invoice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_PROYEK = ["baru", "berjalan", "review", "selesai", "dibatalkan"];
const PRIORITAS = ["rendah", "normal", "tinggi", "urgent"];
const AUDIENS = ["semua", "karyawan", "client"];
const STATUS_TIKET = ["open", "diproses", "selesai", "ditutup"];
/**
 * GET /api/admin/team — seluruh data manajemen tim: karyawan, client,
 * proyek (+ ringkasan), pengumuman, tiket dukungan, invoice, audit log,
 * dan statistik.
 * POST /api/admin/team — mutasi (kind + action):
 *   karyawan: create | update | delete
 *   client:   create | update | delete
 *   proyek:   create | update | delete
 *   pengumuman: create | delete
 *   tiket:    status | assign | delete
 *   invoice:  create | status | delete
 */
export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  try {
    const [employees, clients, projects, announcements, tierCodes, waRows, docs, ticketRows, invoiceRows, auditRows] = await Promise.all([
      db.employee.findMany({ orderBy: { createdAt: "desc" } }),
      db.clientAccount.findMany({ orderBy: { createdAt: "desc" } }),
      db.project.findMany({ orderBy: { updatedAt: "desc" }, take: 300 }),
      db.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      db.tierCode.findMany({ orderBy: { createdAt: "desc" }, take: 80 }),
      db.waNotification.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
      db.documentFile.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
      db.ticket.findMany({ orderBy: { updatedAt: "desc" }, take: 200 }),
      db.invoice.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
      db.auditEvent.findMany({ orderBy: { createdAt: "desc" }, take: 300 }),
    ]);
    const ticketReplies = ticketRows.length
      ? await db.ticketReply.findMany({
          where: { ticketId: { in: ticketRows.map((t) => t.id) } },
          orderBy: { createdAt: "asc" },
          take: 1000,
        })
      : [];
    return NextResponse.json({
      ok: true,
      source: "db",
      employees: employees.map(serEmployee),
      clients: clients.map(serClient),
      projects: projects.map((p) => ({
        id: p.id,
        refCode: p.refCode,
        title: p.title,
        description: p.description,
        clientId: p.clientId,
        clientName: p.clientName,
        employeeId: p.employeeId,
        status: p.status,
        priority: p.priority,
        progress: p.progress,
        dueDate: p.dueDate ? p.dueDate.toISOString() : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      announcements: announcements.map((a) => ({
        id: a.id,
        title: a.title,
        body: a.body,
        audience: a.audience,
        createdAt: a.createdAt.toISOString(),
      })),
      tierCodes: tierCodes.map((t) => ({
        id: t.id,
        code: t.code,
        tier: t.tier,
        targetRole: t.targetRole,
        note: t.note,
        usedById: t.usedById,
        usedByName: t.usedByName,
        usedAt: t.usedAt ? t.usedAt.toISOString() : null,
        createdAt: t.createdAt.toISOString(),
      })),
      waItems: waRows.map((w) => ({
        id: w.id,
        toPhone: w.toPhone,
        toName: w.toName,
        toRole: w.toRole,
        event: w.event,
        message: w.message,
        status: w.status,
        channel: w.channel,
        relatedRef: w.relatedRef,
        createdAt: w.createdAt.toISOString(),
        sentAt: w.sentAt ? w.sentAt.toISOString() : null,
      })),
      documents: docs.map((d) => ({
        id: d.id,
        originalName: d.originalName,
        size: d.size,
        projectRef: d.projectRef,
        uploaderName: d.uploaderName,
        uploaderRole: d.uploaderRole,
        visibility: d.visibility,
        createdAt: d.createdAt.toISOString(),
      })),
      tickets: ticketRows.map((t) => ({
        id: t.id,
        refCode: t.refCode,
        subject: t.subject,
        body: t.body,
        category: t.category,
        priority: t.priority,
        status: t.status,
        creatorId: t.creatorId,
        creatorName: t.creatorName,
        creatorRole: t.creatorRole,
        assigneeId: t.assigneeId,
        assigneeName: t.assigneeName,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        replies: ticketReplies
          .filter((r) => r.ticketId === t.id)
          .map((r) => ({
            id: r.id,
            author: r.author,
            authorRole: r.authorRole,
            message: r.message,
            createdAt: r.createdAt.toISOString(),
          })),
      })),
      invoices: invoiceRows.map(serInvoice),
      audit: auditRows.map(serAudit),
      stats: {
        employees: employees.length,
        activeEmployees: employees.filter((e) => e.status === "active").length,
        clients: clients.length,
        projects: projects.length,
        proyekBerjalan: projects.filter((p) => p.status === "berjalan").length,
        proyekBaru: projects.filter((p) => p.status === "baru").length,
        proyekSelesai: projects.filter((p) => p.status === "selesai").length,
        announcements: announcements.length,
        tierCodesAktif: tierCodes.filter((t) => !t.usedAt).length,
        godAccounts: employees.filter((e) => e.tier === "GOD").length + clients.filter((c) => c.tier === "GOD").length,
        waQueued: waRows.filter((w) => w.status === "queued").length,
        waSent: waRows.filter((w) => w.status === "sent").length,
        documents: docs.length,
        tiketOpen: ticketRows.filter((t) => t.status === "open").length,
        tiketDiproses: ticketRows.filter((t) => t.status === "diproses").length,
        invoiceTerkirim: invoiceRows.filter((i) => i.status === "terkirim").length,
        invoiceNilaiTerkirim: invoiceRows.filter((i) => i.status === "terkirim").reduce((a, i) => a + i.amount, 0),
        invoiceDibayar: invoiceRows.filter((i) => i.status === "dibayar").reduce((a, i) => a + i.amount, 0),
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Layanan sedang tidak tersedia." },
      { status: 503 }
    );
  }
}

function serEmployee(e: {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  position: string;
  department: string;
  code: string;
  tier: string;
  status: string;
  notes: string | null;
  lastAccessAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: e.id,
    name: e.name,
    email: e.email,
    phone: e.phone,
    position: e.position,
    department: e.department,
    code: e.code,
    tier: e.tier,
    status: e.status,
    notes: e.notes,
    lastAccessAt: e.lastAccessAt ? e.lastAccessAt.toISOString() : null,
    createdAt: e.createdAt.toISOString(),
  };
}

function serClient(c: {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  industry: string | null;
  code: string;
  tier: string;
  status: string;
  notes: string | null;
  lastAccessAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    company: c.company,
    industry: c.industry,
    code: c.code,
    tier: c.tier,
    status: c.status,
    notes: c.notes,
    lastAccessAt: c.lastAccessAt ? c.lastAccessAt.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
  };
}

export async function POST(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  const body: unknown = await req.json().catch(() => null);
  const b = (body ?? {}) as Record<string, unknown>;
  const kind = typeof b.kind === "string" ? b.kind : "";
  const action = typeof b.action === "string" ? b.action : "";
  const d = (b.data ?? {}) as Record<string, unknown>;

  const str = (v: unknown): string | null => {
    const s = typeof v === "string" ? v.trim() : "";
    return s ? s : null;
  };

  try {
    /* ── Karyawan ─────────────────────────────────────────────────────── */
    if (kind === "karyawan") {
      if (action === "create") {
        const name = str(d.name);
        if (!name) return NextResponse.json({ ok: false, error: "Nama wajib diisi." }, { status: 400 });
        const code = await uniqueCode(generateEmployeeCode, async (c) =>
          !!(await db.employee.findUnique({ where: { code: c } }))
        );
        const created = await db.employee.create({
          data: {
            name,
            email: str(d.email),
            phone: str(d.phone),
            position: str(d.position) ?? "Staff",
            department: str(d.department) ?? "Operasional",
            code,
            tier: (TIER_CODE_TIERS as readonly string[]).includes(str(d.tier) ?? "") || str(d.tier) === "STANDARD" ? (str(d.tier) as string) : "STANDARD",
            notes: str(d.notes),
          },
        });
        return NextResponse.json({ ok: true, item: serEmployee(created) });
      }
      if (action === "update") {
        const id = str(d.id);
        if (!id) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
        const data: Record<string, unknown> = {};
        if (d.name !== undefined) data.name = str(d.name);
        if (d.email !== undefined) data.email = str(d.email);
        if (d.phone !== undefined) data.phone = str(d.phone);
        if (d.position !== undefined) data.position = str(d.position) ?? "Staff";
        if (d.department !== undefined) data.department = str(d.department) ?? "Operasional";
        if (d.status !== undefined) data.status = d.status === "suspended" ? "suspended" : "active";
        if (d.notes !== undefined) data.notes = str(d.notes);
        if (d.tier !== undefined && (TIER_CODE_TIERS as readonly string[]).includes(str(d.tier) ?? "") ) data.tier = str(d.tier);
        const updated = await db.employee.update({ where: { id }, data });
        return NextResponse.json({ ok: true, item: serEmployee(updated) });
      }
      if (action === "delete") {
        const id = str(d.id);
        if (!id) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
        // Lepas penugasan proyek milik karyawan ini agar data tidak yatim.
        await db.project.updateMany({ where: { employeeId: id }, data: { employeeId: null } });
        await db.employee.delete({ where: { id } });
        return NextResponse.json({ ok: true });
      }
    }

    /* ── Client ───────────────────────────────────────────────────────── */
    if (kind === "client") {
      if (action === "create") {
        const name = str(d.name);
        if (!name) return NextResponse.json({ ok: false, error: "Nama wajib diisi." }, { status: 400 });
        const code = await uniqueCode(generateClientCode, async (c) =>
          !!(await db.clientAccount.findUnique({ where: { code: c } }))
        );
        const created = await db.clientAccount.create({
          data: {
            name,
            email: str(d.email),
            phone: str(d.phone),
            company: str(d.company),
            industry: str(d.industry),
            code,
            tier: (TIER_CODE_TIERS as readonly string[]).includes(str(d.tier) ?? "") || str(d.tier) === "STANDARD" ? (str(d.tier) as string) : "STANDARD",
            notes: str(d.notes),
          },
        });
        return NextResponse.json({ ok: true, item: serClient(created) });
      }
      if (action === "update") {
        const id = str(d.id);
        if (!id) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
        const data: Record<string, unknown> = {};
        if (d.name !== undefined) data.name = str(d.name);
        if (d.email !== undefined) data.email = str(d.email);
        if (d.phone !== undefined) data.phone = str(d.phone);
        if (d.company !== undefined) data.company = str(d.company);
        if (d.industry !== undefined) data.industry = str(d.industry);
        if (d.status !== undefined) data.status = d.status === "suspended" ? "suspended" : "active";
        if (d.notes !== undefined) data.notes = str(d.notes);
        if (d.tier !== undefined && (TIER_CODE_TIERS as readonly string[]).includes(str(d.tier) ?? "")) data.tier = str(d.tier);
        const updated = await db.clientAccount.update({ where: { id }, data });
        return NextResponse.json({ ok: true, item: serClient(updated) });
      }
      if (action === "delete") {
        const id = str(d.id);
        if (!id) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
        await db.project.updateMany({ where: { clientId: id }, data: { clientId: null, clientName: "—" } });
        await db.clientAccount.delete({ where: { id } });
        return NextResponse.json({ ok: true });
      }
    }

    /* ── Proyek ───────────────────────────────────────────────────────── */
    if (kind === "proyek") {
      if (action === "create") {
        const title = str(d.title);
        const description = str(d.description);
        if (!title || !description) {
          return NextResponse.json(
            { ok: false, error: "Judul dan uraian proyek wajib diisi." },
            { status: 400 }
          );
        }
        const clientId = str(d.clientId);
        const employeeId = str(d.employeeId);
        let clientName = "—";
        if (clientId) {
          const c = await db.clientAccount.findUnique({ where: { id: clientId } });
          if (c) clientName = c.company ? `${c.name} · ${c.company}` : c.name;
        }
        const ref = await uniqueCode(generateProjectRef, async (r) =>
          !!(await db.project.findUnique({ where: { refCode: r } }))
        );
        const created = await db.project.create({
          data: {
            refCode: ref,
            title,
            description,
            clientId: clientId ?? null,
            clientName,
            employeeId: employeeId ?? null,
            status: STATUS_PROYEK.includes(str(d.status) ?? "") ? (str(d.status) as string) : "baru",
            priority: PRIORITAS.includes(str(d.priority) ?? "") ? (str(d.priority) as string) : "normal",
            dueDate: str(d.dueDate) ? new Date(str(d.dueDate) as string) : null,
          },
        });
        await db.projectUpdate.create({
          data: {
            projectId: created.id,
            author: "CEO / Admin",
            authorRole: "admin",
            message: `Proyek dibuat oleh CEO: "${title}".`,
          },
        });
        // Pemicu WA otomatis: karyawan penugasan + client terkait
        const waTmpl = waTemplates.proyekBaru({ refCode: created.refCode, title, untuk: clientName });
        const waTargets: { phone: string | null; name: string; role: "karyawan" | "client" }[] = [];
        if (created.employeeId) {
          const emp = await db.employee.findUnique({ where: { id: created.employeeId } });
          if (emp?.status === "active") waTargets.push({ phone: emp.phone, name: emp.name, role: "karyawan" });
        }
        if (created.clientId) {
          const cli = await db.clientAccount.findUnique({ where: { id: created.clientId } });
          if (cli?.status === "active") waTargets.push({ phone: cli.phone, name: cli.name, role: "client" });
        }
        await Promise.allSettled(
          waTargets.map((t) =>
            queueWa({ phone: t.phone, name: t.name, role: t.role, event: "proyek_baru", message: waTmpl, relatedRef: created.refCode })
          )
        );
        return NextResponse.json({ ok: true, refCode: created.refCode });
      }
      if (action === "update") {
        const id = str(d.id);
        if (!id) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
        const data: Record<string, unknown> = {};
        if (d.title !== undefined) data.title = str(d.title);
        if (d.description !== undefined) data.description = str(d.description);
        if (d.employeeId !== undefined) data.employeeId = str(d.employeeId);
        if (d.clientId !== undefined) {
          const clientId = str(d.clientId);
          data.clientId = clientId;
          if (clientId) {
            const c = await db.clientAccount.findUnique({ where: { id: clientId } });
            data.clientName = c ? (c.company ? `${c.name} · ${c.company}` : c.name) : "—";
          } else {
            data.clientName = "—";
          }
        }
        if (d.status !== undefined && STATUS_PROYEK.includes(str(d.status) ?? "")) data.status = str(d.status);
        if (d.priority !== undefined && PRIORITAS.includes(str(d.priority) ?? "")) data.priority = str(d.priority);
        if (d.progress !== undefined) {
          const p = Number(d.progress);
          if (Number.isFinite(p) && p >= 0 && p <= 100) data.progress = Math.round(p);
        }
        if (d.dueDate !== undefined) data.dueDate = str(d.dueDate) ? new Date(str(d.dueDate) as string) : null;
        const updated = await db.project.update({ where: { id }, data });
        return NextResponse.json({ ok: true });
      }
      if (action === "delete") {
        const id = str(d.id);
        if (!id) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
        await db.projectUpdate.deleteMany({ where: { projectId: id } });
        await db.project.delete({ where: { id } });
        return NextResponse.json({ ok: true });
      }
    }

    /* ── Pengumuman ───────────────────────────────────────────────────── */
    if (kind === "pengumuman") {
      if (action === "create") {
        const title = str(d.title);
        const bodyText = str(d.body);
        if (!title || !bodyText) {
          return NextResponse.json({ ok: false, error: "Judul dan isi pengumuman wajib diisi." }, { status: 400 });
        }
        const audience = AUDIENS.includes(str(d.audience) ?? "") ? (str(d.audience) as string) : "semua";
        const created = await db.announcement.create({ data: { title, body: bodyText, audience } });
        // Pemicu WA otomatis: blast ke audiens yang memiliki nomor tercatat
        const blastTargets: { phone: string | null; name: string; role: "karyawan" | "client" }[] = [];
        if (audience === "karyawan" || audience === "semua") {
          const emps = await db.employee.findMany({ where: { status: "active" } });
          emps.forEach((e) => blastTargets.push({ phone: e.phone, name: e.name, role: "karyawan" }));
        }
        if (audience === "client" || audience === "semua") {
          const clis = await db.clientAccount.findMany({ where: { status: "active" } });
          clis.forEach((c) => blastTargets.push({ phone: c.phone, name: c.name, role: "client" }));
        }
        const waMsg = waTemplates.pengumuman({ title, ringkas: ringkas(bodyText) });
        await queueWaBulk(
          blastTargets.map((t) => ({
            phone: t.phone,
            name: t.name,
            role: t.role,
            event: "pengumuman" as const,
            message: waMsg,
            relatedRef: title,
          })),
          100
        );
        return NextResponse.json({ ok: true, id: created.id });
      }
      if (action === "delete") {
        const id = str(d.id);
        if (!id) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
        await db.announcement.delete({ where: { id } });
        return NextResponse.json({ ok: true });
      }
    }

    /* ── Tier & God Mode ─────────────────────────────────────────────── */
    if (kind === "tier") {
      if (action === "kode-create") {
        const tier = str(d.tier) ?? "PRO";
        if (!(TIER_CODE_TIERS as readonly string[]).includes(tier)) {
          return NextResponse.json({ ok: false, error: "Tier kode harus PRO, ELITE, atau GOD." }, { status: 400 });
        }
        const targetRole = ["karyawan", "client", "semua"].includes(str(d.targetRole) ?? "")
          ? (str(d.targetRole) as string)
          : "semua";
        const jumlah = Math.min(Math.max(Number(d.jumlah) || 1, 1), 10);
        const made: string[] = [];
        for (let i = 0; i < jumlah; i++) {
          let code = generateTierCode(tier);
          for (let a = 0; a < 12; a++) {
            const clash = await db.tierCode.findUnique({ where: { code } });
            if (!clash) break;
            code = generateTierCode(tier);
          }
          await db.tierCode.create({
            data: { code, tier, targetRole, note: str(d.note), createdBy: "CEO / Admin" },
          });
          made.push(code);
        }
        return NextResponse.json({ ok: true, codes: made });
      }
      if (action === "kode-delete") {
        const id = str(d.id);
        if (!id) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
        const row = await db.tierCode.findUnique({ where: { id } });
        if (!row) return NextResponse.json({ ok: false, error: "Kode tidak ditemukan." }, { status: 404 });
        if (row.usedAt) return NextResponse.json({ ok: false, error: "Kode yang sudah dipakai tidak dapat dihapus." }, { status: 409 });
        await db.tierCode.delete({ where: { id } });
        return NextResponse.json({ ok: true });
      }
      if (action === "set-tier") {
        const id = str(d.id);
        const tier = str(d.tier) ?? "";
        const targetKind = str(d.targetKind) ?? "";
        if (!id || !(TIER_CODE_TIERS as readonly string[]).includes(tier) && tier !== "STANDARD") {
          return NextResponse.json({ ok: false, error: "Data tier tidak valid." }, { status: 400 });
        }
        if (targetKind === "karyawan") {
          const acc = await db.employee.findUnique({ where: { id } });
          if (!acc) return NextResponse.json({ ok: false, error: "Karyawan tidak ditemukan." }, { status: 404 });
          await db.employee.update({ where: { id }, data: { tier } });
          const tmpl = waTemplates.tier({ nama: acc.name, tier });
          await queueWa({ phone: acc.phone, name: acc.name, role: "karyawan", event: "tier", message: tmpl, relatedRef: acc.code }).catch(() => undefined);
          return NextResponse.json({ ok: true });
        }
        if (targetKind === "client") {
          const acc = await db.clientAccount.findUnique({ where: { id } });
          if (!acc) return NextResponse.json({ ok: false, error: "Client tidak ditemukan." }, { status: 404 });
          await db.clientAccount.update({ where: { id }, data: { tier } });
          const tmpl = waTemplates.tier({ nama: acc.name, tier });
          await queueWa({ phone: acc.phone, name: acc.name, role: "client", event: "tier", message: tmpl, relatedRef: acc.code }).catch(() => undefined);
          return NextResponse.json({ ok: true });
        }
        return NextResponse.json({ ok: false, error: "Jenis target tidak dikenal." }, { status: 400 });
      }
    }

    /* ── Tiket Dukungan (CEO) ────────────────────────────────────── */
    if (kind === "tiket") {
      if (action === "status") {
        const id = str(d.id);
        const status = str(d.status) ?? "";
        if (!id || !STATUS_TIKET.includes(status)) {
          return NextResponse.json({ ok: false, error: "Data status tiket tidak valid." }, { status: 400 });
        }
        const t = await db.ticket.findUnique({ where: { id } });
        if (!t) return NextResponse.json({ ok: false, error: "Tiket tidak ditemukan." }, { status: 404 });
        await db.ticket.update({ where: { id }, data: { status } });
        await Promise.allSettled([
          audit({ actor: "CEO / Admin", actorRole: "admin", action: "tiket_status", target: t.refCode, detail: status }),
          queueWa({
            phone: process.env.ADMIN_WA_NUMBER?.trim() ?? null,
            name: "CEO / Admin",
            role: "admin",
            event: "tiket",
            message: `🎫 Tiket ${t.refCode} (${t.subject}) status → *${status.toUpperCase()}* (oleh CEO).`,
            relatedRef: t.refCode,
          }),
        ]);
        return NextResponse.json({ ok: true });
      }
      if (action === "assign") {
        const id = str(d.id);
        const employeeId = str(d.employeeId);
        if (!id) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
        const t = await db.ticket.findUnique({ where: { id } });
        if (!t) return NextResponse.json({ ok: false, error: "Tiket tidak ditemukan." }, { status: 404 });
        if (!employeeId) {
          await db.ticket.update({ where: { id }, data: { assigneeId: null, assigneeName: null } });
          return NextResponse.json({ ok: true });
        }
        const emp = await db.employee.findUnique({ where: { id: employeeId } });
        if (!emp) return NextResponse.json({ ok: false, error: "Karyawan tidak ditemukan." }, { status: 404 });
        await db.ticket.update({
          where: { id },
          data: { assigneeId: emp.id, assigneeName: emp.name, status: "diproses" },
        });
        await Promise.allSettled([
          audit({ actor: "CEO / Admin", actorRole: "admin", action: "tiket_assign", target: t.refCode, detail: emp.name }),
          queueWa({
            phone: emp.phone,
            name: emp.name,
            role: "karyawan",
            event: "tiket",
            message: `🎫 Anda ditugaskan menangani tiket *${t.subject}* (${t.refCode}). Buka menu Dukungan di dashboard GUNARA.`,
            relatedRef: t.refCode,
          }),
        ]);
        return NextResponse.json({ ok: true });
      }
      if (action === "balas") {
        const id = str(d.id);
        const message = str(d.message) ?? "";
        if (!id || message.length < 2) {
          return NextResponse.json({ ok: false, error: "Balasan terlalu pendek." }, { status: 400 });
        }
        const t = await db.ticket.findUnique({ where: { id } });
        if (!t) return NextResponse.json({ ok: false, error: "Tiket tidak ditemukan." }, { status: 404 });
        await db.ticketReply.create({
          data: { ticketId: t.id, author: "CEO / Admin", authorRole: "admin", message },
        });
        if (!t.assigneeId) {
          await db.ticket.update({ where: { id }, data: { status: "diproses" } });
        }
        if (t.creatorRole === "client") {
          const cli = await db.clientAccount.findUnique({ where: { id: t.creatorId } });
          if (cli?.status === "active") {
            await queueWa({
              phone: cli.phone,
              name: cli.name,
              role: "client",
              event: "tiket",
              message: waTemplates.tiketBalas({ refCode: t.refCode, oleh: "CEO / Admin" }),
              relatedRef: t.refCode,
            }).catch(() => undefined);
          }
        }
        await audit({ actor: "CEO / Admin", actorRole: "admin", action: "tiket_balas", target: t.refCode }).catch(() => undefined);
        return NextResponse.json({ ok: true });
      }
      if (action === "delete") {
        const id = str(d.id);
        if (!id) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
        await db.ticketReply.deleteMany({ where: { ticketId: id } });
        await db.ticket.delete({ where: { id } });
        return NextResponse.json({ ok: true });
      }
    }

    /* ── Invoice (CEO) ───────────────────────────────────────────── */
    if (kind === "invoice") {
      if (action === "create") {
        const items = parseItems(d.items);
        const clientId = str(d.clientId);
        if (!items) {
          return NextResponse.json({ ok: false, error: "Minimal satu item tagihan yang valid diperlukan." }, { status: 400 });
        }
        let clientName = str(d.clientName) ?? "";
        let clientRow: { id: string; name: string; company: string | null; status: string; phone: string | null } | null = null;
        if (clientId) {
          const found = await db.clientAccount.findUnique({ where: { id: clientId } });
          if (!found) return NextResponse.json({ ok: false, error: "Client tidak ditemukan." }, { status: 404 });
          clientRow = { id: found.id, name: found.name, company: found.company, status: found.status, phone: found.phone };
          clientName = found.company ? `${found.name} · ${found.company}` : found.name;
        }
        if (!clientName) {
          return NextResponse.json({ ok: false, error: "Client wajib dipilih atau nama client diisi." }, { status: 400 });
        }
        const projectId = str(d.projectId);
        let projectRef: string | null = null;
        if (projectId) {
          const p = await db.project.findUnique({ where: { id: projectId } });
          if (p) projectRef = p.refCode;
        }
        const ref = await uniqueCode(generateInvoiceRef, async (r) => !!(await db.invoice.findUnique({ where: { refCode: r } })));
        const created = await db.invoice.create({
          data: {
            refCode: ref,
            clientId: clientRow?.id ?? null,
            clientName,
            projectId: projectId ?? null,
            projectRef,
            items: JSON.stringify(items),
            amount: totalOf(items),
            status: "draft",
            dueDate: str(d.dueDate) ? new Date(str(d.dueDate) as string) : null,
            note: str(d.note),
          },
        });
        await audit({ actor: "CEO / Admin", actorRole: "admin", action: "invoice_buat", target: ref, detail: clientName }).catch(() => undefined);
        return NextResponse.json({ ok: true, refCode: ref, id: created.id });
      }
      if (action === "status") {
        const id = str(d.id);
        const status = str(d.status) ?? "";
        if (!id || !(INVOICE_STATUS as readonly string[]).includes(status)) {
          return NextResponse.json({ ok: false, error: "Status invoice tidak valid." }, { status: 400 });
        }
        const inv = await db.invoice.findUnique({ where: { id } });
        if (!inv) return NextResponse.json({ ok: false, error: "Invoice tidak ditemukan." }, { status: 404 });
        await db.invoice.update({ where: { id }, data: { status } });
        const waPromises: Promise<unknown>[] = [
          audit({ actor: "CEO / Admin", actorRole: "admin", action: "invoice_status", target: inv.refCode, detail: status }),
        ];
        // WA otomatis: terkirim → ke client; dibayar → ke CEO (konfirmasi masuk)
        if (status === "terkirim" && inv.clientId) {
          const cli = await db.clientAccount.findUnique({ where: { id: inv.clientId } });
          if (cli?.status === "active") {
            waPromises.push(
              queueWa({
                phone: cli.phone,
                name: cli.name,
                role: "client",
                event: "invoice",
                message: waTemplates.invoice({
                  refCode: inv.refCode,
                  jumlah: rupiah(inv.amount),
                  jatuhTempo: inv.dueDate ? fmtShort(inv.dueDate) : null,
                  untuk: cli.company ? `${cli.name} · ${cli.company}` : cli.name,
                }),
                relatedRef: inv.refCode,
              })
            );
          }
        }
        if (status === "dibayar") {
          waPromises.push(
            queueWa({
              phone: process.env.ADMIN_WA_NUMBER?.trim() ?? null,
              name: "CEO / Admin",
              role: "admin",
              event: "invoice",
              message: `🧾 Invoice ${inv.refCode} (${inv.clientName}) telah DIBAYAR — Rp ${rupiah(inv.amount)} masuk.`,
              relatedRef: inv.refCode,
            })
          );
        }
        await Promise.allSettled(waPromises);
        return NextResponse.json({ ok: true });
      }
      if (action === "delete") {
        const id = str(d.id);
        if (!id) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
        const inv = await db.invoice.findUnique({ where: { id } });
        await db.invoice.delete({ where: { id } });
        await audit({ actor: "CEO / Admin", actorRole: "admin", action: "invoice_hapus", target: inv?.refCode ?? id }).catch(() => undefined);
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ ok: false, error: "Aksi tidak dikenal." }, { status: 400 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Layanan sedang tidak tersedia." },
      { status: 503 }
    );
  }
}

async function uniqueCode(
  generate: () => string,
  taken: (code: string) => Promise<boolean>
): Promise<string> {
  for (let i = 0; i < 12; i++) {
    const candidate = generate();
    if (!(await taken(candidate))) return candidate;
  }
  return generate();
}

function fmtShort(d: Date): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Bangkok" }).format(d);
}
