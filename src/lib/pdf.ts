/**
 * Generator PDF minimal tanpa dependensi eksternal (zero-dep).
 * Membuat PDF 1.4 valid: A4, font standar Helvetica (WinAnsiEncoding),
 * teks membungkus otomatis, tabel bergaris, blok statistik, nomor halaman.
 *
 * Cocok untuk laporan bisnis berbahasa Indonesia (Latin). Tidak butuh
 * embedding font → berkas kecil dan cepat, bebas masalah bundling Next.js.
 */

/* ── Metrik lebar glyph Helvetica (unit/1000, ASCII 32–126) ─────────────── */

const HELV: number[] = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556,
  556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778,
  722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278,
  278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
];

const HELV_B: number[] = [
  278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556,
  556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778,
  722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333,
  278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611,
  611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584,
];

/* ── Pemetaan Unicode → WinAnsi (karakter tanda baca umum) ──────────────── */

const WINANSI_MAP: Record<string, number> = {
  "\u2013": 0x96, // – en dash
  "\u2014": 0x97, // — em dash
  "\u2018": 0x91, // ' left quote
  "\u2019": 0x92, // ' right quote
  "\u201C": 0x93, // " left double
  "\u201D": 0x94, // " right double
  "\u2022": 0x95, // • bullet
  "\u2026": 0x85, // … ellipsis
  "\u00A0": 0x20, // nbsp → spasi
};

/* ── Palet warna GUNARA ─────────────────────────────────────────────────── */

export const C = {
  violet: [0.486, 0.227, 0.929] as const, // #7C3AED
  violetDark: [0.376, 0.145, 0.71] as const, // #602AB5
  dark: [0.059, 0.09, 0.165] as const, // #0F172A
  text: [0.278, 0.335, 0.412] as const, // #475569
  subtle: [0.42, 0.47, 0.55] as const,
  light: [0.945, 0.961, 0.976] as const, // #F1F5F9
  border: [0.796, 0.835, 0.882] as const, // #CBD5E1
  white: [1, 1, 1] as const,
  emerald: [0.02, 0.588, 0.412] as const,
  rose: [0.882, 0.114, 0.282] as const,
  amber: [0.851, 0.467, 0.024] as const,
  gold: [0.72, 0.53, 0.04] as const,
};

export type Rgb = readonly [number, number, number] | readonly number[];

function fmt(n: number): string {
  return (Math.round(n * 100) / 100).toString();
}

function charW(ch: string, bold: boolean): number {
  const code = ch.charCodeAt(0);
  if (code >= 32 && code <= 126) return (bold ? HELV_B : HELV)[code - 32];
  if (WINANSI_MAP[ch] !== undefined) return ch === "\u2022" ? 350 : (bold ? HELV_B : HELV)[0]; // perlakukan seperti spasi/leviar
  return 556;
}

function textW(str: string, bold: boolean, size: number): number {
  let w = 0;
  for (const ch of str) w += charW(ch, bold);
  return (w * size) / 1000;
}

/** Escape string ke bentuk string PDF (WinAnsi + escape tanda kurung). */
function esc(str: string): string {
  let out = "";
  for (const ch of str) {
    const mapped = WINANSI_MAP[ch];
    if (mapped !== undefined) {
      out += String.fromCharCode(mapped);
      continue;
    }
    const code = ch.charCodeAt(0);
    if (code > 255) {
      out += "?";
      continue;
    }
    if (ch === "(" || ch === ")" || ch === "\\") out += `\\${ch}`;
    else out += ch;
  }
  return out;
}

export interface TextOpts {
  size?: number;
  bold?: boolean;
  color?: Rgb;
  /** Geser x khusus untuk baris ini (relative margin). */
  x?: number;
  align?: "left" | "center" | "right";
  /** Lebar bungkus khusus (default: lebar konten penuh). */
  width?: number;
  lineHeight?: number;
}

export interface TableRow {
  cells: string[];
  bold?: boolean;
  color?: Rgb;
  fill?: Rgb;
}

export interface StatBox {
  label: string;
  value: string;
  hint?: string;
  color?: Rgb;
}

const A4_W = 595.28;
const A4_H = 841.89;
const MARGIN_X = 48;
const TOP = 792;
const BOTTOM = 64;
const CONTENT_W = A4_W - MARGIN_X * 2;

export class PdfBuilder {
  private pages: string[][] = [];
  private cur: string[] = [];
  private y = TOP;
  private objects: string[] = [];
  private onPage: ((pageNo: number, total: number, cmds: string[]) => void)[] = [];

