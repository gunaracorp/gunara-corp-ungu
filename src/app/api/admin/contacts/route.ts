import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { mem } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUS = new Set(["new", "read", "replied"]);

/** PATCH /api/admin/contacts — CEO menandai tiket: dibaca / sudah dibalas. */
export async function PATCH(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  const body: unknown = await req.json().catch(() => null);
  const b = (body ?? {}) as Record<string, unknown>;
  const id = String(b.id ?? "").trim();
  const status = String(b.status ?? "").trim();
  if (!id || !VALID_STATUS.has(status)) {
    return NextResponse.json(
      { ok: false, error: "id dan status (new|read|replied) diperlukan" },
      { status: 400 }
    );
  }
  try {
    await db.contactMessage.update({ where: { id }, data: { status } });
  } catch {
    const idx = mem.contacts.findIndex((c) => c.id === id);
    if (idx !== -1) mem.contacts[idx].status = status;
  }
  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/contacts?id=... — hapus tiket. */
export async function DELETE(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  const id = new URL(req.url).searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "id diperlukan" }, { status: 400 });
  }
  try {
    await db.contactMessage.delete({ where: { id } });
  } catch {
    mem.contacts = mem.contacts.filter((c) => c.id !== id);
  }
  return NextResponse.json({ ok: true });
}
