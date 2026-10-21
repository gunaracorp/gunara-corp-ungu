"use client";

/**
 * Panel CEO — dashboard admin GUNARA CORPORATION (#/admin).
 * Satu tempat untuk mengelola: tiket brief, member VVIP + kode akses,
 * pelanggan newsletter, dan log akses. URL tidak ditautkan dari navigasi publik.
 */

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeDollarSign,
  BarChart3,
  Boxes,
  Building2,
  Check,
  Copy,
  Crown,
  FolderKanban,
  Gem,
  Handshake,
  Inbox,
  LayoutDashboard,
  Languages,
  LifeBuoy,
  Lock,
  LogOut,
  Mail,
  Megaphone,
  Plus,
  RefreshCw,
  ScrollText,
  ShieldCheck,
  Ticket,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  PRIORITAS as PRIORITAS_PROYEK,
  ProgressBar,
  STATUS_PROYEK,
  PriorityBadge,
  StatusBadge,
  LangToggle,
} from "@/components/site/portal-ui";
import { AdminEkosistemTab } from "@/components/site/admin-extras";
import { AdminChartsTab } from "@/components/site/admin-charts";
import { AdminAuditTab, AdminDukunganTab, AdminInvoiceTab } from "@/components/site/admin-more";
import { AdminBahasaTab } from "@/components/site/admin-i18n";
import type { AdminAuditItem, AdminInvoice, AdminTicket } from "@/components/site/admin-more";
import { tr, useLang } from "@/lib/i18n";

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

type Tab =
  | "overview"
  | "grafik"
  | "tickets"
  | "projects"
  | "team"
  | "ekosistem"
  | "dukungan"
  | "invoice"
  | "audit"
  | "bahasa"
  | "members"
  | "newsletter"
  | "announcements"
  | "logs";

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "tab.overview", icon: LayoutDashboard },
  { id: "grafik", label: "tab.grafik", icon: BarChart3 },
  { id: "tickets", label: "tab.tickets", icon: Ticket },
  { id: "projects", label: "tab.projects", icon: FolderKanban },
  { id: "team", label: "tab.team", icon: Users },
  { id: "dukungan", label: "tab.dukungan", icon: LifeBuoy },
  { id: "invoice", label: "tab.invoice", icon: BadgeDollarSign },
  { id: "ekosistem", label: "tab.ekosistem", icon: Boxes },
  { id: "audit", label: "tab.audit", icon: ShieldCheck },
  { id: "bahasa", label: "tab.bahasa", icon: Languages },
  { id: "members", label: "tab.members", icon: Gem },
  { id: "announcements", label: "tab.announcements", icon: Megaphone },
  { id: "newsletter", label: "tab.newsletter", icon: Mail },
  { id: "logs", label: "tab.logs", icon: ScrollText },
];

const TIER_BADGE: Record<string, string> = {
  VVIP: "bg-violet-600/10 text-violet-700 border-violet-300",
  GOLD: "bg-amber-500/10 text-amber-700 border-amber-300",
  PLATINUM: "bg-slate-600/10 text-slate-700 border-slate-300",
};

/* ── Tipe data manajemen tim (Tab Proyek / Tim & Client / Pengumuman) ─── */

