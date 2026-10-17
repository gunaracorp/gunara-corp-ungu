import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { generateUniqueCode, mem, type MemMember } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIERS = new Set(["VVIP", "GOLD", "PLATINUM"]);

function toMemMember(m: {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  tier: string;
  code: string;
  status: string;
  notes: string | null;
  validUntil: Date | null;
  lastAccessAt: Date | null;
  createdAt: Date;
}): MemMember {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    company: m.company,
    tier: m.tier,
    code: m.code,
    status: m.status,
    notes: m.notes,
    validUntil: m.validUntil ? m.validUntil.toISOString() : null,
    lastAccessAt: m.lastAccessAt ? m.lastAccessAt.toISOString() : null,
    createdAt: m.createdAt.toISOString(),
  };
}

/** POST /api/admin/members — CEO mendaftarkan member VVIP baru + kode personal. */
export async function POST(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }

  const body: unknown = await req.json().catch(() => null);
  const b = (body ?? {}) as Record<string, unknown>;
  const name = String(b.name ?? "").trim();
  const email = String(b.email ?? "").trim() || null;
  const phone = String(b.phone ?? "").trim() || null;
  const company = String(b.company ?? "").trim() || null;
  const notes = String(b.notes ?? "").trim() || null;
  const tier = TIERS.has(String(b.tier ?? "VVIP")) ? String(b.tier ?? "VVIP") : "VVIP";
  const validUntilRaw = String(b.validUntil ?? "").trim();
  const validUntil = validUntilRaw ? new Date(validUntilRaw) : null;

  if (name.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Nama member diperlukan (minimal 2 karakter)." },
      { status: 400 }
    );
  }
  if (validUntilRaw && (!validUntil || Number.isNaN(validUntil.getTime()))) {
    return NextResponse.json(
      { ok: false, error: "Tanggal masa berlaku tidak valid." },
      { status: 400 }
    );
  }

  const code = await generateUniqueCode(tier);

  try {
    const created = await db.vvipMember.create({
      data: {
        name,
        email,
        phone,
        company,
        tier,
        code,
        notes,
        validUntil,
      },
    });
    return NextResponse.json({ ok: true, member: toMemMember(created) });
  } catch {
    const local: MemMember = {
      id: `mem-${Date.now().toString(36)}`,
      name,
      email,
      phone,
      company,
      tier,
      code,
      status: "active",
      notes,
      validUntil: validUntil ? validUntil.toISOString() : null,
      lastAccessAt: null,
      createdAt: new Date().toISOString(),
    };
    mem.members.unshift(local);
    return NextResponse.json({ ok: true, member: local, source: "memory" });
  }
}

/** PATCH /api/admin/members — aktifkan / tangguhkan / ubah tier & masa berlaku. */
export async function PATCH(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }

  const body: unknown = await req.json().catch(() => null);
  const b = (body ?? {}) as Record<string, unknown>;
  const id = String(b.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "id member diperlukan" }, { status: 400 });
  }

  const data: {
    status?: string;
    tier?: string;
    validUntil?: Date | null;
    notes?: string | null;
  } = {};
  if (b.status === "active" || b.status === "suspended") data.status = b.status;
  if (typeof b.tier === "string" && TIERS.has(b.tier)) data.tier = b.tier;
  if (typeof b.notes === "string") data.notes = b.notes.trim() || null;
  if (typeof b.validUntil === "string") {
    data.validUntil = b.validUntil.trim() ? new Date(b.validUntil) : null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ ok: false, error: "tidak ada perubahan" }, { status: 400 });
  }

  try {
    const updated = await db.vvipMember.update({ where: { id }, data });
    return NextResponse.json({ ok: true, member: toMemMember(updated) });
  } catch {
    const idx = mem.members.findIndex((m) => m.id === id);
    if (idx === -1) {
      return NextResponse.json({ ok: false, error: "member tidak ditemukan" }, { status: 404 });
    }
    if (data.status) mem.members[idx].status = data.status;
    if (data.tier) mem.members[idx].tier = data.tier;
    if (data.notes !== undefined) mem.members[idx].notes = data.notes;
    if (data.validUntil !== undefined) {
      mem.members[idx].validUntil = data.validUntil ? data.validUntil.toISOString() : null;
    }
    return NextResponse.json({ ok: true, member: mem.members[idx], source: "memory" });
  }
}

/** DELETE /api/admin/members?id=... — cabut keanggotaan. */
export async function DELETE(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  const id = new URL(req.url).searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "id member diperlukan" }, { status: 400 });
  }
  try {
    await db.vvipMember.delete({ where: { id } });
  } catch {
    mem.members = mem.members.filter((m) => m.id !== id);
  }
  return NextResponse.json({ ok: true });
}
