import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mem } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The Oracle Dispatch — newsletter covenant. */
export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid payload." },
        { status: 400 }
      );
    }
    const email = String((body as Record<string, unknown>).email ?? "").trim().toLowerCase();

    if (!EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json(
        { ok: false, error: "A valid email is required to receive the Dispatch." },
        { status: 400 }
      );
    }

    try {
      await db.newsletterSubscriber.upsert({
        where: { email },
        update: {},
        create: { email },
      });
    } catch (dbError) {
      // Graceful degradation — held in shared memory so the CEO panel still sees it
      if (!mem.subscribers.some((s) => s.email === email)) {
        mem.subscribers.unshift({
          id: `sub-${Date.now().toString(36)}`,
          email,
          createdAt: new Date().toISOString(),
        });
      }
      console.warn("[newsletter] DB unavailable, subscription held in chamber memory", dbError);
    }

    return NextResponse.json({
      ok: true,
      message: "The Dispatch is yours — first wisdom arrives with the new moon.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "The chamber is temporarily unreachable." },
      { status: 500 }
    );
  }
}