interface TeamEmployee {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  position: string;
  department: string;
  code: string;
  tier: string;
  status: string;
  notes: string | null;
  lastAccessAt: string | null;
  createdAt: string;
}
interface TeamClient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  industry: string | null;
  code: string;
  tier: string;
  status: string;
  notes: string | null;
  lastAccessAt: string | null;
  createdAt: string;
}
interface TeamProject {
  id: string;
  refCode: string;
  title: string;
  description: string;
  clientId: string | null;
  clientName: string;
  employeeId: string | null;
  status: string;
  priority: string;
  progress: number;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
interface TeamAnnouncement {
  id: string;
  title: string;
  body: string;
  audience: string;
  createdAt: string;
}
interface TeamTierCode {
  id: string;
  code: string;
  tier: string;
  targetRole: string;
  note: string | null;
  usedById: string | null;
  usedByName: string | null;
  usedAt: string | null;
  createdAt: string;
}
interface TeamWaItem {
  id: string;
  toPhone: string | null;
  toName: string | null;
  toRole: string;
  event: string;
  message: string;
  status: string;
  channel: string;
  relatedRef: string | null;
  createdAt: string;
  sentAt: string | null;
}
interface TeamDocument {
  id: string;
  originalName: string;
  size: number;
  projectRef: string | null;
  uploaderName: string;
  uploaderRole: string;
  visibility: string;
  createdAt: string;
}
interface TeamData {
  ok: true;
  source?: string;
  employees: TeamEmployee[];
  clients: TeamClient[];
  projects: TeamProject[];
  announcements: TeamAnnouncement[];
  tierCodes: TeamTierCode[];
  waItems: TeamWaItem[];
  documents: TeamDocument[];
  tickets: AdminTicket[];
  invoices: AdminInvoice[];
  audit: AdminAuditItem[];
  stats: {
    employees: number;
    activeEmployees: number;
    clients: number;
    projects: number;
    proyekBerjalan: number;
    proyekBaru: number;
    proyekSelesai: number;
    announcements: number;
    tierCodesAktif: number;
    godAccounts: number;
    waQueued: number;
    waSent: number;
    documents: number;
    tiketOpen: number;
    tiketDiproses: number;
    invoiceTerkirim: number;
    invoiceNilaiTerkirim: number;
    invoiceDibayar: number;
  };
}

export default function AdminPage() {
  const [phase, setPhase] = useState<"checking" | "login" | "ready">("checking");
  const [data, setData] = useState<AdminData | null>(null);
  const [team, setTeam] = useState<TeamData | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [flash, setFlash] = useState<string | null>(null);
  const [lang, setLang] = useLang();

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

  const loadTeam = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/team", { cache: "no-store" });
      if (res.status === 403) {
        setPhase("login");
        return false;
      }
      const json = (await res.json()) as TeamData;
      setTeam(json);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Defer satu tick agar setState tidak sinkron di badan effect.
    const t = window.setTimeout(() => {
      void load();
      void loadTeam();
    }, 0);
    return () => window.clearTimeout(t);
  }, [load, loadTeam]);

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
    return (
      <LoginGate
        onSuccess={() => {
          void load();
          void loadTeam();
        }}
      />
    );
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
                {tr(lang, "admin.title")}
              </h1>
              <p className="text-[12.5px] text-slate-500">
                GUNARA CORPORATION ·{" "}
                <span className={data?.source === "db" ? "text-emerald-600" : "text-amber-600"}>
                  {data?.source === "db" ? tr(lang, "admin.tagline.db") : tr(lang, "admin.tagline.memory")}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle lang={lang} onChange={setLang} />
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-[13px] font-semibold text-slate-600 transition-colors hover:border-violet-400 hover:text-violet-600"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              {tr(lang, "ui.reload")}
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
              {tr(lang, "ui.logout")}
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
              {tr(lang, label)}
              {id === "tickets" && (data?.stats.newContacts ?? 0) > 0 && (
                <span className="ml-0.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-black text-white">
                  {data?.stats.newContacts}
                </span>
              )}
              {id === "projects" && (team?.stats.proyekBaru ?? 0) > 0 && (
                <span className="ml-0.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-black text-white">
                  {team?.stats.proyekBaru}
                </span>
              )}
              {id === "dukungan" && ((team?.stats.tiketOpen ?? 0) + (team?.stats.tiketDiproses ?? 0)) > 0 && (
                <span className="ml-0.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-black text-white">
                  {(team?.stats.tiketOpen ?? 0) + (team?.stats.tiketDiproses ?? 0)}
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
          {tab === "grafik" && <AdminChartsTab team={team} />}
          {tab === "tickets" && <TicketsTab data={data} reload={load} notify={notify} />}
          {tab === "projects" && <ProjectsTab team={team} reload={loadTeam} notify={notify} />}
          {tab === "team" && <TeamTab team={team} reload={loadTeam} notify={notify} />}
          {tab === "dukungan" && team && (
            <AdminDukunganTab
              tickets={team.tickets ?? []}
              employees={team.employees.map((e) => ({ id: e.id, name: e.name, position: e.position }))}
              reload={loadTeam}
              notify={notify}
            />
          )}
          {tab === "invoice" && team && (
            <AdminInvoiceTab
              invoices={team.invoices ?? []}
              clients={team.clients.map((c) => ({ id: c.id, name: c.name, company: c.company }))}
              projects={team.projects.map((p) => ({ id: p.id, refCode: p.refCode, title: p.title }))}
              reload={loadTeam}
              notify={notify}
            />
          )}
          {tab === "audit" && team && <AdminAuditTab audit={team.audit ?? []} />}
          {tab === "bahasa" && <AdminBahasaTab />}
          {tab === "ekosistem" && team && (
            <AdminEkosistemTab
              tierCodes={team.tierCodes ?? []}
              waItems={team.waItems ?? []}
              documents={team.documents ?? []}
              employees={[
                ...team.employees.map((e) => ({
                  id: e.id,
                  name: e.name,
                  tier: e.tier ?? "STANDARD",
                  role: "karyawan" as const,
                  label: `${e.name} · ${e.position}`,
                })),
                ...team.clients.map((c) => ({
                  id: c.id,
                  name: c.name,
                  tier: c.tier ?? "STANDARD",
                  role: "client" as const,
                  label: `${c.name}${c.company ? ` · ${c.company}` : ""}`,
                })),
              ]}
              stats={{
                tierCodesAktif: team.stats.tierCodesAktif ?? 0,
                godAccounts: team.stats.godAccounts ?? 0,
                waQueued: team.stats.waQueued ?? 0,
                waSent: team.stats.waSent ?? 0,
                documents: team.stats.documents ?? 0,
              }}
              reload={loadTeam}
              notify={notify}
            />
          )}
          {tab === "members" && <MembersTab data={data} reload={load} notify={notify} />}
          {tab === "announcements" && <AnnouncementsTab team={team} reload={loadTeam} notify={notify} />}
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
  const [lang, setLang] = useLang();

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
          <div className="self-end">
            <LangToggle lang={lang} onChange={setLang} dark />
          </div>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-[0_14px_44px_-10px_rgba(139,92,246,0.55)]">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.28em] text-violet-300">
            <Crown className="h-3 w-3" aria-hidden="true" />
            Khusus CEO
          </span>
          <h1 className="mt-3 font-display text-2xl font-black tracking-tight">{tr(lang, "admin.login.title")}</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
            {tr(lang, "admin.login.subtitle")}{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11.5px]">ADMIN_PASSWORD</code>.
          </p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={tr(lang, "admin.login.placeholder")}
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

/* ══════════════════════════════════════════════════════════════════════════
   Ekstensi Panel CEO — Tab Proyek, Tim & Client, Pengumuman.
   Mengelola Portal Karyawan (/#/karyawan) dan Portal Client (/#/client):
   pendaftaran akun + kode akses, penugasan proyek, dan pengumuman internal.
   ══════════════════════════════════════════════════════════════════════════ */

const fieldCls =
  "h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";
const fieldClsArea = `${fieldCls} h-auto py-3`;

type MutationResult = { ok: boolean; error?: string; refCode?: string };

async function teamMutation(payload: Record<string, unknown>): Promise<MutationResult> {
  try {
    const res = await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return (await res.json()) as MutationResult;
  } catch {
    return { ok: false, error: "Sinyal terputus. Coba sekali lagi." };
  }
}

function CodeChip({ code, onCopied }: { code: string; onCopied: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard
          ?.writeText(code)
          .then(onCopied)
          .catch(() => undefined);
      }}
      title="Salin kode akses"
      aria-label={`Salin kode akses ${code}`}
      className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-bold text-slate-600 transition-colors hover:bg-violet-100 hover:text-violet-700"
    >
      {code}
      <Copy className="h-3 w-3" aria-hidden="true" />
    </button>
  );
}

function StatusAccountBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10.5px] font-bold ${
        status === "active"
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-rose-300 bg-rose-50 text-rose-600"
      }`}
    >
      {status === "active" ? "AKTIF" : "DITANGGUHKAN"}
    </span>
  );
}

function AudienceBadge({ audience }: { audience: string }) {
  const map: Record<string, string> = {
    semua: "border-violet-300 bg-violet-50 text-violet-700",
    karyawan: "border-sky-300 bg-sky-50 text-sky-700",
    client: "border-emerald-300 bg-emerald-50 text-emerald-700",
  };
  const label: Record<string, string> = { semua: "SEMUA", karyawan: "KARYAWAN", client: "CLIENT" };
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10.5px] font-bold ${map[audience] ?? map.semua}`}>
      {label[audience] ?? audience.toUpperCase()}
    </span>
  );
}

/* ── Tab Tim & Client ─────────────────────────────────────────────────── */

function TeamTab({
  team,
  reload,
  notify,
}: {
  team: TeamData | null;
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  return (
    <div className="space-y-6">
      <EmployeeSection team={team} reload={reload} notify={notify} />
      <ClientSection team={team} reload={reload} notify={notify} />
    </div>
  );
}

function AddToggleBtn({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-4 text-[12px] font-bold text-white shadow-[0_8px_22px_-8px_rgba(139,92,246,0.5)] transition-transform hover:scale-[1.03] active:scale-95"
    >
      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      {open ? "Tutup Form" : "Tambah"}
    </button>
  );
}

function EmployeeSection({
  team,
  reload,
  notify,
}: {
  team: TeamData | null;
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", position: "", department: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);

  async function create() {
    if (busy || !form.name.trim()) return;
    setBusy(true);
    const json = await teamMutation({ kind: "karyawan", action: "create", data: form });
    setBusy(false);
    if (json.ok) {
      notify(`Karyawan "${form.name}" terdaftar — kode akses siap dibagikan.`);
      setForm({ name: "", position: "", department: "", email: "", phone: "" });
      setOpen(false);
      await reload();
    } else {
      notify(json.error ?? "Gagal menambahkan karyawan.");
    }
  }

  async function patch(id: string, data: Record<string, unknown>, msg: string) {
    const json = await teamMutation({ kind: "karyawan", action: "update", data: { id, ...data } });
    if (json.ok) {
      notify(msg);
      await reload();
    } else {
      notify(json.error ?? "Gagal memperbarui karyawan.");
    }
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Hapus karyawan "${name}"? Proyek yang ditugaskan kepadanya otomatis lepas.`)) return;
    const json = await teamMutation({ kind: "karyawan", action: "delete", data: { id } });
    if (json.ok) {
      notify("Karyawan dihapus.");
      await reload();
    } else {
      notify(json.error ?? "Gagal menghapus karyawan.");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <h3 className="flex items-center gap-2 text-[15px] font-black text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/10 text-violet-600">
            <Users className="h-4 w-4" aria-hidden="true" />
          </span>
          Karyawan
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
            {team?.stats.employees ?? 0} orang · {team?.stats.activeEmployees ?? 0} aktif
          </span>
        </h3>
        <AddToggleBtn open={open} onClick={() => setOpen((v) => !v)} />
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="border-b border-slate-100 bg-slate-50/60 p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama lengkap *" aria-label="Nama karyawan" className={fieldCls} />
            <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Jabatan (cth: Konsultan Senior)" aria-label="Jabatan" className={fieldCls} />
            <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Divisi (cth: Perizinan)" aria-label="Divisi" className={fieldCls} />
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (opsional)" aria-label="Email karyawan" className={fieldCls} />
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telepon (opsional)" aria-label="Telepon karyawan" className={fieldCls} />
            <button
              type="button"
              onClick={() => void create()}
              disabled={busy || !form.name.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-[13px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
            >
              <UserPlusAlt />
              {busy ? "Menyimpan…" : "Daftarkan & Terbitkan Kode"}
            </button>
          </div>
        </motion.div>
      )}

      <div className="custom-scrollbar max-h-[52svh] divide-y divide-slate-100 overflow-y-auto">
        {team?.employees.map((e) => (
          <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-[13.5px] font-bold text-slate-800">
                {e.name}
                <span className="text-[11.5px] font-semibold text-slate-400">
                  {e.position} · {e.department}
                </span>
                <StatusAccountBadge status={e.status} />
              </p>
              <p className="mt-0.5 truncate text-[12px] text-slate-500">
                {[e.email, e.phone].filter(Boolean).join(" · ") || "kontak belum diisi"}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <CodeChip code={e.code} onCopied={() => notify("Kode akses disalin — bagikan ke karyawan.")} />
                {e.lastAccessAt && (
                  <span className="text-[11px] text-slate-400">
                    masuk terakhir {fmtDate.format(new Date(e.lastAccessAt))}
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {e.status === "active" ? (
                <ActionBtn onClick={() => void patch(e.id, { status: "suspended" }, `"${e.name}" ditangguhkan.`)} icon={XCircle} label="Tangguhkan" tone="rose" />
              ) : (
                <ActionBtn onClick={() => void patch(e.id, { status: "active" }, `"${e.name}" diaktifkan.`)} icon={ShieldCheck} label="Aktifkan" tone="emerald" />
              )}
              <ActionBtn onClick={() => void remove(e.id, e.name)} icon={Trash2} label="Hapus" tone="rose" />
            </div>
          </div>
        ))}
        {team && team.employees.length === 0 && (
          <Empty text="Belum ada karyawan. Tambahkan tim pertama Anda — kode login GUNARA-EMP-… otomatis diterbitkan." />
        )}
      </div>
    </div>
  );
}

function ClientSection({
  team,
  reload,
  notify,
}: {
  team: TeamData | null;
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", industry: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);

  async function create() {
    if (busy || !form.name.trim()) return;
    setBusy(true);
    const json = await teamMutation({ kind: "client", action: "create", data: form });
    setBusy(false);
    if (json.ok) {
      notify(`Client "${form.name}" terdaftar — kode akses siap dibagikan.`);
      setForm({ name: "", company: "", industry: "", email: "", phone: "" });
      setOpen(false);
      await reload();
    } else {
      notify(json.error ?? "Gagal menambahkan client.");
    }
  }

  async function patch(id: string, data: Record<string, unknown>, msg: string) {
    const json = await teamMutation({ kind: "client", action: "update", data: { id, ...data } });
    if (json.ok) {
      notify(msg);
      await reload();
    } else {
      notify(json.error ?? "Gagal memperbarui client.");
    }
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Hapus client "${name}"? Proyek miliknya akan terlepas dari akun ini.`)) return;
    const json = await teamMutation({ kind: "client", action: "delete", data: { id } });
    if (json.ok) {
      notify("Client dihapus.");
      await reload();
    } else {
      notify(json.error ?? "Gagal menghapus client.");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <h3 className="flex items-center gap-2 text-[15px] font-black text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/10 text-violet-600">
            <Handshake className="h-4 w-4" aria-hidden="true" />
          </span>
          Client
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
            {team?.stats.clients ?? 0} akun
          </span>
        </h3>
        <AddToggleBtn open={open} onClick={() => setOpen((v) => !v)} />
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="border-b border-slate-100 bg-slate-50/60 p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama pic client *" aria-label="Nama client" className={fieldCls} />
            <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Perusahaan" aria-label="Perusahaan client" className={fieldCls} />
            <input type="text" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="Industri (cth: Manufaktur)" aria-label="Industri client" className={fieldCls} />
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (opsional)" aria-label="Email client" className={fieldCls} />
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telepon (opsional)" aria-label="Telepon client" className={fieldCls} />
            <button
              type="button"
              onClick={() => void create()}
              disabled={busy || !form.name.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-[13px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
            >
              <UserPlusAlt />
              {busy ? "Menyimpan…" : "Daftarkan & Terbitkan Kode"}
            </button>
          </div>
        </motion.div>
      )}

      <div className="custom-scrollbar max-h-[52svh] divide-y divide-slate-100 overflow-y-auto">
        {team?.clients.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-[13.5px] font-bold text-slate-800">
                {c.name}
                {c.company && <span className="text-[11.5px] font-semibold text-slate-400">{c.company}</span>}
                <StatusAccountBadge status={c.status} />
              </p>
              <p className="mt-0.5 truncate text-[12px] text-slate-500">
                {[c.industry, c.email, c.phone].filter(Boolean).join(" · ") || "detail belum diisi"}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <CodeChip code={c.code} onCopied={() => notify("Kode akses disalin — bagikan ke client.")} />
                {c.lastAccessAt && (
                  <span className="text-[11px] text-slate-400">
                    masuk terakhir {fmtDate.format(new Date(c.lastAccessAt))}
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {c.status === "active" ? (
                <ActionBtn onClick={() => void patch(c.id, { status: "suspended" }, `"${c.name}" ditangguhkan.`)} icon={XCircle} label="Tangguhkan" tone="rose" />
              ) : (
                <ActionBtn onClick={() => void patch(c.id, { status: "active" }, `"${c.name}" diaktifkan.`)} icon={ShieldCheck} label="Aktifkan" tone="emerald" />
              )}
              <ActionBtn onClick={() => void remove(c.id, c.name)} icon={Trash2} label="Hapus" tone="rose" />
            </div>
          </div>
        ))}
        {team && team.clients.length === 0 && (
          <Empty text="Belum ada client terdaftar. Kode login GUNARA-CLI-… diterbitkan otomatis saat pendaftaran." />
        )}
      </div>
    </div>
  );
}

/** Ikon kecil tambah-akun (tanpa import baru). */
function UserPlusAlt() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}

