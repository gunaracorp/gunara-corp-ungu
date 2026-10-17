import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { findMemberByCode, mem, membershipActive, memberPublic } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/member/profile — data dashboard member VVIP (header x-vvip-code).
 * Mengembalikan profil member + tiket-brief yang cocok dengan email member.
 */
export async function GET(req: Request) {
  const code = (req.headers.get("x-vvip-code") ?? "").trim();
  if (!code) {
    return NextResponse.json(
      { ok: false, error: "kode akses diperlukan" },
      { status: 401 }
    );
  }

  const member = await findMemberByCode(code);

  // Kode utama env (tanpa rekam member) → arahkan ke lounge, bukan dashboard member.
  if (!member) {
    const { vvipCodeMatches } = await import("@/lib/vvip");
    if (vvipCodeMatches(code)) {
      return NextResponse.json({
        ok: true,
        kind: "primary",
        message:
          "Kode akses utama terdeteksi. Dashboard member hanya untuk member terdaftar — lanjut ke Lounge Oracle.",
      });
    }
    return NextResponse.json(
      { ok: false, error: "kode tidak dikenal" },
      { status: 403 }
    );
  }

  if (!membershipActive(member)) {
    return NextResponse.json(
      {
        ok: false,
        error: "membership_inactive",
        message:
          member.status === "suspended"
            ? "Keanggotaan Anda sedang ditangguhkan. Hubungi tim GUNARA untuk pemulihan."
            : "Masa keanggotaan Anda telah berakhir. Perpanjang via WhatsApp +62 813-1651-6524.",
      },
      { status: 403 }
    );
  }

  // Perbarui jejak akses terakhir (best-effort).
  try {
    await db.vvipMember.update({
      where: { id: member.id },
      data: { lastAccessAt: new Date() },
    });
  } catch {
    const local = mem.members.find((x) => x.id === member.id);
    if (local) local.lastAccessAt = new Date().toISOString();
  }

  // Tiket milik member = brief dengan email yang sama.
  let tickets: {
    id: string;
    refCode: string;
    type: string;
    status: string;
    challenge: string;
    createdAt: string;
  }[] = [];
  try {
    if (member.email) {
      const rows = await db.contactMessage.findMany({
        where: { email: member.email.toLowerCase().trim() },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      tickets = rows.map((r) => ({
        id: r.id,
        refCode: r.refCode,
        type: r.type,
        status: r.status,
        challenge: r.challenge.slice(0, 160),
        createdAt: r.createdAt.toISOString(),
      }));
    }
  } catch {
    tickets = mem.contacts
      .filter((c) => member.email && c.email.toLowerCase().trim() === member.email.toLowerCase().trim())
      .slice(0, 10)
      .map((c) => ({
        id: c.id,
        refCode: c.refCode,
        type: c.type,
        status: c.status,
        challenge: c.challenge.slice(0, 160),
        createdAt: c.createdAt,
      }));
  }

  return NextResponse.json({
    ok: true,
    kind: "member",
    member: memberPublic(member),
    tickets,
  });
}
