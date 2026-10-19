"use client";

/**
 * Admin More — tab tambahan Panel CEO GUNARA (fitur baru):
 * 1. AdminDukunganTab — pusat tiket dukungan: balas, tugaskan, ubah status
 * 2. AdminInvoiceTab  — kelola invoice client: buat, kirim, tandai dibayar, unduh PDF
 * 3. AdminAuditTab    — jejak aktivitas seluruh sistem (GOD MODE view) + ekspor CSV
 *
 * Data dari /api/admin/team (tickets, invoices, audit) + /api/admin/export (CSV).
 */

import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  Check,
  ChevronDown,
  ClipboardList,
  Download,
  FileDown,
  MessageSquare,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { ActionBtn, Field, PortalCard, fmtDateTime, inputClass } from "@/components/site/portal-ui";
import { rupiah } from "@/lib/format";

/* ── Tipe ───────────────────────────────────────────────────────────────── */

export interface AdminTicket {
  id: string;
  refCode: string;
  subject: string;
  body: string;
  category: string;
  priority: string;
  status: string;
  creatorId: string;
  creatorName: string;
  creatorRole: string;
  assigneeId: string | null;
  assigneeName: string | null;
  createdAt: string;
  updatedAt: string;
  replies: { id: string; author: string; authorRole: string; message: string; createdAt: string }[];
}

export interface AdminInvoice {
  id: string;
  refCode: string;
  clientId: string | null;
  clientName: string;
  projectId: string | null;
  projectRef: string | null;
  items: { desc: string; qty: number; price: number }[];
  amount: number;
  status: string;
  dueDate: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditItem {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string | null;
  detail: string | null;
  createdAt: string;
}

interface EmployeeLite {
  id: string;
  name: string;
  position: string;
}
interface ClientLite {
  id: string;
  name: string;
  company: string | null;
}
interface ProjectLite {
  id: string;
  refCode: string;
  title: string;
}

const STATUS_TIKET_META: Record<string, { label: string; badge: string }> = {
  open: { label: "Terbuka", badge: "bg-rose-500/10 text-rose-700 border-rose-300" },
  diproses: { label: "Diproses", badge: "bg-amber-500/10 text-amber-700 border-amber-300" },
  selesai: { label: "Selesai", badge: "bg-emerald-600/10 text-emerald-700 border-emerald-300" },
  ditutup: { label: "Ditutup", badge: "bg-slate-500/10 text-slate-600 border-slate-300" },
};

const PRIORITAS_META: Record<string, { label: string; badge: string }> = {
  rendah: { label: "Rendah", badge: "bg-slate-500/10 text-slate-600 border-slate-300" },
  normal: { label: "Normal", badge: "bg-sky-500/10 text-sky-700 border-sky-300" },
  tinggi: { label: "Tinggi", badge: "bg-amber-500/10 text-amber-700 border-amber-300" },
  urgent: { label: "Urgent", badge: "bg-rose-500/10 text-rose-700 border-rose-300" },
};

const INVOICE_STATUS_META: Record<string, { label: string; badge: string }> = {
  draft: { label: "Draft", badge: "bg-slate-500/10 text-slate-600 border-slate-300" },
  terkirim: { label: "Terkirim", badge: "bg-sky-500/10 text-sky-700 border-sky-300" },
  dibayar: { label: "Dibayar", badge: "bg-emerald-600/10 text-emerald-700 border-emerald-300" },
  batal: { label: "Batal", badge: "bg-rose-500/10 text-rose-700 border-rose-300" },
};

const KATEGORI_LABEL: Record<string, string> = {
  umum: "Umum",
  proyek: "Proyek",
  tagihan: "Tagihan",
  teknis: "Teknis",
};

const ROLE_TONE: Record<string, string> = {
  admin: "bg-slate-900 text-white",
  karyawan: "bg-violet-600/10 text-violet-700",
  client: "bg-sky-500/10 text-sky-700",
};

const ACTION_LABEL: Record<string, string> = {
  login: "Masuk",
  logout: "Keluar",
  tiket_buat: "Buat tiket",
  tiket_balas: "Balas tiket",
  tiket_status: "Status tiket",
  tiket_assign: "Tugaskan tiket",
  invoice_buat: "Buat invoice",
  invoice_status: "Status invoice",
  invoice_hapus: "Hapus invoice",
  invoice_pdf: "Unduh PDF invoice",
  laporan_pdf: "Buat laporan PDF",
  proyek_buat: "Buat proyek",
  proyek_status: "Status proyek",
  pengumuman: "Pengumuman",
  dokumen_unggah: "Unggah dokumen",
  dokumen_hapus: "Hapus dokumen",
  tier_aktivasi: "Aktivasi tier",
  tier_set: "Set tier",
  wa_kirim: "Kirim WA",
  ekspor_csv: "Ekspor CSV",
  akun_buat: "Buat akun",
  akun_hapus: "Hapus akun",
};

/* ══════════════════════════════════════════════════════════════════════════
   TAB 1 — DUKUNGAN (Tiket)
   ══════════════════════════════════════════════════════════════════════════ */

export function AdminDukunganTab({
  tickets,
  employees,
  reload,
  notify,
}: {
  tickets: AdminTicket[];
  employees: EmployeeLite[];
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(tickets[0]?.id ?? null);
  const [balasan, setBalasan] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function post(body: Record<string, unknown>, okMsg: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        notify(okMsg);
        await reload();
      } else {
        notify(json.error ?? "Gagal.");
      }
    } catch {
      notify("Jaringan bermasalah.");
    } finally {
      setBusy(false);
    }
  }

