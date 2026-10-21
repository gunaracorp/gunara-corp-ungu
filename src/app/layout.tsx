import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@/components/seo/analytics";
import { JsonLd } from "@/components/seo/json-ld";
import {
  localBusinessLd,
  organizationLd,
  personLd,
  websiteLd,
} from "@/lib/seo-ld";
import {
  BASE_DESCRIPTION,
  BASE_TITLE,
  SITE_LEGAL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import { OWNER } from "@/data/brand";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

/** Kode verifikasi Search Console dst. — set via env, kosong = meta dilewati. */
const vGoogle = process.env.GOOGLE_SITE_VERIFICATION || undefined;
const vBing = process.env.BING_SITE_VERIFICATION || undefined;
const vYandex = process.env.YANDEX_SITE_VERIFICATION || undefined;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BASE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: BASE_DESCRIPTION,
  applicationName: SITE_LEGAL,
  category: "Business Consulting",
  creator: `${OWNER.name} (${OWNER.fullName} — ${OWNER.alias})`,
  publisher: `${SITE_LEGAL} · ${OWNER.entities[0].name} · ${OWNER.entities[1].name}`,
  authors: [
    { name: OWNER.name, url: `${SITE_URL}/kredit` },
    { name: OWNER.fullName, url: `${SITE_URL}/kredit` },
    { name: SITE_LEGAL, url: SITE_URL },
  ],
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "gunara consultan",
    "gunara corporation",
    "konsultan perizinan gunara",
    "konsultan perizinan",
    "jasa pengurusan izin usaha",
    "gerbang perizinan",
    "pendirian PT",
    "pendirian PMA",
    "pendirian CV",
    "kantor perwakilan asing",
    "NIB OSS RBA",
    "izin edar BPOM",
    "sertifikasi halal BPJPH",
    "SNI",
    "KITAS pekerja asing",
    "RPTKA",
    "PSE Komdigi",
    "izin OJK",
    "pendaftaran merek",
    "paten desain hak cipta",
    "sertifikasi ISO",
    "konsultan bisnis Indonesia",
    "konsultan Tasikmalaya",
    "konsultan Jakarta",
    "konsultan perizinan terpercaya",
    "perusahaan 1524 izin",
    "senior konsultan Gugun Gunara",
    "Gugun Gunara",
    "Muhammad Lutfi Azmi",
    "prabudanling",
    "santri angon",
    "PT Top Konsultan Internasional",
    "topkonsultan.web.id",
    "PT Digital Bisnis Manajemen",
    "digiman.id",
    "master polymath",
    "management consulting Indonesia",
    "market entry Indonesia",
    "company registration Indonesia",
    "business license Indonesia",
  ],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: BASE_TITLE,
    description: BASE_DESCRIPTION,
    url: "/",
    siteName: SITE_LEGAL,
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: BASE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: BASE_TITLE,
    description: BASE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: vGoogle,
    yandex: vYandex,
    other: vBing ? { "msvalidate.01": vBing } : undefined,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon.svg"],
  },
  other: {
    "geo.region": "ID-JB",
    "geo.placename": "Tasikmalaya, Jakarta",
    "profile:username": OWNER.alias,
    "og:profile:username": OWNER.alias,
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafc",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        {/* Verifikasi identitas lintas-kanal — React 19 memindahkan <link> ini ke <head> */}
        {OWNER.socials.map((s) => (
          <link key={s.url} rel="me" href={s.url} />
        ))}
        <link rel="me" href={OWNER.entities[0].url} />
        <link rel="me" href={OWNER.entities[1].url} />
        <JsonLd
          data={[organizationLd(), personLd(), websiteLd(), ...localBusinessLd()]}
        />
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
