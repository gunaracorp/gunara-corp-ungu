import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { JsonLd } from "@/components/seo/json-ld";
import {
  localBusinessLd,
  organizationLd,
  websiteLd,
} from "@/lib/seo-ld";
import {
  BASE_DESCRIPTION,
  BASE_TITLE,
  SITE_LEGAL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

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
  creator: SITE_LEGAL,
  publisher: SITE_LEGAL,
  authors: [{ name: SITE_LEGAL, url: SITE_URL }],
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
    "management consulting Indonesia",
    "market entry Indonesia",
    "company registration Indonesia",
    "business license Indonesia",
  ],
  alternates: {
    canonical: "/",
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
        <JsonLd
          data={[organizationLd(), websiteLd(), ...localBusinessLd()]}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
