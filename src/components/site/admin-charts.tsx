"use client";

/**
 * Tab Grafik Panel CEO — visualisasi Recharts murni dari data yang sudah dimuat
 * (team = /api/admin/team, data = /api/admin/data). Tanpa API tambahan.
 * Grafik: aktivitas 14 hari, nilai invoice per status, distribusi tier, proyek per status.
 */

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, CircleDollarSign, Gauge, Sparkles, TicketCheck } from "lucide-react";
import { useMemo } from "react";
import { STATUS_PROYEK } from "@/components/site/portal-ui";
import type { AdminTicket } from "@/components/site/admin-more";
import type { AdminInvoice } from "@/components/site/admin-more";

const WAKTU = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
const RP = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

/* Palet GUNARA — ungu dominan, aksen hangat */
const C = {
  violet: "#7c3aed",
  violetMuda: "#a78bfa",
  amber: "#f59e0b",
  emerald: "#10b981",
  rose: "#f43f5e",
  sky: "#0ea5e9",
  slate: "#94a3b8",
};

const TIER_WARNA: Record<string, string> = {
  STANDARD: C.slate,
  PRO: C.sky,
  ELITE: C.violet,
  GOD: C.amber,
};

interface ChartCardProps {
  title: string;
  icon?: typeof BarChart3;
  children: React.ReactNode;
  hint?: string;
}

