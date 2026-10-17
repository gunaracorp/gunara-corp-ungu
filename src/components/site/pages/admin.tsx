"use client";

/**
 * Panel CEO — dashboard admin GUNARA CORPORATION (#/admin).
 * Satu tempat untuk mengelola: tiket brief, member VVIP + kode akses,
 * pelanggan newsletter, dan log akses. URL tidak ditautkan dari navigasi publik.
 */

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Building2,
  Check,
  Copy,
  Crown,
  Gem,
  Inbox,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  ScrollText,
  ShieldCheck,
  Ticket,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

const fmtDate = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Bangkok",
});

interface AdminContact {
  id: string;
  refCode: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  role: string | null;
  type: string;
  challenge: string;
  status: string;
  createdAt: string;
}
interface AdminSubscriber {
  id: string;
  email: string;
  createdAt: string;
}
interface AdminMember {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  tier: string;
  code: string;
  status: string;
  notes: string | null;
  validUntil: string | null;
  lastAccessAt: string | null;
  createdAt: string;
}
interface AdminLog {
  id: string;
  memberId: string | null;
  name: string | null;
  codeMasked: string;
  action: string;
  detail: string | null;
  createdAt: string;
}
interface AdminData {
  source: "db" | "memory";
  usingDefault: boolean;
  stats: {
    contacts: number;
    subscribers: number;
    members: number;
    activeMembers: number;
    newContacts: number;
    accessLogs: number;
  };
  contacts: AdminContact[];
  subscribers: AdminSubscriber[];
  members: AdminMember[];
  logs: AdminLog[];
}

type Tab = "overview" | "tickets" | "members" | "newsletter" | "logs";

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { id: "tickets", label: "Tiket Brief", icon: Ticket },
  { id: "members", label: "Member VVIP", icon: Gem },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "logs", label: "Log Akses", icon: ScrollText },
];

const TIER_BADGE: Record<string, string> = {
  VVIP: "bg-violet-600/10 text-violet-700 border-violet-300",
  GOLD: "bg-amber-500/10 text-amber-700 border-amber-300",
  PLATINUM: "bg-slate-600/10 text-slate-700 border-slate-300",
};

export default function AdminPage() {
  const [phase, setPhase] = useState<"checking" | "login" | "ready">("checking");
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [flash, setFlash] = useState<string | null>(null);

  const load = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/data", { cache: "no-store" });
      if (res.status === 403) {
        setPhase("login");
        return false;
      }
      const json = (await res.json()) as AdminData;
      setData(json);
      setPhase("ready");
      return true;
    } catch {
      setPhase("login");
      return false;
    }
  }, []);

  useEffect(() => {
    // Defer satu tick agar setState tidak sinkron di badan effect.
    const t = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(t);
  }, [load]);

  function notify(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 3200);
  }

  if (phase === "checking") {
    return (
      <section className="grid min-h-[70svh] place-items-center bg-[#fafafc]">
        <p className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <RefreshCw className="h-4 w-4 animate-spin text-violet-600" aria-hidden="true" />
          Memeriksa sesi CEO…
        </p>
      </section>
    );
  }

  if (phase === "login") {
    return <LoginGate onSuccess={() => void load()} />;
  }

  return (
    <section className="min-h-[calc(100svh-0px)] bg-[#fafafc] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto w-full max-w-6xl px-5">
        {/* Header panel */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-[0_10px_30px_-8px_rgba(139,92,246,0.5)]">
              <Crown className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-black tracking-tight text-slate-900">
                Panel CEO
              </h1>
              <p className="text-[12.5px] text-slate-500">
                GUNARA CORPORATION ·{" "}
                <span className={data?.source === "db" ? "text-emerald-600" : "text-amber-600"}>
                  {data?.source === "db" ? "database persisten" : "mode memori"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-[13px] font-semibold text-slate-600 transition-colors hover:border-violet-400 hover:text-violet-600"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Muat ulang
            </button>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/admin/login", { method: "DELETE" });
                setData(null);
                setPhase("login");
              }}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-4 text-[13px] font-bold text-white transition-transform hover:scale-[1.03] active:scale-95"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Keluar
            </button>
          </div>
        </div>

        {/* Peringatan kata sandi bawaan */}
        {data?.usingDefault && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              <b>Keamanan:</b> Panel ini masih memakai kata sandi bawaan. Set{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[12px]">ADMIN_PASSWORD</code>{" "}
              di Environment Variables (Vercel/lokal) lalu redeploy — sesi lama otomatis mati.
            </p>
          </div>
        )}

        {/* Tab navigasi */}
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Bagian panel CEO">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id}
              className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-bold transition-all ${
                tab === id
                  ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_10px_26px_-10px_rgba(139,92,246,0.55)]"
                  : "border border-slate-300 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-600"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
              {id === "tickets" && (data?.stats.newContacts ?? 0) > 0 && (
                <span className="ml-0.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-black text-white">
                  {data?.stats.newContacts}
                </span>
              )}
            </button>
          ))}
        </nav>

        {flash && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-[13px] font-semibold text-emerald-700"
            role="status"
          >
            {flash}
          </motion.p>
        )}

        <div className="mt-6">
          {tab === "overview" && <OverviewTab data={data} onGoto={setTab} />}
          {tab === "tickets" && <TicketsTab data={data} reload={load} notify={notify} />}
          {tab === "members" && <MembersTab data={data} reload={load} notify={notify} />}
          {tab === "newsletter" && <NewsletterTab data={data} reload={load} notify={notify} />}
          {tab === "logs" && <LogsTab data={data} />}
        </div>
      </div>
    </section>
  );
}