/* ── Tab Proyek ───────────────────────────────────────────────────────── */

function ProjectsTab({
  team,
  reload,
  notify,
}: {
  team: TeamData | null;
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    clientId: "",
    employeeId: "",
    priority: "normal",
    dueDate: "",
  });

  async function create() {
    if (busy || !form.title.trim() || !form.description.trim()) return;
    setBusy(true);
    const json = await teamMutation({ kind: "proyek", action: "create", data: form });
    setBusy(false);
    if (json.ok) {
      notify(`Proyek dibuat${json.refCode ? ` (${json.refCode})` : ""} — tampil di portal client & karyawan.`);
      setForm({ title: "", description: "", clientId: "", employeeId: "", priority: "normal", dueDate: "" });
      setOpen(false);
      await reload();
    } else {
      notify(json.error ?? "Gagal membuat proyek.");
    }
  }

  async function patch(id: string, data: Record<string, unknown>, msg: string) {
    const json = await teamMutation({ kind: "proyek", action: "update", data: { id, ...data } });
    if (json.ok) {
      notify(msg);
      await reload();
    } else {
      notify(json.error ?? "Gagal memperbarui proyek.");
    }
  }

  async function remove(id: string, title: string) {
    if (!window.confirm(`Hapus proyek "${title}" beserta seluruh riwayatnya?`)) return;
    const json = await teamMutation({ kind: "proyek", action: "delete", data: { id } });
    if (json.ok) {
      notify("Proyek dihapus.");
      await reload();
    } else {
      notify(json.error ?? "Gagal menghapus proyek.");
    }
  }

  return (
    <div className="space-y-5">
      {/* Ringkas + tombol buat */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
        <p className="text-[13px] font-bold text-slate-700">
          {team?.stats.projects ?? 0} proyek ·{" "}
          <span className="text-violet-600">{team?.stats.proyekBaru ?? 0} baru</span> ·{" "}
          <span className="text-slate-500">{team?.stats.proyekBerjalan ?? 0} berjalan</span> ·{" "}
          <span className="text-emerald-600">{team?.stats.proyekSelesai ?? 0} selesai</span>
        </p>
        <AddToggleBtn open={open} onClick={() => setOpen((v) => !v)} />
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
          <h3 className="text-[15px] font-black text-slate-900">Proyek Baru</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Judul proyek *" aria-label="Judul proyek" className={fieldCls} />
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} aria-label="Prioritas proyek" className={fieldCls}>
              {Object.entries(PRIORITAS_PROYEK).map(([k, v]) => (
                <option key={k} value={k}>
                  Prioritas: {v.label}
                </option>
              ))}
            </select>
            <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} aria-label="Client pemesan" className={fieldCls}>
              <option value="">Tanpa akun client</option>
              {team?.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  Client: {c.company ? `${c.name} · ${c.company}` : c.name}
                </option>
              ))}
            </select>
            <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} aria-label="Penanggung jawab" className={fieldCls}>
              <option value="">Belum ditugaskan</option>
              {team?.employees
                .filter((e) => e.status === "active")
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    PJ: {e.name} ({e.position})
                  </option>
                ))}
            </select>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              aria-label="Tenggat waktu"
              className={fieldCls}
            />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Uraian pekerjaan, ruang lingkup, catatan untuk tim & client… *" aria-label="Uraian proyek" rows={3} className={fieldClsArea} />
          </div>
          <button
            type="button"
            onClick={() => void create()}
            disabled={busy || !form.title.trim() || !form.description.trim()}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-[13px] font-bold text-white shadow-[0_10px_26px_-10px_rgba(139,92,246,0.55)] transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
          >
            <FolderKanban className="h-4 w-4" aria-hidden="true" />
            {busy ? "Menyimpan…" : "Buat Proyek"}
          </button>
        </motion.div>
      )}

      {/* Daftar proyek */}
      {team?.projects.map((p) => (
        <article key={p.id} className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600">{p.refCode}</code>
              <StatusBadge status={p.status} />
              <PriorityBadge priority={p.priority} />
              {p.employeeId === null && <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[10.5px] font-bold text-amber-700">BELUM ADA PJ</span>}
            </div>
            <h3 className="mt-2 text-[15px] font-black tracking-tight text-slate-900">{p.title}</h3>
            <p className="text-[12px] text-slate-500">
              {p.clientName} · dibuat {fmtDate.format(new Date(p.createdAt))}
              {p.dueDate ? ` · tenggat ${fmtDate.format(new Date(p.dueDate))}` : ""}
            </p>
          </div>
          <div className="space-y-3 p-5">
            <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-600">{p.description}</p>
            <ProgressBar value={p.status === "selesai" ? 100 : p.progress} />
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-slate-400">Status</span>
                <select
                  value={p.status}
                  onChange={(e) => void patch(p.id, { status: e.target.value }, `Status ${p.refCode} diperbarui.`)}
                  aria-label={`Status proyek ${p.refCode}`}
                  className={fieldCls}
                >
                  {Object.entries(STATUS_PROYEK).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-slate-400">Penanggung Jawab</span>
                <select
                  value={p.employeeId ?? ""}
                  onChange={(e) => void patch(p.id, { employeeId: e.target.value }, `PJ ${p.refCode} diperbarui.`)}
                  aria-label={`Penanggung jawab ${p.refCode}`}
                  className={fieldCls}
                >
                  <option value="">Belum ditugaskan</option>
                  {team?.employees.filter((e) => e.status === "active").map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.department})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-slate-400">Prioritas</span>
                <select
                  value={p.priority}
                  onChange={(e) => void patch(p.id, { priority: e.target.value }, `Prioritas ${p.refCode} diperbarui.`)}
                  aria-label={`Prioritas ${p.refCode}`}
                  className={fieldCls}
                >
                  {Object.entries(PRIORITAS_PROYEK).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-end">
              <ActionBtn onClick={() => void remove(p.id, p.title)} icon={Trash2} label="Hapus Proyek" tone="rose" />
            </div>
          </div>
        </article>
      ))}
      {team && team.projects.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
          <Empty text="Belum ada proyek. Buat proyek pertama, tugaskan ke karyawan, lalu pantau lewat portal masing-masing." />
        </div>
      )}
    </div>
  );
}

