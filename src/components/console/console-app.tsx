"use client";

/**
 * ConsoleShell — shell eksklusif ruang INTERNAL GUNARA CORPORATION.
 * ----------------------------------------------------------------------------
 * Perbedaan tegas dari shell publik (src/components/site/app.tsx):
 *   - TANPA Navbar publik, Footer publik, Preloader sinematik, ScrollProgress,
 *     atau tombol WhatsApp mengapung.
 *   - Topbar gelap slate-950 khas area kerja: monogram GC, badge AREA INTERNAL,
 *     switcher portal (Lounge VVIP · Member · CEO · Karyawan · Client), toggle
 *     bahasa, dan pintu kembali ke situs publik.
 *   - Footer konsol minimal, menempel di dasar (mt-auto + safe-area).
 *   - Tema gelap seragam sehingga pengguna selalu tahu sedang berada di area
 *     terbatas — bukan di halaman marketing.
 *
 * Halaman portal (admin/karyawan/client/member/vvip) tetap menjadi pemilik
 * kontennya; shell hanya menyediakan kerangka navigasi dan identitas.
 */

import { ArrowUpRight, Globe, Lock, ShieldAlert } from "lucide-react";
import { CONSOLE_PORTALS, consolePortal } from "@/lib/routes";
import { tr, useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/site/portal-ui";

export default function ConsoleShell({
  segment,
  children,
}: {
  /** Segmen aktif ("admin" | "karyawan" | …) — menentukan item switcher aktif. */
  segment: string;
  children: React.ReactNode;
}) {
  const [lang, setLang] = useLang();
  const active = consolePortal(segment);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* ── Topbar konsol ─────────────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-zinc-950/90 backdrop-blur-md"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Identitas */}
          <a
            href="#/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="GUNARA Corporation — kembali ke beranda publik"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 font-display text-[13px] font-black tracking-tight text-white shadow-[0_8px_24px_-6px_rgba(13,148,136,0.6)]">
              GC
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-[13px] font-black tracking-wide text-white">
                GUNARA CONSOLE
              </span>
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                {tr(lang, "console.zone")}
              </span>
            </span>
          </a>

          {/* Switcher portal — desktop */}
          <nav
            className="ml-4 hidden flex-1 items-center gap-1 lg:flex"
            aria-label={tr(lang, "console.switcher")}
          >
            {CONSOLE_PORTALS.map((p) => {
              const isActive = p.id === segment;
              const isLocked = p.id === "admin" || p.id === "karyawan" || p.id === "client";
              return (
                <a
                  key={p.id}
                  href={p.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-9 items-center rounded-full px-3.5 text-[12.5px] font-bold transition-colors ${
                    isActive
                      ? "bg-violet-600/20 text-violet-200 ring-1 ring-violet-400/40"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                  }`}
                >
                  {isLocked ? (
                    <Lock className="mr-1.5 h-3 w-3" aria-hidden="true" />
                  ) : (
                    <ShieldAlert className="mr-1.5 h-3 w-3" aria-hidden="true" />
                  )}
                  {lang === "id" ? p.label : p.enLabel}
                </a>
              );
            })}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2 lg:flex-none">
            <LangToggle lang={lang} onChange={setLang} dark />
            <a
              href="#/"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-3.5 text-[12px] font-bold text-zinc-300 transition-colors hover:border-violet-400/50 hover:text-violet-200"
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{tr(lang, "console.publicSite")}</span>
              <span className="sm:hidden">Publik</span>
            </a>
          </div>
        </div>

        {/* Switcher portal — mobile/tablet: chip gulir horizontal */}
        <nav
          className="flex gap-1.5 overflow-x-auto px-4 pb-2.5 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={tr(lang, "console.switcher")}
        >
          {CONSOLE_PORTALS.map((p) => {
            const isActive = p.id === segment;
            return (
              <a
                key={p.id}
                href={p.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex h-8 shrink-0 items-center rounded-full px-3 text-[12px] font-bold transition-colors ${
                  isActive
                    ? "bg-violet-600/20 text-violet-200 ring-1 ring-violet-400/40"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                }`}
              >
                {lang === "id" ? p.label : p.enLabel}
              </a>
            );
          })}
        </nav>
      </header>

      {/* ── Konten portal ──────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer konsol ──────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-white/10 bg-zinc-950">
        <div
          className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 sm:px-6"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <p className="text-[11.5px] font-medium text-zinc-500">
            © {new Date().getFullYear()} GUNARA CORPORATION —{" "}
            {tr(lang, "console.footer.restricted")}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {active && (
              <span className="hidden text-[11.5px] text-zinc-500 sm:inline">
                {lang === "id" ? active.description : active.enDescription}
              </span>
            )}
            <a
              href="#/sitemap"
              className="inline-flex items-center gap-1 text-[11.5px] font-bold text-zinc-400 transition-colors hover:text-violet-300"
            >
              {tr(lang, "console.footer.sitemap")}
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
