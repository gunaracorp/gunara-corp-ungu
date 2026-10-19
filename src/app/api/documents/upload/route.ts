import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { portalSession } from "@/lib/portal-auth";
import { dokumenTersisa } from "@/lib/tiers";
import { queueWa, waTemplates, ringkas } from "@/lib/wa";
import { UPLOAD_DIR } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const EKSTENSI_OK = [
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv", "txt",
  "zip", "rar", "7z", "png", "jpg", "jpeg", "webp", "gif", "svg", "mp4", "mov",
];

/**
 * POST /api/documents/upload — unggah dokumen (multipart/form-data):
 * - file        : berkas (wajib, maks 10 MB)
 * - projectId   : opsional, kaitkan ke proyek
 * - visibility  : semua | karyawan | client (default "semua")
 * - note        : catatan singkat (opsional)
 *
 * Kuota per tier portal: STANDARD 5 · PRO 25 · ELITE 100 · GOD tak terbatas.
 * CEO/Panel CEO tanpa batas. Setiap unggahan memicu notifikasi WA otomatis.
 */
export async function POST(req: Request) {
  const admin = isAdmin(req);
  const session = portalSession(req);
  if (!admin && !session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Format unggahan tidak valid." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "Berkas tidak ditemukan." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ ok: false, error: "Ukuran berkas melebihi 10 MB." }, { status: 400 });
  }
  const originalName = file.name || "dokumen";
  const ext = (originalName.split(".").pop() ?? "").toLowerCase();
  if (!EKSTENSI_OK.includes(ext)) {
    return NextResponse.json(
      { ok: false, error: `Format .${ext || "?"} tidak didukung. Gunakan: ${EKSTENSI_OK.slice(0, 10).join(", ")}…` },
      { status: 400 }
    );
  }

  const noteRaw = form.get("note");
  const note = typeof noteRaw === "string" ? noteRaw.trim().slice(0, 300) : "";
  const visibilityRaw = form.get("visibility");
  const visibility = typeof visibilityRaw === "string" && ["semua", "karyawan", "client"].includes(visibilityRaw)
    ? visibilityRaw
    : "semua";
  const projectIdRaw = form.get("projectId");
  const projectId = typeof projectIdRaw === "string" ? projectIdRaw.trim() : "";

  try {
    let uploaderId = "admin";
    let uploaderName = "CEO / Admin";
    let uploaderRole = "admin";
    let quotaLeft: number | null = null;

    if (!admin && session) {
      const { role, subjectId } = session;
      const account =
        role === "karyawan"
          ? await db.employee.findUnique({ where: { id: subjectId } })
          : await db.clientAccount.findUnique({ where: { id: subjectId } });
      if (!account || account.status !== "active") {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
      }
      uploaderId = account.id;
      uploaderName = account.name;
      uploaderRole = role;
      const terpakai = await db.documentFile.count({ where: { uploaderId: account.id } });
      quotaLeft = dokumenTersisa(account.tier, terpakai);
      if (quotaLeft !== null && quotaLeft <= 0) {
        return NextResponse.json(
          {
            ok: false,
            error: `Kuota dokumen tier ${account.tier} sudah habis. Aktifkan tier lebih tinggi lewat kode aktivasi (GOD MODE = tak terbatas).`,
            quota: { terpakai, tier: account.tier },
          },
          { status: 402 }
        );
      }
    }

    // Validasi proyek + hak akses terhadap proyek
    let projectRef: string | null = null;
    let project: { id: string; refCode: string; clientId: string | null; employeeId: string | null; title: string } | null = null;
    if (projectId) {
      project = await db.project.findUnique({ where: { id: projectId } });
      if (!project) {
        return NextResponse.json({ ok: false, error: "Proyek tidak ditemukan." }, { status: 404 });
      }
      if (!admin && session) {
        const owns =
          (session.role === "karyawan" && project.employeeId === session.subjectId) ||
          (session.role === "client" && project.clientId === session.subjectId);
        if (!owns) {
          return NextResponse.json({ ok: false, error: "Anda tidak tergabung pada proyek ini." }, { status: 403 });
        }
      }
      projectRef = project.refCode;
    }

    await mkdir(UPLOAD_DIR, { recursive: true });
    const storedName = `${randomBytes(12).toString("hex")}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, storedName), bytes);

    const created = await db.documentFile.create({
      data: {
        storedName,
        originalName,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        projectId: project?.id ?? null,
        projectRef,
        visibility,
        uploaderId,
        uploaderName,
        uploaderRole,
        note: note || null,
      },
    });

    if (project) {
      await db.projectUpdate.create({
        data: {
          projectId: project.id,
          author: uploaderName,
          authorRole: uploaderRole,
          message: `Dokumen "${originalName}" diunggah${note ? ` — ${ringkas(note, 80)}` : ""}.`,
        },
      });
    }

    // Pemicu WA otomatis ke pihak terkait
    const tmpl = waTemplates.dokumen({ nama: originalName, oleh: uploaderName, proyek: projectRef });
    const targets: { phone: string | null; name: string; role: "admin" | "karyawan" | "client" }[] = [];
    const adminPhone = process.env.ADMIN_WA_NUMBER?.trim() ?? null;
    if (!admin) targets.push({ phone: adminPhone, name: "CEO / Admin", role: "admin" });
    if (project) {
      if (project.employeeId && project.employeeId !== uploaderId) {
        const emp = await db.employee.findUnique({ where: { id: project.employeeId } });
        if (emp?.status === "active") targets.push({ phone: emp.phone, name: emp.name, role: "karyawan" });
      }
      if (project.clientId && project.clientId !== uploaderId) {
        const cli = await db.clientAccount.findUnique({ where: { id: project.clientId } });
        if (cli?.status === "active") targets.push({ phone: cli.phone, name: cli.name, role: "client" });
      }
    }
    await Promise.allSettled(
      targets.map((t) =>
        queueWa({
          phone: t.phone,
          name: t.name,
          role: t.role,
          event: "dokumen",
          message: tmpl,
          relatedRef: projectRef ?? originalName,
        })
      )
    );

    return NextResponse.json({
      ok: true,
      item: {
        id: created.id,
        originalName: created.originalName,
        size: created.size,
        projectRef: created.projectRef,
        visibility: created.visibility,
        quotaLeft,
        createdAt: created.createdAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Gagal menyimpan dokumen. Coba lagi." }, { status: 503 });
  }
}