function ChartCard({ title, icon: Icon, children, hint }: ChartCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600">
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
          )}
          <div>
            <h3 className="text-[14px] font-black text-slate-900">{title}</h3>
            {hint && <p className="text-[11.5px] text-slate-500">{hint}</p>}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function KpiChip({ label, value, sub, icon: Icon, warna }: { label: string; value: string; sub?: string; icon: typeof BarChart3; warna: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: warna }}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11.5px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="font-display text-xl font-black leading-tight text-slate-900">{value}</p>
        {sub && <p className="truncate text-[11.5px] text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}

function tooltipStyle() {
  return {
    contentStyle: {
      borderRadius: 12,
      border: "1px solid #e2e8f0",
      boxShadow: "0 8px 24px -12px rgba(15,23,42,0.25)",
      fontSize: 12,
    },
    labelStyle: { fontWeight: 700 as const, color: "#0f172a" },
  };
}

export interface ChartsTeamData {
  tickets: AdminTicket[];
  invoices: AdminInvoice[];
  audit: { id: string; action: string; createdAt: string }[];
  employees: { tier: string; status: string }[];
  clients: { tier: string; status: string }[];
  projects: { status: string; progress: number }[];
  stats: { invoiceNilaiTerkirim: number; invoiceDibayar: number; godAccounts: number; proyekBerjalan: number };
}

export function AdminChartsTab({ team }: { team: ChartsTeamData | null }) {
  const kpi = useMemo(() => {
    const s = team?.stats;
    const proyek = team?.projects ?? [];
    const avgProgress = proyek.length ? Math.round(proyek.reduce((a, p) => a + (p.progress || 0), 0) / proyek.length) : 0;
    return {
      nilaiTerkirim: s?.invoiceNilaiTerkirim ?? 0,
      nilaiDibayar: s?.invoiceDibayar ?? 0,
      god: s?.godAccounts ?? 0,
      avgProgress,
      proyekBerjalan: s?.proyekBerjalan ?? 0,
    };
  }, [team]);

  /* 1. Aktivitas 14 hari — tiket, invoice, audit */
  const aktivitas = useMemo(() => {
    const hari: { key: string; label: string; tiket: number; invoice: number; audit: number }[] = [];
    const indeks = new Map<string, number>();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      indeks.set(key, hari.length);
      hari.push({ key, label: WAKTU.format(d), tiket: 0, invoice: 0, audit: 0 });
    }
    const tambah = (list: { createdAt: string }[], kolom: "tiket" | "invoice" | "audit") => {
      for (const it of list) {
        const key = (it.createdAt || "").slice(0, 10);
        const i = indeks.get(key);
        if (i !== undefined) hari[i][kolom] += 1;
      }
    };
    if (team) {
      tambah(team.tickets, "tiket");
      tambah(team.invoices, "invoice");
      tambah(team.audit, "audit");
    }
    return hari;
  }, [team]);

  /* 2. Nilai invoice per status (juta Rp) */
  const invoiceStatus = useMemo(() => {
    const map: Record<string, number> = { draft: 0, terkirim: 0, dibayar: 0, batal: 0 };
    for (const inv of team?.invoices ?? []) if (inv.status in map) map[inv.status] += inv.amount || 0;
    const warna: Record<string, string> = { draft: C.slate, terkirim: C.sky, dibayar: C.emerald, batal: C.rose };
    return Object.entries(map).map(([status, nilai]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      juta: Math.round((nilai / 1_000_000) * 10) / 10,
      warna: warna[status],
    }));
  }, [team]);

  /* 3. Distribusi tier akun (karyawan + client, semua status) */
  const tierDist = useMemo(() => {
    const map: Record<string, number> = { STANDARD: 0, PRO: 0, ELITE: 0, GOD: 0 };
    for (const e of team?.employees ?? []) if (e.tier in map) map[e.tier] += 1;
    for (const c of team?.clients ?? []) if (c.tier in map) map[c.tier] += 1;
    return Object.entries(map)
      .filter(([, n]) => n > 0)
      .map(([tier, n]) => ({ tier, jumlah: n, warna: TIER_WARNA[tier] ?? C.slate }));
  }, [team]);

  const totalAkun = tierDist.reduce((a, d) => a + d.jumlah, 0);

  /* 4. Proyek per status (horizontal) */
  const proyekStatus = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of team?.projects ?? []) map.set(p.status, (map.get(p.status) ?? 0) + 1);
    const urut = Object.keys(STATUS_PROYEK).filter((s) => map.has(s));
    for (const s of map.keys()) if (!urut.includes(s)) urut.push(s);
    return urut.map((s) => ({ status: STATUS_PROYEK[s]?.label ?? s, jumlah: map.get(s) ?? 0 }));
  }, [team]);

  return (
    <div className="space-y-6">
      {/* Strip KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiChip label="Invoice Terkirim" value={`Rp ${RP.format(kpi.nilaiTerkirim / 1_000_000)} jt`} sub={`dibayar Rp ${RP.format(kpi.nilaiDibayar / 1_000_000)} jt`} icon={CircleDollarSign} warna={C.emerald} />
        <KpiChip label="Proyek Berjalan" value={String(kpi.proyekBerjalan)} sub={`rata-rata progres ${kpi.avgProgress}%`} icon={Gauge} warna={C.violet} />
        <KpiChip label="Akun GOD MODE" value={String(kpi.god)} sub="karyawan + client" icon={Sparkles} warna={C.amber} />
        <KpiChip label="Tiket Total" value={String(team?.tickets.length ?? 0)} sub="seluruh periode" icon={TicketCheck} warna={C.sky} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Aktivitas 14 Hari" icon={BarChart3} hint="tiket, invoice, dan aksi tercatat per hari">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aktivitas} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gTiket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.violet} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={C.violet} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gInvoice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.emerald} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={C.emerald} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10.5, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10.5, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle()} />
                <Legend wrapperStyle={{ fontSize: 11.5 }} />
                <Area type="monotone" dataKey="tiket" name="Tiket" stroke={C.violet} strokeWidth={2} fill="url(#gTiket)" />
                <Area type="monotone" dataKey="invoice" name="Invoice" stroke={C.emerald} strokeWidth={2} fill="url(#gInvoice)" />
                <Area type="monotone" dataKey="audit" name="Aksi Audit" stroke={C.slate} strokeWidth={1.5} fillOpacity={0.05} fill={C.slate} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Nilai Invoice per Status" icon={CircleDollarSign} hint="dalam juta rupiah">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={invoiceStatus} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="status" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                <YAxis tick={{ fontSize: 10.5, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <Tooltip
                  {...tooltipStyle()}
                  formatter={(v: number) => [`Rp ${RP.format(v)} jt`, "Nilai"]}
                />
                <Bar dataKey="juta" name="Nilai (jt Rp)" radius={[8, 8, 0, 0]} maxBarSize={56}>
                  {invoiceStatus.map((d) => (
                    <Cell key={d.status} fill={d.warna} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Distribusi Tier Akun" icon={Sparkles} hint={`${totalAkun} akun karyawan + client`}>
          {tierDist.length === 0 ? (
            <p className="py-16 text-center text-[12.5px] text-slate-500">Belum ada akun.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tierDist} dataKey="jumlah" nameKey="tier" innerRadius={52} outerRadius={84} paddingAngle={3} strokeWidth={2} stroke="#fff">
                    {tierDist.map((d) => (
                      <Cell key={d.tier} fill={d.warna} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle()} formatter={(v: number, n) => [`${v} akun`, String(n)]} />
                  <Legend wrapperStyle={{ fontSize: 11.5 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Proyek per Status" icon={Gauge} hint={`${team?.projects.length ?? 0} proyek terdaftar`}>
          {proyekStatus.length === 0 ? (
            <p className="py-16 text-center text-[12.5px] text-slate-500">Belum ada proyek.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={proyekStatus} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10.5, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                  <YAxis type="category" dataKey="status" width={110} tick={{ fontSize: 10.5, fill: "#64748b" }} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle()} formatter={(v: number) => [`${v} proyek`, "Jumlah"]} />
                  <Bar dataKey="jumlah" name="Proyek" fill={C.violetMuda} radius={[0, 8, 8, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
