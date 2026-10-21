"use client";

/**
 * /offices — Kantor Kami.
 * Empat lokasi resmi dengan arah navigasi, jam layanan, protokol kunjungan,
 * dan jam dunia (komponen OfficeClocks dipakai ulang).
 */

import { Building2, CalendarCheck2, Clock3, Landmark, MapPin, MessageCircle, Navigation, ShieldCheck, Sparkles } from "lucide-react";
import { OFFICES } from "@/data/offices";
import { BRAND } from "@/data/brand";
import { Link } from "@/lib/router";
import OfficeClocks from "@/components/site/office-clocks";
import { Reveal, SectionHeading, TiltCard } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero } from "@/components/site/ui";

const mapsUrl = (address: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

const VISIT_PROTOCOL = [
  {
    icon: CalendarCheck2,
    title: "Janji temu terlebih dahulu",
    desc: "Seluruh kantor kami melayani kunjungan dengan penjadwalan agar Mitra dan berkas Anda siap di meja saat Anda tiba — bukan menunggu di ruang tunggu. Konfirmasi slot via WhatsApp, dibalas dalam 48 jam.",
  },
  {
    icon: ShieldCheck,
    title: "Ruang briefing yang tertutup",
    desc: "Setiap sesi konsultasi digelar di ruang tertutup: dokumen Anda tidak berpindah meja, diskusi Anda tidak terngiung. Kerahasiaan dimulai dari arsitektur ruang, bukan sekadar ikrar.",
  },
  {
    icon: Clock3,
    title: "Waktu Anda dihormati",
    desc: "Briefing pertama 46 menit, terukur dan terarah — kami meminta Anda membawa dokumen inti (identitas, legalitas, rencana usaha) agar sesi berakhir dengan keputusan, bukan daftar belanja.",
  },
] as const;

export default function OfficesPage() {
  const flagship = OFFICES.find((o) => o.flagship) ?? OFFICES[0];
  const others = OFFICES.filter((o) => o !== flagship);

  return (
    <>
      <PageHero
        eyebrow="Kantor Kami"
        title={
          <>
            Empat pintu, <span className="text-gradient-gold">satu standar dunia.</span>
          </>
        }
        sub="Dari kantor pusat di Tasikmalaya hingga jantung Jakarta — setiap lokasi berbagi Dewan, sistem, dan standar kerja yang sama. Pilih yang terdekat; kualitas tidak berpindah tempat."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Kantor Kami" }]}
        meta={["4 kantor resmi", "Zona WIB — jam kerja 08.00–17.00", "Layanan WhatsApp 24/7"]}
      >
        <LinkButton to="/contact" withArrow>
          Jadwalkan briefing
        </LinkButton>
        <a
          href={`${BRAND.whatsappHref}?text=${encodeURIComponent("Halo Gunara Consultan, saya ingin menjadwalkan kunjungan ke kantor Anda.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-emerald-300 bg-emerald-50 px-7 py-3 text-sm font-bold text-emerald-600 transition-all duration-300 hover:border-emerald-500/60 hover:bg-emerald-100"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp {BRAND.phone}
        </a>
      </PageHero>

      {/* Kantor pusat — kartu besar */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8" aria-label="Kantor pusat">
        <Reveal>
          <TiltCard>
            <article className="overflow-hidden rounded-3xl border border-violet-300 bg-gradient-to-br from-violet-600/[0.08] via-white to-white transition-all duration-300 hover:border-violet-500/60 hover:shadow-[0_32px_80px_-32px_rgba(139,92,246,0.4)]">
              <div className="grid lg:grid-cols-[1fr_340px]">
                <div className="flex flex-col justify-center gap-5 p-6 sm:p-10">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Kantor Pusat
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300 bg-violet-50/60 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-700">
                      <Landmark className="h-3 w-3" aria-hidden="true" />
                      Sejak {BRAND.founded}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                    {flagship.city}
                  </h2>
                  <address className="not-italic">
                    <p className="flex items-start gap-2.5 text-[15px] leading-relaxed text-slate-600">
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      {flagship.address}
                    </p>
                  </address>
                  <ul className="grid gap-2.5 text-sm text-slate-600 sm:grid-cols-2">
                    <li className="flex items-center gap-2.5">
                      <Clock3 className="h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      Senin–Jumat 08.00–17.00 · Sabtu 08.00–14.00
                    </li>
                    <li className="flex items-center gap-2.5">
                      <MessageCircle className="h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      WhatsApp bisnis aktif 24/7
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Building2 className="h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      Ruang briefing tertutup &amp; ruang Dewan
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Navigation className="h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      Parkir tersedia di lokasi
                    </li>
                  </ul>
                  <div className="mt-1 flex flex-wrap gap-3">
                    <a
                      href={mapsUrl(flagship.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shine inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-transform duration-300 hover:scale-[1.04] active:scale-95"
                    >
                      <Navigation className="h-4 w-4" aria-hidden="true" />
                      Petunjuk arah
                    </a>
                    <LinkButton to="/contact" variant="ghost">
                      Jadwalkan kunjungan
                    </LinkButton>
                  </div>
                </div>
                <div className="relative hidden min-h-[320px] overflow-hidden border-l border-violet-200/60 lg:block">
                  <iframe
                    title={`Peta lokasi ${flagship.city}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(flagship.address)}&z=15&output=embed`}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </article>
          </TiltCard>
        </Reveal>
      </section>

      {/* Tiga kantor lainnya */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-label="Kantor cabang dan perwakilan">
        <SectionHeading
          eyebrow="Jaringan kantor"
          title={
            <>
              Dekat lokasi Anda, <span className="text-gradient-gold">tanpa menurunkan standar.</span>
            </>
          }
          sub="Kantor cabang dan perwakilan resmi — masing-masing diawal kualitas oleh tim inti yang sama dari kantor pusat."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {others.map((o, i) => (
            <Reveal key={o.city} delay={i * 0.08} className="h-full">
              <TiltCard className="h-full">
                <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(139,92,246,0.22)] sm:p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{o.city}</h3>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600">
                    {o.country} · Zona WIB
                  </p>
                  <address className="mt-3 flex-1 not-italic">
                    <p className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      {o.address}
                    </p>
                  </address>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2.5">
                      <Clock3 className="h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      Senin–Jumat 08.00–17.00 · Sabtu 08.00–14.00
                    </li>
                    <li className="flex items-center gap-2.5">
                      <MessageCircle className="h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                      WhatsApp bisnis aktif 24/7
                    </li>
                  </ul>
                  <div className="mt-5 flex gap-2.5">
                    <a
                      href={mapsUrl(o.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                    >
                      <Navigation className="h-4 w-4" aria-hidden="true" />
                      Arah
                    </a>
                    <LinkButton to="/contact" variant="ghost" className="flex-1">
                      Janji temu
                    </LinkButton>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Protokol kunjungan */}
      <section className="border-y border-slate-200 bg-gradient-to-b from-violet-600/[0.04] to-transparent py-16 sm:py-20" aria-label="Protokol kunjungan">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Protokol kunjungan"
            title={
              <>
                Sebelum Anda datang, <span className="text-gradient-gold">baca ini dulu.</span>
              </>
            }
            sub="Kami menata kunjungan seperti kami menata penugasan: terjadwal, tertutup, dan terukur. Tiga hal berikut membuat briefing Anda menghasilkan keputusan — bukan sekadar perkenalan."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {VISIT_PROTOCOL.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className="h-full">
                <div className="glass group flex h-full flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:gold-ring sm:p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <p.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-900 sm:text-lg">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-violet-200 bg-white/80 p-6 text-center sm:p-8">
              <p className="text-sm leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-900">Perwakilan di luar keempat lokasi?</span>{" "}
                Untuk klien di luar Jawa dan 190 negara lainnya, briefing awal kami selenggarakan secara daring
                dengan protokol keamanan yang sama — dan kunjungan Mitra ke lokasi Anda dapat dijadwalkan untuk
                penugasan strategis.{" "}
                <Link to="/contact" className="font-semibold text-violet-700 underline decoration-violet-400/40 underline-offset-2 transition-colors hover:text-violet-600">
                  Hubungi Dewan
                </Link>{" "}
                untuk mengatur format terbaik.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Jam dunia — komponen dipakai ulang */}
      <OfficeClocks />

      <CTABand
        title={
          <>
            Tidak perlu ke kantor untuk <span className="text-gradient-gold">memulai.</span>
          </>
        }
        sub="Briefing daring tersedia hari ini — 46 menit bersama Dewan yang tepat, dari ruang kerja Anda sendiri. Kejelasan jalur terbaik sampai dalam 48 jam."
      />
    </>
  );
}
