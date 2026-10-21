import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import {
  createBackup,
  deleteBackup,
  getBackupStatus,
  listBackups,
  readBackup,
} from "@/lib/backup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /api/admin/backup — backup DB + uploads. Khusus Panel CEO.
 *   GET            → status scheduler + daftar arsip
 *   GET ?id=NAME   → unduh arsip (.tar.gz)
 *   POST           → buat backup sekarang
 *   DELETE ?id=    → hapus arsip
 */

export async function GET(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ ok: false, error: "Akses ditolak." }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (id) {
    try {
      const buf = readBackup(id);
      return new NextResponse(new Uint8Array(buf), {
        headers: {
          "Content-Type": "application/gzip",
          "Content-Disposition": `attachment; filename="${id}"`,
          "Content-Length": String(buf.length),
        },
      });
    } catch (e) {
      return NextResponse.json(
        { ok: false, error: e instanceof Error ? e.message : "Gagal membuka arsip." },
        { status: 404 },
      );
    }
  }
  return NextResponse.json({ ok: true, status: getBackupStatus(), backups: listBackups() });
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ ok: false, error: "Akses ditolak." }, { status: 403 });
  try {
    const info = await createBackup("manual");
    return NextResponse.json({ ok: true, backup: info, status: getBackupStatus(), backups: listBackups() });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Backup gagal." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ ok: false, error: "Akses ditolak." }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Parameter id wajib." }, { status: 400 });
  try {
    deleteBackup(id);
    return NextResponse.json({ ok: true, status: getBackupStatus(), backups: listBackups() });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Hapus gagal." },
      { status: 400 },
    );
  }
}
