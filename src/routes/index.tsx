import { createFileRoute } from "@tanstack/react-router";
import { DemoRequestProvider } from "@/context/DemoRequestContext";
import { BackgroundOrbs } from "@/components/orbs/BackgroundOrbs";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { PlatformSection } from "@/components/sections/PlatformSection";
import { TeachersSection } from "@/components/sections/TeachersSection";
import { FamiliesSection } from "@/components/sections/FamiliesSection";
import { AiDemosSection } from "@/components/sections/AiDemosSection";
import { CompareSection } from "@/components/sections/CompareSection";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { MarketsSection } from "@/components/sections/MarketsSection";
import { AppsSection } from "@/components/sections/AppsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { GetStartedSection } from "@/components/sections/GetStartedSection";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AVERRA — The Modern School Experience, Powered by AI" },
      { name: "description", content: "AVERRA is the AI-powered platform connecting students, teachers, families and administrators for private schools, colleges and universities." },
      { property: "og:title", content: "AVERRA — The Modern School Experience, Powered by AI" },
      { property: "og:description", content: "One branded, AI-powered platform connecting students, teachers, families and administrators at private schools, colleges and universities." },
      { name: "twitter:title", content: "AVERRA — The Modern School Experience, Powered by AI" },
      { name: "twitter:description", content: "One branded, AI-powered platform for the whole school community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <DemoRequestProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="relative z-10">
        <BackgroundOrbs />
        <Hero />
        <PlatformSection />
        <TeachersSection />
        <FamiliesSection />
        <AiDemosSection />
        <CompareSection />
        <CalculatorSection />
        <MarketsSection />
        <AppsSection />
        <PricingSection />
        <TrustSection />
        <GetStartedSection />
      </main>
      <div className="relative z-10"><Footer /></div>
    </DemoRequestProvider>
  );
}
