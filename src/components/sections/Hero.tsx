import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoRequest } from "@/context/DemoRequestContext";
import { HeroInterfaces } from "./HeroInterfaces";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { openDemo } = useDemoRequest();
  const reduce = useReducedMotion();
  const fade = (d: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease } };

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-32">
      <div className="bg-hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
        <div className="max-w-xl">
          <motion.p {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
            <Sparkles className="size-3.5 text-lavender" aria-hidden />
            The Modern School Experience, Powered by AI.
          </motion.p>
          <motion.h1 {...fade(0.08)} id="hero-title" className="text-display mt-6 text-[3.25rem] sm:text-7xl lg:text-[5.25rem]">
            Your School.
            <br />
            <span className="text-gradient">Reimagined.</span>
          </motion.h1>
          <motion.p {...fade(0.16)} className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            An intelligent ecosystem for the entire school community. Empowering students,
            simplifying teaching, connecting families, and modernizing school operations.
          </motion.p>
          <motion.div {...fade(0.24)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button variant="hero" size="xl" onClick={openDemo}>
              Schedule a Personalized Demo
              <ArrowRight aria-hidden />
            </Button>
            <Button variant="subtle" size="xl" asChild>
              <a href="#platform">Explore the Platform</a>
            </Button>
          </motion.div>
        </div>
        <motion.div {...(reduce ? {} : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: 0.2, ease } })}>
          <HeroInterfaces />
          <p className="mt-6 text-center text-xs text-muted-foreground lg:mt-10">
            Product interfaces shown with simulated demonstration data.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
