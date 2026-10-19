import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portalSession } from "@/lib/portal-auth";
import { normalizePhone, serWa } from "@/lib/wa";
import { dokumenTersisa, tierMeta } from "@/lib/tiers";
import { serInvoice } from "@/lib/invoice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/portal/data — payload dashboard sesuai peran sesi:
 * - karyawan → profil + proyek yang ditugaskan + pengumuman + tiket + tier
 * - client   → profil + proyek miliknya + pengumuman + tiket sendiri + invoice
 * Proyek disertai riwayat update (feed kolaborasi).
 */
function serializeTicket(
  t: {
    id: string;
    refCode: string;
    subject: string;
    body: string;
    category: string;
    priority: string;
    status: string;
    creatorId: string;
    creatorName: string;
    creatorRole: string;
    assigneeId: string | null;
    assigneeName: string | null;
    createdAt: Date;
    updatedAt: Date;
  },
  replies: { id: string; author: string; authorRole: string; message: string; createdAt: Date }[]
) {
  return {
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
    replies: replies
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map((r) => ({
        id: r.id,
        author: r.author,
        authorRole: r.authorRole,
        message: r.message,
        createdAt: r.createdAt.toISOString(),
      })),
  };
}

export async function GET(req: Request) {
  const session = portalSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  const { role, subjectId } = session;

  try {
    if (role === "karyawan") {
      const emp = await db.employee.findUnique({ where: { id: subjectId } });
      if (!emp || emp.status !== "active") {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
      }
      const [projects, announcementRows, myDocs, waRows, ticketRows, invoices] = await Promise.all([
        db.project.findMany({
          where: { employeeId: subjectId },
          orderBy: { updatedAt: "desc" },
          take: 200,
        }),
        db.announcement.findMany({
          where: { audience: { in: ["karyawan", "semua"] } },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        db.documentFile.count({ where: { uploaderId: subjectId } }),
        db.waNotification.findMany({
          where: {
            OR: [
              { toRole: "karyawan" },
              ...(normalizePhone(emp.phone) ? [{ toPhone: normalizePhone(emp.phone)! }] : []),
            ],
          },
          orderBy: { createdAt: "desc" },
          take: 30,
        }),
        db.ticket.findMany({ orderBy: { updatedAt: "desc" }, take: 100 }),
        db.invoice.findMany({ where: { clientId: subjectId }, orderBy: { createdAt: "desc" }, take: 50 }),
      ]);
      const updates = projects.length
        ? await db.projectUpdate.findMany({
            where: { projectId: { in: projects.map((p) => p.id) } },
            orderBy: { createdAt: "desc" },
            take: 400,
          })
        : [];
      const ticketReplies = ticketRows.length
        ? await db.ticketReply.findMany({
            where: { ticketId: { in: ticketRows.map((t) => t.id) } },
            orderBy: { createdAt: "asc" },
            take: 600,
          })
        : [];
      return NextResponse.json({
        ok: true,
        role,
        profile: {
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          position: emp.position,
          department: emp.department,
          tier: emp.tier,
          lastAccessAt: emp.lastAccessAt ? emp.lastAccessAt.toISOString() : null,
          createdAt: emp.createdAt.toISOString(),
        },
        tierInfo: {
          ...tierMeta(emp.tier),
          dokumenTerpakai: myDocs,
          dokumenSisa: dokumenTersisa(emp.tier, myDocs),
        },
        waItems: waRows.map(serWa),
        projects: projects.map((p) => serializeProject(p, updates.filter((u) => u.projectId === p.id))),
        tickets: ticketRows.map((t) =>
          serializeTicket(t, ticketReplies.filter((r) => r.ticketId === t.id))
        ),
        invoices: [],
        announcements: announcementRows.map((a) => ({
          id: a.id,
          title: a.title,
          body: a.body,
          createdAt: a.createdAt.toISOString(),
        })),
        stats: {
          total: projects.length,
          berjalan: projects.filter((p) => p.status === "berjalan").length,
          review: projects.filter((p) => p.status === "review").length,
          selesai: projects.filter((p) => p.status === "selesai").length,
          tiketOpen: ticketRows.filter((t) => t.status === "open" || t.status === "diproses").length,
        },
      });
    }

    // role === "client"
    const client = await db.clientAccount.findUnique({ where: { id: subjectId } });
    if (!client || client.status !== "active") {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
    }
    const [projects, announcementRows, myDocs, waRows, ticketRows, invoices] = await Promise.all([
      db.project.findMany({
        where: { clientId: subjectId },
        orderBy: { updatedAt: "desc" },
        take: 200,
      }),
      db.announcement.findMany({
        where: { audience: { in: ["client", "semua"] } },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.documentFile.count({ where: { uploaderId: subjectId } }),
      db.waNotification.findMany({
        where: {
          OR: [
            { toRole: "client" },
            ...(normalizePhone(client.phone) ? [{ toPhone: normalizePhone(client.phone)! }] : []),
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      db.ticket.findMany({ where: { creatorId: subjectId }, orderBy: { updatedAt: "desc" }, take: 100 }),
      db.invoice.findMany({ where: { clientId: subjectId }, orderBy: { createdAt: "desc" }, take: 50 }),
    ]);
    const updates = projects.length
      ? await db.projectUpdate.findMany({
          where: { projectId: { in: projects.map((p) => p.id) } },
          orderBy: { createdAt: "desc" },
          take: 400,
        })
      : [];
    const ticketReplies = ticketRows.length
      ? await db.ticketReply.findMany({
          where: { ticketId: { in: ticketRows.map((t) => t.id) } },
          orderBy: { createdAt: "asc" },
          take: 600,
        })
      : [];
    return NextResponse.json({
      ok: true,
      role,
      profile: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        industry: client.industry,
        tier: client.tier,
        lastAccessAt: client.lastAccessAt ? client.lastAccessAt.toISOString() : null,
        createdAt: client.createdAt.toISOString(),
      },
      tierInfo: {
        ...tierMeta(client.tier),
        dokumenTerpakai: myDocs,
        dokumenSisa: dokumenTersisa(client.tier, myDocs),
      },
      waItems: waRows.map(serWa),
      projects: projects.map((p) => serializeProject(p, updates.filter((u) => u.projectId === p.id))),
      tickets: ticketRows.map((t) =>
        serializeTicket(t, ticketReplies.filter((r) => r.ticketId === t.id))
      ),
      invoices: invoices.map(serInvoice),
      announcements: announcementRows.map((a) => ({
        id: a.id,
        title: a.title,
        body: a.body,
        createdAt: a.createdAt.toISOString(),
      })),
      stats: {
        total: projects.length,
        berjalan: projects.filter((p) => p.status === "berjalan").length,
        review: projects.filter((p) => p.status === "review").length,
        selesai: projects.filter((p) => p.status === "selesai").length,
        tiketOpen: ticketRows.filter((t) => t.status === "open" || t.status === "diproses").length,
        invoiceTerkirim: invoices.filter((i) => i.status === "terkirim").length,
        invoiceBelumDibayar: invoices
          .filter((i) => i.status === "terkirim")
          .reduce((a, i) => a + i.amount, 0),
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Layanan sedang tidak tersedia. Coba beberapa saat lagi." },
      { status: 503 }
    );
  }
}

function serializeProject(
  p: {
    id: string;
    refCode: string;
    title: string;
    description: string;
    clientName: string;
    status: string;
    priority: string;
    progress: number;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
  updates: { id: string; author: string; authorRole: string; message: string; createdAt: Date }[]
) {
  return {
    id: p.id,
    refCode: p.refCode,
    title: p.title,
    description: p.description,
    clientName: p.clientName,
    status: p.status,
    priority: p.priority,
    progress: p.progress,
    dueDate: p.dueDate ? p.dueDate.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    updates: updates
      .slice(0, 40)
      .map((u) => ({
        id: u.id,
        author: u.author,
        authorRole: u.authorRole,
        message: u.message,
        createdAt: u.createdAt.toISOString(),
      })),
  };
}
