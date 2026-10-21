import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mem } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TYPES = new Set(["general", "booking", "career", "oracle-escalation"]);

/**
 * Engagement log — every brief the Councils receive is persisted via Prisma.
 * If the database is unreachable (e.g. minimal shared hosting), the brief is
 * held in the SHARED memory store so the CEO panel still sees it.
 */

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
    }

    const b = body as Record<string, unknown>;
    const name = String(b.name ?? "").trim();
    const email = String(b.email ?? "").trim();
    const company = String(b.company ?? "").trim();
    const budget = String(b.budget ?? "").trim();
    const role = String(b.role ?? "").trim();
    const type = VALID_TYPES.has(String(b.type ?? "general"))
      ? String(b.type ?? "general")
      : "general";
    const challenge = String(b.challenge ?? "").trim();

    if (name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Nama diperlukan (minimal 2 karakter)." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Email valid diperlukan — kejelasan harus tahu harus mendarat di mana." },
        { status: 400 }
      );
    }
    if (challenge.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Ceritakan sedikit lebih banyak — brief penting butuh minimal 10 karakter." },
        { status: 400 }
      );
    }
    if (challenge.length > 4000 || name.length > 120 || email.length > 200) {
      return NextResponse.json(
        { ok: false, error: "Payload melebihi kapasitas ruang dewan." },
        { status: 400 }
      );
    }

    // Ceremonial deliberation pause (feels deliberate, dampens spam bursts)
    await new Promise((r) => setTimeout(r, 500));

    const refCode = `GUNARA-${Date.now().toString(36).toUpperCase()}`;

    try {
      await db.contactMessage.create({
        data: {
          refCode,
          name,
          email,
          company: company || null,
          budget: budget || null,
          role: role || null,
          type,
          challenge,
        },
      });
      console.log(`[contact] persisted ${refCode} (${type})`);
    } catch (dbError) {
      // Shared-hosting fallback: hold in the shared chamber memory (visible to Panel CEO)
      mem.contacts.unshift({
        id: refCode,
        refCode,
        name,
        email,
        company: company || null,
        budget: budget || null,
        role: role || null,
        type,
        challenge,
        status: "new",
        createdAt: new Date().toISOString(),
      });
      if (mem.contacts.length > 500) mem.contacts.pop();
      console.warn(`[contact] DB unavailable — ${refCode} held in chamber memory`, dbError);
    }

    return NextResponse.json({
      ok: true,
      id: refCode,
      message: "46 Dewan Pakar telah menghadir untuk brief Anda.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ruang dewan sedang tidak dapat dihubungi." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const total = await db.contactMessage.count();
    return NextResponse.json({ ok: true, total, source: "db" });
  } catch {
    return NextResponse.json({ ok: true, total: mem.contacts.length, source: "memory" });
  }
}
