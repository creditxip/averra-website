import { useState } from "react";
import { BookCheck, GraduationCap, LayoutDashboard, Presentation, UserCog, Users } from "lucide-react";
import { SectionShell } from "@/components/ui/section-shell";
import { Reveal } from "@/components/ui/reveal";
import { SchoolAssistantPanel } from "@/components/ai/SchoolAssistantPanel";
import { StudyCompanionPanel } from "@/components/ai/StudyCompanionPanel";
import { StudentPrepDemo } from "@/components/ai/StudentPrepDemo";
import { TeacherAiDemo } from "@/components/ai/TeacherAiDemo";
import { AdminAiDemo } from "@/components/ai/AdminAiDemo";
import { cn } from "@/lib/utils";

const PRINCIPLES = [
  { icon: BookCheck, title: "Grounded in approved information", body: "The assistant answers from documents your school publishes and approves — and says so when it doesn't know." },
  { icon: UserCog, title: "Configurable by role", body: "Students, families and staff each see answers and tools appropriate to their role." },
  { icon: Users, title: "Human oversight built in", body: "Unanswered questions route to staff, and AI drafts are reviewed before anything is shared." },
];
const TABS = [
  { id: "student", label: "Student", icon: GraduationCap, app: "AVERRA STUDY" },
  { id: "teacher", label: "Teacher", icon: Presentation, app: "AVERRA TEACHER · AI assist" },
  { id: "admin", label: "Administrator", icon: LayoutDashboard, app: "AVERRA ADMIN · AI assist" },
] as const;

export function AiDemosSection() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("student");
  const cur = TABS.find((t) => t.id === tab)!;
  return (
    <SectionShell id="ai" eyebrow="AVERRA AI" title="Intelligence That Supports Every Student." tone="light">
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">One AI layer, shaped for each role — helping students learn, teachers prepare, and administrators communicate.</p>

      <Reveal className="mt-12">
        <div role="tablist" aria-label="AI demos by role" className="inline-flex rounded-full border border-hairline bg-card p-1 shadow-soft">
          {TABS.map((t) => (
            <button key={t.id} role="tab" id={`ai-tab-${t.id}`} aria-controls="ai-panel" aria-selected={tab === t.id} type="button" onClick={() => setTab(t.id)}
              className={cn("inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition", tab === t.id ? "bg-navy text-on-dark" : "text-muted-foreground hover:text-foreground")}>
              <t.icon className="size-4" aria-hidden />{t.label}
            </button>
          ))}
        </div>
        <div id="ai-panel" role="tabpanel" aria-labelledby={`ai-tab-${tab}`} className="mt-6">
          <div className={cn("grid gap-6", tab === "student" && "xl:grid-cols-[1.2fr_1fr]")}>
            <div className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-float">
              <header className="flex flex-wrap items-center gap-3 border-b border-hairline px-5 py-3.5">
                <cur.icon className="size-4 text-lavender" aria-hidden /><p className="text-sm font-semibold">{cur.app}</p>
                <span className="ml-auto rounded-full bg-mint-soft px-2.5 py-0.5 text-[11px] font-medium text-navy">Simulated demo — sample data</span>
              </header>
              {tab === "student" ? <StudentPrepDemo /> : tab === "teacher" ? <TeacherAiDemo /> : <AdminAiDemo />}
            </div>
            {tab === "student" && <StudyCompanionPanel />}
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <h3 className="text-2xl font-semibold tracking-tight">Approved knowledge sources, controlled by your school</h3>
        <p className="mt-2 max-w-2xl text-muted-foreground">Turn a source off and the assistant stops answering from it.</p>
        <div className="mt-6"><SchoolAssistantPanel /></div>
      </Reveal>
      <p className="mt-6 text-sm text-muted-foreground">In production, AVERRA's responses are grounded in resources your school approves. Responses shown here are simulated.</p>

      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {PRINCIPLES.map((p, i) => (
          <li key={p.title}><Reveal delay={i * 0.06} className="h-full rounded-2xl border border-hairline bg-card/80 p-6 shadow-soft">
            <p.icon className="size-5 text-lavender" aria-hidden />
            <h3 className="mt-4 font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{p.body}</p>
          </Reveal></li>
        ))}
      </ul>
    </SectionShell>
  );
}
