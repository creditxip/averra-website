import { SectionShell } from "@/components/ui/section-shell";
import { LmsComparison } from "@/components/compare/LmsComparison";

export function CompareSection() {
  return (
    <SectionShell
      id="compare"
      eyebrow="One ecosystem"
      title="Your School's Technology Should Work Together."
      tone="dark"
    >
      <p className="mt-5 max-w-2xl text-lg text-on-dark-muted">
        Choose a part of the school day. The same work appears as a disconnected stack, and as one
        Averra experience with a single login and the school's own identity.
      </p>
      <LmsComparison />
    </SectionShell>
  );
}
