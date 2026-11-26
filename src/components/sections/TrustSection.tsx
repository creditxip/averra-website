import { BadgeCheck, Database, Eye, KeyRound, Lock, Scale, ShieldCheck, Sparkles, UserCheck, Users } from "lucide-react";
import { SectionShell } from "@/components/ui/section-shell";
import { Reveal } from "@/components/ui/reveal";

const CARDS = [
  { icon: Users, t: "Role-based access", d: "Students, families, teachers and administrators each see only what their role permits." },
  { icon: KeyRound, t: "Secure authentication", d: "Designed for SSO-ready sign-in, encrypted connections and session controls." },
  { icon: UserCheck, t: "Parent permissions", d: "Schools control what families can view, per student and per data type." },
  { icon: Database, t: "School-controlled information", d: "The school decides what content and data the AI can use, and remains in control of its data." },
  { icon: Lock, t: "Student data protections", d: "Data minimization and access logging. No selling of student data, and no use of student data for advertising." },
  { icon: Sparkles, t: "Responsible AI", d: "Answers grounded in school-approved sources, clear labeling of AI-generated content, and age-appropriate guardrails." },
  { icon: Eye, t: "Human oversight", d: "Teachers and administrators review AI drafts, and questions escalate to staff when the AI lacks approved information." },
  { icon: ShieldCheck, t: "Privacy-conscious design", d: "Privacy by default, with retention periods your school can configure." },
];

const LAWS = [
  ["FERPA", "The Family Educational Rights and Privacy Act protects the privacy of student education records at schools that receive U.S. Department of Education funding. Averra is designed to support schools in meeting their FERPA obligations, such as acting under the school's direct control when handling education records."],
  ["COPPA", "The Children's Online Privacy Protection Act applies to online services collecting personal information from children under 13. Where applicable, Averra is designed to operate under school authorization and to support the school's responsibilities."],
  ["State student privacy laws", "Many states have student data privacy laws (for example, California's SOPIPA and New York Education Law §2-d). We review applicable state requirements with each school during implementation and can support data privacy agreements."],
];

export function TrustSection() {
  return (
    <SectionShell id="trust" eyebrow="Trust & responsible AI" title="Built Around the Responsibility of Educating Students." tone="light">
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">Every part of Averra is designed so schools stay in control of who sees what, and what the AI is allowed to know.</p>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ icon: I, t, d }, i) => (
          <Reveal key={t} delay={(i % 4) * 0.06} className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-float">
            <div className="grid size-10 place-items-center rounded-xl bg-lavender-soft text-lavender"><I className="size-5" aria-hidden /></div>
            <h3 className="mt-5 font-semibold tracking-tight">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 rounded-3xl border border-border bg-card/80 p-6 shadow-float backdrop-blur sm:p-10">
        <div className="flex items-center gap-3"><Scale className="size-5 text-lavender" aria-hidden /><h3 className="text-xl font-semibold tracking-tight">Regulatory awareness</h3></div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {LAWS.map(([t, d]) => (
            <div key={t}>
              <p className="flex items-center gap-2 font-semibold"><BadgeCheck className="size-4 text-mint" aria-hidden />{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">Averra does not claim third-party certifications it has not obtained. Each school remains responsible for its own legal compliance; consult your counsel.</p>
      </Reveal>
    </SectionShell>
  );
}
