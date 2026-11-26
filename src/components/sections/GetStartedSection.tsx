import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { useDemoRequest } from "@/context/DemoRequestContext";

export function GetStartedSection() {
  const { openDemo } = useDemoRequest();
  const reduce = useReducedMotion();
  return (
    <section id="get-started" aria-labelledby="get-started-title" data-tone="dark" className="overflow-hidden bg-navy py-32 text-on-dark sm:py-44"
      style={{ backgroundImage: "radial-gradient(60% 55% at 30% 40%, color-mix(in oklab, var(--lavender) 32%, transparent), transparent 70%), radial-gradient(50% 50% at 75% 70%, color-mix(in oklab, var(--mint) 22%, transparent), transparent 70%), linear-gradient(color-mix(in oklab, var(--on-dark) 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--on-dark) 5%, transparent) 1px, transparent 1px)", backgroundSize: "auto, auto, 56px 56px, 56px 56px" }}>
      <Reveal className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="mb-5 text-sm font-medium text-mint">Get started</p>
        <h2 id="get-started-title" className="text-display text-4xl sm:text-6xl md:text-7xl">Give Your School the Digital Experience It Deserves.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-on-dark/70">Discover how Averra can bring your students, families, educators, and administrators together.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="hero" size="xl" onClick={openDemo}>Schedule a Personalized Demo<ArrowRight aria-hidden /></Button>
          <Button variant="outline" size="xl" className="border-on-dark/25 bg-transparent text-on-dark hover:bg-on-dark/10 hover:text-on-dark" onClick={() => document.getElementById("platform")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })}>Explore Averra</Button>
        </div>
      </Reveal>
    </section>
  );
}