/* ── Layar login CEO ──────────────────────────────────────────────────── */

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!password.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess();
        return;
      }
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? "Kata sandi tidak cocok.");
      setTick((t) => t + 1);
      setPassword("");
    } catch {
      setError("Sinyal terputus. Coba sekali lagi.");
      setTick((t) => t + 1);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="noise-overlay relative flex min-h-[calc(100svh-0px)] items-center justify-center overflow-hidden bg-zinc-950 px-5 pb-20 pt-28 text-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[130px]" aria-hidden="true" />
      <motion.div
        key={tick}
        initial={error ? { x: 0 } : false}
        animate={error ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-[0_14px_44px_-10px_rgba(139,92,246,0.55)]">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.28em] text-violet-300">
            <Crown className="h-3 w-3" aria-hidden="true" />
            Khusus CEO
          </span>
          <h1 className="mt-3 font-display text-2xl font-black tracking-tight">Panel CEO</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
            Pusat kendali tiket, member VVIP, dan log akses. Kata sandi diatur
            lewat environment variable{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11.5px]">ADMIN_PASSWORD</code>.
          </p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kata sandi CEO"
            aria-label="Kata sandi CEO"
            autoComplete="current-password"
            className="h-12 w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/25"
          />
          <button
            type="submit"
            disabled={!password.trim() || busy}
            className="shine h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 text-sm font-bold text-white shadow-[0_14px_44px_-10px_rgba(139,92,246,0.5)] transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Memverifikasi…" : "Masuk Panel"}
          </button>
          {error && (
            <p role="alert" className="text-center text-[12.5px] font-medium text-red-400">
              {error}
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}

/* ── Tab Ringkasan ────────────────────────────────────────────────────── */

function OverviewTab({ data, onGoto }: { data: AdminData | null; onGoto: (t: Tab) => void }) {
  const stats = [
    { label: "Tiket Brief Masuk", value: data?.stats.contacts ?? 0, hint: `${data?.stats.newContacts ?? 0} belum diproses`, icon: Ticket, to: "tickets" as Tab },
    { label: "Member VVIP", value: data?.stats.members ?? 0, hint: `${data?.stats.activeMembers ?? 0} aktif`, icon: Gem, to: "members" as Tab },
    { label: "Pelanggan Newsletter", value: data?.stats.subscribers ?? 0, hint: "Oracle Dispatch", icon: Mail, to: "newsletter" as Tab },
    { label: "Log Akses Terbaru", value: data?.stats.accessLogs ?? 0, hint: "login & percobaan ditolak", icon: ScrollText, to: "logs" as Tab },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, hint, icon: Icon, to }) => (
          <button
            key={label}
            type="button"
            onClick={() => onGoto(to)}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)] transition-all hover:-translate-y-0.5 hover:border-violet-300"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-3xl font-black text-slate-900">{value}</span>
            </div>
            <p className="mt-3 text-[13px] font-bold text-slate-700">{label}</p>
            <p className="text-[12px] text-slate-500">{hint}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Brief Terbaru" icon={Inbox}>
          {(data?.contacts.slice(0, 4) ?? []).map((c) => (
            <div key={c.id} className="flex items-start justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-slate-800">
                  {c.name} <span className="font-mono text-[11px] font-medium text-violet-600">{c.refCode}</span>
                </p>
                <p className="truncate text-[12px] text-slate-500">{c.challenge}</p>
              </div>
              <StatusPill status={c.status} />
            </div>
          ))}
          {data && data.contacts.length === 0 && <Empty text="Belum ada brief masuk." />}
        </Card>
        <Card title="Akses Member Terbaru" icon={ShieldCheck}>
          {(data?.logs.slice(0, 4) ?? []).map((l) => (
            <div key={l.id} className="flex items-start justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-slate-800">
                  {l.name ?? "Kode utama"} <span className="font-mono text-[11px] font-medium text-slate-400">{l.codeMasked}</span>
                </p>
                <p className="truncate text-[12px] text-slate-500">{l.detail ?? "—"}</p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] font-bold ${
                  l.action === "login"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-rose-300 bg-rose-50 text-rose-600"
                }`}
              >
                {l.action === "login" ? "MASUK" : "DITOLAK"}
              </span>
            </div>
          ))}
          {data && data.logs.length === 0 && <Empty text="Belum ada aktivitas akses." />}
        </Card>
      </div>
    </div>
  );
}

/* ── Tab Tiket ────────────────────────────────────────────────────────── */

function TicketsTab({
  data,
  reload,
  notify,
}: {
  data: AdminData | null;
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  async function setStatus(id: string, status: string) {
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await reload();
    notify("Status tiket diperbarui.");
  }
  async function remove(id: string) {
    await fetch(`/api/admin/contacts?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await reload();
    notify("Tiket dihapus.");
  }

  return (
    <div className="space-y-4">
      {data?.contacts.map((c) => (
        <article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11.5px] font-bold text-violet-600">{c.refCode}</span>
            <StatusPill status={c.status} />
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10.5px] font-bold text-slate-500">
              {c.type}
            </span>
            <span className="ml-auto text-[11.5px] text-slate-400">{fmtDate.format(new Date(c.createdAt))}</span>
          </div>
          <h3 className="mt-2 text-[15px] font-black text-slate-900">{c.name}</h3>
          <p className="text-[12.5px] text-slate-500">
            {c.email}
            {c.company ? ` · ${c.company}` : ""}
            {c.budget ? ` · anggaran ${c.budget}` : ""}
            {c.role ? ` · peran ${c.role}` : ""}
          </p>
          <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-3.5 text-[13px] leading-relaxed text-slate-700">
            {c.challenge}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.status !== "read" && c.status !== "replied" && (
              <ActionBtn onClick={() => void setStatus(c.id, "read")} icon={Check} label="Tandai dibaca" />
            )}
            {c.status !== "replied" && (
              <ActionBtn onClick={() => void setStatus(c.id, "replied")} icon={ShieldCheck} label="Sudah dibalas" tone="emerald" />
            )}
            <a
              href={`mailto:${c.email}?subject=Re: Brief Anda ${c.refCode}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-300 px-3.5 text-[12px] font-bold text-slate-600 transition-colors hover:border-violet-400 hover:text-violet-600"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Balas via email
            </a>
            <ActionBtn onClick={() => void remove(c.id)} icon={Trash2} label="Hapus" tone="rose" />
          </div>
        </article>
      ))}
      {data && data.contacts.length === 0 && (
        <Card title="Belum ada tiket" icon={Inbox}>
          <Empty text="Setiap brief dari situs akan muncul di sini dengan nomor tiket GUNARA-XXXX." />
        </Card>
      )}
    </div>
  );
}

/* ── Tab Member VVIP ──────────────────────────────────────────────────── */

function MembersTab({
  data,
  reload,
  notify,
}: {
  data: AdminData | null;
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", tier: "VVIP", validUntil: "" });
  const [busy, setBusy] = useState(false);
  const [newCode, setNewCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { ok: boolean; member?: AdminMember; error?: string };
      if (json.ok && json.member) {
        setNewCode(json.member.code);
        notify(`Member "${json.member.name}" terdaftar. Kode siap dibagikan.`);
        setForm({ name: "", email: "", phone: "", company: "", tier: form.tier, validUntil: "" });
        await reload();
      } else {
        notify(json.error ?? "Gagal mendaftarkan member.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, payload: Record<string, unknown>, msg: string) {
    await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    await reload();
    notify(msg);
  }

  async function remove(id: string) {
    await fetch(`/api/admin/members?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await reload();
    notify("Keanggotaan dicabut.");
  }

  function copy(code: string) {
    void navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(code);
    window.setTimeout(() => setCopied(null), 1800);
  }

  const inputCls =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15";

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* Form pendaftaran */}
      <form onSubmit={create} className="h-fit space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
        <h3 className="flex items-center gap-2 text-[15px] font-black text-slate-900">
          <Plus className="h-4 w-4 text-violet-600" aria-hidden="true" />
          Daftarkan Member Baru
        </h3>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama lengkap *" aria-label="Nama lengkap" className={inputCls} />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (untuk pencocokan tiket)" type="email" aria-label="Email" className={inputCls} />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="No. WhatsApp" aria-label="Nomor WhatsApp" className={inputCls} />
        <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Perusahaan" aria-label="Perusahaan" className={inputCls} />
        <div className="grid grid-cols-2 gap-3">
          <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })} aria-label="Tingkat keanggotaan" className={inputCls}>
            <option value="VVIP">Tier VVIP</option>
            <option value="GOLD">Tier GOLD</option>
            <option value="PLATINUM">Tier PLATINUM</option>
          </select>
          <input value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} type="date" aria-label="Berlaku hingga" className={inputCls} />
        </div>
        <button
          type="submit"
          disabled={!form.name.trim() || busy}
          className="shine h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-[13px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
        >
          {busy ? "Menerbitkan kode…" : "Terbitkan Kode Akses"}
        </button>

        {newCode && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-violet-300 bg-violet-50 p-4">
            <p className="text-[11.5px] font-bold uppercase tracking-wider text-violet-700">Kode personal terbit</p>
            <div className="mt-1.5 flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-white px-3 py-2 font-mono text-[13px] font-bold text-slate-800">{newCode}</code>
              <button
                type="button"
                onClick={() => copy(newCode)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition-transform hover:scale-105"
                aria-label="Salin kode"
              >
                {copied === newCode ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-violet-600">
              Kirim lewat WhatsApp: <i>&quot;Lounge VIP kami: [domain]/#/member — kode Anda: {newCode}&quot;</i>
            </p>
          </motion.div>
        )}
      </form>

      {/* Daftar member */}
      <div className="space-y-4">
        {data?.members.map((m) => (
          <article key={m.id} className={`rounded-2xl border bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)] ${m.status === "active" ? "border-slate-200" : "border-rose-200"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-[10.5px] font-black tracking-wide ${TIER_BADGE[m.tier] ?? TIER_BADGE.VVIP}`}>
                {m.tier}
              </span>
              {m.status === "active" ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[10.5px] font-bold text-emerald-700">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  AKTIF
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-1 text-[10.5px] font-bold text-rose-600">
                  <XCircle className="h-3 w-3" aria-hidden="true" />
                  DITANGGUHKAN
                </span>
              )}
              <span className="ml-auto text-[11.5px] text-slate-400">
                {m.lastAccessAt ? `Akses terakhir ${fmtDate.format(new Date(m.lastAccessAt))}` : "Belum pernah masuk"}
              </span>
            </div>
            <h3 className="mt-2 text-[15px] font-black text-slate-900">{m.name}</h3>
            <p className="text-[12.5px] text-slate-500">
              {m.email ?? "—"}
              {m.company ? ` · ${m.company}` : ""}
              {m.phone ? ` · ${m.phone}` : ""}
            </p>
            <p className="mt-1 text-[12px] text-slate-500">
              Berlaku: {m.validUntil ? fmtDate.format(new Date(m.validUntil)) : "seumur hidup"}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <code className="rounded-lg bg-slate-100 px-3 py-2 font-mono text-[12.5px] font-bold text-slate-700">{m.code}</code>
              <button
                type="button"
                onClick={() => copy(m.code)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:border-violet-400 hover:text-violet-600"
                aria-label={`Salin kode ${m.name}`}
              >
                {copied === m.code ? <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              </button>
              {m.status === "active" ? (
                <ActionBtn onClick={() => void patch(m.id, { status: "suspended" }, "Member ditangguhkan.")} icon={XCircle} label="Tangguhkan" tone="rose" />
              ) : (
                <ActionBtn onClick={() => void patch(m.id, { status: "active" }, "Member diaktifkan kembali.")} icon={ShieldCheck} label="Aktifkan" tone="emerald" />
              )}
              <ActionBtn onClick={() => void remove(m.id)} icon={Trash2} label="Cabut" tone="rose" />
            </div>
          </article>
        ))}
        {data && data.members.length === 0 && (
          <Card title="Belum ada member" icon={Gem}>
            <Empty text="Daftarkan member pertama di formulir — kode personal akan terbit otomatis." />
          </Card>
        )}
      </div>
    </div>
  );
}

