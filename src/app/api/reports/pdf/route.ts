import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { portalSession } from "@/lib/portal-auth";
import { buildReportPdf, type ReportKind } from "@/lib/reports";
import { tierLevel } from "@/lib/tiers";
import { queueWa } from "@/lib/wa";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/reports/pdf?type=ringkasan|karyawan|client|invoice&id=<invoiceId>
 *
 * Hak akses:
 * - CEO/admin : semua jenis laporan + seksi eksekutif (GOD MODE built-in)
 * - karyawan  : laporan penugasannya sendiri — tier PRO ke atas
 * - client    : laporan layanannya sendiri — tier PRO ke atas
 * - client    : invoice miliknya — TANPA syarat tier (dokumen transaksi)
 *
 * Setiap pembuatan laporan tercatat di Audit Log + notifikasi WA (audit trail).
 */
export async function GET(req: Request) {
  const admin = isAdmin(req);
  const session = admin ? null : portalSession(req);
  if (!admin && !session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }

  const url = new URL(req.url);
  const typeRaw = url.searchParams.get("type") ?? (admin ? "ringkasan" : session!.role);
  const id = url.searchParams.get("id");
  const validTypes: ReportKind[] = ["ringkasan", "karyawan", "client", "invoice"];
  if (!validTypes.includes(typeRaw as ReportKind)) {
    return NextResponse.json({ ok: false, error: "Jenis laporan tidak dikenal." }, { status: 400 });
  }
  const kind = typeRaw as ReportKind;

  try {
    let subjectId: string | undefined;
    let tier = "CEO";
    let oleh = "CEO / Admin";
    let actorRole: "admin" | "karyawan" | "client" = "admin";

    if (admin) {
      if (kind !== "ringkasan" && kind !== "invoice") {
        return NextResponse.json(
          { ok: false, error: "Laporan per-orang dihasilkan dari portal masing-masing. CEO memakai type=ringkasan atau type=invoice&id=…" },
          { status: 400 }
        );
      }
      if (kind === "invoice" && !id) {
        return NextResponse.json({ ok: false, error: "Parameter id invoice wajib diisi." }, { status: 400 });
      }
    } else {
      const { role, subjectId: sid } = session!;
      actorRole = role;
      const account =
        role === "karyawan"
          ? await db.employee.findUnique({ where: { id: sid } })
          : await db.clientAccount.findUnique({ where: { id: sid } });
      if (!account || account.status !== "active") {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
      }

      if (kind === "invoice") {
        // Invoice = dokumen transaksi: boleh tanpa syarat tier, tapi harus milik sendiri.
        if (role !== "client" || !id) {
          return NextResponse.json({ ok: false, error: "Invoice hanya untuk akun client (parameter id wajib)." }, { status: 403 });
        }
        const inv = await db.invoice.findUnique({ where: { id } });
        if (!inv || inv.clientId !== sid) {
          return NextResponse.json({ ok: false, error: "Invoice tidak ditemukan atau bukan milik Anda." }, { status: 404 });
        }
      } else {
        if (tierLevel(account.tier) < 2) {
          return NextResponse.json(
            {
              ok: false,
              error: `Laporan PDF tersedia mulai tier PRO. Tier Anda: ${account.tier}. Aktifkan kode tier di dashboard untuk membuka fitur ini.`,
              upgrade: true,
            },
            { status: 402 }
          );
        }
        if ((role === "karyawan" && kind !== "karyawan") || (role === "client" && kind !== "client")) {
          return NextResponse.json({ ok: false, error: "Jenis laporan tidak sesuai peran Anda." }, { status: 403 });
        }
      }
      subjectId = sid;
      tier = account.tier;
      oleh = account.name;
    }

    const { bytes, fileName, judul } = await buildReportPdf({
      kind,
      subjectId,
      invoiceId: id ?? undefined,
      oleh,
      tier,
      seksiEksekutif: admin || tier === "GOD",
    });

    await Promise.allSettled([
      audit({
        actor: oleh,
        actorRole,
        action: kind === "invoice" ? "invoice_pdf" : "laporan_pdf",
        target: kind === "invoice" ? id : fileName,
        detail: judul,
      }),
      queueWa({
        phone: process.env.ADMIN_WA_NUMBER?.trim() ?? null,
        name: "CEO / Admin",
        role: "admin",
        event: "laporan",
        message: `📄 ${oleh} (${tier}) membuat dokumen PDF: ${judul}.`,
        relatedRef: fileName,
      }),
    ]);

    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(bytes.length),
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    console.error("[reports/pdf]", e);
    return NextResponse.json({ ok: false, error: "Gagal membuat laporan PDF." }, { status: 503 });
  }
}
