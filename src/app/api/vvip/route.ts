import { NextResponse } from "next/server";
import { vvipCodeMatches } from "@/lib/vvip";
import { findMemberByCode, logAccess, maskCode, membershipActive, memberPublic } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/vvip — gerbang lounge & dashboard Member VVIP (halaman #/vvip, #/member).
 * Menerima: (1) kode utama dari VVIP_ACCESS_CODE, atau (2) kode personal member aktif.
 * Setiap percobaan (berhasil maupun ditolak) tercatat di Log Akses Panel CEO.
 */
export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  const raw = (body as { code?: unknown } | null)?.code;
  const code = typeof raw === "string" ? raw : "";

  if (!code.trim()) {
    return NextResponse.json(
      { ok: false, error: "code_required", message: "Masukkan kode akses Anda." },
      { status: 400 }
    );
  }

  // 1) Kode personal member terdaftar (diutamakan: bisa dirotasi per member).
  const member = await findMemberByCode(code);
  if (member) {
    if (!membershipActive(member)) {
      await logAccess({
        memberId: member.id,
        name: member.name,
        codeMasked: maskCode(code),
        action: "denied",
        detail:
          member.status === "suspended"
            ? "Keanggotaan ditangguhkan"
            : "Masa keanggotaan berakhir",
      });
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

    await logAccess({
      memberId: member.id,
      name: member.name,
      codeMasked: maskCode(code),
      action: "login",
      detail: `Tier ${member.tier}`,
    });

    try {
      const { db } = await import("@/lib/db");
      await db.vvipMember.update({
        where: { id: member.id },
        data: { lastAccessAt: new Date() },
      });
    } catch {
      /* best-effort */
    }

    return NextResponse.json({
      ok: true,
      tier: member.tier,
      member: memberPublic(member),
    });
  }

  // 2) Kode utama dari environment (pemilik situs / tim inti).
  if (vvipCodeMatches(code)) {
    await logAccess({
      name: null,
      codeMasked: maskCode(code),
      action: "login",
      detail: "Kode utama situs",
    });
    return NextResponse.json({ ok: true, tier: "VVIP" });
  }

  // 3) Bukan keduanya — tolak & catat percobaan.
  await new Promise((resolve) => setTimeout(resolve, 700));
  await logAccess({
    name: null,
    codeMasked: maskCode(code),
    action: "denied",
    detail: "Kode tidak dikenal",
  });
  return NextResponse.json(
    {
      ok: false,
      error: "invalid_code",
      message: "Kode akses tidak dikenal. Hubungi tim GUNARA untuk kode VVIP terbaru.",
    },
    { status: 403 }
  );
}
