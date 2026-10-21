import { NextResponse } from "next/server";
import { allPublicPaths, abs, SITE_URL } from "@/lib/seo";

/**
 * IndexNow — pemberitahuan instan ke mesin pencari non-Google.
 * ----------------------------------------------------------------------------
 * IndexNow didukung bersama oleh Bing, Yandex, Naver, Seznam, dan Yep
 * (aliansi IndexNow). Google tidak ikut — Google merayapi via sitemap.xml.
 *
 * Endpoint:
 *   GET  /api/indexnow            → kirim SELURUH URL publik (~144) ke jaringan
 *                                   IndexNow (dipanggil manual setelah deploy).
 *   POST /api/indexnow {urls:[]}  → kirim URL tertentu (mis. halaman baru).
 *
 * Verifikasi kepemilikan: file statis /{INDEXNOW_KEY}.txt di public/ berisi
 * tepat nilai key. Set NEXT_PUBLIC_SITE_URL agar key file cocok dengan domain
 * produksi saat dipanggil.
 *
 * Pemakaian setelah deploy:
 *   curl "https://<domain>/api/indexnow"
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "gunara7f3a9c21b6d4e805";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
const keyLocation = abs(`/${INDEXNOW_KEY}.txt`);

/** Kirim payload IndexNow; batasi 10.000 URL per permintaan (batas protokol). */
async function submit(urls: string[]): Promise<NextResponse> {
  if (urls.length === 0) {
    return NextResponse.json({ ok: false, error: "no_urls" }, { status: 400 });
  }

  const host = new URL(SITE_URL).host;
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList: urls.slice(0, 10_000),
  };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    // 200/202 = diterima; 400/403/422 = key/URL tidak valid; 429 = throttled.
    return NextResponse.json(
      {
        ok: res.ok || res.status === 202,
        status: res.status,
        submitted: payload.urlList.length,
        host,
        keyLocation,
        note: "Terkirim ke aliansi IndexNow (Bing, Yandex, Naver, Seznam, Yep). Google mengindeks via sitemap.xml — tidak butuh IndexNow.",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "indexnow_unreachable" },
      { status: 502 },
    );
  }
}

export async function GET() {
  return submit(allPublicPaths().map((p) => abs(p)));
}

export async function POST(request: Request) {
  let body: { urls?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const raw = Array.isArray(body.urls) ? body.urls : [];
  // Hanya URL same-origin — endpoint ini bukan proksi ping pihak ketiga.
  const urls = raw
    .filter((u): u is string => typeof u === "string")
    .map((u) => {
      try {
        return new URL(u).toString();
      } catch {
        return abs(u.startsWith("/") ? u : `/${u}`);
      }
    })
    .filter((u) => {
      try {
        return new URL(u).host === new URL(SITE_URL).host;
      } catch {
        return false;
      }
    });

  if (urls.length === 0) {
    return NextResponse.json(
      { ok: false, error: "no_valid_urls", hint: `Gunakan URL ${SITE_URL}/…` },
      { status: 400 },
    );
  }

  return submit(urls);
}
