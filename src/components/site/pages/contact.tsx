"use client";

import { ArrowRight } from "lucide-react";
import { Link, useRoute } from "@/lib/router";
import ContactSection from "@/components/landing/contact";
import OfficeClocks from "@/components/site/office-clocks";
import { CTABand } from "@/components/site/ui";

export default function ContactPage() {
  const route = useRoute();
  const role = route.query.get("role");

  return (
    <>
      {/* Breadcrumb rail */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 pt-32 text-xs sm:px-6 lg:px-8"
      >
        <span className="flex items-center gap-1.5">
          <Link to="/" className="font-medium text-slate-900 transition-colors hover:text-violet-600">
            Beranda
          </Link>
          <span className="text-slate-400" aria-hidden="true">
            /
          </span>
          <span className="font-semibold text-violet-700">Konsultasi dengan Dewan</span>
        </span>
        <Link
          to="/offices"
          className="hidden items-center gap-1.5 font-semibold text-violet-700 transition-colors hover:text-violet-600 sm:inline-flex"
        >
          4 kantor resmi &amp; arah
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </nav>

      <div className="pt-4">
        <ContactSection initialRole={role} />
      </div>

      <OfficeClocks />
      <CTABand />
    </>
  );
}