/* ── Tab Pengumuman ───────────────────────────────────────────────────── */

function AnnouncementsTab({
  team,
  reload,
  notify,
}: {
  team: TeamData | null;
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", audience: "semua" });

  async function create() {
    if (busy || !form.title.trim() || !form.body.trim()) return;
    setBusy(true);
    const json = await teamMutation({ kind: "pengumuman", action: "create", data: form });
    setBusy(false);
    if (json.ok) {
      notify("Pengumuman terbit — muncul di portal terkait.");
      setForm({ title: "", body: "", audience: "semua" });
      setOpen(false);
      await reload();
    } else {
      notify(json.error ?? "Gagal menerbitkan pengumuman.");
    }
  }

  async function remove(id: string, title: string) {
    if (!window.confirm(`Hapus pengumuman "${title}"?`)) return;
    const json = await teamMutation({ kind: "pengumuman", action: "delete", data: { id } });
    if (json.ok) {
      notify("Pengumuman dihapus.");
      await reload();
    } else {
      notify(json.error ?? "Gagal menghapus pengumuman.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
        <p className="text-[13px] font-bold text-slate-700">
          {team?.stats.announcements ?? 0} pengumuman aktif
        </p>
        <AddToggleBtn open={open} onClick={() => setOpen((v) => !v)} />
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
          <div className="grid gap-3">
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Judul pengumuman *" aria-label="Judul pengumuman" className={fieldCls} />
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Isi pengumuman… *" aria-label="Isi pengumuman" rows={4} className={fieldClsArea} />
            <div className="flex flex-wrap items-center gap-3">
              <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} aria-label="Audiens pengumuman" className={`${fieldCls} max-w-xs`}>
                <option value="semua">Audiens: Semua (karyawan + client)</option>
                <option value="karyawan">Audiens: Karyawan saja</option>
                <option value="client">Audiens: Client saja</option>
              </select>
              <button
                type="button"
                onClick={() => void create()}
                disabled={busy || !form.title.trim() || !form.body.trim()}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-[13px] font-bold text-white shadow-[0_10px_26px_-10px_rgba(139,92,246,0.55)] transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
              >
                <Megaphone className="h-4 w-4" aria-hidden="true" />
                {busy ? "Menerbitkan…" : "Terbitkan"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {team?.announcements.map((a) => (
        <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <AudienceBadge audience={a.audience} />
                <span className="text-[11.5px] text-slate-400">{fmtDate.format(new Date(a.createdAt))}</span>
              </div>
              <h3 className="mt-1.5 text-[14.5px] font-black text-slate-900">{a.title}</h3>
              <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-slate-600">{a.body}</p>
            </div>
            <ActionBtn onClick={() => void remove(a.id, a.title)} icon={Trash2} label="Hapus" tone="rose" />
          </div>
        </div>
      ))}
      {team && team.announcements.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
          <Empty text="Belum ada pengumuman. Terbitkan informasi penting untuk karyawan dan client Anda." />
        </div>
      )}
    </div>
  );
}
