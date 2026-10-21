import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { langMeta } from "@/lib/i18n/languages";
import { generateLocaleWithAI, incompleteLanguages } from "@/lib/i18n-gen";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

/**
 * POST /api/i18n/generate — isi otomatis terjemahan via AI (admin).
 *   body { code: "th" }   → terjemahkan satu bahasa
 *   body { list: true }   → daftar bahasa yang belum lengkap
 */
export async function POST(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const body = (await req.json().catch(() => null)) as
    | { code?: string; list?: boolean }
    | null;

  if (body?.list) {
    return NextResponse.json({ ok: true, missing: incompleteLanguages() });
  }

  const code = (body?.code ?? "").trim();
  const meta = langMeta(code);
  if (!meta) {
    return NextResponse.json(
      { ok: false, error: "kode tidak terdaftar di registry 195 bahasa" },
      { status: 400 }
    );
  }

  const result = await generateLocaleWithAI(meta.code);
  if (result.ok) {
    await audit({
      actor: "CEO / Admin",
      actorRole: "admin",
      action: "i18n_generate",
      target: meta.code,
      detail: `${result.keys} kunci diterjemahkan AI (${result.ms} ms)`,
    });
  }
  return NextResponse.json({ ok: result.ok, result });
}
