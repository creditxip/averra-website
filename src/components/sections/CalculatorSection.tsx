import { ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/ui/section-shell";
import { Estimator } from "@/components/calculator/Estimator";
import { Button } from "@/components/ui/button";
import { useDemoRequest } from "@/context/DemoRequestContext";

export function CalculatorSection() {
  const { openDemo } = useDemoRequest();
  return (
    <SectionShell
      id="calculator"
      eyebrow="Operational estimate"
      title="What Could Your School Save With a More Connected Technology Ecosystem?"
      tone="light"
    >
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Enter the expenses and the repetitive communication time your school already carries. Every
        result updates as you adjust the figures and the assumptions.
      </p>
      <Estimator />
      <div className="mt-16 max-w-3xl">
        <h3 className="text-display text-3xl sm:text-5xl">
          Discover What Your School Could Accomplish With Averra.
        </h3>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Bring these figures to a conversation about a proposal shaped around your school.
        </p>
        <Button variant="hero" size="xl" className="mt-6" onClick={() => openDemo()}>
          Schedule a Personalized Demo
          <ArrowRight aria-hidden />
        </Button>
      </div>
    </SectionShell>
  );
}
