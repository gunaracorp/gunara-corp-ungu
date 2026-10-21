"use client";

/**
 * SiteApp — the whole multi-page GUNARA CORPORATION experience,
 * routed by hash so it runs identically on Next.js dev, Node hosting, or
 * plain shared hosting.
 */

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRoute, useScrollTopOnRoute } from "@/lib/router";
import {
  ROUTE_TITLES,
  SITE_NAME,
  councilTitle,
  industryTitle,
  insightTitle,
  layananTitle,
  perizinanTitle,
  serviceTitle,
} from "@/lib/seo";
import { slugify } from "@/data/extended-types";
import { COUNCILS, SERVICES } from "@/data/content";
import { catalogServiceBySlug } from "@/data/service-catalog";
import { INDUSTRIES } from "@/data/industries";
import { INSIGHTS } from "@/data/insights";
import { PERIZINAN } from "@/data/perizinan";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import Preloader from "@/components/landing/preloader";
import ScrollProgress from "@/components/landing/scroll-progress";
import WhatsAppFloat from "@/components/landing/whatsapp-float";
import HomePage from "@/components/site/pages/home";

/*
 * Code-splitting: hanya HomePage + NotFound yang eager — semua view lain
 * dipecah per-chunk (next/dynamic, SSR tetap jalan) supaya bundle awal
 * ringan: JS evaluation & TBT turun drastis di seluruh situs.
 * Data slug (PERIZINAN/INSIGHTS/...) tetap di sini karena lookup routing
 * harus sinkron untuk paritas SSR.
 */
const DynamicLoading = () => <div className="min-h-[60svh]" aria-hidden="true" />;
const dyn = (loader: () => Promise<{ default: React.ComponentType<any> }>) =>
  dynamic(loader, { loading: DynamicLoading });

const NotFoundPage = dyn(() => import("@/components/site/pages/not-found"));
const AboutPage = dyn(() => import("@/components/site/pages/about"));
const ServicesPage = dyn(() => import("@/components/site/pages/services"));
const ServiceDetailPage = dyn(() => import("@/components/site/pages/service-detail"));
const LayananPage = dyn(() => import("@/components/site/pages/layanan"));
const LayananDetailPage = dyn(() => import("@/components/site/pages/layanan-detail"));
const CouncilsPage = dyn(() => import("@/components/site/pages/councils"));
const CouncilDetailPage = dyn(() => import("@/components/site/pages/council-detail"));
const IndustriesPage = dyn(() => import("@/components/site/pages/industries"));
const IndustryDetailPage = dyn(() => import("@/components/site/pages/industry-detail"));
const InsightsPage = dyn(() => import("@/components/site/pages/insights"));
const InsightDetailPage = dyn(() => import("@/components/site/pages/insight-detail"));
const PerizinanPage = dyn(() => import("@/components/site/pages/perizinan"));
const PerizinanDetailPage = dyn(() => import("@/components/site/pages/perizinan-detail"));
const CareersPage = dyn(() => import("@/components/site/pages/careers"));
const MethodPage = dyn(() => import("@/components/site/pages/method"));
const ResultsPage = dyn(() => import("@/components/site/pages/results"));
const ContactPage = dyn(() => import("@/components/site/pages/contact"));
const LegalPage = dyn(() => import("@/components/site/pages/legal"));
const FaqPage = dyn(() => import("@/components/site/pages/faq"));
const LeadershipPage = dyn(() => import("@/components/site/pages/leadership"));
const OfficesPage = dyn(() => import("@/components/site/pages/offices"));
const NewsroomPage = dyn(() => import("@/components/site/pages/newsroom"));
const ResourcesPage = dyn(() => import("@/components/site/pages/resources"));
const ResponsibilityPage = dyn(() => import("@/components/site/pages/responsibility"));
const SitemapPage = dyn(() => import("@/components/site/pages/sitemap"));
const VvipPage = dyn(() => import("@/components/site/pages/vvip"));
const AdminPage = dyn(() => import("@/components/site/pages/admin"));
const MemberPage = dyn(() => import("@/components/site/pages/member"));
const KaryawanPage = dyn(() => import("@/components/site/pages/karyawan"));
const ClientPage = dyn(() => import("@/components/site/pages/client"));
const UnduhPage = dyn(() => import("@/components/site/pages/unduh"));
const KreditPage = dyn(() => import("@/components/site/pages/kredit"));

const BASE_TITLE = "GUNARA CORPORATION — Konsultasi & Perizinan Terlengkap di Dunia";

/** Judul rute statis — satu sumber dari lib/seo.ts agar paritas dengan SSR. */
const TITLES: Record<string, string> = { ...ROUTE_TITLES, "/": BASE_TITLE };

