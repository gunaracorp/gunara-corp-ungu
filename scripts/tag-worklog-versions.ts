/**
 * scripts/tag-worklog-versions.ts — v1.4.0 "Kronika"
 * ===================================================
 * Migrasi satu-kali: menyuntikkan baris `Release: vX.Y.Z "KodeNama"` tepat di
 * bawah setiap baris `Task ID: …` pada worklog.md, lalu mengganti judul lama
 * dengan header governance (§0 aturan versi, §1 registri rilis, §2 kontrak entri).
 *
 * Pemetaan versi = rekonstruksi historis dari urutan entri (Babak I–III).
 * Idempoten: entri yang sudah punya baris `Release:` dilewati.
 *
 * Jalankan: bun scripts/tag-worklog-versions.ts
 */
import { readFileSync, writeFileSync } from "node:fs";

const WORKLOG = new URL("../worklog.md", import.meta.url).pathname;

/** Baris (1-based, pada berkas ASLI) → versi rilis. */
const RELEASE_BY_LINE: Record<number, string> = {
  // Babak I — fondasi (build Omniprime → PT TOP KONSULTAN)
  4: 'v0.1.0 "Genesis"',
  25: 'v0.2.0 "Ekspansi"',
  49: 'v0.3.0 "Gerbang Perizinan"',
  71: 'v0.3.0 "Gerbang Perizinan"',
  95: 'v0.3.0 "Gerbang Perizinan"',
  122: 'v0.3.0 "Gerbang Perizinan"',
  143: 'v0.3.0 "Gerbang Perizinan"',
  164: 'v0.3.0 "Gerbang Perizinan"',
  187: 'v0.3.0 "Gerbang Perizinan"',
  207: 'v0.3.0 "Gerbang Perizinan"',
  232: 'v0.4.0 "Kepemimpinan"',
  // Babak II — produksi (repo topkonsultan → GUNARA CORPORATION)
  250: 'v0.5.0 "Restorasi"',
  270: 'v0.5.0 "Restorasi"',
  289: 'v0.5.0 "Restorasi"',
  306: 'v0.6.0 "Identitas Ungu-Biru"',
  330: 'v0.7.0 "Skybridge"',
  355: 'v0.7.0 "Skybridge"',
  374: 'v0.7.0 "Skybridge"',
  390: 'v0.8.0 "Bright Executive"',
  410: 'v0.9.0 "Gerbang Terpilih"',
  435: 'v0.9.0 "Gerbang Terpilih"',
  464: 'v0.9.0 "Gerbang Terpilih"',
  490: 'v1.0.0 "Summit"',
  524: 'v1.0.0 "Summit"',
  557: 'v1.1.0 "Katalog Raksasa"',
  579: 'v1.1.0 "Katalog Raksasa"',
  601: 'v1.1.0 "Katalog Raksasa"',
  624: 'v1.1.0 "Katalog Raksasa"',
  646: 'v1.1.0 "Katalog Raksasa"',
  668: 'v1.1.0 "Katalog Raksasa"',
  // Babak III — operasi kini
  692: 'v1.2.0 "Dunia Dua"',
  725: 'v1.2.1 "Gerbang Bersih"',
  742: 'v1.3.0 "Zamrud Keberangkatan"',
};

