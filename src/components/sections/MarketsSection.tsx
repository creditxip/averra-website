import { SectionShell } from "@/components/ui/section-shell";
import { Markets } from "@/components/markets/Markets";

export function MarketsSection() {
  return (
    <SectionShell
      id="markets"
      eyebrow="Independent schools"
      title="Designed for the Schools Shaping Tomorrow."
      tone="dark"
    >
      <p className="mt-5 max-w-2xl text-lg text-on-dark-muted">
        AVERRA is designed for private and independent schools in these regions, and for
        institutions anywhere in the country.
      </p>
      <Markets />
    </SectionShell>
  );
}
