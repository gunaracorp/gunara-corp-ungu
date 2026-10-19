import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { portalSession } from "@/lib/portal-auth";
import { TIER_META, tierMeta } from "@/lib/tiers";
import { queueWa, waTemplates } from "@/lib/wa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/tiers — aktivasi kode tier portal (karyawan/client):
 * { code: "GUNARA-GOD-XXXX-XXXX" }
 *
 * Kode dibuat lewat Panel CEO (tab Ekosistem), sekali pakai, dan terikat
 * peran (karyawan | client | semua). Aktivasi sukses langsung membuka
 * keistimewaan tier — termasuk GOD MODE untuk tier maksimal.
 *
 * GET /api/tiers — daftar keistimewaan semua tier (publik untuk sesi apa pun).
 */
export async function GET(req: Request) {
  const admin = isAdmin(req) || !!portalSession(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  return NextResponse.json({ ok: true, tiers: Object.values(TIER_META) });
}

export async function POST(req: Request) {
  const session = portalSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  const body: unknown = await req.json().catch(() => null);
  const b = (body ?? {}) as Record<string, unknown>;
  const rawCode = typeof b.code === "string" ? b.code.trim().toUpperCase() : "";
  if (!rawCode) {
    return NextResponse.json({ ok: false, error: "Kode aktivasi wajib diisi." }, { status: 400 });
  }

  try {
    const { role, subjectId } = session;
    const tierCode = await db.tierCode.findUnique({ where: { code: rawCode } });
    if (!tierCode) {
      return NextResponse.json({ ok: false, error: "Kode aktivasi tidak dikenal." }, { status: 404 });
    }
    if (tierCode.usedAt || tierCode.usedById) {
      return NextResponse.json(
        { ok: false, error: `Kode sudah dipakai oleh ${tierCode.usedByName ?? "akun lain"}.` },
        { status: 409 }
      );
    }
    if (tierCode.targetRole !== "semua" && tierCode.targetRole !== role) {
      return NextResponse.json(
        { ok: false, error: `Kode ini hanya untuk ${tierCode.targetRole}.` },
        { status: 403 }
      );
    }

    const account =
      role === "karyawan"
        ? await db.employee.findUnique({ where: { id: subjectId } })
        : await db.clientAccount.findUnique({ where: { id: subjectId } });
    if (!account || account.status !== "active") {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
    }
    const currentLevel = tierMeta(account.tier).level;
    const newLevel = tierMeta(tierCode.tier).level;
    if (newLevel <= currentLevel) {
      return NextResponse.json(
        { ok: false, error: `Tier akun Anda saat ini (${account.tier}) sudah ≥ tier kode ini.` },
        { status: 409 }
      );
    }

    // Aktifkan
    const [updated] = await Promise.all([
      role === "karyawan"
        ? db.employee.update({ where: { id: subjectId }, data: { tier: tierCode.tier } })
        : db.clientAccount.update({ where: { id: subjectId }, data: { tier: tierCode.tier } }),
      db.tierCode.update({
        where: { id: tierCode.id },
        data: { usedById: account.id, usedByName: account.name, usedAt: new Date() },
      }),
    ]);

    // Notifikasi WA ke akun + CEO
    const tmpl = waTemplates.tier({ nama: account.name, tier: tierCode.tier });
    await Promise.allSettled([
      queueWa({
        phone: account.phone,
        name: account.name,
        role: role as "karyawan" | "client",
        event: "tier",
        message: tmpl,
        relatedRef: tierCode.code,
      }),
      queueWa({
        phone: process.env.ADMIN_WA_NUMBER?.trim() ?? null,
        name: "CEO / Admin",
        role: "admin",
        event: "tier",
        message: `⚡ ${account.name} (${role}) mengaktifkan tier ${tierCode.tier} dengan kode ${tierCode.code}.`,
        relatedRef: tierCode.code,
      }),
    ]);

    return NextResponse.json({
      ok: true,
      tier: updated.tier,
      meta: tierMeta(updated.tier),
      message:
        tierCode.tier === "GOD"
          ? "GOD MODE AKTIF — tier maksimal terbuka penuh! Semua keistimewaan premium kini milik Anda."
          : `Tier ${tierCode.tier} berhasil diaktifkan.`,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Gagal mengaktivasi kode." }, { status: 503 });
  }
}
