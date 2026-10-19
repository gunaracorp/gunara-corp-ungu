import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAccess, maskCode } from "@/lib/store";
import {
  clearPortalCookieHeader,
  portalCookieHeader,
  type PortalRole,
} from "@/lib/portal-auth";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/portal/login — login Portal Karyawan / Portal Client via kode personal.
 * Body: { portal: "karyawan" | "client", code: string }
 * DELETE /api/portal/login — keluar (hapus cookie portal).
 */
export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  const b = body as { portal?: unknown; code?: unknown } | null;
  const portal =
    b?.portal === "karyawan" || b?.portal === "client" ? (b.portal as PortalRole) : null;
  const code = typeof b?.code === "string" ? b.code.trim().toUpperCase() : "";

  if (!portal) {
    return NextResponse.json({ ok: false, error: "Jenis portal tidak dikenal." }, { status: 400 });
  }
  if (!code) {
    return NextResponse.json(
      { ok: false, error: "Masukkan kode akses personal Anda." },
      { status: 400 }
    );
  }

  try {
    if (portal === "karyawan") {
      const emp = await db.employee.findUnique({ where: { code } });
      if (!emp) {
        await new Promise((r) => setTimeout(r, 800));
        void logAccess({ codeMasked: maskCode(code), action: "denied", detail: "portal karyawan: kode tidak dikenal" });
        return NextResponse.json(
          { ok: false, error: "Kode akses tidak dikenal. Hubungi CEO/admin Anda." },
          { status: 403 }
        );
      }
      if (emp.status !== "active") {
        void logAccess({ memberId: emp.id, name: emp.name, codeMasked: maskCode(code), action: "denied", detail: "portal karyawan: akun ditangguhkan" });
        return NextResponse.json(
          { ok: false, error: "Akun Anda ditangguhkan. Hubungi admin." },
          { status: 403 }
        );
      }
      await db.employee.update({ where: { id: emp.id }, data: { lastAccessAt: new Date() } });
      void logAccess({ memberId: emp.id, name: emp.name, codeMasked: maskCode(code), action: "login", detail: "portal karyawan" });
      void audit({ actor: emp.name, actorRole: "karyawan", action: "login", detail: "Portal Karyawan" });
      const res = NextResponse.json({
        ok: true,
        name: emp.name,
        position: emp.position,
        department: emp.department,
      });
      res.headers.set("Set-Cookie", portalCookieHeader("karyawan", emp.id));
      return res;
    }

    // portal === "client"
    const client = await db.clientAccount.findUnique({ where: { code } });
    if (!client) {
      await new Promise((r) => setTimeout(r, 800));
      void logAccess({ codeMasked: maskCode(code), action: "denied", detail: "portal client: kode tidak dikenal" });
      return NextResponse.json(
        { ok: false, error: "Kode akses tidak dikenal. Hubungi tim GUNARA Anda." },
        { status: 403 }
      );
    }
    if (client.status !== "active") {
      void logAccess({ memberId: client.id, name: client.name, codeMasked: maskCode(code), action: "denied", detail: "portal client: akun ditangguhkan" });
      return NextResponse.json(
        { ok: false, error: "Akun Anda ditangguhkan. Hubungi tim GUNARA." },
        { status: 403 }
      );
    }
    await db.clientAccount.update({ where: { id: client.id }, data: { lastAccessAt: new Date() } });
    void logAccess({ memberId: client.id, name: client.name, codeMasked: maskCode(code), action: "login", detail: "portal client" });
    void audit({ actor: client.name, actorRole: "client", action: "login", detail: "Portal Client" });
    const res = NextResponse.json({
      ok: true,
      name: client.name,
      company: client.company,
    });
    res.headers.set("Set-Cookie", portalCookieHeader("client", client.id));
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Layanan sedang tidak tersedia. Coba beberapa saat lagi." },
      { status: 503 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearPortalCookieHeader());
  return res;
}
