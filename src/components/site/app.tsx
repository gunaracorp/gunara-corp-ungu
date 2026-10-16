"use client";

/**
 * SiteApp — the whole multi-page PT TOP KONSULTAN INTERNASIONAL experience,
 * routed by hash so it runs identically on Next.js dev, Node hosting, or
 * plain shared hosting.
 */

import { useEffect } from "react";
import { useRoute, useScrollTopOnRoute } from "@/lib/router";
import {
  ROUTE_TITLES,
  SITE_NAME,
  councilTitle,
  industryTitle,
  insightTitle,
  perizinanTitle,
  serviceTitle,
} from "@/lib/seo";
import { slugify } from "@/data/extended-types";
import { COUNCILS, SERVICES } from "@/data/content";
import { COUNCIL_PROFILES } from "@/data/council-profiles";
import { INDUSTRIES } from "@/data/industries";
import { INSIGHTS } from "@/data/insights";
import { PERIZINAN } from "@/data/perizinan";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import Preloader from "@/components/landing/preloader";
import ScrollProgress from "@/components/landing/scroll-progress";
import WhatsAppFloat from "@/components/landing/whatsapp-float";
import NotFoundPage from "@/components/site/pages/not-found";
import HomePage from "@/components/site/pages/home";
import AboutPage from "@/components/site/pages/about";
import ServicesPage from "@/components/site/pages/services";
import ServiceDetailPage from "@/components/site/pages/service-detail";
import CouncilsPage from "@/components/site/pages/councils";
import CouncilDetailPage from "@/components/site/pages/council-detail";
import IndustriesPage from "@/components/site/pages/industries";
import IndustryDetailPage from "@/components/site/pages/industry-detail";
import InsightsPage from "@/components/site/pages/insights";
import InsightDetailPage from "@/components/site/pages/insight-detail";
import PerizinanPage from "@/components/site/pages/perizinan";
import PerizinanDetailPage from "@/components/site/pages/perizinan-detail";
import CareersPage from "@/components/site/pages/careers";
import MethodPage from "@/components/site/pages/method";
import ResultsPage from "@/components/site/pages/results";
import ContactPage from "@/components/site/pages/contact";
import LegalPage from "@/components/site/pages/legal";
import FaqPage from "@/components/site/pages/faq";
import LeadershipPage from "@/components/site/pages/leadership";
import OfficesPage from "@/components/site/pages/offices";
import NewsroomPage from "@/components/site/pages/newsroom";
import ResourcesPage from "@/components/site/pages/resources";
import ResponsibilityPage from "@/components/site/pages/responsibility";
import SitemapPage from "@/components/site/pages/sitemap";
import VvipPage from "@/components/site/pages/vvip";
import AdminPage from "@/components/site/pages/admin";
import MemberPage from "@/components/site/pages/member";

const BASE_TITLE = "PT TOP KONSULTAN INTERNASIONAL — Konsultasi & Perizinan Terlengkap di Dunia";

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
      default: {
        const profile = COUNCIL_PROFILES[0];
        void profile;
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
