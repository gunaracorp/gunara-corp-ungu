"use client";

/**
 * Kredit & Kepemilikan (#/kredit) — halaman identitas pemilik sistem.
 * Sumber kebenaran Person Gugun Gunara (Muhammad Lutfi Azmi · prabudanling ·
 * Santri Angon), 6 kanal sosial resmi, dan entitas support system.
 * Diperkaya ProfilePage JSON-LD agar Google mengikat seluruh entitas.
 */

import { AtSign, BadgeCheck, Crown, ExternalLink, Globe, Landmark, Link2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { OWNER } from "@/data/brand";
import { JsonLd } from "@/components/seo/json-ld";
import { profilePageLd } from "@/lib/seo-ld";
import { tr, useLang } from "@/lib/i18n";

const SOCIAL_ICONS: Record<string, string> = {
  Facebook: "f",
  "X (Twitter)": "𝕏",
  Instagram: "◎",
  TikTok: "♪",
  Threads: "@",
  Reddit: "r/",
};

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay: i * 0.06 },
});

export default function KreditPage() {
  const [lang] = useLang();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <JsonLd data={profilePageLd()} />

      {/* Kepala */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-[0_12px_40px_-10px_rgba(139,92,246,0.5)]"
        >
          <Crown className="h-7 w-7" aria-hidden="true" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="text-balance text-4xl font-black tracking-tight text-slate-900 sm:text-5xl"
        >
          {tr(lang, "kredit.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-4 text-pretty text-[15px] leading-relaxed text-slate-600"
        >
          {tr(lang, "kredit.subtitle")}
        </motion.p>
      </div>

      {/* Kartu pemilik */}
      <motion.section
        {...fadeUp(0)}
        className="relative mt-12 overflow-hidden rounded-3xl border border-violet-300 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-7 ring-1 ring-violet-200 sm:p-10"
        aria-labelledby="kredit-owner"
      >
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <span
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-500 to-blue-600 text-2xl font-black text-white shadow-[0_16px_50px_-12px_rgba(139,92,246,0.55)]"
          >
            GG
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-600">
              {tr(lang, "kredit.owner")}
            </p>
            <h2 id="kredit-owner" className="mt-1 text-3xl font-black tracking-tight text-slate-900">
              {OWNER.name}
            </h2>
            <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13.5px] font-bold text-slate-600 sm:justify-start">
              <span>{OWNER.fullName}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="rounded-full bg-violet-600/10 px-2.5 py-0.5 text-violet-700">@{OWNER.alias}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{OWNER.community}</span>
            </p>
            <p className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {OWNER.titles.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-1 text-[11.5px] font-bold text-slate-700 shadow-sm"
                >
                  <Sparkles className="h-3 w-3 text-violet-500" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-[13.5px] leading-relaxed text-slate-600 sm:mx-0">
              {lang === "en" ? OWNER.aboutEn : OWNER.about}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/80 px-3.5 py-2 text-[12px] font-semibold text-slate-700 ring-1 ring-slate-200">
              <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
              {OWNER.role}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Kanal sosial */}
      <motion.section {...fadeUp(1)} className="mt-12" aria-labelledby="kredit-social">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white">
            <AtSign className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="kredit-social" className="text-xl font-black tracking-tight text-slate-900">
              {tr(lang, "kredit.social")}
            </h2>
            <p className="text-[12.5px] font-semibold text-slate-500">{tr(lang, "kredit.socialDesc")}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OWNER.socials.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="me noopener noreferrer"
              className="group flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-[0_16px_40px_-18px_rgba(139,92,246,0.4)]"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-[15px] font-black text-white transition-colors group-hover:bg-violet-600"
              >
                {SOCIAL_ICONS[s.name] ?? <Globe className="h-5 w-5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-black text-slate-900">{s.name}</span>
                <span className="block truncate text-[12px] font-semibold text-slate-500">
                  @{s.handle}
                </span>
              </span>
              <ExternalLink className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-violet-600" aria-hidden="true" />
            </a>
          ))}
        </div>
      </motion.section>

      {/* Entitas pendukung */}
      <motion.section {...fadeUp(2)} className="mt-12" aria-labelledby="kredit-entities">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
            <Landmark className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="kredit-entities" className="text-xl font-black tracking-tight text-slate-900">
              {tr(lang, "kredit.entities")}
            </h2>
            <p className="text-[12.5px] font-semibold text-slate-500">{tr(lang, "kredit.entitiesDesc")}</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {OWNER.entities.map((e) => {
            const inner = (
              <>
                <span className="flex items-center gap-2.5">
                  <Link2 className="h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                  <span className="truncate text-[14px] font-black text-slate-900">{e.name}</span>
                </span>
                <span className="mt-1.5 block text-[12.5px] font-semibold leading-relaxed text-slate-600">
                  {e.role}
                </span>
                {e.site ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-violet-700">
                    {e.site}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </span>
                ) : (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-400">
                    {OWNER.community} · marka digital
                  </span>
                )}
              </>
            );
            return e.url ? (
              <a
                key={e.name}
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-[0_16px_40px_-18px_rgba(139,92,246,0.4)]"
              >
                {inner}
              </a>
            ) : (
              <div key={e.name} className="rounded-2xl border border-slate-200 bg-white p-5">
                {inner}
              </div>
            );
          })}
        </div>
      </motion.section>

      <motion.p
        {...fadeUp(3)}
        className="mx-auto mt-12 max-w-2xl text-center text-[12px] font-semibold leading-relaxed text-slate-400"
      >
        {tr(lang, "kredit.seoNote")}
      </motion.p>
    </div>
  );
}