  constructor(
    private readonly docTitle: string = "GUNARA CORPORATION",
    private readonly footerLabel: string = "GUNARA CORPORATION — Dokumen internal & rahasia"
  ) {
    this.pages.push(this.cur);
  }

  get contentY(): number {
    return this.y;
  }

  private newPage(): void {
    this.cur = [];
    this.pages.push(this.cur);
    this.y = TOP;
  }

  private ensure(h: number): void {
    if (this.y - h < BOTTOM) this.newPage();
  }

  spacer(h = 10): this {
    this.y -= h;
    if (this.y < BOTTOM) this.newPage();
    return this;
  }

  rect(x: number, y: number, w: number, h: number, color: Rgb, stroke = false): this {
    this.cur.push(
      stroke
        ? `${fmt(color[0])} ${fmt(color[1])} ${fmt(color[2])} RG 0.7 w ${fmt(x)} ${fmt(y)} ${fmt(w)} ${fmt(h)} re S`
        : `${fmt(color[0])} ${fmt(color[1])} ${fmt(color[2])} rg ${fmt(x)} ${fmt(y)} ${fmt(w)} ${fmt(h)} re f`
    );
    return this;
  }

  /** Tulis teks dengan bungkus kata otomatis; mengalirkan kursor ke bawah. */
  text(str: string, opts: TextOpts = {}): this {
    const size = opts.size ?? 10.5;
    const bold = opts.bold ?? false;
    const color = opts.color ?? C.text;
    const wrapW = opts.width ?? CONTENT_W - (opts.x ?? 0);
    const lh = opts.lineHeight ?? size * 1.38;
    const font = bold ? "/F2" : "/F1";
    const col = `${fmt(color[0])} ${fmt(color[1])} ${fmt(color[2])} rg`;

    const paragraphs = str.split("\n");
    for (const para of paragraphs) {
      if (para === "") {
        this.y -= lh * 0.6;
        continue;
      }
      const words = para.split(/\s+/).filter(Boolean);
      let line = "";
      const flush = () => {
        if (!line) return;
        this.ensure(lh);
        let x = MARGIN_X + (opts.x ?? 0);
        const w = textW(line, bold, size);
        if (opts.align === "center") x = MARGIN_X + (CONTENT_W - w) / 2;
        else if (opts.align === "right") x = MARGIN_X + CONTENT_W - w;
        this.cur.push(
          `BT ${font} ${fmt(size)} Tf ${col} 1 0 0 1 ${fmt(x)} ${fmt(this.y - size * 0.92)} Tm (${esc(line)}) Tj ET`
        );
        this.y -= lh;
        line = "";
      };
      for (const word of words) {
        const attempt = line ? `${line} ${word}` : word;
        if (textW(attempt, bold, size) > wrapW && line) flush();
        line = line ? (textW(word, bold, size) > wrapW ? (flush(), word) : `${line} ${word}`) : word;
      }
      flush();
    }
    return this;
  }

  /** Judul seksi: kotak aksen violet + teks tebal. */
  heading(label: string): this {
    this.ensure(30);
    this.rect(MARGIN_X, this.y - 14, 3.5, 15, C.violet);
    this.text(label, { size: 12.5, bold: true, color: C.dark, x: 10, lineHeight: 17 });
    this.y -= 5;
    return this;
  }

  /** Baris pasangan label-nilai sederhana. */
  kv(key: string, value: string, opts: TextOpts = {}): this {
    this.ensure(15);
    this.text(key, { size: 9.5, bold: true, color: C.subtle, x: 2, lineHeight: 14 });
    const w = textW(key, true, 9.5);
    this.text(value, { size: 10, color: opts.color ?? C.text, x: 12 + w, lineHeight: 14 });
    return this;
  }

