import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { mem } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** DELETE /api/admin/subscribers?id=... — CEO menghapus pelanggan newsletter. */
export async function DELETE(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  const id = new URL(req.url).searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "id diperlukan" }, { status: 400 });
  }
  try {
    await db.newsletterSubscriber.delete({ where: { id } });
  } catch {
    mem.subscribers = mem.subscribers.filter((s) => s.id !== id);
  }
  return NextResponse.json({ ok: true });
}
