"use client";

/**
 * Portal Client — dashboard klien GUNARA CORPORATION (#/client).
 * Login via kode personal (dibagikan tim GUNARA lewat Panel CEO → tab Tim).
 * Client membuat permintaan layanan, memantau progres proyek, berdiskusi
 * lewat catatan proyek, dan membaca pengumuman.
 */

import { motion } from "framer-motion";
import {
  Bell,
  Briefcase,
  Building2,
  CalendarClock,
  CircleCheckBig,
  ClipboardList,
  Eye,
  FilePlus2,
  FileText,
  FolderOpen,
  Handshake,
  KeyRound,
  LifeBuoy,
  Loader2,
  Lock,
  LogOut,
  MessageSquarePlus,
  ReceiptText,
  RefreshCw,
  Send,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { usePageTitle } from "@/lib/router";
import {
  ActionBtn,
  CheckingScreen,
  Field,
  Flash,
  PortalCard,
  PortalTabs,
  PriorityBadge,
  ProgressBar,
  StatusBadge,
  UpdateFeed,
  fmtDateTime,
  inputClass,
} from "@/components/site/portal-ui";
import {
  DokumenTab,
  LaporanWaTab,
  PortalDukunganTab,
  PortalTagihanTab,
  TierActivatePanel,
  TierBadge,
  type InvoiceLite,
  type TierInfoLite,
  type TicketLite,
  type WaItemLite,
} from "@/components/site/portal-extras";

interface PortalProject {
  id: string;
  refCode: string;
  title: string;
  description: string;
  clientName: string;
  status: string;
  priority: string;
  progress: number;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  updates: { id: string; author: string; authorRole: string; message: string; createdAt: string }[];
}

interface PortalData {
  ok: true;
  role: "client";
  profile: {
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    industry: string | null;
    tier: string;
    lastAccessAt: string | null;
    createdAt: string;
  };
  tierInfo: TierInfoLite;
  waItems: WaItemLite[];
  projects: PortalProject[];
  tickets: TicketLite[];
  invoices: InvoiceLite[];
  announcements: { id: string; title: string; body: string; createdAt: string }[];
  stats: { total: number; berjalan: number; review: number; selesai: number; tiketOpen: number; invoiceTerkirim: number; invoiceBelumDibayar: number };
}

type Tab = "proyek" | "baru" | "tagihan" | "dukungan" | "dokumen" | "laporan" | "pengumuman" | "profil";

export default function ClientPage() {
  usePageTitle("Portal Client — GUNARA CORPORATION");
  const [phase, setPhase] = useState<"checking" | "login" | "ready">("checking");
  const [data, setData] = useState<PortalData | null>(null);
  const [tab, setTab] = useState<Tab>("proyek");
  const [flash, setFlash] = useState<string | null>(null);

  const load = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/portal/data", { cache: "no-store" });
      if (res.status === 403) {
        setPhase("login");
        return false;
      }
      const json = (await res.json()) as PortalData;
      if (json.role !== "client") {
        // Sesi portal lain (karyawan) masih aktif — hapus agar login ulang dengan kode client.
        await fetch("/api/portal/login", { method: "DELETE" });
        setPhase("login");
        return false;
      }
      setData(json);
      setPhase("ready");
      return true;
    } catch {
      setPhase("login");
      return false;
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(t);
  }, [load]);

  function notify(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 3200);
  }

  if (phase === "checking") return <CheckingScreen label="Memeriksa sesi client…" />;
  if (phase === "login") return <LoginGate onSuccess={() => void load()} />;

  return (
    <section className="min-h-screen bg-[#fafafc] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto w-full max-w-6xl px-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-[0_10px_30px_-8px_rgba(139,92,246,0.5)]">
              <Handshake className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-black tracking-tight text-slate-900">
                Portal Client
              </h1>
              <p className="flex flex-wrap items-center gap-2 text-[12.5px] text-slate-500">
                {data?.profile.name}
                {data?.profile.company ? ` · ${data.profile.company}` : ""}
                {data?.profile.tier && <TierBadge tier={data.profile.tier} />}
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
                await fetch("/api/portal/login", { method: "DELETE" });
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

        {/* Statistik */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile2 label="Total Proyek" value={data?.stats.total ?? 0} hint="seluruh permintaan Anda" icon={ClipboardList} />
          <StatTile2 label="Berjalan" value={data?.stats.berjalan ?? 0} hint="sedang dikerjakan tim" icon={Loader2} />
          <StatTile2 label="Menunggu Review" value={data?.stats.review ?? 0} hint="mohon persetujuan Anda" icon={Eye} />
          <StatTile2 label="Selesai" value={data?.stats.selesai ?? 0} hint="proyek tuntas" icon={CircleCheckBig} />
        </div>

        <div className="mt-6">
          <Flash msg={flash} />
        </div>

        {/* Tab */}
        <div className="mt-4">
          <PortalTabs<Tab>
            ariaLabel="Bagian portal client"
            tabs={[
              { id: "proyek", label: "Proyek Saya", icon: ClipboardList },
              { id: "baru", label: "Permintaan Baru", icon: FilePlus2 },
              { id: "tagihan", label: "Tagihan", icon: ReceiptText },
              { id: "dukungan", label: "Dukungan", icon: LifeBuoy },
              { id: "dokumen", label: "Dokumen", icon: FolderOpen },
              { id: "laporan", label: "Laporan & WA", icon: FileText },
              { id: "pengumuman", label: "Pengumuman", icon: Bell },
              { id: "profil", label: "Profil & Tier", icon: UserRound },
            ]}
            active={tab}
            onChange={setTab}
            badge={{ dukungan: data?.stats.tiketOpen ?? 0 }}
          />
        </div>

        <div className="mt-6">
          {tab === "proyek" && <ProyekTab data={data} reload={load} notify={notify} />}
          {tab === "baru" && <PermintaanBaruTab reload={load} notify={notify} gotoProyek={() => setTab("proyek")} />}
          {tab === "tagihan" && <PortalTagihanTab invoices={data?.invoices ?? []} />}
          {tab === "dukungan" && (
            <PortalDukunganTab role="client" tickets={data?.tickets ?? []} reload={load} notify={notify} />
          )}
          {tab === "dokumen" && (
            <DokumenTab
              projects={(data?.projects ?? []).map((p) => ({ id: p.id, refCode: p.refCode, title: p.title }))}
              tierInfo={data?.tierInfo ?? null}
              onTierChanged={() => load()}
              notify={notify}
            />
          )}
          {tab === "laporan" && (
            <LaporanWaTab role="client" tier={data?.profile.tier ?? "STANDARD"} notify={notify} />
          )}
          {tab === "pengumuman" && <PengumumanTab data={data} />}
          {tab === "profil" && <ProfilTab data={data} reload={load} />}
        </div>
      </div>
    </section>
  );
}

