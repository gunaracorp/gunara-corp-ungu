import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portalSession } from "@/lib/portal-auth";
import { generateProjectRef } from "@/lib/store";
import { queueWa, waTemplates, COMPANY_WA } from "@/lib/wa";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_KARYAWAN = ["berjalan", "review", "selesai"];
const PRIORITAS = ["rendah", "normal", "tinggi", "urgent"];
const KATEGORI_TIKET = ["umum", "proyek", "tagihan", "teknis"];
const STATUS_TIKET_PORTAL = ["open", "selesai"]; // karyawan/client boleh menutup/menyelesaikan

/**
 * POST /api/portal/actions — mutasi portal (peran dari sesi):
 * - client:   { action: "buat-proyek" | "tulis-catatan" | "tiket" }
 * - karyawan: { action: "ubah-status" | "tulis-catatan" | "tiket" }
 * Aksi tiket: { action: "tiket", sub: "buat"|"balas"|"status", ... }
 */
export async function POST(req: Request) {
  const session = portalSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  const { role, subjectId } = session;

  const body: unknown = await req.json().catch(() => null);
  const b = body as Record<string, unknown> | null;
  const action = typeof b?.action === "string" ? b.action : "";

  try {
    if (role === "client") {
      const client = await db.clientAccount.findUnique({ where: { id: subjectId } });
      if (!client || client.status !== "active") {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
      }

      if (action === "buat-proyek") {
        const title = typeof b?.title === "string" ? b.title.trim() : "";
        const description = typeof b?.description === "string" ? b.description.trim() : "";
        const priority = typeof b?.priority === "string" && PRIORITAS.includes(b.priority) ? b.priority : "normal";
        if (title.length < 4 || description.length < 10) {
          return NextResponse.json(
            { ok: false, error: "Judul minimal 4 karakter dan uraian kebutuhan minimal 10 karakter." },
            { status: 400 }
          );
        }
        let ref = generateProjectRef();
        for (let i = 0; i < 12; i++) {
          const clash = await db.project.findUnique({ where: { refCode: ref } });
          if (!clash) break;
          ref = generateProjectRef();
        }
        const created = await db.project.create({
          data: {
            refCode: ref,
            title,
            description,
            clientId: client.id,
            clientName: client.company ? `${client.name} · ${client.company}` : client.name,
            priority,
            status: "baru",
          },
        });
        await db.projectUpdate.create({
          data: {
            projectId: created.id,
            author: client.name,
            authorRole: "client",
            message: `Permintaan layanan dibuat oleh client: "${title}".`,
          },
        });
        // Pemicu WA otomatis: notifikasi ke CEO/admin atas permintaan baru
        await queueWa({
          phone: process.env.ADMIN_WA_NUMBER?.trim() ?? COMPANY_WA,
          name: "CEO / Admin",
          role: "admin",
          event: "proyek_baru",
          message: waTemplates.proyekBaru({ refCode: created.refCode, title, untuk: client.company ? `${client.name} · ${client.company}` : client.name }),
          relatedRef: created.refCode,
        }).catch(() => undefined);
        return NextResponse.json({ ok: true, refCode: created.refCode });
      }

      if (action === "tulis-catatan") {
        return await addNote(b, subjectId, client.name, "client");
      }

      if (action === "tiket") {
        return await ticketAction(b, { id: subjectId, name: client.name, role: "client", phone: client.phone });
      }

      return NextResponse.json({ ok: false, error: "Aksi tidak tersedia untuk client." }, { status: 400 });
    }

    // role === "karyawan"
    const emp = await db.employee.findUnique({ where: { id: subjectId } });
    if (!emp || emp.status !== "active") {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
    }

    if (action === "ubah-status") {
      const projectId = typeof b?.projectId === "string" ? b.projectId : "";
      const status = typeof b?.status === "string" ? b.status : "";
      const progressRaw = Number(b?.progress);
      if (!projectId || !STATUS_KARYAWAN.includes(status)) {
        return NextResponse.json({ ok: false, error: "Data status tidak valid." }, { status: 400 });
      }
      const project = await db.project.findFirst({ where: { id: projectId, employeeId: subjectId } });
      if (!project) {
        return NextResponse.json({ ok: false, error: "Proyek tidak ditemukan." }, { status: 404 });
      }
      const progress =
        Number.isFinite(progressRaw) && progressRaw >= 0 && progressRaw <= 100
          ? Math.round(progressRaw)
          : status === "selesai"
            ? 100
            : project.progress;
      await db.project.update({
        where: { id: projectId },
        data: { status, progress },
      });
      await db.projectUpdate.create({
        data: {
          projectId,
          author: emp.name,
          authorRole: "karyawan",
          message: `Status diubah menjadi "${status}"${progress !== project.progress ? ` · progres ${progress}%` : ""}.`,
        },
      });
      // Pemicu WA otomatis: client pemilik proyek + CEO/admin
      const tmpl = waTemplates.proyekStatus({
        refCode: project.refCode,
        title: project.title,
        status,
        progress,
        oleh: emp.name,
      });
      await Promise.allSettled([
        (async () => {
          if (project.clientId) {
            const cli = await db.clientAccount.findUnique({ where: { id: project.clientId } });
            if (cli?.status === "active") {
              await queueWa({ phone: cli.phone, name: cli.name, role: "client", event: "proyek_status", message: tmpl, relatedRef: project.refCode });
            }
          }
        })(),
        queueWa({
          phone: process.env.ADMIN_WA_NUMBER?.trim() ?? COMPANY_WA,
          name: "CEO / Admin",
          role: "admin",
          event: "proyek_status",
          message: tmpl,
          relatedRef: project.refCode,
        }),
      ]);
      return NextResponse.json({ ok: true });
    }

    if (action === "tulis-catatan") {
      return await addNote(b, subjectId, emp.name, "karyawan");
    }

    if (action === "tiket") {
      return await ticketAction(b, { id: subjectId, name: emp.name, role: "karyawan", phone: emp.phone });
    }

    return NextResponse.json({ ok: false, error: "Aksi tidak tersedia untuk karyawan." }, { status: 400 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Layanan sedang tidak tersedia. Coba beberapa saat lagi." },
      { status: 503 }
    );
  }
}

async function addNote(
  b: Record<string, unknown> | null,
  subjectId: string,
  author: string,
  authorRole: "karyawan" | "client"
) {
  const projectId = typeof b?.projectId === "string" ? b.projectId : "";
  const message = typeof b?.message === "string" ? b.message.trim() : "";
  if (!projectId || message.length < 2) {
    return NextResponse.json({ ok: false, error: "Catatan terlalu pendek." }, { status: 400 });
  }
  const project = await db.project.findFirst({
    where: authorRole === "karyawan" ? { id: projectId, employeeId: subjectId } : { id: projectId, clientId: subjectId },
  });
  if (!project) {
    return NextResponse.json({ ok: false, error: "Proyek tidak ditemukan." }, { status: 404 });
  }
  await db.projectUpdate.create({
    data: { projectId, author, authorRole, message },
  });
  return NextResponse.json({ ok: true });
}

/* ── Tiket Dukungan (portal karyawan & client) ─────────────────────── */

interface TicketActor {
  id: string;
  name: string;
  role: "karyawan" | "client";
  phone: string | null;
}

async function ticketAction(
  b: Record<string, unknown> | null,
  actor: TicketActor
): Promise<NextResponse> {
  const sub = typeof b?.sub === "string" ? b.sub : "";
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  /* — buat tiket baru — */
  if (sub === "buat") {
    const subject = str(b?.subject);
    const body = str(b?.body);
    const category = KATEGORI_TIKET.includes(str(b?.category)) ? str(b?.category) : "umum";
    const priority = PRIORITAS.includes(str(b?.priority)) ? str(b?.priority) : "normal";
    if (subject.length < 5 || body.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Subjek minimal 5 karakter dan isi tiket minimal 10 karakter." },
        { status: 400 }
      );
    }
    let ref = `TIK-${Array.from({ length: 4 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("")}-${Array.from({ length: 4 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("")}`;
    for (let i = 0; i < 12; i++) {
      const clash = await db.ticket.findUnique({ where: { refCode: ref } });
      if (!clash) break;
      ref = `TIK-${Array.from({ length: 4 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("")}-${Array.from({ length: 4 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("")}`;
    }
    const created = await db.ticket.create({
      data: {
        refCode: ref,
        subject,
        body,
        category,
        priority,
        creatorId: actor.id,
        creatorName: actor.name,
        creatorRole: actor.role,
      },
    });
    await db.ticketReply.create({
      data: { ticketId: created.id, author: actor.name, authorRole: actor.role, message: body },
    });
    await Promise.allSettled([
      audit({ actor: actor.name, actorRole: actor.role, action: "tiket_buat", target: ref, detail: subject }),
      queueWa({
        phone: process.env.ADMIN_WA_NUMBER?.trim() ?? COMPANY_WA,
        name: "CEO / Admin",
        role: "admin",
        event: "tiket",
        message: waTemplates.tiket({ refCode: ref, subjek: subject, oleh: actor.name, prioritas: priority }),
        relatedRef: ref,
      }),
    ]);
    return NextResponse.json({ ok: true, refCode: ref });
  }

  /* — balas tiket — */
  if (sub === "balas") {
    const ticketId = str(b?.ticketId);
    const message = str(b?.message);
    if (!ticketId || message.length < 2) {
      return NextResponse.json({ ok: false, error: "Balasan terlalu pendek." }, { status: 400 });
    }
    const ticket = await db.ticket.findFirst({
      where: actor.role === "client" ? { id: ticketId, creatorId: actor.id } : { id: ticketId },
    });
    if (!ticket || ticket.status === "ditutup") {
      return NextResponse.json({ ok: false, error: "Tiket tidak ditemukan atau sudah ditutup." }, { status: 404 });
    }
    await db.ticketReply.create({
      data: { ticketId: ticket.id, author: actor.name, authorRole: actor.role, message },
    });
    // Jika karyawan membalas tiket client → otomatis beri assignee bila kosong
    if (actor.role === "karyawan" && !ticket.assigneeId) {
      await db.ticket.update({ where: { id: ticket.id }, data: { assigneeId: actor.id, assigneeName: actor.name, status: "diproses" } });
    }
    // WA: balasan dari client → ke admin; dari karyawan → ke pembuat tiket bila client
    if (actor.role === "client") {
      await queueWa({
        phone: process.env.ADMIN_WA_NUMBER?.trim() ?? COMPANY_WA,
        name: "CEO / Admin",
        role: "admin",
        event: "tiket",
        message: waTemplates.tiketBalas({ refCode: ticket.refCode, oleh: actor.name }),
        relatedRef: ticket.refCode,
      }).catch(() => undefined);
    } else if (ticket.creatorRole === "client") {
      const cli = await db.clientAccount.findUnique({ where: { id: ticket.creatorId } });
      if (cli?.status === "active") {
        await queueWa({
          phone: cli.phone,
          name: cli.name,
          role: "client",
          event: "tiket",
          message: waTemplates.tiketBalas({ refCode: ticket.refCode, oleh: actor.name }),
          relatedRef: ticket.refCode,
        }).catch(() => undefined);
      }
    }
    await audit({ actor: actor.name, actorRole: actor.role, action: "tiket_balas", target: ticket.refCode }).catch(() => undefined);
    return NextResponse.json({ ok: true });
  }

  /* — ubah status tiket (karyawan penangan/pembuat, atau client menutup sendiri) — */
  if (sub === "status") {
    const ticketId = str(b?.ticketId);
    const status = str(b?.status);
    if (!ticketId || !STATUS_TIKET_PORTAL.includes(status)) {
      return NextResponse.json({ ok: false, error: "Status tiket tidak valid." }, { status: 400 });
    }
    const ticket = await db.ticket.findFirst({
      where: actor.role === "client" ? { id: ticketId, creatorId: actor.id } : { id: ticketId },
    });
    if (!ticket) {
      return NextResponse.json({ ok: false, error: "Tiket tidak ditemukan." }, { status: 404 });
    }
    await db.ticket.update({ where: { id: ticket.id }, data: { status } });
    if (actor.role === "karyawan" && !ticket.assigneeId) {
      await db.ticket.update({ where: { id: ticket.id }, data: { assigneeId: actor.id, assigneeName: actor.name } });
    }
    await Promise.allSettled([
      audit({ actor: actor.name, actorRole: actor.role, action: "tiket_status", target: ticket.refCode, detail: status }),
      queueWa({
        phone: process.env.ADMIN_WA_NUMBER?.trim() ?? COMPANY_WA,
        name: "CEO / Admin",
        role: "admin",
        event: "tiket",
        message: `🎫 Tiket ${ticket.refCode} (${ticket.subject}) status berubah menjadi *${status.toUpperCase()}* oleh ${actor.name}.`,
        relatedRef: ticket.refCode,
      }),
    ]);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Sub-aksi tiket tidak dikenal." }, { status: 400 });
}
