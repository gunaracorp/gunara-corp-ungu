import { NextResponse } from "next/server";
import { langMeta } from "@/lib/i18n/languages";
import { readLocaleFile, expectedKeys } from "@/lib/i18n-gen";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/i18n/locales?code=xx — publik.
 * Fallback runtime ketika chunk bundle belum memuat locale (mis. berkas
 * baru hasil generate AI setelah server hidup). Menggabungkan override DB.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = (url.searchParams.get("code") ?? "").trim();
  const meta = langMeta(raw);
  if (!meta) {
    return NextResponse.json({ ok: false, error: "unknown_code" }, { status: 404 });
  }

  const dict = readLocaleFile(meta.code);
  if (!dict) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  let overrides: Record<string, string> = {};
  try {
    const rows = await db.translationOverride.findMany({ where: { lang: meta.code } });
    for (const r of rows) overrides[r.key] = r.value;
  } catch {
    /* DB tidak tersedia — berkas polos saja */
  }

  return NextResponse.json({
    ok: true,
    code: meta.code,
    expected: expectedKeys().length,
    data: { ...dict, ...overrides },
  });
}
