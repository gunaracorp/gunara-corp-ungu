/**
 * Seed data demo ekosistem GUNARA — idempoten (tidak menduplikasi).
 * Menyiapkan karyawan, client, proyek, dan pengumuman untuk pengujian
 * dashboard multi-role, unggah dokumen, notifikasi WA, dan tier/GOD MODE.
 *
 * Jalankan: bunx tsx scripts/seed-eco.ts   (atau bun scripts/seed-eco.ts)
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // ── Karyawan ──────────────────────────────────────────────────────────
  const budi = await db.employee.upsert({
    where: { code: "GUNARA-EMP-3ATE-HHHT" },
    update: { status: "active" },
    create: {
      name: "Budi Santoso",
      email: "budi.santoso@gunara.co.id",
      phone: "0812-3456-7890",
      position: "Senior Consultant",
      department: "Perizinan & Legalitas",
      code: "GUNARA-EMP-3ATE-HHHT",
      tier: "STANDARD",
      notes: "Karyawan demo — kode dari sesi instalasi.",
    },
  });
  const dewi = await db.employee.upsert({
    where: { code: "GUNARA-EMP-DEW1-KOTA" },
    update: { status: "active" },
    create: {
      name: "Dewi Lestari",
      email: "dewi.lestari@gunara.co.id",
      phone: "0812-9876-5432",
      position: "Project Manager",
      department: "Operasional",
      code: "GUNARA-EMP-DEW1-KOTA",
      tier: "ELITE",
      notes: "Karyawan demo tier elite.",
    },
  });

  // ── Client ────────────────────────────────────────────────────────────
  const sari = await db.clientAccount.upsert({
    where: { code: "GUNARA-CLI-99A9-J27A" },
    update: { status: "active" },
    create: {
      name: "Sari Dewi",
      email: "sari@majujaya.co.id",
      phone: "0811-1223-3445",
      company: "PT Maju Jaya",
      industry: "Manufaktur",
      code: "GUNARA-CLI-99A9-J27A",
      tier: "STANDARD",
      notes: "Client demo — kode dari sesi instalasi.",
    },
  });
  const agung = await db.clientAccount.upsert({
    where: { code: "GUNARA-CLI-AGR1-SENA" },
    update: { status: "active" },
    create: {
      name: "Agung Sena",
      email: "agung@senaproperti.id",
      phone: "0813-5566-7788",
      company: "Sena Properti",
      industry: "Properti",
      code: "GUNARA-CLI-AGR1-SENA",
      tier: "PRO",
      notes: "Client demo tier pro.",
    },
  });

  // ── Proyek ────────────────────────────────────────────────────────────
  const proyekSeed = [
    {
      refCode: "PRJ-EK01-DEMO",
      title: "Pengurusan Izin Usaha Industri (IUI) PT Maju Jaya",
      description:
        "Pendampingan lengkap pengajuan Izin Usaha Industri: analisis KBLI, dokumen teknis, koordinasi dinas, hingga terbit izin.",
      clientId: sari.id,
      clientName: "Sari Dewi · PT Maju Jaya",
      employeeId: budi.id,
      status: "berjalan",
      priority: "tinggi",
      progress: 45,
    },
    {
      refCode: "PRJ-EK02-DEMO",
      title: "Sertifikasi Halal Produk UMKM Batch 3",
      description:
        "Fasilitasi sertifikasi halal untuk 12 produk: bahan, proses produksi, auditor, dan dokumen SJPH.",
      clientId: sari.id,
      clientName: "Sari Dewi · PT Maju Jaya",
      employeeId: dewi.id,
      status: "review",
      priority: "normal",
      progress: 80,
    },
    {
      refCode: "PRJ-EK03-DEMO",
      title: "Izin Bangunan Gedung (PBG) Gudang Sena Properti",
      description:
        "Pengurusan PBG untuk gudang 2 lantai: gambar teknis, SLF, dan koordinasi GAPOKTAN.",
      clientId: agung.id,
      clientName: "Agung Sena · Sena Properti",
      employeeId: budi.id,
      status: "baru",
      priority: "urgent",
      progress: 10,
    },
    {
      refCode: "PRJ-EK04-DEMO",
      title: "Pendirian PT + NPWP + NIB Paket Komplit",
      description: "Akta pendirian, pengesahan Kemenkumham, NPWP badan, NIB, dan perizinan dasar.",
      clientId: agung.id,
      clientName: "Agung Sena · Sena Properti",
      employeeId: dewi.id,
      status: "selesai",
      priority: "normal",
      progress: 100,
    },
  ];
  for (const p of proyekSeed) {
    const existing = await db.project.findUnique({ where: { refCode: p.refCode } });
    if (!existing) {
      const created = await db.project.create({ data: p });
      await db.projectUpdate.create({
        data: {
          projectId: created.id,
          author: "CEO / Admin",
          authorRole: "admin",
          message: `Proyek demo dibuat: "${p.title}".`,
        },
      });
    }
  }

  // ── Pengumuman ────────────────────────────────────────────────────────
  const pengCount = await db.announcement.count();
  if (pengCount === 0) {
    await db.announcement.createMany({
      data: [
        {
          title: "Selamat Datang di Ekosistem Dashboard GUNARA",
          body:
            "Ekosistem dashboard kini lengkap: unggah dokumen, notifikasi WhatsApp, laporan PDF, dan sistem tier hingga GOD MODE. Perkenalkan diri di kanal tim!",
          audience: "semua",
        },
        {
          title: "Town Hall Q4 — Jumat 15.00",
          body:
            "Rapat evaluasi kuartal seluruh karyawan. Siapkan ringkasan proyek masing-masing; client tetap dilayani oleh tim duty officer.",
          audience: "karyawan",
        },
        {
          title: "Portal Client Baru: Dokumen & Laporan PDF",
          body:
            "Kini Anda dapat mengunggah dokumen langsung ke proyek dan mengunduh laporan layanan PDF dari dashboard.",
          audience: "client",
        },
      ],
    });
  }

  console.log("Seed selesai:");
  console.log("  Karyawan :", [budi, dewi].map((e) => `${e.name} (${e.code} · ${e.tier})`).join(", "));
  console.log("  Client   :", [sari, agung].map((c) => `${c.name} (${c.code} · ${c.tier})`).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
