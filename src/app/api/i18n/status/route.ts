import { NextResponse } from "next/server";
import { existsSync } from "node:fs";
import { isAdmin } from "@/lib/admin-auth";
import { LANGUAGES, TOTAL_LANGUAGES } from "@/lib/i18n/languages";
import { coverageOf, expectedKeys, localePath } from "@/lib/i18n-gen";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/i18n/status — statistik 195 bahasa untuk Studio Multi-Bahasa (admin).
 * Cache memori 30 detik agar membaca ~200 berkas JSON tidak diulang tiap klik.
 */
let cache: { at: number; payload: unknown } | null = null;
const TTL_MS = 30_000;

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const fresh = new URL(req.url).searchParams.get("fresh") === "1";
  if (!fresh && cache && Date.now() - cache.at < TTL_MS) {
    return NextResponse.json(cache.payload);
  }

  const expected = expectedKeys();

  const rows = LANGUAGES.map((l) => {
    const cov = coverageOf(l.code, expected);
    return {
      code: l.code,
      native: l.native,
      name: l.name,
      flag: l.flag,
      region: l.region,
      rtl: l.rtl,
      core: l.core,
      keys: cov.keys,
      complete: cov.complete,
      present: existsSync(localePath(l.code)),
    };
  });

  let overrides: Record<string, number> = {};
  try {
    const grouped = await db.translationOverride.groupBy({
      by: ["lang"],
      _count: { _all: true },
    });
    for (const g of grouped) overrides[g.lang] = g._count._all;
  } catch {
    /* DB tidak tersedia — lanjut tanpa hitungan override */
  }

  const complete = rows.filter((r) => r.complete).length;
  const payload = {
    ok: true,
    total: TOTAL_LANGUAGES,
    expected: expected.length,
    summary: {
      complete,
      partial: rows.filter((r) => r.present && !r.complete).length,
      missing: rows.filter((r) => !r.present).length,
      core: rows.filter((r) => r.core).length,
      ai: rows.filter((r) => !r.core && r.present).length,
      rtl: rows.filter((r) => r.rtl).length,
      overrides: Object.values(overrides).reduce((a, b) => a + b, 0),
    },
    rows,
    overrides,
  };

  cache = { at: Date.now(), payload };
  return NextResponse.json(payload);
}
