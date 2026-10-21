import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { portalSession } from "@/lib/portal-auth";
import { COMPANY_WA, COMPANY_WA_LABEL, normalizePhone, queueWa, queueWaBulk, serWa, waLink } from "@/lib/wa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/wa — daftar notifikasi WhatsApp:
 * - CEO/admin : seluruh antrean & riwayat
 * - karyawan  : notifikasi yang dialamatkan ke peran karyawan / nomornya
 * - client    : notifikasi yang dialamatkan ke peran client / nomornya
 *
 * POST /api/wa — aksi:
 * - admin {action:"kirim", audience:"karyawan"|"client"|"semua"|"manual",
 *          manualPhone?, manualName?, message}   → blast / kirim manual
 * - admin {action:"tandai-terkirim", id}        → tandai sudah dikirim
 * - admin {action:"hapus", id}                  → hapus antrean
 * - portal {action:"hubungi-admin", message}    → sampaikan pesan ke CEO via WA
 */
export async function GET(req: Request) {
  const admin = isAdmin(req);
  const session = admin ? null : portalSession(req);
  if (!admin && !session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  try {
    let where: Record<string, unknown> = {};
    if (session) {
      const { role, subjectId } = session;
      const account =
        role === "karyawan"
          ? await db.employee.findUnique({ where: { id: subjectId } })
          : await db.clientAccount.findUnique({ where: { id: subjectId } });
      if (!account || account.status !== "active") {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
      }
      const myPhone = normalizePhone(account.phone);
      where = {
        OR: [
          { toRole: role },
          ...(myPhone ? [{ toPhone: myPhone }] : []),
          { toRole: "admin", relatedRef: account.code },
        ],
      };
    }
    const rows = await db.waNotification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: admin ? 200 : 60,
    });
    return NextResponse.json({
      ok: true,
      companyWa: COMPANY_WA_LABEL,
      gatewayAktif: !!process.env.WA_GATEWAY_URL?.trim() && !!process.env.WA_GATEWAY_TOKEN?.trim(),
      items: rows.map(serWa),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Layanan WA tidak tersedia." }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const admin = isAdmin(req);
  const session = admin ? null : portalSession(req);
  if (!admin && !session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  const body: unknown = await req.json().catch(() => null);
  const b = (body ?? {}) as Record<string, unknown>;
  const action = typeof b.action === "string" ? b.action : "";
  const message = typeof b.message === "string" ? b.message.trim().slice(0, 2000) : "";

  try {
    /* ── Aksi portal: sampaikan pesan ke CEO via WA ────────────────────── */
    if (!admin && session) {
      if (action !== "hubungi-admin") {
        return NextResponse.json({ ok: false, error: "Aksi tidak dikenal." }, { status: 400 });
      }
      if (message.length < 5) {
        return NextResponse.json({ ok: false, error: "Pesan terlalu pendek (minimal 5 karakter)." }, { status: 400 });
      }
      const { role, subjectId } = session;
      const account =
        role === "karyawan"
          ? await db.employee.findUnique({ where: { id: subjectId } })
          : await db.clientAccount.findUnique({ where: { id: subjectId } });
      if (!account || account.status !== "active") {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
      }
      const pengirim = `${account.name}${account.phone ? ` (${account.phone})` : ""}`;
      const item = await queueWa({
        phone: process.env.ADMIN_WA_NUMBER?.trim() ?? COMPANY_WA,
        name: "CEO / Admin",
        role: "admin",
        event: "manual",
        message: `[Pesan ${role}] ${pengirim}:\n${message}`,
        relatedRef: account.code,
      });
      // Tautan siap klik bagi pengirim untuk membuka WhatsApp langsung
      const linkUser = waLink(COMPANY_WA, `[Pesan ${role}] ${pengirim}:\n${message}`);
      return NextResponse.json({ ok: true, item, linkUser });
    }

    /* ── Aksi CEO/admin ────────────────────────────────────────────────── */
    if (action === "tandai-terkirim") {
      const id = typeof b.id === "string" ? b.id : "";
      if (!id) return NextResponse.json({ ok: false, error: "ID wajib." }, { status: 400 });
      const updated = await db.waNotification.update({
        where: { id },
        data: { status: "sent", sentAt: new Date(), channel: "wa.me" },
      });
      return NextResponse.json({ ok: true, item: serWa(updated) });
    }

    if (action === "hapus") {
      const id = typeof b.id === "string" ? b.id : "";
      if (!id) return NextResponse.json({ ok: false, error: "ID wajib." }, { status: 400 });
      await db.waNotification.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    }

    if (action === "kirim") {
      if (message.length < 5) {
        return NextResponse.json({ ok: false, error: "Pesan minimal 5 karakter." }, { status: 400 });
      }
      const audience = typeof b.audience === "string" ? b.audience : "manual";

      if (audience === "manual") {
        const phone = normalizePhone(typeof b.manualPhone === "string" ? b.manualPhone : "");
        const name = typeof b.manualName === "string" ? b.manualName.trim() : null;
        const item = await queueWa({
          phone: phone ?? COMPANY_WA,
          name: name ?? "Nomor manual",
          role: "admin",
          event: "manual",
          message,
        });
        return NextResponse.json({ ok: true, jumlah: 1, items: [item] });
      }

      // Blast ke audiens portal
      const targets: { phone: string | null; name: string; role: "karyawan" | "client" }[] = [];
      if (audience === "karyawan" || audience === "semua") {
        const emps = await db.employee.findMany({ where: { status: "active" } });
        emps.forEach((e) => targets.push({ phone: e.phone, name: e.name, role: "karyawan" }));
      }
      if (audience === "client" || audience === "semua") {
        const clis = await db.clientAccount.findMany({ where: { status: "active" } });
        clis.forEach((c) => targets.push({ phone: c.phone, name: c.name, role: "client" }));
      }
      if (targets.length === 0) {
        return NextResponse.json({ ok: false, error: "Tidak ada penerima pada audiens itu." }, { status: 400 });
      }
      const items = await queueWaBulk(
        targets.map((t) => ({
          phone: t.phone,
          name: t.name,
          role: t.role,
          event: "pengumuman" as const,
          message: `[Blast CEO — audiens: ${audience}]\n${message}`,
        }))
      );
      return NextResponse.json({ ok: true, jumlah: items.length, items });
    }

    return NextResponse.json({ ok: false, error: "Aksi tidak dikenal." }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "Gagal memproses notifikasi WA." }, { status: 503 });
  }
}