  const aktif = tickets.filter((t) => t.status === "open" || t.status === "diproses");

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
          <p className="text-[12px] font-bold uppercase tracking-wide text-rose-600">Tiket terbuka</p>
          <p className="font-display text-2xl font-black text-slate-900">{tickets.filter((t) => t.status === "open").length}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <p className="text-[12px] font-bold uppercase tracking-wide text-amber-600">Sedang diproses</p>
          <p className="font-display text-2xl font-black text-slate-900">{tickets.filter((t) => t.status === "diproses").length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-[12px] font-bold uppercase tracking-wide text-emerald-600">Selesai</p>
          <p className="font-display text-2xl font-black text-slate-900">{tickets.filter((t) => t.status === "selesai").length}</p>
        </div>
      </div>

      {tickets.length === 0 && (
        <PortalCard title="Tiket Dukungan" icon={MessageSquare}>
          <p className="text-[13px] italic text-slate-400">
            Belum ada tiket. Client dan karyawan membuat tiket dari menu <b>Dukungan</b> di portal masing-masing.
          </p>
        </PortalCard>
      )}

      {tickets.map((t) => {
        const open = openId === t.id;
        const st = STATUS_TIKET_META[t.status] ?? STATUS_TIKET_META.open;
        const pr = PRIORITAS_META[t.priority] ?? PRIORITAS_META.normal;
        return (
          <div key={t.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : t.id)}
              className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left"
              aria-expanded={open}
            >
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${st.badge}`}>{st.label}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-black text-slate-900">{t.subject}</span>
                <span className="block text-[11.5px] text-slate-500">
                  {t.refCode} · {KATEGORI_LABEL[t.category] ?? t.category} · oleh {t.creatorName} ({t.creatorRole})
                  {t.assigneeName ? ` · ditangani ${t.assigneeName}` : ""}
                </span>
              </span>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${pr.badge}`}>{pr.label}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {open && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-t border-slate-100">
                <div className="space-y-3 px-5 py-4">
                  <ol className="max-h-72 space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
                    {t.replies.map((r) => (
                      <li key={r.id} className="flex gap-3">
                        <span className={`mt-0.5 flex h-7 shrink-0 items-center rounded-full px-2.5 text-[10px] font-black uppercase ${ROLE_TONE[r.authorRole] ?? "bg-slate-100 text-slate-600"}`}>
                          {r.authorRole === "admin" ? "CEO" : r.authorRole}
                        </span>
                        <div className="min-w-0">
                          <p className="whitespace-pre-wrap text-[13px] leading-snug text-slate-700">{r.message}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400">{r.author} · {fmtDateTime.format(new Date(r.createdAt))}</p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="flex flex-wrap items-end gap-2 border-t border-slate-100 pt-3">
                    <div className="min-w-56 flex-1">
                      <Field label="Balas sebagai CEO">
                        <textarea
                          value={balasan[t.id] ?? ""}
                          onChange={(e) => setBalasan((m) => ({ ...m, [t.id]: e.target.value }))}
                          rows={2}
                          placeholder="Tulis balasan untuk pembuat tiket…"
                          className={`${inputClass} h-auto py-2.5`}
                        />
                      </Field>
                    </div>
                    <ActionBtn
                      icon={Send}
                      label="Kirim"
                      tone="violet"
                      disabled={busy || (balasan[t.id] ?? "").trim().length < 2}
                      onClick={() => {
                        void post(
                          { kind: "tiket", action: "balas", data: { id: t.id, message: (balasan[t.id] ?? "").trim() } },
                          `Balasan terkirim ke ${t.refCode}`
                        );
                        setBalasan((m) => ({ ...m, [t.id]: "" }));
                      }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Status:</span>
                    {["open", "diproses", "selesai", "ditutup"].map((s) => (
                      <ActionBtn
                        key={s}
                        icon={s === "selesai" ? Check : ClipboardList}
                        label={STATUS_TIKET_META[s].label}
                        tone={t.status === s ? "violet" : "slate"}
                        disabled={busy || t.status === s}
                        onClick={() => void post({ kind: "tiket", action: "status", data: { id: t.id, status: s } }, `Status ${t.refCode} → ${s}`)}
                      />
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Tugaskan:</span>
                    <select
                      value={t.assigneeId ?? ""}
                      onChange={(e) => void post({ kind: "tiket", action: "assign", data: { id: t.id, employeeId: e.target.value } }, "Penangan tiket diperbarui")}
                      className="h-9 rounded-full border border-slate-300 bg-white px-3 text-[12px] font-semibold text-slate-700 outline-none focus:border-violet-500"
                    >
                      <option value="">— belum ditugaskan —</option>
                      {employees.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name} · {e.position}
                        </option>
                      ))}
                    </select>
                    <span className="flex-1" />
                    <ActionBtn
                      icon={Trash2}
                      label="Hapus"
                      tone="rose"
                      disabled={busy}
                      onClick={() => void post({ kind: "tiket", action: "delete", data: { id: t.id } }, `Tiket ${t.refCode} dihapus`)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );
      })}

      {tickets.length > 0 && (
        <p className="text-[12px] italic text-slate-400">
          {aktif.length} tiket menunggu penanganan dari total {tickets.length}.
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TAB 2 — INVOICE
   ══════════════════════════════════════════════════════════════════════════ */

interface ItemDraft {
  desc: string;
  qty: string;
  price: string;
}

export function AdminInvoiceTab({
  invoices,
  clients,
  projects,
  reload,
  notify,
}: {
  invoices: AdminInvoice[];
  clients: ClientLite[];
  projects: ProjectLite[];
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([{ desc: "", qty: "1", price: "" }]);
  const [busy, setBusy] = useState(false);

  const draftTotal = items.reduce((a, it) => a + Math.round((Number(it.qty) || 0) * (Number(it.price) || 0)), 0);

  async function post(body: Record<string, unknown>, okMsg: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        notify(okMsg);
        await reload();
        return true;
      }
      notify(json.error ?? "Gagal.");
      return false;
    } catch {
      notify("Jaringan bermasalah.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function buatInvoice() {
    const validItems = items
      .map((it) => ({ desc: it.desc.trim(), qty: Number(it.qty), price: Math.round(Number(it.price)) }))
      .filter((it) => it.desc && it.qty > 0 && Number.isFinite(it.price) && it.price >= 0);
    if (!validItems.length) {
      notify("Minimal satu item valid (uraian, qty > 0, harga).");
      return;
    }
    const ok = await post(
      {
        kind: "invoice",
        action: "create",
        data: { clientId: clientId || null, projectId: projectId || null, items: validItems, dueDate: dueDate || null, note: note || null },
      },
      "Invoice dibuat (status: draft)"
    );
    if (ok) {
      setItems([{ desc: "", qty: "1", price: "" }]);
      setClientId("");
      setProjectId("");
      setDueDate("");
      setNote("");
      setShowForm(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
          <p className="text-[12px] font-bold uppercase tracking-wide text-sky-600">Belum dibayar</p>
          <p className="font-display text-xl font-black text-slate-900">
            Rp {rupiah(invoices.filter((i) => i.status === "terkirim").reduce((a, i) => a + i.amount, 0))}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-[12px] font-bold uppercase tracking-wide text-emerald-600">Sudah dibayar</p>
          <p className="font-display text-xl font-black text-slate-900">
            Rp {rupiah(invoices.filter((i) => i.status === "dibayar").reduce((a, i) => a + i.amount, 0))}
          </p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
          <p className="text-[12px] font-bold uppercase tracking-wide text-violet-600">Total invoice</p>
          <p className="font-display text-xl font-black text-slate-900">{invoices.length}</p>
        </div>
      </div>

      <PortalCard
        title="Buat Invoice"
        icon={BadgeDollarSign}
        action={<ActionBtn icon={showForm ? ChevronDown : Plus} label={showForm ? "Tutup" : "Baru"} onClick={() => setShowForm(!showForm)} />}
      >
        {showForm && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Client">
                <select value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputClass}>
                  <option value="">— pilih client terdaftar —</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.company ? ` · ${c.company}` : ""}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Proyek terkait (opsional)">
                <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={inputClass}>
                  <option value="">— tanpa proyek —</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.refCode} · {p.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Jatuh tempo (opsional)">
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Catatan (opsional)">
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Contoh: termin 50% setelah milestone 1" className={inputClass} />
              </Field>
            </div>

            <div className="space-y-2">
              <span className="block text-[12px] font-bold uppercase tracking-wide text-slate-500">Item tagihan</span>
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_72px_130px_40px] items-center gap-2">
                  <input
                    value={it.desc}
                    onChange={(e) => setItems((arr) => arr.map((x, i) => (i === idx ? { ...x, desc: e.target.value } : x)))}
                    placeholder={`Uraian item ${idx + 1}`}
                    className={inputClass}
                  />
                  <input
                    value={it.qty}
                    onChange={(e) => setItems((arr) => arr.map((x, i) => (i === idx ? { ...x, qty: e.target.value } : x)))}
                    placeholder="Qty"
                    inputMode="decimal"
                    className={inputClass}
                  />
                  <input
                    value={it.price}
                    onChange={(e) => setItems((arr) => arr.map((x, i) => (i === idx ? { ...x, price: e.target.value } : x)))}
                    placeholder="Harga Rp"
                    inputMode="numeric"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setItems((arr) => (arr.length > 1 ? arr.filter((_, i) => i !== idx) : arr))}
                    className="grid h-11 w-10 place-items-center rounded-xl border border-slate-300 text-slate-400 transition-colors hover:border-rose-400 hover:text-rose-500"
                    aria-label="Hapus item"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <ActionBtn icon={Plus} label="Tambah item" onClick={() => setItems((arr) => [...arr, { desc: "", qty: "1", price: "" }])} />
                <p className="text-[13px] font-black text-slate-900">
                  Total: <span className="text-violet-700">Rp {rupiah(draftTotal)}</span>
                </p>
              </div>
            </div>

            <ActionBtn
              icon={Check}
              label={busy ? "Menyimpan…" : "Simpan Invoice"}
              tone="violet"
              disabled={busy}
              onClick={() => void buatInvoice()}
            />
          </div>
        )}
      </PortalCard>

      {invoices.length === 0 ? (
        <PortalCard title="Daftar Invoice" icon={BadgeDollarSign}>
          <p className="text-[13px] italic text-slate-400">Belum ada invoice. Buat invoice pertama di atas.</p>
        </PortalCard>
      ) : (
        <PortalCard title="Daftar Invoice" icon={BadgeDollarSign}>
          <div className="space-y-3">
            {invoices.map((inv) => {
              const st = INVOICE_STATUS_META[inv.status] ?? INVOICE_STATUS_META.draft;
              return (
                <div key={inv.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[14px] font-black text-slate-900">
                        {inv.refCode} <span className="font-semibold text-slate-500">· {inv.clientName}</span>
                      </p>
                      <p className="text-[11.5px] text-slate-500">
                        {inv.projectRef ? `Proyek ${inv.projectRef} · ` : ""}
                        {inv.items.length} item · terbit {fmtDateTime.format(new Date(inv.createdAt))}
                        {inv.dueDate ? ` · tempo ${new Date(inv.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${st.badge}`}>{st.label}</span>
                      <span className="font-display text-[15px] font-black text-slate-900">Rp {rupiah(inv.amount)}</span>
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1 border-t border-slate-100 pt-2">
                    {inv.items.map((it, i) => (
                      <li key={i} className="flex justify-between text-[12px] text-slate-600">
                        <span>
                          {it.desc} <span className="text-slate-400">× {it.qty}</span>
                        </span>
                        <span className="font-semibold">Rp {rupiah(it.qty * it.price)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                    <a
                      href={`/api/reports/pdf?type=invoice&id=${inv.id}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 text-[12px] font-bold text-slate-600 transition-all hover:border-violet-400 hover:text-violet-600"
                    >
                      <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
                      PDF
                    </a>
                    {["draft", "terkirim", "dibayar", "batal"].map((s) => (
                      <ActionBtn
                        key={s}
                        icon={s === "terkirim" ? Send : s === "dibayar" ? Check : ClipboardList}
                        label={INVOICE_STATUS_META[s].label}
                        tone={inv.status === s ? "violet" : "slate"}
                        disabled={busy || inv.status === s}
                        onClick={() => {
                          void post(
                            { kind: "invoice", action: "status", data: { id: inv.id, status: s } },
                            s === "terkirim"
                              ? `Invoice ${inv.refCode} ditandai terkirim — WA otomatis ke client`
                              : `Status ${inv.refCode} → ${s}`
                          );
                        }}
                      />
                    ))}
                    <span className="flex-1" />
                    <ActionBtn
                      icon={Trash2}
                      label="Hapus"
                      tone="rose"
                      disabled={busy}
                      onClick={() => void post({ kind: "invoice", action: "delete", data: { id: inv.id } }, `Invoice ${inv.refCode} dihapus`)}
                    />
                  </div>
                  {inv.note && <p className="mt-2 text-[12px] italic text-slate-500">Catatan: {inv.note}</p>}
                </div>
              );
            })}
          </div>
        </PortalCard>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TAB 3 — AUDIT LOG + EKSPOR CSV
   ══════════════════════════════════════════════════════════════════════════ */

const EKSPOR_TIPE: { type: string; label: string }[] = [
  { type: "karyawan", label: "Karyawan" },
  { type: "client", label: "Client" },
  { type: "proyek", label: "Proyek" },
  { type: "tiket", label: "Tiket" },
  { type: "invoice", label: "Invoice" },
  { type: "dokumen", label: "Dokumen" },
  { type: "wa", label: "WA" },
  { type: "audit", label: "Audit Log" },
];

export function AdminAuditTab({ audit }: { audit: AdminAuditItem[] }) {
  const [filter, setFilter] = useState("");
  const filtered = audit.filter((a) => {
    if (!filter.trim()) return true;
    const q = filter.trim().toLowerCase();
    return (
      a.actor.toLowerCase().includes(q) ||
      a.action.toLowerCase().includes(q) ||
      (a.target ?? "").toLowerCase().includes(q) ||
      (a.detail ?? "").toLowerCase().includes(q)
    );
  });

  const roleTone: Record<string, string> = {
    admin: "bg-slate-900 text-white",
    karyawan: "bg-violet-600/10 text-violet-700",
    client: "bg-sky-500/10 text-sky-700",
    sistem: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-4">
      <PortalCard title="Ekspor Data CSV (Excel)" icon={Download}>
        <p className="mb-3 text-[12.5px] leading-relaxed text-slate-500">
          Unduh seluruh data ekosistem dalam format CSV siap dibuka di Excel/Google Sheets. Setiap ekspor tercatat di jejak aktivitas di bawah.
        </p>
        <div className="flex flex-wrap gap-2">
          {EKSPOR_TIPE.map((t) => (
            <a
              key={t.type}
              href={`/api/admin/export?type=${t.type}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 text-[12px] font-bold text-slate-600 transition-all hover:border-violet-400 hover:text-violet-600"
            >
              <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
              {t.label}
            </a>
          ))}
        </div>
      </PortalCard>

      <PortalCard
        title="Jejak Aktivitas Sistem — GOD MODE"
        icon={ShieldCheck}
        action={
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Cari aktor/aksi/target…"
            className="h-9 w-44 rounded-full border border-slate-300 px-3.5 text-[12px] outline-none focus:border-violet-500 sm:w-64"
          />
        }
      >
        {filtered.length === 0 ? (
          <p className="text-[13px] italic text-slate-400">
            {audit.length === 0 ? "Belum ada aktivitas tercatat." : "Tidak ada hasil yang cocok dengan pencarian."}
          </p>
        ) : (
          <ol className="max-h-[28rem] space-y-2.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
            {filtered.map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-7 shrink-0 items-center rounded-full px-2.5 text-[10px] font-black uppercase ${roleTone[a.actorRole] ?? "bg-slate-100 text-slate-600"}`}>
                  {a.actorRole}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug text-slate-700">
                    <b className="font-black text-slate-900">{a.actor}</b> — {ACTION_LABEL[a.action] ?? a.action}
                    {a.target ? <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600">{a.target}</span> : null}
                    {a.detail ? <span className="text-slate-500"> · {a.detail}</span> : null}
                  </p>
                  <p className="text-[11px] text-slate-400">{fmtDateTime.format(new Date(a.createdAt))}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </PortalCard>
    </div>
  );
}
