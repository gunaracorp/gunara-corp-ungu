import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { langMeta } from "@/lib/i18n/languages";
import { expectedKeys } from "@/lib/i18n-gen";
import { audit } from "@/lib/audit";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Override terjemahan (Studio Multi-Bahasa):
 *   GET    ?lang=xx           → publik (dipakai runtime saat memuat bahasa)
 *   PUT    {lang,key,value}   → admin — simpan/ubah suntingan
 *   DELETE ?lang=&key=        → admin — kembalikan nilai asli berkas
 */
export async function GET(req: Request) {
  const lang = (new URL(req.url).searchParams.get("lang") ?? "").trim();
  if (!langMeta(lang)) {
    return NextResponse.json({ ok: false, error: "unknown_code" }, { status: 404 });
  }
  try {
    const rows = await db.translationOverride.findMany({ where: { lang } });
    const data: Record<string, string> = {};
    for (const r of rows) data[r.key] = r.value;
    return NextResponse.json({ ok: true, lang, data });
  } catch {
    return NextResponse.json({ ok: true, lang, data: {} });
  }
}

export async function PUT(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const body = (await req.json().catch(() => null)) as
    | { lang?: string; key?: string; value?: string }
    | null;
  const lang = (body?.lang ?? "").trim();
  const key = (body?.key ?? "").trim();
  const value = (body?.value ?? "").trim();
  if (!langMeta(lang)) {
    return NextResponse.json({ ok: false, error: "unknown_code" }, { status: 400 });
  }
  if (!expectedKeys().includes(key)) {
    return NextResponse.json({ ok: false, error: "unknown_key" }, { status: 400 });
  }
  if (!value || value.length > 2000) {
    return NextResponse.json({ ok: false, error: "invalid_value" }, { status: 400 });
  }
  try {
    await db.translationOverride.upsert({
      where: { lang_key: { lang, key } },
      create: { lang, key, value },
      update: { value },
    });
    await audit({
      actor: "CEO / Admin",
      actorRole: "admin",
      action: "i18n_override",
      target: lang,
      detail: `${key} = ${value.slice(0, 60)}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String((err as Error)?.message ?? err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const url = new URL(req.url);
  const lang = (url.searchParams.get("lang") ?? "").trim();
  const key = (url.searchParams.get("key") ?? "").trim();
  if (!langMeta(lang) || !key) {
    return NextResponse.json({ ok: false, error: "invalid_params" }, { status: 400 });
  }
  try {
    await db.translationOverride.deleteMany({ where: { lang, key } });
    await audit({
      actor: "CEO / Admin",
      actorRole: "admin",
      action: "i18n_override",
      target: lang,
      detail: `reset ${key}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String((err as Error)?.message ?? err) },
      { status: 500 }
    );
  }
}
