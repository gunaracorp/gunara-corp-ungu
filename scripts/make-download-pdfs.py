#!/usr/bin/env python3
"""
Generate branded downloadable resource PDFs for the TOP public resources page.
Output: /home/z/my-project/public/downloads/*.pdf
Language: Indonesian (Latin script — Helvetica family is safe).
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, KeepTogether
)

OUT_DIR = "/home/z/my-project/public/downloads"
os.makedirs(OUT_DIR, exist_ok=True)

VIOLET = HexColor("#7c3aed")
VIOLET_DARK = HexColor("#5b21b6")
INDIGO = HexColor("#4f46e5")
BLUE = HexColor("#2563eb")
INK = HexColor("#0f172a")
SLATE = HexColor("#475569")
MIST = HexColor("#f5f3ff")
LINE = HexColor("#ddd6fe")
WHITE = HexColor("#ffffff")

BRAND = "PT TOP KONSULTAN INTERNASIONAL"
WA = "+62 811-1116-5165"
MAIL = "halo@topkonsultan.web.id"

S_TITLE = ParagraphStyle("t", fontName="Helvetica-Bold", fontSize=20, leading=25, textColor=INK)
S_SUB = ParagraphStyle("s", fontName="Helvetica", fontSize=10.5, leading=15, textColor=SLATE)
S_H2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=13, leading=17, textColor=VIOLET_DARK, spaceBefore=14, spaceAfter=6)
S_BODY = ParagraphStyle("b", fontName="Helvetica", fontSize=9.8, leading=14.5, textColor=INK)
S_LI = ParagraphStyle("li", fontName="Helvetica", fontSize=9.8, leading=14.5, textColor=INK, leftIndent=14, bulletIndent=4, spaceAfter=2.5)
S_NOTE = ParagraphStyle("n", fontName="Helvetica-Oblique", fontSize=8.5, leading=12, textColor=SLATE)
S_TH = ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=WHITE)
S_TD = ParagraphStyle("td", fontName="Helvetica", fontSize=9, leading=12.5, textColor=INK)
S_TD_B = ParagraphStyle("tdb", fontName="Helvetica-Bold", fontSize=9, leading=12.5, textColor=VIOLET_DARK)
S_CAP = ParagraphStyle("cap", fontName="Helvetica", fontSize=8, leading=11, textColor=SLATE, alignment=TA_CENTER)


def band(canvas, doc, title, subtitle, edition):
    """Violet gradient-ish header band + footer on every page."""
    w, h = A4
    canvas.saveState()
    # header band
    canvas.setFillColor(VIOLET_DARK)
    canvas.rect(0, h - 34 * mm, w, 34 * mm, stroke=0, fill=1)
    canvas.setFillColor(VIOLET)
    canvas.rect(0, h - 36.5 * mm, w, 2.5 * mm, stroke=0, fill=1)
    canvas.setFillColor(INDIGO)
    canvas.rect(0, h - 38 * mm, w, 1.5 * mm, stroke=0, fill=1)
    # brand chip
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 8.5)
    canvas.drawString(18 * mm, h - 10.5 * mm, BRAND)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(HexColor("#e9d5ff"))
    canvas.drawString(18 * mm, h - 15 * mm, "Konsultasi & Perizinan Terlengkap di Dunia — sejak 2001")
    # title
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 19)
    canvas.drawString(18 * mm, h - 24.5 * mm, title)
    canvas.setFont("Helvetica", 9.5)
    canvas.setFillColor(HexColor("#ddd6fe"))
    canvas.drawString(18 * mm, h - 30.5 * mm, subtitle)
    # edition chip
    canvas.setFillColor(WHITE)
    canvas.roundRect(w - 52 * mm, h - 26.5 * mm, 36 * mm, 8.5 * mm, 4.25 * mm, stroke=0, fill=1)
    canvas.setFillColor(VIOLET_DARK)
    canvas.setFont("Helvetica-Bold", 8.5)
    canvas.drawCentredString(w - 34 * mm, h - 23.8 * mm, edition)
    # footer
    canvas.setFillColor(MIST)
    canvas.rect(0, 0, w, 16 * mm, stroke=0, fill=1)
    canvas.setFillColor(LINE)
    canvas.rect(0, 16 * mm, w, 0.6, stroke=0, fill=1)
    canvas.setFillColor(VIOLET_DARK)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(18 * mm, 10.5 * mm, "WhatsApp Bisnis 24/7:")
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(SLATE)
    canvas.drawString(50 * mm, 10.5 * mm, f"{WA}   |   {MAIL}")
    canvas.setFont("Helvetica-Oblique", 7.5)
    canvas.drawString(18 * mm, 5.5 * mm, "Dokumen panduan umum, bukan nasihat hukum untuk kasus spesifik Anda. Konsultasikan kondisi Anda dengan Dewan kami.")
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(w - 18 * mm, 5.5 * mm, f"Halaman {doc.page}")
    canvas.restoreState()


def build(path, title, subtitle, edition, story):
    doc = BaseDocTemplate(path, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                          topMargin=44 * mm, bottomMargin=20 * mm,
                          title=f"{title} — {BRAND}", author=BRAND,
                          subject=subtitle)
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f")

    def on_page(canv, d):
        band(canv, d, title, subtitle, edition)

    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=on_page)])
    doc.build(story)


def hrule():
    t = Table([[""]], colWidths=[174 * mm], rowHeights=[0.6])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), LINE)]))
    return t


def checklist_table(rows):
    data = [[Paragraph("No.", S_TH), Paragraph("Dokumen / Langkah", S_TH), Paragraph("Catatan Kunci", S_TH), Paragraph("Selesai", S_TH)]]
    for i, (item, note) in enumerate(rows, 1):
        data.append([
            Paragraph(f"{i:02d}", S_TD_B),
            Paragraph(item, S_TD),
            Paragraph(note, S_TD),
            Paragraph("&#9744;", ParagraphStyle("box", fontName="Helvetica", fontSize=11, alignment=TA_CENTER, textColor=VIOLET)),
        ])
    t = Table(data, colWidths=[11 * mm, 62 * mm, 79 * mm, 22 * mm], repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), VIOLET),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, MIST]),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]
    t.setStyle(TableStyle(style))
    return t


# ----------------------------------------------------------------------------
# PDF 1 — Checklist Pendirian PT
# ----------------------------------------------------------------------------
c1 = []
c1.append(Paragraph("Satu dokumen kerja untuk mendirikan PT dengan benar — dari pemilihan nama hingga kewajiban pertama pasca-NIB.", S_SUB))
c1.append(Spacer(1, 8))
c1.append(hrule())

c1.append(Paragraph("A — Persiapan Pendirian", S_H2))
c1.append(checklist_table([
    ("Tentukan nama PT (3 alternatif)", "Cek ketersediaan nama di sistem Kemenkumham; hindari nama mirip entitas terdaftar."),
    ("Rumuskan bidang usaha & kode KBLI 2020", "KBLI menentukan risiko perizinan, skema insentif, dan kewajiban izin turunan."),
    ("Tetapkan struktur modal & porsi saham", "Modal dasar, ditempatkan, disetor; sesuaikan dengan syarat penerbitan izin tertentu."),
    ("Siapkan alamat kantor + bukti KKPR", "Kesepakatan atas ruang kantor atau sewa; verifikasi kesesuaian tata ruang lebih dulu."),
    ("Pemegang saham, direksi, komisaris", "Data identitas (KTP/paspor), NPWP, alamat, dan porsi kepentingan setiap pihak."),
]))
c1.append(Spacer(1, 6))
c1.append(Paragraph("B — Akta & Pengesahan", S_H2))
c1.append(checklist_table([
    ("Akta pendirian di hadapan notaris", "Memuat anggaran dasar yang selaras KBLI & UU Cipta Kerja; jangan pakai templat asal."),
    ("Pengesahan badan hukum (Kemenkumham)", "Akta tanpa SK pengesahan belum berkepribadian hukum."),
    ("NPWP badan + aktivasi efiling", "Diterbitkan bersamaan/melingkar dengan NIB; wajib untuk perpajakan."),
    ("Surat keterangan domisili (bila diminta)", "Dibutuhkan sejumlah bank dan instansi; format berbeda tiap daerah."),
]))

c1.append(Paragraph("C — OSS RBA & Perizinan Berusaha", S_H2))
c1.append(checklist_table([
    ("Registrasi akun OSS RBA (pemerintah/badan usaha)", "Gunakan NIB sebagai identitas; tetapkan peran pelaku usaha dengan benar."),
    ("Terbitkan NIB (Nomor Induk Berusaha)", "NIB berlaku sebagai identitas, izin lokasi, dan registrasi fiskal sekaligus."),
    ("Pilih skema risiko per KBLI", "Rendah: NIB saja; menengah tinggi & tinggi: wajib sertifikat standar / izin."),
    ("Penuhi sertifikat standar / izin berusaha", "Lengkapi persyaratan teknis (K3L, kualifikasi, peralatan) sesuai sektor."),
    ("Catat komitmen (bila ada) & laksanakan", "Komitmen berizin yang tertunda dapat menggantung validitas izin."),
]))

c1.append(Paragraph("D — Pasca-Pendirian (Sering Terlewat)", S_H2))
c1.append(checklist_table([
    ("Rekening bank atas nama PT", "Dana usaha dipisahkan dari pribadi — fondasi kredibilitas & audit."),
    ("Pendaftaran BPJS Ketenagakerjaan & Kesehatan", "Wajib begitu ada karyawan; diperiksa saat tender dan due diligence."),
    ("Laporan Kegiatan Penanaman Modal (LKPM)", "Kewajiban periodik OSS; kelalaian menutup akses insentif & pembaruan izin."),
    ("SPT Tahunan Badan & SPT Masa", "Kalender pajak dimulai sejak NIB aktif — bukan sejak operasional."),
    ("HAKI, merek & domain", "Lindungi nama dagang sebelum eksposur pasar meningkat."),
]))

c1.append(Paragraph("Estimasi Durasi (Skenario Normal)", S_H2))
dur = Table(
    [
        [Paragraph("Tahap", S_TH), Paragraph("Durasi umum", S_TH), Paragraph("Catatan", S_TH)],
        [Paragraph("Penyiapan dokumen & nama", S_TD), Paragraph("2–4 hari kerja", S_TD), Paragraph("Lebih cepat bila seluruh identitas lengkap.", S_TD)],
        [Paragraph("Akta notaris + SK Kemenkumham", S_TD), Paragraph("1–3 hari kerja", S_TD), Paragraph("Notaris non-sistem dapat menambah antrean.", S_TD)],
        [Paragraph("NIB + izin dasar di OSS RBA", S_TD), Paragraph("1 hari kerja", S_TD), Paragraph("Instan bila KBLI & modal konsisten.", S_TD)],
        [Paragraph("Izin teknis sektor (bila ada)", S_TD), Paragraph("5–30 hari kerja", S_TD), Paragraph("Sangat bergantung sektor & kesiapan teknis.", S_TD)],
    ],
    colWidths=[62 * mm, 40 * mm, 72 * mm],
    repeatRows=1,
)
dur.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), INDIGO),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, MIST]),
    ("GRID", (0, 0), (-1, -1), 0.5, LINE),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 4.5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
]))
c1.append(dur)
c1.append(Spacer(1, 10))
c1.append(KeepTogether([
    Paragraph("Kapan Anda butuh mitra?", S_H2),
    Paragraph(
        "Pendirian PT jarang gagal karena formulir — ia gagal karena struktur: KBLI yang salah membuat insentif hangus, "
        "anggaran dasar yang mengunci pemidanaan modal, atau komitmen berizin yang tidak pernah dilaporkan. "
        f"TOP mengawal seluruh rantai di atas sebagai satu penugasan, dengan satu Mitra Utama yang menjawab dengan nama. "
        f"Mulai lewat WhatsApp {WA} — briefing hari ini, kejelasan dalam 48 jam.",
        S_BODY,
    ),
    Spacer(1, 6),
    Paragraph("Edisi Januari 2026 — disusun oleh Tim Perizinan & Regulasi TOP. Diperbarui berkala mengikuti regulasi OSS RBA terkini.", S_NOTE),
]))
build(os.path.join(OUT_DIR, "checklist-pendirian-pt-2026.pdf"),
      "Checklist Pendirian PT 2026", "Panduan kerja 26 titik krusial — dari nama badan hukum hingga LKPM pertama",
      "Edisi 2026", c1)

# ----------------------------------------------------------------------------
# PDF 2 — Peta Jalan Perizinan OSS RBA
# ----------------------------------------------------------------------------
c2 = []
c2.append(Paragraph("Bagaimana sistem perizinan berusaha berbasis risiko Indonesia bekerja — dan bagaimana melewatinya tanpa drama.", S_SUB))
c2.append(Spacer(1, 8))
c2.append(hrule())

c2.append(Paragraph("OSS RBA dalam Satu Halaman", S_H2))
c2.append(Paragraph(
    "OSS RBA (Online Single Submission — Risk Based Approach) adalah pintu tunggal seluruh perizinan berusaha Indonesia. "
    "Sejak UU Cipta Kerja, pemerintah tidak lagi memperlakukan semua usaha sama: tingkat risiko kegiatan usaha Anda "
    "— diturunkan dari kode KBLI — menentukan seberapa berat syarat yang dipungut. Memahami logika risiko ini "
    "berarti setengah perjalanan perizinan Anda selesai; sisanya adalah kedisiplinan dokumen dan urutan proses.", S_BODY))
c2.append(Spacer(1, 4))
risk = Table(
    [
        [Paragraph("Tingkat Risiko", S_TH), Paragraph("Instrumen", S_TH), Paragraph("Artinya bagi Anda", S_TH)],
        [Paragraph("Rendah", S_TD_B), Paragraph("NIB", S_TD), Paragraph("Nomor Induk Berusaha langsung menjadi izin operasional Anda.", S_TD)],
        [Paragraph("Menengah Tinggi", S_TD_B), Paragraph("NIB + Sertifikat Standar", S_TD), Paragraph("Anda menyatakan kesanggupan memenuhi standar teknis, terverifikasi.", S_TD)],
        [Paragraph("Tinggi", S_TD_B), Paragraph("NIB + Izin (Persetujuan)", S_TD), Paragraph("Pemerintah menilai dokumen teknis sebelum Anda boleh beroperasi.", S_TD)],
    ],
    colWidths=[34 * mm, 52 * mm, 88 * mm],
    repeatRows=1,
)
risk.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), VIOLET),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, MIST]),
    ("GRID", (0, 0), (-1, -1), 0.5, LINE),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
]))
c2.append(risk)

c2.append(Paragraph("Peta Jalan Enam Tahap", S_H2))
steps = [
    ("01", "Verifikasi awal & pemetaan KBLI",
     "Uji kesesuaian tata ruang (KKPR), tetapkan KBLI final, pastikan sektor tidak tertutup untuk struktur modal Anda. Kesalahan di tahap ini menjalar ke seluruh rantai."),
    ("02", "NIB — identitas & registrasi fiskal",
     "Terbitkan NIB di OSS RBA. NIB merangkap izin lokasi, registrasi fiskal (NPWP), dan akses layanan pemerintahan lainnya."),
    ("03", "Skema risiko & instrumen perizinan",
     "Untuk setiap KBLI: risiko rendah selesai di NIB; menengah tinggi menuntut sertifikat standar; tinggi menuntut persetujuan (izin) dari kementerian/lembaga teknis."),
    ("04", "Pemenuhan persyaratan teknis",
     "Dokumen K3L, kualifikasi SDM, peralatan, audit keuangan bila diminta — disusun sekali dengan benar agar lolos tanpa revisi berulang."),
    ("05", "Komitmen berizin & pengawasan",
     "Bila izin Anda membawa komitmen (renovasi, alat, tenaga ahli), patuhi tenggat — verifikasi akhir menentukan izin tetap sah."),
    ("06", "Kewajiban berkelanjutan",
     "LKPM periodik, SPT pajak, pembaruan data OSS saat perubahan skala usaha atau kepemilikan. Perizinan yang sehat adalah sistem, bukan peristiwa."),
]
rows2 = [[Paragraph(n, S_TD_B), Paragraph(t, S_TD_B), Paragraph(d, S_TD)] for n, t, d in steps]
road = Table(rows2, colWidths=[12 * mm, 52 * mm, 110 * mm])
road.setStyle(TableStyle([
    ("ROWBACKGROUNDS", (0, 0), (-1, -1), [WHITE, MIST]),
    ("LINEBELOW", (0, 0), (-1, -2), 0.5, LINE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
]))
c2.append(road)

c2.append(Paragraph("Lima Kesalahan Paling Mahal", S_H2))
c2.append(Paragraph("1. KBLI dipilih asal — insentif fiskal hangus dan izin sektor salah pintu.", S_LI, bulletText="•"))
c2.append(Paragraph("2. Modal dasar diangsur sesuai mood — padahal izin tertentu mensyaratkan angka tertentu.", S_LI, bulletText="•"))
c2.append(Paragraph("3. Sertifikat standar dianggap selesai saat terbit — padahal verifikasi menyusul.", S_LI, bulletText="•"))
c2.append(Paragraph("4. LKPM diabaikan — akses insentif dan pembaruan izin terkunci tanpa peringatan.", S_LI, bulletText="•"))
c2.append(Paragraph("5. Perubahan saham/pengurus tidak dilaporkan ke OSS — data usaha tidak konsisten saat audit.", S_LI, bulletText="•"))

c2.append(KeepTogether([
    Paragraph("Bagaimana TOP menuntaskannya", S_H2),
    Paragraph(
        "Tim Perizinan & Regulasi TOP mengawal enam tahap di atas sebagai satu penugasan terintegrasi — satu Mitra Utama, "
        "satu titik akuntabilitas, satu kalender kewajiban. Katalog lengkap 36+ jenis izin kami, dari NIB hingga AMDAL dan "
        f"KITAS, berada di situs resmi kami. Konsultasi awal via WhatsApp {WA}: briefing hari ini, kejelasan jalur terbaik dalam 48 jam.",
        S_BODY,
    ),
    Spacer(1, 6),
    Paragraph("Edisi Januari 2026 — disusun berdasarkan PP 5/2021, PP 28/2025 dan praktik terkini OSS RBA. Peraturan berubah; selalu konfirmasi sebelum bertindak.", S_NOTE),
]))
build(os.path.join(OUT_DIR, "peta-jalan-perizinan-oss-rba-2026.pdf"),
      "Peta Jalan Perizinan OSS RBA 2026", "Memahami perizinan berusaha berbasis risiko — enam tahap dari NIB hingga pemeliharaan",
      "Edisi 2026", c2)

for f in sorted(os.listdir(OUT_DIR)):
    p = os.path.join(OUT_DIR, f)
    print(f"{f}  —  {os.path.getsize(p)/1024:.1f} KB")