/* ── Tab Newsletter ───────────────────────────────────────────────────── */

function NewsletterTab({
  data,
  reload,
  notify,
}: {
  data: AdminData | null;
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  async function remove(id: string) {
    await fetch(`/api/admin/subscribers?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await reload();
    notify("Pelanggan dihapus.");
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {data?.subscribers.map((s) => (
        <div key={s.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-slate-800">{s.email}</p>
              <p className="text-[11.5px] text-slate-400">{fmtDate.format(new Date(s.createdAt))}</p>
            </div>
          </div>
          <ActionBtn onClick={() => void remove(s.id)} icon={Trash2} label="Hapus" tone="rose" />
        </div>
      ))}
      {data && data.subscribers.length === 0 && (
        <Card title="Belum ada pelanggan" icon={Mail}>
          <Empty text="Pendaftar Oracle Dispatch dari footer situs akan tercatat di sini." />
        </Card>
      )}
    </div>
  );
}

/* ── Tab Log Akses ────────────────────────────────────────────────────── */

function LogsTab({ data }: { data: AdminData | null }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
      <div className="custom-scrollbar max-h-[60svh] overflow-y-auto">
        {data?.logs.map((l) => (
          <div key={l.id} className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5 last:border-0">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-slate-800">
                {l.name ?? "Kode utama"} <span className="font-mono text-[11px] font-medium text-slate-400">{l.codeMasked}</span>
              </p>
              <p className="truncate text-[12px] text-slate-500">{l.detail ?? "—"} · {fmtDate.format(new Date(l.createdAt))}</p>
            </div>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] font-bold ${
                l.action === "login"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-rose-300 bg-rose-50 text-rose-600"
              }`}
            >
              {l.action === "login" ? "MASUK" : "DITOLAK"}
            </span>
          </div>
        ))}
        {data && data.logs.length === 0 && <Empty text="Belum ada aktivitas. Semua login member & percobaan ditolak tampil di sini." />}
      </div>
    </div>
  );
}