  /** Blok kotak statistik (2–4 kolom). */
  statBoxes(stats: StatBox[], cols = 3): this {
    const gap = 10;
    const boxW = (CONTENT_W - gap * (cols - 1)) / cols;
    const rows = Math.ceil(stats.length / cols);
    for (let r = 0; r < rows; r++) {
      const slice = stats.slice(r * cols, r * cols + cols);
      const boxH = 52;
      this.ensure(boxH + 8);
      const topY = this.y;
      slice.forEach((s, i) => {
        const x = MARGIN_X + i * (boxW + gap);
        const yy = topY - boxH;
        this.rect(x, yy, boxW, boxH, C.light);
        this.rect(x, yy + boxH - 3, boxW, 3, s.color ?? C.violet);
        this.cur.push(
          `BT /F2 15 Tf ${fmt((s.color ?? C.dark)[0])} ${fmt((s.color ?? C.dark)[1])} ${fmt((s.color ?? C.dark)[2])} rg 1 0 0 1 ${fmt(x + 10)} ${fmt(yy + 22)} Tm (${esc(s.value)}) Tj ET`
        );
        this.cur.push(
          `BT /F1 7.6 Tf ${fmt(C.subtle[0])} ${fmt(C.subtle[1])} ${fmt(C.subtle[2])} rg 1 0 0 1 ${fmt(x + 10)} ${fmt(yy + 9)} Tm (${esc(s.label.toUpperCase())}) Tj ET`
        );
        if (s.hint) {
          this.cur.push(
            `BT /F1 6.8 Tf ${fmt(C.subtle[0])} ${fmt(C.subtle[1])} ${fmt(C.subtle[2])} rg 1 0 0 1 ${fmt(x + 10)} ${fmt(yy + 40)} Tm (${esc(s.hint)}) Tj ET`
          );
        }
      });
      this.y = topY - boxH - 10;
    }
    return this;
  }

  /** Tabel bergaris dengan header violet; otomatis pindah halaman. */
  table(headers: string[], rows: TableRow[], widths: number[], fontSize = 8.8): this {
    const total = widths.reduce((a, b) => a + b, 0);
    const colW = widths.map((w) => (w / total) * CONTENT_W);
    const pad = 4;

    const drawHeader = () => {
      const h = fontSize + pad * 2 + 2;
      this.ensure(h + 4);
      this.rect(MARGIN_X, this.y - h, CONTENT_W, h, C.violetDark);
      let x = MARGIN_X;
      headers.forEach((hd, i) => {
        this.cur.push(
          `BT /F2 ${fmt(fontSize)} Tf ${fmt(C.white[0])} ${fmt(C.white[1])} ${fmt(C.white[2])} rg 1 0 0 1 ${fmt(x + pad)} ${fmt(this.y - h + pad + 1)} Tm (${esc(hd)}) Tj ET`
        );
        x += colW[i];
      });
      this.y -= h + 2;
    };

    drawHeader();

    rows.forEach((row, ri) => {
      // Bungkus isi sel per kolom
      const cellLines = row.cells.map((cell, i) => this.wrapPlain(cell, colW[i] - pad * 2, row.bold ?? false, fontSize));
      const lineCount = Math.max(1, ...cellLines.map((l) => l.length));
      const lh = fontSize * 1.3;
      const h = lineCount * lh + pad * 2;

      if (this.y - h < BOTTOM) {
        this.newPage();
        drawHeader();
      }
      const topY = this.y;
      if (row.fill) {
        this.rect(MARGIN_X, topY - h, CONTENT_W, h, row.fill);
      } else if (ri % 2 === 1) {
        this.rect(MARGIN_X, topY - h, CONTENT_W, h, C.light);
      }
      // Garis bawah baris
      this.rect(MARGIN_X, topY - h, CONTENT_W, 0.5, C.border);

      let x = MARGIN_X;
      cellLines.forEach((lines, i) => {
        let ty = topY - pad - fontSize * 0.85;
        for (const ln of lines) {
          this.cur.push(
            `BT /F${row.bold ? 2 : 1} ${fmt(fontSize)} Tf ${fmt((row.color ?? C.text)[0])} ${fmt((row.color ?? C.text)[1])} ${fmt((row.color ?? C.text)[2])} rg 1 0 0 1 ${fmt(x + pad)} ${fmt(ty)} Tm (${esc(ln)}) Tj ET`
          );
          ty -= lh;
        }
        x += colW[i];
      });
      this.y = topY - h;
    });
    this.y -= 8;
    return this;
  }

