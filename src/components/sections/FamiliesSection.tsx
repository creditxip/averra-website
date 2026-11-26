import { SectionShell } from "@/components/ui/section-shell";
import { FamilyShowcase } from "@/components/families/FamilyShowcase";

export function FamiliesSection() {
  return (
    <SectionShell id="families" eyebrow="For families" title="Every Parent. More Connected." tone="dark">
      <p className="mt-5 max-w-2xl text-lg text-on-dark-muted">
        A dedicated parent app that keeps families informed about what matters, with only the information your school authorizes.
      </p>
      <FamilyShowcase />
    </SectionShell>
  );
}