const HEADER = `# GUNARACORP — Engineering Worklog & Version Registry

> 🏷️ **Release aktif: v1.4.0 "Kronika" — 2026-10-22** · kanal \`stable\` · SemVer 2.0.0
> Berkas ini adalah **log kerja operasional multi-agent** (kronologis, append-only). Riwayat versi yang rapi untuk publik: **CHANGELOG.md** · Identitas versi programatik: **src/lib/version.ts** (\`APP_VERSION\`, \`RELEASES\`) · Metadata machine: **GET /api/version**.

---

## §0 Aturan Versi (SemVer Governance) — WAJIB dipatuhi semua agent

| Segmen | Naik ketika | Contoh nyata |
|---|---|---|
| **MAJOR** | Perubahan era identitas merek / struktur yang memutus kompatibilitas | (belum terpakai sejak v1.0.0) |
| **MINOR** | Fitur, halaman, atau integrasi baru yang kompatibel ke belakang | v1.1.0 katalog · v1.2.0 konsol · v1.3.0 warna · v1.4.0 tata kelola |
| **PATCH** | Perbaikan bug, kebersihan permukaan publik, perbaikan dokumen | v1.2.1 hotfix gerbang unduh |

**Alur rilis 6 langkah** (satu perubahan = satu versi, tanpa kecuali):

\`\`\`text
ubah kode → pilih tipe bump (MAJOR/MINOR/PATCH)
          → naikkan APP_VERSION + package.json + entri RELEASES (src/lib/version.ts)
          → tulis entri CHANGELOG.md (Added/Changed/Fixed/Verified)
          → tag \`Release: vX.Y.Z "Kode"\` pada entri worklog ini
          → bun run lint 0 error + verifikasi browser → rilis sah
\`\`\`

**Kebijakan nama kode**: satu kata per rilis, nuansa Nusantara/kitab, urutan kronologis —
Genesis, Ekspansi, Gerbang Perizinan, Kepemimpinan, Restorasi, Identitas Ungu-Biru, Skybridge,
Bright Executive, Gerbang Terpilih, Summit, Katalog Raksasa, Dunia Dua, Gerbang Bersih,
Zamrud Keberangkatan, Kronika.

## §1 Registri Rilis (rekonstruksi historis — tanggal pra-v1.4.0 presisi bulan)

| Versi | Kode | Tanggal | Babak | Sorotan | Task IDs |
|---|---|---|---|---|---|
| **1.4.0** | Kronika | 2026-10-22 | III | Tata kelola versi: CHANGELOG, API versi, chip footer, README v3, rename \`gunaracorp\` | 9 |
| **1.3.0** | Zamrud Keberangkatan | 2026-10 | III | Sistem warna v2 zamrud #047857 — uji kontras WCAG 2.2 numerik, alias token @theme | 9 |
| **1.2.1** | Gerbang Bersih | 2026-10 | III | Pintu unduh internal dibersihkan dari permukaan publik (navbar + footer) | 8 |
| **1.2.0** | Dunia Dua | 2026-10 | II–III | Pemisahan tegas Publik vs Console, README rewrite, audit penuh semua halaman | 15 |
| **1.1.0** | Katalog Raksasa | 2026-10 | II | Rebrand GUNARA CORPORATION, 120 layanan + /layanan, riset harga 5 kompetitor, SEO maksimal | 13, 14, 7-a, 5-a, 3-int, 4-harga |
| **1.0.0** | Summit | 2026-10 | II | **RILIS STABIL PERTAMA** — paket SEO 255 URL + perbaikan performa Lighthouse | 11, 12 |
| **0.9.0** | Gerbang Terpilih | 2026-10 | II | Oracle lounge VVIP, dashboard CEO + member, 6 halaman internasional | 8, 9, 10 |
| **0.8.0** | Bright Executive | 2026-10 | II | Rebrand tema gelap → terang | 7 |
| **0.7.0** | Skybridge | 2026-10 | II | Deploy produksi Vercel, anti no-deploy, README bilingual | 4, 5, 6 |
| **0.6.0** | Identitas Ungu-Biru | 2026-10 | II | Kontak resmi, rebrand ungu-biru, logo mitra instansi | 3 |
| **0.5.0** | Restorasi | 2026-10 | II | Pasang repo + branding 8 foto asli + logo instansi RI | 1, 2, 3 |
| **0.4.0** | Kepemimpinan | 2026-10 | I | Gugun Gunara pimpinan perusahaan + README kelas dunia pertama | 4-leadership-readme |
| **0.3.0** | Gerbang Perizinan | 2026-10 | I | Katalog 36 izin, terjemahan Indonesia penuh, rebrand PT TOP KONSULTAN | 3-a…3-g, 3-core |
| **0.2.0** | Ekspansi | 2026-10 | I | One-pager → website multi-halaman penuh | 2 |
| **0.1.0** | Genesis | 2026-10 | I | Build pertama "Omniprime Global Advisory" (46 Council, Oracle AI) | 1 |

> **Babak** — I: fondasi (sandbox pertama) · II: produksi (repo topkonsultan → GUNARA CORPORATION) · III: operasi berjalan.

## §2 Kontrak Penulisan Entri (untuk semua agent, tanpa kecuali)

1. Entri baru di-*append* di akhir berkas, dipisah baris \`---\`.
2. Tepat di bawah baris \`Task ID: …\` WAJIB ada baris \`Release: vX.Y.Z "KodeNama"\`.
3. Entri wajib memuat: Agent, Task, Work Log (langkah konkret), Stage Summary (hasil/keputusan/artefak).
4. Perubahan yang menaikkan versi WAJIB memperbarui \`src/lib/version.ts\` + \`package.json\` + \`CHANGELOG.md\` pada rilis yang sama.
5. Dilarang menghapus/menulis-ulang entri historis — koreksi dilakukan lewat entri baru.

---

# Log Kerja Kronologis (entri tertua → terbaru; setiap entri diberi tag rilis)`;

const lines = readFileSync(WORKLOG, "utf8").split("\n");

// Validasi: baris yang dipetakan memang baris "Task ID:".
let invalid = 0;
for (const [lineStr] of Object.entries(RELEASE_BY_LINE)) {
  const n = Number(lineStr);
  if (!/^Task ID:/.test(lines[n - 1] ?? "")) {
    console.error(`✗ Baris ${n} bukan "Task ID:": ${JSON.stringify(lines[n - 1]?.slice(0, 60))}`);
    invalid++;
  }
}
if (invalid > 0) {
  console.error(`Migrasi dibatalkan — ${invalid} pemetaan tidak valid.`);
  process.exit(1);
}

// Suntikkan dari BAWAH ke ATAS agar nomor baris di atas tetap valid.
const sorted = Object.keys(RELEASE_BY_LINE).map(Number).sort((a, b) => b - a);
let inserted = 0;
for (const n of sorted) {
  const next = lines[n] ?? "";
  if (/^Release:/.test(next)) continue; // idempoten
  lines.splice(n, 0, `Release: ${RELEASE_BY_LINE[n]}`);
  inserted++;
}

// Ganti judul lama (baris pertama) dengan header governance penuh.
if (lines[0].startsWith("# Worklog — Proyek Omniprime")) {
  lines[0] = HEADER;
} else if (!lines[0].includes("Version Registry")) {
  console.error("✗ Judul pertama tak dikenali:", lines[0].slice(0, 80));
  process.exit(1);
}

writeFileSync(WORKLOG, lines.join("\n"), "utf8");
console.log(`✓ Selesai: ${inserted} tag Release disuntikkan, header governance terpasang.`);
