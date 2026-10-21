"use client";

import { ArrowRight, AtSign, Download, Facebook, Globe, Instagram, Loader2, Mail, MapPin, MessageCircle, Music2, Phone, Twitter, type LucideIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { COUNCIL_CATEGORIES, SERVICES } from "@/data/content";
import { PERIZINAN_CATEGORIES } from "@/data/perizinan";
import { CATALOG_CATEGORIES } from "@/data/service-catalog";
import { BRAND, OWNER } from "@/data/brand";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/site/portal-ui";
import { Link } from "@/lib/router";
import { LogoMark } from "./logo";

const FIRM_LINKS = [
  { to: "/about", label: "Tentang Perusahaan" },
  { to: "/leadership", label: "Pimpinan & Tata Kelola" },
  { to: "/harga", label: "Harga Terbaik" },
  { to: "/method", label: "Metode Oracle" },
  { to: "/results", label: "Hasil & Bukti" },
  { to: "/responsibility", label: "Tanggung Jawab & Dampak" },
  { to: "/insights", label: "Wawasan" },
  { to: "/careers", label: "Karier" },
  { to: "/offices", label: "Kantor Kami" },
  { to: "/contact", label: "Hubungi Kami" },
];

const LEGAL_LINKS = [
  { to: "/privacy", label: "Kebijakan Privasi" },
  { to: "/terms", label: "Syarat & Ketentuan" },
  { to: "/cookies", label: "Kebijakan Cookie" },
  { to: "/faq", label: "Pertanyaan Umum" },
  { to: "/resources", label: "Pusat Sumber Daya" },
  { to: "/newsroom", label: "Ruang Media" },
  { to: "/sitemap", label: "Peta Situs" },
];

/** Enam kanal sosial resmi pemilik — diambil dari OWNER (data/brand.ts). */
const SOCIAL_ICONS: Record<string, LucideIcon> = {
  Facebook,
  "X (Twitter)": Twitter,
  Instagram,
  TikTok: Music2,
  Threads: AtSign,
  Reddit: MessageCircle,
};
const SOCIALS = OWNER.socials.map((s) => ({
  ...s,
  Icon: (SOCIAL_ICONS[s.name] ?? Globe) as LucideIcon,
}));

export default function Footer() {
  const year = new Date().getFullYear();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [lang] = useLang();

  async function onSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast({
        title: "Alamat email diperlukan",
        description: "Masukkan email yang valid — kearifan perlu tahu harus mendarat di mana.",
      });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string; error?: string };
      if (!res.ok || !data.ok) {
        toast({ title: "Sinyal tertolak", description: data.error ?? "Coba lagi sebentar lagi." });
      } else {
        toast({ title: "Selamat bergabung di Dispatch", description: data.message });
        setEmail("");
      }
    } catch {
      toast({ title: "Sinyal hilang di udara", description: "Coba lagi sebentar lagi." });
    } finally {
      setSending(false);
    }
  }

  return (
    <footer className="mt-auto border-t border-violet-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand + Dispatch + Kontak */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-3" ariaLabel="GUNARA CORPORATION — beranda">
              <LogoMark className="h-10 w-10" />
              <span className="leading-none">
                <span className="block font-display text-sm font-bold tracking-[0.28em] text-slate-900">
                  GUNARA CONSULTAN
                </span>
                <span className="mt-1 block text-[9px] font-semibold tracking-[0.5em] text-violet-600">
                  CORPORATION
                </span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-900">
              Konsultan &amp; perizinan terlengkap di dunia — 1.524 perusahaan
              ditangani, lokal maupun nasional, global maupun dalam negeri, daerah
              maupun pusat. 46 Dewan Pakar internasional; dari NIB hingga ekspansi
              190 negara.
            </p>

            <address className="flex flex-col gap-2 text-sm not-italic text-slate-900">
              <a
                href={BRAND.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 font-semibold text-slate-600 transition-colors hover:text-violet-600"
                aria-label={`WhatsApp bisnis ${BRAND.whatsapp}`}
              >
                <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-600" aria-hidden="true">
                  <MessageCircle className="h-2.5 w-2.5 text-white" />
                </span>
                {BRAND.whatsapp} — WhatsApp resmi 24/7
              </a>
              <a
                href={`tel:${BRAND.phoneHref}`}
                className="flex items-center gap-2.5 transition-colors hover:text-violet-600"
                aria-label={`Telepon ${BRAND.phone}`}
              >
                <Phone className="h-3.5 w-3.5 shrink-0 text-violet-500" aria-hidden="true" />
                {BRAND.phone}
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-violet-600"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-violet-500" aria-hidden="true" />
                {BRAND.email}
              </a>
              <span className="flex flex-col gap-1.5">
                {BRAND.addresses.map((a) => (
                  <span key={a.label} className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" aria-hidden="true" />
                    <span>
                      <span className="font-semibold text-slate-500">{a.label}:</span>{" "}
                      {a.value}
                    </span>
                  </span>
                ))}
              </span>
            </address>

            {/* Newsletter — the Oracle Dispatch */}
            <form onSubmit={onSubscribe} className="mt-1" aria-label="Berlangganan Oracle Dispatch">
              <label
                htmlFor="dispatch-email"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900"
              >
                Oracle Dispatch
              </label>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white/60 transition-colors focus-within:border-violet-500/60">
                <input
                  id="dispatch-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  autoComplete="email"
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex min-h-11 w-12 shrink-0 items-center justify-center bg-gradient-to-r from-violet-600 to-blue-600 text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  aria-label="Berlangganan Oracle Dispatch"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
                Satu kirim per bulan. Nol derau. Tanpa pelacak — lihat{" "}
                <Link to="/cookies" className="text-slate-900 underline decoration-violet-400/40 underline-offset-2 hover:text-violet-600">
                  Kebijakan Cookie
                </Link>
                .
              </p>
            </form>

            <div className="flex flex-wrap gap-3">
              {SOCIALS.map(({ name, handle, url, Icon }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={`${name} — @${handle}`}
                  title={`${name} — @${handle}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/60 hover:text-violet-600"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Perusahaan */}
          <nav aria-label="Perusahaan">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900">
              Perusahaan
            </h3>
            <ul className="space-y-2.5 text-sm">
              {FIRM_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-slate-500 transition-colors hover:text-violet-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Perizinan */}
          <nav aria-label="Perizinan">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900">
              Perizinan
            </h3>
            <ul className="space-y-2.5 text-sm">
              {PERIZINAN_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/perizinan?kategori=${c.id}`}
                    className="text-slate-500 transition-colors hover:text-violet-600"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/perizinan" className="font-semibold text-violet-700 transition-colors hover:text-violet-700">
                  Lihat semua 36 izin →
                </Link>
              </li>
            </ul>
          </nav>

          {/* Layanan + Dewan + Hukum */}
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-1">
            <nav aria-label="Layanan">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900">
                Layanan
              </h3>
              <ul className="space-y-2.5 text-sm">
                {SERVICES.slice(0, 6).map((s) => (
                  <li key={s.num}>
                    <Link
                      to={`/services/${s.num}`}
                      className="text-slate-500 transition-colors hover:text-violet-600"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/services" className="font-semibold text-violet-700 transition-colors hover:text-violet-700">
                    Lihat 12 layanan utama →
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Katalog Layanan">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900">
                Katalog Layanan
              </h3>
              <ul className="space-y-2.5 text-sm">
                {CATALOG_CATEGORIES.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/layanan?kategori=${c.id}`}
                      className="text-slate-500 transition-colors hover:text-violet-600"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/layanan" className="font-semibold text-violet-700 transition-colors hover:text-violet-700">
                    Jelajahi 120+ layanan →
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex flex-col gap-8">
              <nav aria-label="Dewan Pakar">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900">
                  Dewan Pakar
                </h3>
                <ul className="space-y-2.5 text-sm">
                  {COUNCIL_CATEGORIES.slice(0, 4).map((c) => (
                    <li key={c}>
                      <Link
                        to={`/councils?filter=${encodeURIComponent(c)}`}
                        className="text-slate-500 transition-colors hover:text-violet-600"
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/councils" className="font-semibold text-violet-700 transition-colors hover:text-violet-700">
                      Hadapi 46 Dewan →
                    </Link>
                  </li>
                </ul>
              </nav>

              <nav aria-label="Hukum">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900">
                  Hukum
                </h3>
                <ul className="space-y-2.5 text-sm">
                  {LEGAL_LINKS.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-slate-500 transition-colors hover:text-violet-600">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Kredit & kepemilikan — entitas pribadi pemilik sistem */}
      <div className="border-t border-slate-200 bg-gradient-to-r from-violet-50 via-white to-indigo-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-1.5 px-4 py-5 text-center sm:px-6 lg:px-8">
          <p className="text-[13.5px] font-black tracking-tight text-slate-900">
            {OWNER.creditLine}
          </p>
          <p className="text-[11.5px] font-semibold text-slate-600">
            {OWNER.titles.join(" · ")} — {OWNER.supportLine}
          </p>
          <Link
            to="/kredit"
            className="text-[11.5px] font-bold text-violet-700 transition-colors hover:text-violet-600"
          >
            Kredit & Kepemilikan lengkap →
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div
          className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-600 sm:flex-row sm:px-6 lg:px-8"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <p>© {year} {BRAND.legal}. Seluruh masa depan dilindungi.</p>
            <Link
              to="/unduh"
              className="inline-flex items-center gap-1.5 font-bold text-violet-700 transition-colors hover:text-violet-600"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Pusat Unduhan
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LangToggle lang={lang} onChange={() => {}} />
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
              Semua 46 Dewan Pakar sedang online — respons ≤ 48 jam
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
