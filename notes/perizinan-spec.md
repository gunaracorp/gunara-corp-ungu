# SPESIFIKSI — src/data/perizinan.ts (PT TOP KONSULTAN INTERNASIONAL)

Katalog "Gerbang Perizinan" — jasa pengurusan izin terlengkap di dunia.
Output: SATU file TypeScript `src/data/perizinan.ts` yang lolos `bunx tsc --noEmit`.

## Aturan bahasa & brand
- Semua teks naratif dalam BAHASA INDONESIA baku dan premium (gaya konsultan top).
- Istilah teknis boleh tetap asing bila lazim (NIB, OSS RBA, e-Faktur, KITAS, ISO 9001, due diligence).
- Setiap item wajib punya `enName` + `enTagline` (bahasa Inggris elegan) untuk klien global.
- Persamaan angka gunakan format Indonesia (Rp10 miliar, 99,97%).

## Ekspor yang wajib ada

```ts
import { type LucideIcon } from "lucide-react";
// import icon dari lucide-react yang relevan (FileSignature, Landmark, Scale, dst)

export interface PerizinanCategory {
  id: string;          // slug stabil, dipakai di URL ?kategori=
  name: string;        // bahasa Indonesia
  enName: string;      // bahasa Inggris
  desc: string;        // 1 kalimat Indonesia
  icon: LucideIcon;
}

export interface PerizinanItem {
  slug: string;          // kebab-case unik, stabil (URL)
  name: string;          // ID
  enName: string;        // EN
  categoryId: string;    // EXACT id dari PERIZINAN_CATEGORIES
  agency: string;        // instansi, mis. "Lembaga OSS (OSS RBA) · BKPM"
  tagline: string;       // 1 kalimat ID
  enTagline: string;     // 1 kalimat EN
  description: string[]; // TEPAT 2 paragraf ID (masing-masing 2–3 kalimat)
  requirements: string[];// TEPAT 5 butir ID
  process: { step: string; text: string }[]; // TEPAT 5 langkah ID (step = "01".."05", text 1 kalimat)
  timeline: string;      // mis. "1–3 hari kerja"
  validity: string;      // mis. "Berlaku selama badan usaha aktif"
  complexity: "Dasar" | "Menengah" | "Kompleks";
  priceNote: string;     // mis. "Biaya resmi negara Rp0 — pendampingan pakar mulai Rp2,5 juta"
  icon: LucideIcon;
}

export const PERIZINAN_CATEGORIES: PerizinanCategory[] = [ /* TEPAT 8, urutan di bawah */ ];
export const PERIZINAN: PerizinanItem[] = [ /* TEPAT 36 item */ ];
export const PERIZINAN_STATS: { value: string; label: string }[] = [
  { value: "36+", label: "Jenis Izin Ditangani" },
  { value: "8", label: "Kategori Regulasi" },
  { value: "48 jam", label: "Peta Jalan Perizinan Pertama" },
  { value: "99,97%", label: "Ketepatan Kelengkapan Dokumen" },
];
```

## 8 Kategori (id → name → enName) — urutan WAJIB
1. `badan-hukum` → "Pendirian & Badan Hukum" → "Entity Formation & Legal Standing"
2. `oss-nib` → "OSS RBA & Izin Usaha" → "OSS RBA & Business Licenses"
3. `pajak` → "Perpajakan" → "Taxation"
4. `ketenagakerjaan` → "Ketenagakerjaan & Imigrasi" → "Manpower & Immigration"
5. `lingkungan` → "Lingkungan & Bangunan" → "Environment & Buildings"
6. `perdagangan` → "Perdagangan & Produk" → "Trade & Products"
7. `kekayaan-intelektual` → "Kekayaan Intelektual & Digital" → "Intellectual Property & Digital"
8. `sektor-khusus` → "Sektor Khusus & Kepatuhan Global" → "Special Sectors & Global Compliance"

## 36 Item (slug → name — agency; jumlah per kategori)

### badan-hukum (6)
1. `pendirian-pt` → "Pendirian PT (Perseroan Terbatas)" — Notaris & AHU Kemenkumham
2. `pendirian-pma` → "Pendirian PT PMA (Penanaman Modal Asing)" — BKPM / OSS RBA & Notaris
3. `pendirian-cv-firma-koperasi` → "Pendirian CV, Firma & Koperasi" — Notaris & Dinas Koperasi
4. `kantor-perwakilan-asing` → "Kantor Perwakilan Asing (Representative Office)" — KPPA / BKPM
5. `pendirian-yayasan` → "Pendirian Yayasan & Perkumpulan" — Notaris & AHU Kemenkumham
6. `domisili-virtual-office` → "Alamat Domisili & Virtual Office" — Mitra Domisili Lisensi

### oss-nib (4)
7. `nib-oss-rba` → "NIB — Nomor Induk Berusaha (OSS RBA)" — Lembaga OSS (OSS RBA)
8. `izin-usaha-sertifikat-standar` → "Izin Usaha & Sertifikat Standar" — Lembaga OSS (OSS RBA)
9. `kbli-skala-usaha` → "Penetapan KBLI & Skala Usaha" — Lembaga OSS (OSS RBA)
10. `legalisasi-apostille` → "Legalisasi Dokumen & Apostille" — Kemenkumham

### pajak (4)
11. `npwp-badan` → "NPWP Badan & Cabang" — Direktorat Jenderal Pajak (DJP)
12. `pkp-efaktur` → "Pengukuhan PKP & e-Faktur/e-In" — DJP
13. `spt-kepatuhan-pajak` → "Kepatuhan SPT & Pendampingan Pajak Tahunan" — DJP
14. `fasilitas-pajak` → "Fasilitas Pajak (Tax Holiday, Super Deduction)" — DJP & Kemenperin/BKPM

