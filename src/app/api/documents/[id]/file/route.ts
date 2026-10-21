import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { portalSession } from "@/lib/portal-auth";
import { UPLOAD_DIR } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/documents/[id]/file — unduh / pratinjau berkas dokumen.
 * Akses tervalidasi: CEO/admin (semua), portal sesuai visibilitas,
 * pengunggah, atau keanggotaan proyek terkait.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = isAdmin(req);
  const session = admin ? null : portalSession(req);
  if (!admin && !session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }

  try {
    const doc = await db.documentFile.findUnique({ where: { id } });
    if (!doc) {
      return NextResponse.json({ ok: false, error: "Dokumen tidak ditemukan." }, { status: 404 });
    }

    if (session) {
      const { role, subjectId } = session;
      let allowed = doc.uploaderId === subjectId || doc.visibility === role || doc.visibility === "semua";
      if (!allowed && doc.projectId) {
        const project = await db.project.findUnique({
          where: { id: doc.projectId },
          select: { employeeId: true, clientId: true },
        });
        allowed = !!project && (project.employeeId === subjectId || project.clientId === subjectId);
      }
      if (!allowed) {
        return NextResponse.json({ ok: false, error: "Akses ditolak untuk dokumen ini." }, { status: 403 });
      }
    }

    const buf = await readFile(path.join(UPLOAD_DIR, doc.storedName));
    const download = new URL(req.url).searchParams.get("download") === "1";
    const safeName = doc.originalName.replace(/[^\w.\- ]+/g, "_");
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Length": String(buf.length),
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${safeName}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Berkas tidak dapat dibaca." }, { status: 404 });
  }
}
