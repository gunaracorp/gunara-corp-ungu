import SiteApp from "@/components/site/app";

/**
 * 404 tingkat aplikasi (URL di luar daftar rute publik).
 * ----------------------------------------------------------------------------
 * - Status HTTP tetap 404 → Google otomatis mengecualikan dari indeks;
 *   meta robots noindex dirender sebagai pengaman ganda (React 19 hoisting).
 * - SiteApp dipasang dengan initialPath "/404" (segmen tak dikenal) sehingga
 *   server & client merender tampilan NotFound yang sama (hydration aman),
 *   lengkap dengan navbar/footer, dan semua tautan SPA langsung berfungsi.
 *
 * Catatan: JANGAN mengekspor `metadata` dari file ini — di Next 16 hal itu
 * memicu NoFallbackError yang menjatuhkan server standalone saat melayani 404.
 */

export default function AppNotFound() {
  return (
    <>
      <meta name="robots" content="noindex, follow" />
      <SiteApp initialPath="/404" />
    </>
  );
}