### ketenagakerjaan (4)
15. `wajib-lapor-bpjs` → "Wajib Lapor Perusahaan & BPJS" — Disnaker & BPJS
16. `rptka` → "RPTKA — Rencana Penggunaan Tenaga Kerja Asing" — Kemnaker (DKP-TKA)
17. `kitas-itas-asing` → "Notifikasi IMTA, VITAS/KITAS-ITAS & KITAP" — Kemnaker & Imigrasi
18. `pp-pkb-lks` → "Peraturan Perusahaan, PP-PKB & LKS Bipartit" — Disnaker

### lingkungan (4)
19. `kkpr` → "Persetujuan Tata Ruang (KKPR)" — ATR/BPN
20. `persetujuan-lingkungan` → "Persetujuan Lingkungan (AMDAL / UKL-UPL / SPPL)" — KLHK / Dinas LH
21. `pbg` → "PBG — Persetujuan Bangunan Gedung" — SIMBG / Pemda
22. `slf` → "SLF — Sertifikat Laik Fungsi" — Pemda

### perdagangan (5)
23. `api-u-api-p` → "API-U & API-P (Importir/Eksportir)" — Bea Cukai (via OSS)
24. `izin-edar-bpom-pirt` → "Izin Edar BPOM (MD) & PIRT" — BPOM
25. `sertifikasi-halal` → "Sertifikasi Halal Wajib (BPJPH)" — BPJPH (SiHalal)
26. `sni` → "SNI — Sertifikat Tanda Standar Nasional" — BSN / LSPro
27. `alat-kesehatan-kosmetik` → "Izin Alat Kesehatan (AKD/AKL) & Notifikasi Kosmetik" — Kemenkes & BPOM

### kekayaan-intelektual (4)
28. `pendaftaran-merek` → "Pendaftaran Merek" — DJKI Kemenkumham
29. `paten-desain-hakcipta` → "Paten, Desain Industri & Hak Cipta" — DJKI Kemenkumham
30. `pse-komdigi` → "Pendaftaran PSE (Sistem Elektronik)" — Komdigi
31. `kepatuhan-uu-pdp` → "Kepatuhan UU Perlindungan Data Pribadi" — Audit PDP TOP

### sektor-khusus (5)
32. `izin-ojk-bi` → "Izin OJK & Perizinan Bank Indonesia (PJSP)" — OJK & BI
33. `izin-sektor-strategis` → "Izin Sektor Strategis (BAPETEN, ESDM, Minerba, Kehutanan)" — K/L Terkait
34. `sertifikasi-iso` → "Sertifikasi ISO (9001/14001/27001/45001/22000)" — Lembaga Sertifikasi Akreditasi
35. `aml-cft-kyc` → "Kepatuhan AML/CFT & KYC" — PPATK Readiness TOP
36. `ekspansi-global` → "Ekspansi Global & Market Entry 190 Negara" — Jejaring TOP Global

## Fakta regulasi yang HARUS akurat (hasil riset)
- PMA: modal disetor minimal Rp2,5 miliar per pemegang saham; rencana investasi total ≥ Rp10 miliar (di luar tanah & bangunan) sesuai regulasi BKPM; berdiri via notaris → SK Kemenkumham → NIB OSS.
- Halal: wajib bagi pangan/minuman sejak 17 Oktober 2024 (PP 42/2024); kosmetik & barang konsumsi mengikuti bertahap (2026); proses via SiHalal BPJPH; lppom/auditor halal; sertifikat asing didaftarkan (IDR 800 ribu/sertifikat).
- PBG menggantikan IMB (UU Cipta Kerja; SIMBG); SLF diterbitkan Pemda setelah gedung selesai & memenuhi standar teknis.
- PSE Lingkup Privat: Permenkominfo 5/2020, pendaftaran online, menerbitkan TDPSE; wajib bagi yang melayani Indonesia.
- API-U/API-P: diterbitkan melalui NIB di OSS (fungsi ganda).
- RPTKA: wajib sebelum mengpekerjakan TKA; disusun pemberi kerja; DP 10 juta USD/TKA untuk kompensasi (atau keringanan); dilanjutkan notifikasi & visa.
- Tax holiday hingga 20 tahun; super deduction 300% (riset) & 200% (vokasi).
- Merek DJKI: online via PDKI, perlindungan 10 tahun & dapat diperpanjang.
- NIB: berlaku sebagai identitas & sekaligus izin untuk risiko usaha rendah; OSS RBA = pemeringkatan risiko (rendah/menengah rendah/menengah tinggi/tinggi).
- AMDAL untuk dampak besar; UKL-UPL menengah; SPPL rendah — sebagai bagian Persetujuan Lingkungan.

## Gaya priceNote
Sebutkan "biaya resmi negara" (banyak Rp0/variatif per daerah) + estimasi jasa pendampingan TOP dalam Rupiah wajar (Rp1,5–75 juta tergantung kompleksitas; PMA/OJK/AMDAL lebih tinggi). Jangan janji harga pasti.

## Gaya penulisan
- Nada: berwibawa, presiden-direktur-friendly, zero-jargon-berlebihan, kayak brosur McKinsey × pengacara korporat Jakarta.
- description[0]: masalah & konteks regulasi; description[1]: cara TOP menuntaskan + hasil untuk klien.
- requirements: dokumen/prasyarat nyata (KTP/akta/NPWP/dll) — boleh ringkas.
- process steps: linear jelas dari konsultasi → penyerahan dokumen resmi.
- JANGAN mengarang pasal/angka selain yang tercantum di atas; boleh bilang "sesuai regulasi terkini".
- WAJIB: file lolos TS — ikon hanya dari lucide-react; tidak ada import yang tak terpakai; tidak ada `any`.
