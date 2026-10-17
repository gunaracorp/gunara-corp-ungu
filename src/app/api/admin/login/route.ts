import { NextResponse } from "next/server";
import {
  adminPasswordMatches,
  clearCookieHeader,
  sessionCookieHeader,
  usingDefaultAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/login  — Panel CEO: verifikasi kata sandi, terbit cookie sesi 8 jam.
 * DELETE /api/admin/login — keluar (hapus cookie).
 */
export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  const raw = (body as { password?: unknown } | null)?.password;
  const password = typeof raw === "string" ? raw : "";

  if (!password.trim()) {
    return NextResponse.json(
      { ok: false, error: "Masukkan kata sandi CEO." },
      { status: 400 }
    );
  }

  if (!adminPasswordMatches(password)) {
    // Jeda kecil menumpulkan brute-force.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json(
      { ok: false, error: "Kata sandi tidak cocok. Hanya CEO yang boleh masuk." },
      { status: 403 }
    );
  }

  const res = NextResponse.json({ ok: true, usingDefault: usingDefaultAdminPassword() });
  res.headers.set("Set-Cookie", sessionCookieHeader());
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearCookieHeader());
  return res;
}
