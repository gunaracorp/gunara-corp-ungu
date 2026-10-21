import { unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { portalSession } from "@/lib/portal-auth";
import { UPLOAD_DIR } from "@/lib/uploads";
import { dokumenTersisa, tierMeta } from "@/lib/tiers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/documents — daftar dokumen sesuai peran:
 * - CEO/admin : seluruh dokumen + statistik kuota
 * - karyawan  : miliknya + visibilitas semua/karyawan + dokumen proyeknya
 * - client    : miliknya + visibilitas semua/client + dokumen proyeknya
 * DELETE /api/documents?id=… — CEO/admin atau pengunggah asli.
 */
export async function GET(req: Request) {
  const admin = isAdmin(req);
  const session = admin ? null : portalSession(req);
  if (!admin && !session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }

  try {
    let where: Record<string, unknown> = {};
    let quota: { tier: string; terpakai: number; sisa: number | null; maks: number | null } | null = null;

    if (session) {
      const { role, subjectId } = session;
      const account =
        role === "karyawan"
          ? await db.employee.findUnique({ where: { id: subjectId } })
          : await db.clientAccount.findUnique({ where: { id: subjectId } });
      if (!account || account.status !== "active") {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
      }
      const myProjects = await db.project.findMany({
        where: role === "karyawan" ? { employeeId: subjectId } : { clientId: subjectId },
        select: { id: true },
      });
      where = {
        OR: [
          { uploaderId: subjectId },
          { visibility: role },
          { visibility: "semua" },
          { projectId: { in: myProjects.map((p) => p.id) } },
        ],
      };
      const terpakai = await db.documentFile.count({ where: { uploaderId: subjectId } });
      const meta = tierMeta(account.tier);
      quota = {
        tier: account.tier,
        terpakai,
        sisa: dokumenTersisa(account.tier, terpakai),
        maks: meta.quotaDokumen,
      };
    }

    const rows = await db.documentFile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({
      ok: true,
      quota,
      items: rows.map((d) => ({
        id: d.id,
        originalName: d.originalName,
        mimeType: d.mimeType,
        size: d.size,
        projectId: d.projectId,
        projectRef: d.projectRef,
        visibility: d.visibility,
        uploaderId: d.uploaderId,
        uploaderName: d.uploaderName,
        uploaderRole: d.uploaderRole,
        note: d.note,
        createdAt: d.createdAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Layanan dokumen tidak tersedia." }, { status: 503 });
  }
}

export async function DELETE(req: Request) {
  const admin = isAdmin(req);
  const session = admin ? null : portalSession(req);
  if (!admin && !session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "ID dokumen wajib." }, { status: 400 });
  }
  try {
    const doc = await db.documentFile.findUnique({ where: { id } });
    if (!doc) {
      return NextResponse.json({ ok: false, error: "Dokumen tidak ditemukan." }, { status: 404 });
    }
    if (!admin && doc.uploaderId !== session!.subjectId) {
      return NextResponse.json({ ok: false, error: "Hanya pengunggah atau CEO yang dapat menghapus." }, { status: 403 });
    }
    await db.documentFile.delete({ where: { id } });
    try {
      await unlink(path.join(UPLOAD_DIR, doc.storedName));
    } catch {
      /* berkas fisik mungkin sudah hilang — abaikan */
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Gagal menghapus dokumen." }, { status: 503 });
  }
}
