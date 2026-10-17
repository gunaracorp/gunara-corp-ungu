import Script from "next/script";

/**
 * Google Analytics 4 — hanya aktif bila NEXT_PUBLIC_GA_ID diisi di env.
 * ----------------------------------------------------------------------------
 * Tanpa env, komponen ini merender TIDAK SAMA SEKALI (nol overhead, nol
 * cookie) — penting agar Lighthouse Best Practices tetap 100 saat analytics
 * belum dipasang.
 *
 * Setup: buat property GA4 di analytics.google.com → salin Measurement ID
 * (format G-XXXXXXXXXX) → set NEXT_PUBLIC_GA_ID di Vercel → redeploy.
 */

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId || !/^G-[A-Z0-9]{6,12}$/.test(gaId)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
