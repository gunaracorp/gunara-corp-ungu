import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin, usingDefaultAdminPassword } from "@/lib/admin-auth";
import { mem } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/data — satu fetch untuk seluruh Panel CEO:
 * statistik + tiket + subscriber + member VVIP + log akses.
 * DB dulu; bila tidak tersedia (Vercel) → penyimpanan memori bersama.
 */
export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 403 }
    );
  }

  try {
    const [contacts, subscribers, members, logs, contactCount, subCount] =
      await Promise.all([
        db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 300 }),
        db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
        db.vvipMember.findMany({ orderBy: { createdAt: "desc" } }),
        db.vvipAccessLog.findMany({ orderBy: { createdAt: "desc" }, take: 120 }),
        db.contactMessage.count(),
        db.newsletterSubscriber.count(),
      ]);

    const activeMembers = members.filter((m) => m.status === "active").length;

    return NextResponse.json({
      ok: true,
      source: "db",
      usingDefault: usingDefaultAdminPassword(),
      stats: {
        contacts: contactCount,
        subscribers: subCount,
        members: members.length,
        activeMembers,
        newContacts: contacts.filter((c) => c.status === "new").length,
        accessLogs: logs.length,
      },
      contacts: contacts.map((c) => ({
        id: c.id,
        refCode: c.refCode,
        name: c.name,
        email: c.email,
        company: c.company,
        budget: c.budget,
        role: c.role,
        type: c.type,
        challenge: c.challenge,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
      })),
      subscribers: subscribers.map((s) => ({
        id: s.id,
        email: s.email,
        createdAt: s.createdAt.toISOString(),
      })),
      members: members.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        company: m.company,
        tier: m.tier,
        code: m.code,
        status: m.status,
        notes: m.notes,
        validUntil: m.validUntil ? m.validUntil.toISOString() : null,
        lastAccessAt: m.lastAccessAt ? m.lastAccessAt.toISOString() : null,
        createdAt: m.createdAt.toISOString(),
      })),
      logs: logs.map((l) => ({
        id: l.id,
        memberId: l.memberId,
        name: l.name,
        codeMasked: l.codeMasked,
        action: l.action,
        detail: l.detail,
        createdAt: l.createdAt.toISOString(),
      })),
    });
  } catch {
    // Tanpa DB — sajikan penyimpanan memori bersama.
    return NextResponse.json({
      ok: true,
      source: "memory",
      usingDefault: usingDefaultAdminPassword(),
      stats: {
        contacts: mem.contacts.length,
        subscribers: mem.subscribers.length,
        members: mem.members.length,
        activeMembers: mem.members.filter((m) => m.status === "active").length,
        newContacts: mem.contacts.filter((c) => c.status === "new").length,
        accessLogs: mem.logs.length,
      },
      contacts: mem.contacts.slice(0, 300),
      subscribers: mem.subscribers.slice(0, 500),
      members: mem.members,
      logs: mem.logs.slice(0, 120),
    });
  }
}
