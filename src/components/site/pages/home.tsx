"use client";

import BenchmarkMarquee from "@/components/landing/marquee";
import Hero from "@/components/landing/hero";
import Stats from "@/components/landing/stats";
import About from "@/components/landing/about";
import Services from "@/components/landing/services";
import PerizinanSection from "@/components/landing/perizinan-section";
import Agencies from "@/components/landing/agencies";
import Councils from "@/components/landing/councils";
import Methodology from "@/components/landing/methodology";
import Comparison from "@/components/landing/comparison";
import Results from "@/components/landing/results";
import Accreditation from "@/components/landing/accreditation";
import Testimonials from "@/components/landing/testimonials";
import GlobalReach from "@/components/landing/global";
import { CTABand } from "@/components/site/ui";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BenchmarkMarquee />
      <Stats />
      <About />
      <Services />
      <PerizinanSection />
      <Agencies />
      <Councils />
      <Methodology />
      <Comparison />
      <Results />
      <Accreditation />
      <Testimonials />
      <GlobalReach />
      <CTABand />
    </>
  );
}