/* ── Elemen kecil bersama ─────────────────────────────────────────────── */

function Card({ title, icon: Icon, children }: { title: string; icon: typeof Inbox; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
      <h3 className="flex items-center gap-2 text-[15px] font-black text-slate-900">
        <Icon className="h-4 w-4 text-violet-600" aria-hidden="true" />
        {title}
      </h3>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-2.5 py-6 text-[13px] text-slate-400">
      <Building2 className="h-4 w-4" aria-hidden="true" />
      {text}
    </p>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "border-violet-300 bg-violet-50 text-violet-700",
    read: "border-sky-300 bg-sky-50 text-sky-700",
    replied: "border-emerald-300 bg-emerald-50 text-emerald-700",
  };
  const label: Record<string, string> = { new: "BARU", read: "DIBACA", replied: "DIBALAS" };
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10.5px] font-bold ${map[status] ?? map.new}`}>
      {label[status] ?? status.toUpperCase()}
    </span>
  );
}

function ActionBtn({
  onClick,
  icon: Icon,
  label,
  tone = "slate",
}: {
  onClick: () => void;
  icon: typeof Check;
  label: string;
  tone?: "slate" | "rose" | "emerald";
}) {
  const tones: Record<string, string> = {
    slate: "border-slate-300 text-slate-600 hover:border-violet-400 hover:text-violet-600",
    rose: "border-rose-200 text-rose-500 hover:border-rose-400 hover:text-rose-600",
    emerald: "border-emerald-200 text-emerald-600 hover:border-emerald-400 hover:text-emerald-700",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[12px] font-bold transition-colors ${tones[tone]}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}
