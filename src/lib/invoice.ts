import { db } from "@/lib/db";

/**
 * Invoice GUNARA — tagihan layanan kepada client.
 *
 * - Item tersimpan sebagai JSON [{desc, qty, price}] di kolom `items`.
 * - Total (amount) selalu dihitung ulang di server — tidak percaya klien.
 * - RefCode format INV-XXXX-XXXX.
 * - Status: draft | terkirim | dibayar | batal.
 */

export const INVOICE_STATUS = ["draft", "terkirim", "dibayar", "batal"] as const;

export interface InvoiceItem {
  desc: string;
  qty: number;
  price: number;
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateInvoiceRef(): string {
  const pick = (n: number) =>
    Array.from({ length: n }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
  return `INV-${pick(4)}-${pick(4)}`;
}

/** Normalisasi + validasi item invoice dari body request. */
export function parseItems(raw: unknown): InvoiceItem[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: InvoiceItem[] = [];
  for (const it of raw.slice(0, 30)) {
    if (!it || typeof it !== "object") return null;
    const o = it as Record<string, unknown>;
    const desc = typeof o.desc === "string" ? o.desc.trim() : "";
    const qty = Number(o.qty);
    const price = Number(o.price);
    if (!desc || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(price) || price < 0) return null;
    out.push({ desc: desc.slice(0, 120), qty: Math.round(qty * 100) / 100, price: Math.round(price) });
  }
  return out;
}

export function totalOf(items: InvoiceItem[]): number {
  return items.reduce((a, it) => a + Math.round(it.qty * it.price), 0);
}

/** Format Rupiah tanpa desimal: 12.500.000 (re-export dari lib/format, client-safe). */
export { rupiah } from "@/lib/format";

/** Serialisasi invoice untuk API/UI. */
export function serInvoice(inv: {
  id: string;
  refCode: string;
  clientId: string | null;
  clientName: string;
  projectId: string | null;
  projectRef: string | null;
  items: string;
  amount: number;
  status: string;
  dueDate: Date | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  let items: InvoiceItem[] = [];
  try {
    const parsed = JSON.parse(inv.items);
    if (Array.isArray(parsed)) items = parsed as InvoiceItem[];
  } catch {
    /* items korup → kosong */
  }
  return {
    id: inv.id,
    refCode: inv.refCode,
    clientId: inv.clientId,
    clientName: inv.clientName,
    projectId: inv.projectId,
    projectRef: inv.projectRef,
    items,
    amount: inv.amount,
    status: inv.status,
    dueDate: inv.dueDate ? inv.dueDate.toISOString() : null,
    note: inv.note,
    createdAt: inv.createdAt.toISOString(),
    updatedAt: inv.updatedAt.toISOString(),
  };
}

/** Ambil satu invoice milik client (untuk portal). */
export async function invoiceMilikClient(invoiceId: string, clientId: string) {
  const inv = await db.invoice.findUnique({ where: { id: invoiceId } });
  if (!inv || inv.clientId !== clientId) return null;
  return inv;
}

export const INVOICE_STATUS_META: Record<string, { label: string; badge: string }> = {
  draft: { label: "Draft", badge: "bg-slate-500/10 text-slate-600 border-slate-300" },
  terkirim: { label: "Terkirim", badge: "bg-sky-500/10 text-sky-700 border-sky-300" },
  dibayar: { label: "Dibayar", badge: "bg-emerald-600/10 text-emerald-700 border-emerald-300" },
  batal: { label: "Batal", badge: "bg-rose-500/10 text-rose-700 border-rose-300" },
};
