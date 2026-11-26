import { Check, Minus } from "lucide-react";
import { SectionShell } from "@/components/ui/section-shell";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useDemoRequest } from "@/context/DemoRequestContext";
import { PLANS, TABLE } from "@/components/pricing/plans";
import { cn } from "@/lib/utils";

const FAQ: [string, string][] = [
  ["What's included in implementation?", "Implementation covers discovery, platform configuration (roles, permissions, modules and content), branding, and launch preparation for your package. Plus and Institutional also include initial staff training; scope is confirmed in your proposal."],
  ["Is the subscription billed monthly or annually?", "Billing terms are agreed in your proposal."],
  ["How is AI usage handled?", "AI features include usage allowances appropriate to your plan. AVERRA does not offer unlimited AI usage; we'll size allowances with you based on your community and expected use."],
  ["Can we start with Essential and upgrade?", "Yes. Schools can start with Essential and move to Plus or Institutional later. Any additional implementation work for new modules is scoped at the time of upgrade."],
];

export function PricingSection() {
  const { openDemo } = useDemoRequest();
  return (
    <SectionShell id="pricing" eyebrow="Pricing" title="Transparent Starting Prices." tone="dark">
      <p className="mt-5 max-w-2xl text-lg text-on-dark/70">A one-time implementation to set up your school, plus a monthly subscription. Final pricing is tailored to your institution.</p>

      <div className="mt-16 grid items-start gap-6 lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08} className={cn("relative flex flex-col rounded-3xl border bg-on-dark/[0.04] p-7 backdrop-blur", p.highlight ? "border-lavender shadow-[0_0_80px_-20px_var(--lavender)] lg:-translate-y-4" : "border-on-dark/10")}>
            {p.highlight && <span className="absolute -top-3 left-7 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-navy">Most comprehensive for most schools</span>}
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-mint">AVERRA {p.name}</h3>
            <div className="mt-6 space-y-3">
              <PriceBlock badge="One-time" label="Implementation" prefix="starting at" value={p.impl} />
              <PriceBlock badge="Recurring" label="Monthly subscription" prefix={p.monthly.startsWith("$") ? "starting at" : ""} value={p.monthly} />
            </div>
            <ul className="mt-7 space-y-2.5 text-sm">
              {p.features.map((f) => <li key={f} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden />{f}</li>)}
            </ul>
            {p.note && <p className="mt-5 text-xs text-on-dark/60">{p.note}</p>}
            <Button variant={p.highlight ? "hero" : "outline"} size="xl" className={cn("mt-8 w-full", !p.highlight && "border-on-dark/20 bg-transparent text-on-dark hover:bg-on-dark/10 hover:text-on-dark")} onClick={() => openDemo(`AVERRA ${p.name}`)}>
              {p.cta}
            </Button>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 space-y-1 text-center text-sm text-on-dark/60">
        <p>Final costs depend on enrollment, AI usage, integrations, customization, support requirements, and implementation scope.</p>
        <p>AI features include usage allowances appropriate to your plan; AVERRA does not offer unlimited AI usage.</p>
      </div>

      <Reveal className="mt-20 overflow-x-auto rounded-2xl border border-on-dark/10">
        <table className="w-full min-w-[560px] text-sm">
          <caption className="sr-only">Feature comparison by package</caption>
          <thead><tr className="border-b border-on-dark/10 text-left">
            <th scope="col" className="p-4 font-medium text-on-dark/60">Feature</th>
            {PLANS.map((p) => <th key={p.name} scope="col" className={cn("p-4 text-center font-semibold", p.highlight && "text-lavender")}>{p.name}</th>)}
          </tr></thead>
          <tbody>
            {TABLE.map(([f, v]) => (
              <tr key={f} className="border-b border-on-dark/5 last:border-0">
                <th scope="row" className="p-4 text-left font-normal">{f}</th>
                {v.map((x, i) => (
                  <td key={i} className="p-4 text-center">
                    {x === true ? <Check className="mx-auto size-4 text-mint" aria-label="Included" /> : x === false ? <Minus className="mx-auto size-4 text-on-dark/30" aria-label="Not included" /> : <span className="text-xs text-on-dark/70">{x}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Reveal className="mx-auto mt-20 max-w-3xl">
        <h3 className="text-2xl font-semibold tracking-tight">Pricing questions</h3>
        <Accordion type="single" collapsible className="mt-6">
          {FAQ.map(([q, a]) => (
            <AccordionItem key={q} value={q} className="border-on-dark/10">
              <AccordionTrigger className="text-left text-base hover:no-underline">{q}</AccordionTrigger>
              <AccordionContent className="text-on-dark/70">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </SectionShell>
  );
}

function PriceBlock({ badge, label, prefix, value }: { badge: string; label: string; prefix: string; value: string }) {
  return (
    <div className="rounded-2xl border border-on-dark/10 bg-navy/60 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-on-dark/60">{label}</span>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", badge === "One-time" ? "bg-lavender/20 text-lavender" : "bg-mint/15 text-mint")}>{badge}</span>
      </div>
      <p className="mt-2"><span className="text-xs text-on-dark/60">{prefix} </span><span className="text-3xl font-semibold tracking-tight">{value}</span></p>
    </div>
  );
}