  private wrapPlain(str: string, maxW: number, bold: boolean, size: number): string[] {
    const words = String(str ?? "").split(/\s+/).filter(Boolean);
    if (words.length === 0) return [""];
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const attempt = line ? `${line} ${word}` : word;
      if (textW(attempt, bold, size) > maxW && line) {
        lines.push(line);
        line = word;
      } else {
        line = attempt;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  /** Band header dokumen di halaman pertama. */
  coverBand(subtitle: string, meta: string[]): this {
    const bandH = 92;
    this.rect(0, A4_H - bandH, A4_W, bandH, C.violetDark);
    this.rect(0, A4_H - bandH - 4, A4_W, 4, C.violet);
    this.cur.push(
      `BT /F2 22 Tf 1 1 1 rg 1 0 0 1 ${fmt(MARGIN_X)} ${fmt(A4_H - 34)} Tm (GUNARA CORPORATION) Tj ET`
    );
    this.cur.push(
      `BT /F1 10.5 Tf 0.88 0.85 0.98 rg 1 0 0 1 ${fmt(MARGIN_X)} ${fmt(A4_H - 52)} Tm (${esc(subtitle)}) Tj ET`
    );
    let mx = MARGIN_X;
    for (const m of meta) {
      this.cur.push(
        `BT /F1 7.8 Tf 0.8 0.78 0.95 rg 1 0 0 1 ${fmt(mx)} ${fmt(A4_H - 74)} Tm (${esc(m)}) Tj ET`
      );
      mx += textW(m, false, 7.8) + 18;
    }
    this.y = A4_H - bandH - 24;
    return this;
  }

  /** Sisipkan footer tiap halaman saat build. */
  private stampFooters(): void {
    const total = this.pages.length;
    this.pages.forEach((cmds, i) => {
      cmds.push(
        `0.796 0.835 0.882 RG 0.6 w ${fmt(MARGIN_X)} ${fmt(BOTTOM - 14)} m ${fmt(A4_W - MARGIN_X)} ${fmt(BOTTOM - 14)} l S`
      );
      cmds.push(
        `BT /F1 7.6 Tf ${fmt(C.subtle[0])} ${fmt(C.subtle[1])} ${fmt(C.subtle[2])} rg 1 0 0 1 ${fmt(MARGIN_X)} ${fmt(BOTTOM - 26)} Tm (${esc(this.footerLabel)}) Tj ET`
      );
      const pn = `Halaman ${i + 1} dari ${total}`;
      cmds.push(
        `BT /F2 7.6 Tf ${fmt(C.subtle[0])} ${fmt(C.subtle[1])} ${fmt(C.subtle[2])} rg 1 0 0 1 ${fmt(A4_W - MARGIN_X - textW(pn, true, 7.6))} ${fmt(BOTTOM - 26)} Tm (${esc(pn)}) Tj ET`
      );
    });
  }

  /** Rakit PDF → Uint8Array. */
  build(): Uint8Array {
    this.stampFooters();
    const pageObjs: number[] = [];
    const contentObjs: number[] = [];
    // Objek: 1 katalog, 2 pages, 3 F1, 4 F2, lalu per halaman: page & konten
    let nextNum = 5;
    for (let i = 0; i < this.pages.length; i++) {
      const pageNum = nextNum++;
      const contentNum = nextNum++;
      pageObjs.push(pageNum);
      contentObjs.push(contentNum);
    }

    const enc = (s: string) => Buffer.from(s, "latin1");
    const chunks: Buffer[] = [];
    let offset = 0;
    const offsets: number[] = [];
    const push = (s: string) => {
      const b = enc(s);
      chunks.push(b);
      offset += b.length;
    };

    push("%PDF-1.4\n%\u00E2\u00E3\u00CF\u00D3\n");

    const addObj = (num: number, body: string) => {
      offsets[num] = offset;
      push(`${num} 0 obj\n${body}\nendobj\n`);
    };

    addObj(1, "<< /Type /Catalog /Pages 2 0 R >>");
    const kids = pageObjs.map((n) => `${n} 0 R`).join(" ");
    addObj(2, `<< /Type /Pages /Kids [${kids}] /Count ${pageObjs.length} >>`);
    addObj(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
    addObj(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");

    this.pages.forEach((cmds, i) => {
      const stream = cmds.join("\n");
      addObj(
        pageObjs[i],
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${fmt(A4_W)} ${fmt(A4_H)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjs[i]} 0 R >>`
      );
      addObj(contentObjs[i], `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`);
    });

    const xrefStart = offset;
    const count = nextNum;
    let xref = `xref\n0 ${count}\n0000000000 65535 f \n`;
    for (let i = 1; i < count; i++) {
      xref += `${String(offsets[i] ?? 0).padStart(10, "0")} 00000 n \n`;
    }
    push(xref);
    push(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`);

    const buf = Buffer.concat(chunks);
    return new Uint8Array(buf);
  }
}