export default function SiteApp({ initialPath }: { initialPath?: string }) {
  const route = useRoute(initialPath);
  useScrollTopOnRoute(route.target ?? "");

  const [seg1, seg2] = route.segments;
  let view: React.ReactNode;
  let title: string = TITLES[route.path] ?? BASE_TITLE;

  if (!route.target || seg1 === undefined) {
    view = <HomePage />;
  } else {
    switch (seg1) {
      case "about":
        view = <AboutPage />;
        break;
      case "services": {
        const service = seg2 ? SERVICES.find((s) => s.num === seg2) : undefined;
        view = service ? (
          <ServiceDetailPage num={service.num} />
        ) : seg2 ? (
          <NotFoundPage />
        ) : (
          <ServicesPage />
        );
        if (service) title = serviceTitle(service);
        break;
      }
      case "perizinan": {
        const item = seg2 ? PERIZINAN.find((p) => p.slug === seg2) : undefined;
        view = item ? (
          <PerizinanDetailPage slug={item.slug} />
        ) : seg2 ? (
          <NotFoundPage />
        ) : (
          <PerizinanPage initialCategory={route.query.get("kategori")} />
        );
        if (item) title = perizinanTitle(item);
        break;
      }
      case "layanan": {
        const service = seg2 ? catalogServiceBySlug(seg2) : undefined;
        view = service ? (
          <LayananDetailPage slug={service.slug} />
        ) : seg2 ? (
          <NotFoundPage />
        ) : (
          <LayananPage initialCategory={route.query.get("kategori")} />
        );
        if (service) title = layananTitle(service);
        break;
      }
      case "councils": {
        const council = seg2
          ? COUNCILS.find((c) => slugify(c.name) === seg2)
          : undefined;
        view = council ? (
          <CouncilDetailPage name={council.name} />
        ) : seg2 ? (
          <NotFoundPage />
        ) : (
          <CouncilsPage initialFilter={route.query.get("filter")} />
        );
        if (council) title = councilTitle(council);
        break;
      }
      case "industries": {
        const industry = seg2
          ? INDUSTRIES.find((i) => i.slug === seg2)
          : undefined;
        view = industry ? (
          <IndustryDetailPage slug={industry.slug} />
        ) : seg2 ? (
          <NotFoundPage />
        ) : (
          <IndustriesPage />
        );
        if (industry) title = industryTitle(industry);
        break;
      }
      case "insights": {
        const insight = seg2
          ? INSIGHTS.find((i) => i.slug === seg2)
          : undefined;
        view = insight ? (
          <InsightDetailPage slug={insight.slug} />
        ) : seg2 ? (
          <NotFoundPage />
        ) : (
          <InsightsPage />
        );
        if (insight) title = insightTitle(insight);
        break;
      }
      case "careers":
        view = <CareersPage />;
        break;
      case "method":
        view = <MethodPage />;
        break;
      case "results":
        view = <ResultsPage />;
        break;
      case "contact":
        view = <ContactPage />;
        break;
      case "faq":
        view = <FaqPage />;
        break;
      case "leadership":
        view = <LeadershipPage />;
        break;
      case "offices":
        view = <OfficesPage />;
        break;
      case "newsroom":
        view = <NewsroomPage />;
        break;
      case "resources":
        view = <ResourcesPage />;
        break;
      case "responsibility":
        view = <ResponsibilityPage />;
        break;
      case "sitemap":
        view = <SitemapPage />;
        break;
      case "privacy":
        view = <LegalPage docId="privacy" />;
        break;
      case "terms":
        view = <LegalPage docId="terms" />;
        break;
      case "cookies":
        view = <LegalPage docId="cookies" />;
        break;
      case "vvip":
        view = <VvipPage />;
        title = `Member Lounge — ${SITE_NAME}`;
        break;
      case "member":
        view = <MemberPage />;
        title = `Dashboard Member VVIP — ${SITE_NAME}`;
        break;
      case "admin":
        view = <AdminPage />;
        title = `Panel CEO — ${SITE_NAME}`;
        break;
      case "karyawan":
        view = <KaryawanPage />;
        title = `Portal Karyawan — ${SITE_NAME}`;
        break;
      case "client":
        view = <ClientPage />;
        title = `Portal Client — ${SITE_NAME}`;
        break;
      case "unduh":
        view = <UnduhPage />;
        title = `Pusat Unduhan — ${SITE_NAME}`;
        break;
      case "kredit":
        view = <KreditPage />;
        title = `Kredit & Kepemilikan — ${SITE_NAME}`;
        break;
      default: {
        view = <NotFoundPage />;
        title = `Halaman Tidak Ditemukan — ${SITE_NAME}`;
      }
    }
  }

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-violet-600 focus:px-5 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Langsung ke konten
      </a>
      <Preloader />
      <ScrollProgress />
      <Navbar />
      <main id="main" key={route.target ?? "/"} className="page-enter flex-1">
        {view}
      </main>
      <Footer />
      {/* Oracle kini eksklusif Member VVIP — hanya di #/vvip, bukan di situs publik. */}
      <WhatsAppFloat />
    </div>
  );
}
