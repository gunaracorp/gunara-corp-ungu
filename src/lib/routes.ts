/**
 * GUNARA Route Classification — pemisahan tegas SITUS PUBLIK vs KONSOL INTERNAL.
 * ----------------------------------------------------------------------------
 * Satu sumber kebenaran untuk:
 *  - src/components/site/app.tsx   (shell SPA: shell publik vs shell konsol)
 *  - src/app/[...slug]/page.tsx    (path nyata SSR: meta noindex untuk konsol)
 *  - src/app/robots.ts             (Disallow untuk ruang internal)
 *  - src/app/sitemap.ts            (konsol TIDAK PERNAH masuk sitemap)
 *
 * Tiga zona:
 *  1. PUBLIK  — marketing & informasi. Terindeks Google penuh (sitemap, SSR,
 *     canonical, JSON-LD). Dilayani shell publik: Navbar, Footer, Preloader,
 *     WhatsApp mengapung, scroll progress.
 *  2. MEMBER  — ruang pelanggan berkode (Lounge VVIP & Dashboard Member).
 *     Tampil di shell konsol (gelap), noindex, Disallow robots.
 *  3. INTERNAL — Panel CEO, Portal Karyawan, Portal Client. Shell konsol,
 *     noindex, Disallow robots, dilindungi sesi cookie HttpOnly HMAC.
 */

/** Segmen ruang internal — dirender ConsoleShell, tidak pernah diindeks. */
export const CONSOLE_SEGMENTS = ["vvip", "member", "admin", "karyawan", "client"] as const;

export type ConsoleSegment = (typeof CONSOLE_SEGMENTS)[number];

export interface ConsolePortal {
  id: ConsoleSegment;
  href: string;
  label: string;
  enLabel: string;
  description: string;
  enDescription: string;
  /** Audiens portal — tampil sebagai sub-label pemisah zona. */
  audience: "member" | "internal";
}

/** Metadata portal untuk switcher di topbar konsol (urutan zona → peran). */
export const CONSOLE_PORTALS: ConsolePortal[] = [
  {
    id: "vvip",
    href: "#/vvip",
    label: "Lounge Oracle",
    enLabel: "Oracle Lounge",
    description: "Gerbang AI Member VVIP — masuk dengan kode akses utama.",
    enDescription: "VVIP member AI gate — enter with the primary access code.",
    audience: "member",
  },
  {
    id: "member",
    href: "#/member",
    label: "Member VVIP",
    enLabel: "VVIP Member",
    description: "Dashboard keanggotaan, kartu digital, dan tiket Anda.",
    enDescription: "Membership dashboard, digital card, and your tickets.",
    audience: "member",
  },
  {
    id: "admin",
    href: "#/admin",
    label: "Panel CEO",
    enLabel: "CEO Panel",
    description: "Pusat kendali perusahaan — khusus Senior Konsultan.",
    enDescription: "Company control center — Senior Consultant only.",
    audience: "internal",
  },
  {
    id: "karyawan",
    href: "#/karyawan",
    label: "Portal Karyawan",
    enLabel: "Employee Portal",
    description: "Ruang kerja tim internal GUNARA.",
    enDescription: "Workspace for the internal GUNARA team.",
    audience: "internal",
  },
  {
    id: "client",
    href: "#/client",
    label: "Portal Client",
    enLabel: "Client Portal",
    description: "Pantau proyek & dokumen perizinan Anda.",
    enDescription: "Track your projects & licensing documents.",
    audience: "internal",
  },
];

export function isConsoleSegment(seg: string | undefined): seg is ConsoleSegment {
  return seg !== undefined && (CONSOLE_SEGMENTS as readonly string[]).includes(seg);
}

export function consolePortal(seg: string): ConsolePortal | undefined {
  return CONSOLE_PORTALS.find((p) => p.id === seg);
}
