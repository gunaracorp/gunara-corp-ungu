/** Isolasi error buildReportPdf (karyawan). Jalankan: bun scripts/dbg-pdf.ts */
import { buildReportPdf } from "../src/lib/reports";

async function main() {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const db = new PrismaClient();
    const emp = await db.employee.findUnique({ where: { code: "GUNARA-EMP-3ATE-HHHT" } });
    console.log("emp:", emp?.id, emp?.name, emp?.tier);
    await db.$disconnect();
    const out = await buildReportPdf({
      kind: "karyawan",
      subjectId: emp!.id,
      oleh: emp!.name,
      tier: emp!.tier,
      seksiEksekutif: true,
    });
    console.log("OK bytes:", out.bytes.length, out.fileName);
  } catch (e) {
    console.error("GAGAL:", e);
    process.exit(1);
  }
}
main();
