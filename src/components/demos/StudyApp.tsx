import { useState } from "react";
import { BookOpenCheck, CalendarRange, CheckCircle2, Lightbulb, ListChecks, XCircle } from "lucide-react";
import { AppShell, Chip, Panel, ViewTitle, btnGhost, type NavItem } from "./AppShell";
import { cn } from "@/lib/utils";

type Mode = "explain" | "quiz" | "plan";
const NAV: NavItem<Mode>[] = [
  { id: "explain", label: "Explain a concept", icon: Lightbulb },
  { id: "quiz", label: "Practice questions", icon: ListChecks },
  { id: "plan", label: "Study plan", icon: CalendarRange },
];
type Q = { q: string; options: string[]; correct: number; why: string };
type Topic = { explain: string[]; quiz: Q[]; plan: string[] };
export const TOPICS: Record<string, Topic> = {
  Photosynthesis: {
    explain: ["Photosynthesis is how plants turn light energy into chemical energy stored in glucose.", "Light-dependent reactions in the thylakoids split water, release oxygen, and make ATP and NADPH.", "The Calvin cycle in the stroma uses that ATP and NADPH to fix CO₂ into sugar."],
    quiz: [
      { q: "Where do the light-dependent reactions occur?", options: ["Stroma", "Thylakoid membrane", "Mitochondria"], correct: 1, why: "They happen across the thylakoid membrane, where chlorophyll captures light." },
      { q: "Which gas is released as a by-product?", options: ["Oxygen", "Carbon dioxide", "Nitrogen"], correct: 0, why: "Splitting water releases O₂." },
      { q: "What does the Calvin cycle produce?", options: ["ATP", "Water", "G3P / glucose"], correct: 2, why: "It fixes carbon into G3P, which builds glucose." },
    ],
    plan: ["Re-read notes on chloroplast structure", "Draw the light reactions from memory", "Calvin cycle flashcards", "Practice questions + review mistakes", "Explain it aloud to a friend"],
  },
  Derivatives: {
    explain: ["A derivative measures how fast a function changes at an instant — the slope of the tangent line.", "Formally, f′(x) = lim h→0 of [f(x+h) − f(x)] / h.", "Rules like the power rule (d/dx xⁿ = nxⁿ⁻¹) let you skip the limit for common functions."],
    quiz: [
      { q: "d/dx of x³ is…", options: ["3x²", "x²", "3x³"], correct: 0, why: "Power rule: bring down 3, reduce the exponent by 1." },
      { q: "The derivative of a constant is…", options: ["1", "0", "The constant"], correct: 1, why: "A constant doesn't change, so its rate of change is 0." },
      { q: "f′(x) at a local maximum equals…", options: ["Positive", "Negative", "Zero"], correct: 2, why: "The tangent line is horizontal at a smooth local max." },
    ],
    plan: ["Review the limit definition", "Power, product and quotient rules drill", "Chain rule practice (10 problems)", "Applications: tangent lines & extrema", "Timed mixed review set"],
  },
  "The French Revolution": {
    explain: ["The French Revolution (1789–1799) overthrew the monarchy and reshaped France's political order.", "Causes included debt, inequality between the Estates, and Enlightenment ideas.", "Key moments: the Storming of the Bastille, the Declaration of the Rights of Man, the Reign of Terror, and Napoleon's rise."],
    quiz: [
      { q: "In what year was the Bastille stormed?", options: ["1776", "1789", "1804"], correct: 1, why: "July 14, 1789 — now France's national day." },
      { q: "Who led the Committee of Public Safety during the Terror?", options: ["Robespierre", "Louis XVI", "Lafayette"], correct: 0, why: "Maximilien Robespierre was its most influential member." },
      { q: "Which document proclaimed natural rights in 1789?", options: ["Magna Carta", "Napoleonic Code", "Declaration of the Rights of Man"], correct: 2, why: "Adopted August 1789 by the National Assembly." },
    ],
    plan: ["Timeline of 1789–1799", "Causes: three Estates & fiscal crisis", "Primary source: Declaration of the Rights of Man", "Reign of Terror — causes and effects", "Practice DBQ outline"],
  },
};

