import { NextResponse } from "next/server";
import { vvipCodeMatches } from "@/lib/vvip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/vvip — verifikasi kode akses Member VVIP (gerbang halaman #/vvip).
 * Body: { code: string } → 200 { ok:true, tier:"VVIP" } | 403 { ok:false }
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

  if (!vvipCodeMatches(code)) {
    // Jeda kecil untuk menumpulkan percobaan brute-force.
    await new Promise((resolve) => setTimeout(resolve, 700));
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_code",
        message: "Kode akses tidak dikenal. Hubungi tim TOP untuk kode VVIP terbaru.",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true, tier: "VVIP" });
}