function StatTile2({ label, value, hint, icon: Icon }: { label: string; value: number; hint: string; icon: typeof ClipboardList }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-display text-3xl font-black tabular-nums text-slate-900">{value}</span>
      </div>
      <p className="mt-3 text-[13px] font-bold text-slate-700">{label}</p>
      <p className="text-[12px] text-slate-500">{hint}</p>
    </div>
  );
}

/* ── Tab Proyek ─────────────────────────────────────────────────────────── */

function ProyekTab({
  data,
  reload,
  notify,
}: {
  data: PortalData | null;
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  if (!data || data.projects.length === 0) {
    return (
      <PortalCard title="Proyek Saya" icon={ClipboardList}>
        <p className="py-6 text-center text-[13.5px] text-slate-500">
          Belum ada proyek atas nama Anda. Ajukan permintaan layanan pertama Anda
          lewat tab <b>Permintaan Baru</b> — tim GUNARA akan segera menindaklanjuti.
        </p>
      </PortalCard>
    );
  }
  return (
    <div className="space-y-5">
      {data.projects.map((p) => (
        <ClientProjectCard key={p.id} project={p} reload={reload} notify={notify} />
      ))}
    </div>
  );
}

function ClientProjectCard({
  project: p,
  reload,
  notify,
}: {
  project: PortalProject;
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [openNote, setOpenNote] = useState(false);

  async function sendNote() {
    if (busy || note.trim().length < 2) return;
    setBusy(true);
    try {
      const res = await fetch("/api/portal/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "tulis-catatan", projectId: p.id, message: note.trim() }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setNote("");
        notify("Catatan terkirim ke tim.");
        await reload();
      } else {
        notify(json.error ?? "Gagal mengirim catatan.");
      }
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <code className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600">
            {p.refCode}
          </code>
          <StatusBadge status={p.status} />
          <PriorityBadge priority={p.priority} />
        </div>
        <h3 className="mt-2 text-[15.5px] font-black tracking-tight text-slate-900">{p.title}</h3>
        {p.dueDate && (
          <p className="text-[12.5px] text-slate-500">
            <CalendarClock className="mb-0.5 inline h-3 w-3" aria-hidden="true" /> estimasi tenggat{" "}
            {fmtDateTime.format(new Date(p.dueDate))}
          </p>
        )}
      </div>
      <div className="space-y-4 p-5">
        <p className="text-[13.5px] leading-relaxed text-slate-600">{p.description}</p>
        <ProgressBar value={p.status === "selesai" ? 100 : p.progress} />
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[12.5px] font-black uppercase tracking-wide text-slate-500">
              Diskusi & Riwayat
            </h4>
            <ActionBtn
              onClick={() => setOpenNote((v) => !v)}
              icon={MessageSquarePlus}
              label={openNote ? "Tutup" : "Tulis Pesan"}
              tone="slate"
            />
          </div>
          <div className="mt-3">
            <UpdateFeed updates={p.updates} emptyLabel="Belum ada aktivitas — tim kami akan segera merespons." />
          </div>
          {openNote && (
            <motion.form
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={(e) => {
                e.preventDefault();
                void sendNote();
              }}
              className="mt-3 flex gap-2"
            >
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tulis pesan / pertanyaan untuk tim GUNARA…"
                aria-label="Pesan untuk tim"
                maxLength={500}
                className={inputClass}
              />
              <button
                type="submit"
                disabled={busy || note.trim().length < 2}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
                aria-label="Kirim pesan"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Tab Permintaan Baru ────────────────────────────────────────────────── */

function PermintaanBaruTab({
  reload,
  notify,
  gotoProyek,
}: {
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
  gotoProyek: () => void;
}) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("normal");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "buat-proyek", title, description, priority }),
      });
      const json = (await res.json()) as { ok: boolean; refCode?: string; error?: string };
      if (json.ok && json.refCode) {
        setTitle("");
        setDescription("");
        setPriority("normal");
        notify(`Permintaan terkirim dengan nomor referensi ${json.refCode}.`);
        await reload();
        gotoProyek();
      } else {
        setError(json.error ?? "Gagal mengirim permintaan.");
      }
    } catch {
      setError("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PortalCard title="Ajukan Permintaan Layanan" icon={FilePlus2}>
      <p className="text-[13px] leading-relaxed text-slate-500">
        Sampaikan kebutuhan konsultasi, perizinan, atau layanan lain. Permintaan Anda
        langsung masuk ke Panel CEO dan akan ditugaskan ke tim yang tepat.
      </p>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <Field label="Judul permintaan">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="cth: Pendirian PT + pengurusan NIB & sertifikasi halal"
            aria-label="Judul permintaan"
            maxLength={140}
            className={inputClass}
          />
        </Field>
        <Field label="Tingkat urgensi">
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputClass} aria-label="Tingkat urgensi">
            <option value="rendah">Rendah — bisa menunggu</option>
            <option value="normal">Normal</option>
            <option value="tinggi">Tinggi — perlu segera</option>
            <option value="urgent">Urgent — kritis untuk bisnis</option>
          </select>
        </Field>
        <Field label="Uraian kebutuhan">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan latar belakang, target, dan kendala Anda… (minimal 10 karakter)"
            aria-label="Uraian kebutuhan"
            rows={5}
            maxLength={4000}
            className={`${inputClass} h-auto py-3`}
          />
        </Field>
        {error && (
          <p role="alert" className="text-[12.5px] font-semibold text-rose-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || title.trim().length < 4 || description.trim().length < 10}
          className="shine inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 text-sm font-bold text-white shadow-[0_14px_44px_-10px_rgba(139,92,246,0.5)] transition-transform hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-8"
        >
          <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          {busy ? "Mengirim…" : "Kirim Permintaan"}
        </button>
      </form>
    </PortalCard>
  );
}

/* ── Tab Pengumuman ─────────────────────────────────────────────────────── */

function PengumumanTab({ data }: { data: PortalData | null }) {
  const items = data?.announcements ?? [];
  return (
    <PortalCard title="Pengumuman untuk Client" icon={Bell}>
      {items.length === 0 ? (
        <p className="py-6 text-center text-[13.5px] text-slate-500">Belum ada pengumuman.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((a) => (
            <li key={a.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[14px] font-black text-slate-900">{a.title}</p>
              <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-slate-600">{a.body}</p>
              <p className="mt-2 text-[11px] text-slate-400">{fmtDateTime.format(new Date(a.createdAt))}</p>
            </li>
          ))}
        </ul>
      )}
    </PortalCard>
  );
}

/* ── Tab Profil ─────────────────────────────────────────────────────────── */

function ProfilTab({ data, reload }: { data: PortalData | null; reload: () => Promise<boolean> }) {
  const p = data?.profile;
  if (!p) return null;
  const rows: [string, string][] = [
    ["Nama", p.name],
    ["Perusahaan", p.company ?? "—"],
    ["Industri", p.industry ?? "—"],
    ["Email", p.email ?? "—"],
    ["Telepon", p.phone ?? "—"],
    ["Tier akun", p.tier === "GOD" ? "GOD MODE (tier maks)" : p.tier],
    ["Terakhir masuk", p.lastAccessAt ? fmtDateTime.format(new Date(p.lastAccessAt)) : "—"],
  ];
  return (
    <div className="space-y-5">
      <PortalCard title="Profil Saya" icon={UserRound}>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <dt className="text-[11px] font-black uppercase tracking-wide text-slate-400">{k}</dt>
              <dd className="mt-0.5 text-[13.5px] font-semibold text-slate-800">{v}</dd>
            </div>
          ))}
        </dl>
        {data?.tierInfo && data.tierInfo.perkawanan?.length > 0 && (
          <div className="mt-4 rounded-xl border border-violet-200 bg-violet-600/5 px-4 py-3">
            <p className="text-[12px] font-black uppercase tracking-wide text-violet-700">
              Keistimewaan tier {p.tier === "GOD" ? "GOD MODE" : p.tier}
            </p>
            <ul className="mt-1.5 space-y-1 text-[12.5px] text-slate-600">
              {data.tierInfo.perkawanan.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-4 text-[12px] leading-relaxed text-slate-500">
          Butuh bantuan seputar akun atau proyek? Hubungi manajer akun Anda lewat
          tab Laporan & WA, atau gunakan tombol WhatsApp melayang di kanan bawah.
        </p>
      </PortalCard>

      <TierActivatePanel tier={p.tier} onActivated={reload} />
    </div>
  );
}

/* ── Layar login client ─────────────────────────────────────────────────── */

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portal: "client", code }),
      });
      if (res.ok) {
        onSuccess();
        return;
      }
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? "Kode akses tidak cocok.");
      setTick((t) => t + 1);
      setCode("");
    } catch {
      setError("Sinyal terputus. Coba sekali lagi.");
      setTick((t) => t + 1);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="noise-overlay relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-5 pb-20 pt-28 text-white">
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
            <Briefcase className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.28em] text-violet-300">
            <KeyRound className="h-3 w-3" aria-hidden="true" />
            Klien Terhormat
          </span>
          <h1 className="mt-3 font-display text-2xl font-black tracking-tight">Portal Client</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
            Masuk dengan kode akses personal dari tim GUNARA Anda, berformat{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11.5px]">GUNARA-CLI-XXXX-XXXX</code>.
          </p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Kode akses client"
            aria-label="Kode akses client"
            autoComplete="off"
            spellCheck={false}
            className="h-12 w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 font-mono text-sm uppercase tracking-wider text-white placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-600 outline-none transition-all focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/25"
          />
          <button
            type="submit"
            disabled={!code.trim() || busy}
            className="shine h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 text-sm font-bold text-white shadow-[0_14px_44px_-10px_rgba(139,92,246,0.5)] transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Memverifikasi…" : "Masuk Portal"}
          </button>
          {error && (
            <p role="alert" className="text-center text-[12.5px] font-medium text-red-400">
              {error}
            </p>
          )}
        </form>
        <p className="mt-5 flex items-start gap-2 text-[11.5px] leading-relaxed text-zinc-500">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Belum punya kode akses? Hubungi tim GUNARA Anda — kode diterbitkan
          langsung oleh perusahaan demi keamanan akun Anda.
        </p>
      </motion.div>
    </section>
  );
}