export default function StudyApp() {
  const [mode, setMode] = useState<Mode>("explain");
  const [topic, setTopic] = useState<keyof typeof TOPICS>("Photosynthesis");
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [done, setDone] = useState<boolean[]>([false, false, false, false, false]);
  const t = TOPICS[topic]!;
  const score = answers.filter((a, i) => a === t.quiz[i]!.correct).length;
  const pick = (k: string) => { setTopic(k); setAnswers([null, null, null]); setDone([false, false, false, false, false]); };

  return (
    <AppShell nav={NAV} active={mode} onChange={setMode} footer={<p className="text-[11px] leading-relaxed text-muted-foreground">Designed to support learning, not replace it. Teachers can set academic-integrity guardrails.</p>}>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Topic">{Object.keys(TOPICS).map((k) => (
        <button key={k} type="button" aria-pressed={topic === k} onClick={() => pick(k)} className={cn(btnGhost, "rounded-full py-1.5", topic === k && "border-lavender bg-lavender-soft")}>{k}</button>
      ))}</div>
      {mode === "explain" && (<>
        <ViewTitle title={topic} sub="Explained step by step" />
        <ol className="space-y-3">{t.explain.map((p, i) => <Panel key={i} className="flex gap-3 text-sm leading-relaxed"><span className="bg-brand grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold text-primary-foreground">{i + 1}</span>{p}</Panel>)}</ol>
        <button type="button" className={cn(btnGhost, "mt-4")} onClick={() => setMode("quiz")}><BookOpenCheck className="size-4" />Check my understanding</button>
      </>)}
      {mode === "quiz" && (<>
        <ViewTitle title={`${topic} · Practice`} action={answers.every((a) => a !== null) && <Chip tone="lavender">Score {score}/3</Chip>} />
        <div className="space-y-4">{t.quiz.map((qq, qi) => {
          const a = answers[qi];
          return (
            <Panel key={qq.q}>
              <p className="text-sm font-medium">{qi + 1}. {qq.q}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">{qq.options.map((o, oi) => {
                const chosen = a === oi; const correct = oi === qq.correct;
                return <button key={o} type="button" disabled={a !== null} onClick={() => setAnswers((x) => x.map((v, j) => (j === qi ? oi : v)))}
                  className={cn("rounded-lg border px-3 py-2 text-left text-sm transition-colors", a === null ? "border-hairline hover:border-lavender/50" : correct ? "border-mint bg-mint-soft" : chosen ? "border-destructive/40 bg-destructive/10" : "border-hairline opacity-60")}>{o}</button>;
              })}</div>
              {a !== null && <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">{a === qq.correct ? <CheckCircle2 className="size-3.5 text-mint" aria-hidden /> : <XCircle className="size-3.5 text-destructive" aria-hidden />}{a === qq.correct ? "Correct. " : "Not quite. "}{qq.why}</p>}
            </Panel>
          );
        })}</div>
        <button type="button" className={cn(btnGhost, "mt-4")} onClick={() => setAnswers([null, null, null])}>Try again</button>
      </>)}
      {mode === "plan" && (<>
        <ViewTitle title="5-day study plan" sub={`${topic} · ${done.filter(Boolean).length}/5 complete`} />
        <ul className="space-y-2">{t.plan.map((p, i) => (
          <li key={p}><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-hairline bg-card p-3 text-sm">
            <input type="checkbox" className="size-4 accent-[var(--lavender)]" checked={done[i] ?? false} onChange={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))} />
            <span className="w-12 text-xs font-medium text-muted-foreground">Day {i + 1}</span>
            <span className={cn(done[i] && "text-muted-foreground line-through")}>{p}</span>
          </label></li>
        ))}</ul>
      </>)}
      <p className="mt-6 text-xs text-muted-foreground md:hidden">Designed to support learning, not replace it. Teachers can set academic-integrity guardrails.</p>
    </AppShell>
  );
}
