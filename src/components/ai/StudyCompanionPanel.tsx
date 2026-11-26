import { useEffect, useMemo, useState } from "react";
import { Brain, CheckCircle2, XCircle } from "lucide-react";
import { btnGhost, input } from "@/components/demos/AppShell";
import { studyDays } from "./knowledge";
import { cn } from "@/lib/utils";

type Q = { q: string; options: string[]; correct: number };
type Subject = { simple: string[]; deep: string[]; quiz: Q[]; topics: string[] };
const SUBJECTS: Record<string, Subject> = {
  Biology: {
    simple: ["Cells make energy by breaking down sugar.", "This happens mostly in the mitochondria.", "The energy is stored as ATP, which the cell spends like currency."],
    deep: ["Glycolysis splits glucose into two pyruvate in the cytoplasm, netting 2 ATP.", "The Krebs cycle oxidizes acetyl-CoA in the matrix, producing NADH and FADH₂.", "The electron transport chain uses those carriers to pump protons; ATP synthase yields ~32–34 ATP."],
    quiz: [{ q: "Where does glycolysis occur?", options: ["Cytoplasm", "Nucleus", "Matrix"], correct: 0 }, { q: "Final electron acceptor in the ETC?", options: ["CO₂", "Oxygen", "Glucose"], correct: 1 }, { q: "Which stage makes the most ATP?", options: ["Glycolysis", "Krebs cycle", "Electron transport chain"], correct: 2 }],
    topics: ["Cell structure review", "Glycolysis", "Krebs cycle", "Electron transport chain", "Fermentation", "Mixed practice set"],
  },
  Calculus: {
    simple: ["A derivative tells you how fast something is changing.", "On a graph, it's the steepness of the curve at one point.", "Shortcuts like the power rule make it quick to compute."],
    deep: ["f′(x) = lim h→0 [f(x+h) − f(x)] / h defines instantaneous rate of change.", "Power, product, quotient and chain rules compose to differentiate most elementary functions.", "Critical points where f′(x)=0 locate extrema; the second derivative tests concavity."],
    quiz: [{ q: "d/dx (x⁴)?", options: ["4x³", "x³", "4x⁴"], correct: 0 }, { q: "d/dx (sin x)?", options: ["−cos x", "cos x", "sin x"], correct: 1 }, { q: "If f′(a)=0 and f″(a)<0, a is a…", options: ["Minimum", "Inflection", "Maximum"], correct: 2 }],
    topics: ["Limit definition", "Power & product rules", "Chain rule", "Implicit differentiation", "Optimization problems", "Timed review"],
  },
  "U.S. History": {
    simple: ["The New Deal was FDR's plan to fight the Great Depression.", "It created jobs, banking rules and programs like Social Security.", "It changed how much the government does for citizens."],
    deep: ["The First New Deal (1933–34) focused on relief and recovery: CCC, AAA, NIRA.", "The Second New Deal (1935–38) added reform: Social Security Act, Wagner Act, WPA.", "Historians debate its economic impact, but it permanently expanded the federal role."],
    quiz: [{ q: "Which president led the New Deal?", options: ["Hoover", "F. D. Roosevelt", "Truman"], correct: 1 }, { q: "Social Security Act year?", options: ["1935", "1929", "1941"], correct: 0 }, { q: "The Wagner Act protected…", options: ["Farmers' prices", "Bank deposits", "Union organizing"], correct: 2 }],
    topics: ["Causes of the Depression", "First New Deal programs", "Second New Deal", "Critics of the New Deal", "Primary source practice", "DBQ outline"],
  },
  Chemistry: {
    simple: ["Moles let chemists count tiny particles by weighing them.", "One mole is 6.022 × 10²³ particles.", "Molar mass converts grams to moles."],
    deep: ["Avogadro's number links atomic mass units to grams: 1 mol of ¹²C is exactly 12 g.", "Stoichiometry uses balanced-equation mole ratios to relate reactants and products.", "Limiting reagent and percent yield follow from comparing actual to theoretical moles."],
    quiz: [{ q: "Avogadro's number is about…", options: ["6.022 × 10²³", "3.0 × 10⁸", "1.6 × 10⁻¹⁹"], correct: 0 }, { q: "Molar mass of H₂O (g/mol)?", options: ["16", "18", "20"], correct: 1 }, { q: "The reactant that runs out first is the…", options: ["Catalyst", "Excess reagent", "Limiting reagent"], correct: 2 }],
    topics: ["Moles & Avogadro's number", "Molar mass", "Balancing equations", "Stoichiometry", "Limiting reagent", "Percent yield"],
  },
};
type Tab = "Explain" | "Practice" | "Plan";
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function StudyCompanionPanel() {
  const [subject, setSubject] = useState("Biology");
  const [tab, setTab] = useState<Tab>("Explain");
  const [deep, setDeep] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [today, setToday] = useState<Date | null>(null);
  const [exam, setExam] = useState("");
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  useEffect(() => { const t = new Date(); setToday(t); setExam(iso(new Date(t.getTime() + 5 * 86400000))); }, []);

  const s = SUBJECTS[subject]!;
  const score = answers.filter((a, i) => a === s.quiz[i]!.correct).length;
  const plan = useMemo(() => {
    if (!today || !exam) return [];
    const [y, m, d] = exam.split("-").map(Number);
    const n = studyDays(today, new Date(y!, m! - 1, d!));
    return Array.from({ length: n }, (_, i) => {
      const date = new Date(today.getTime() + i * 86400000);
      const task = i === n - 1 ? "Light review + rest before the exam" : s.topics[i % s.topics.length]!;
      return { label: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }), task };
    });
  }, [today, exam, s]);
  const choose = (k: string) => { setSubject(k); setAnswers([null, null, null]); setChecked({}); };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-float">
      <header className="flex flex-wrap items-center gap-3 border-b border-hairline px-5 py-3.5">
        <span className="squircle icon-study icon-sheen grid size-8 place-items-center text-primary-foreground"><Brain className="size-4" aria-hidden /></span>
        <div><p className="text-sm font-semibold">AVERRA Study</p><p className="text-[11px] text-muted-foreground">Study Companion</p></div>
        <span className="ml-auto rounded-full bg-mint-soft px-2.5 py-0.5 text-[11px] font-medium text-navy">Simulated demo — sample data</span>
      </header>
      <div className="flex flex-wrap gap-1.5 border-b border-hairline px-5 py-2.5" role="group" aria-label="Subject">
        {Object.keys(SUBJECTS).map((k) => (
          <button key={k} type="button" aria-pressed={subject === k} onClick={() => choose(k)} className={cn("rounded-full border px-3 py-1 text-xs", subject === k ? "border-lavender bg-lavender-soft" : "border-hairline")}>{k}</button>
        ))}
      </div>
      <div role="tablist" aria-label="Study mode" className="flex gap-4 border-b border-hairline px-5">
        {(["Explain", "Practice", "Plan"] as Tab[]).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("-mb-px border-b-2 py-2.5 text-sm", tab === t ? "border-lavender font-medium" : "border-transparent text-muted-foreground")}>{t}</button>
        ))}
      </div>
      <div className="h-[372px] overflow-y-auto p-5" role="tabpanel">
        {tab === "Explain" && (<>
          <div className="mb-4 flex rounded-lg border border-hairline p-0.5 text-xs w-fit" role="group" aria-label="Depth">
            {[false, true].map((v) => <button key={String(v)} type="button" aria-pressed={deep === v} onClick={() => setDeep(v)} className={cn("rounded-md px-3 py-1", deep === v ? "bg-navy text-on-dark" : "text-muted-foreground")}>{v ? "Deeper" : "Simpler"}</button>)}
          </div>
          <ol className="space-y-2.5">{(deep ? s.deep : s.simple).map((p, i) => (
            <li key={p} className="flex gap-3 text-sm leading-relaxed"><span className="bg-brand grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold text-primary-foreground">{i + 1}</span>{p}</li>
          ))}</ol>
        </>)}
        {tab === "Practice" && (<>
          {answers.every((a) => a !== null) && <p className="mb-3 text-sm font-medium">Score: {score}/3</p>}
          <div className="space-y-4">{s.quiz.map((q, qi) => (
            <div key={q.q}>
              <p className="text-sm font-medium">{qi + 1}. {q.q}</p>
              <div className="mt-2 flex flex-wrap gap-2">{q.options.map((o, oi) => {
                const a = answers[qi];
                return <button key={o} type="button" disabled={a !== null} onClick={() => setAnswers((x) => x.map((v, j) => (j === qi ? oi : v)))}
                  className={cn("rounded-lg border px-3 py-1.5 text-sm", a == null ? "border-hairline hover:border-lavender/50" : oi === q.correct ? "border-mint bg-mint-soft" : a === oi ? "border-destructive/40 bg-destructive/10" : "border-hairline opacity-50")}>{o}</button>;
              })}</div>
              {answers[qi] != null && <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">{answers[qi] === q.correct ? <><CheckCircle2 className="size-3.5 text-mint" aria-hidden />Correct</> : <><XCircle className="size-3.5 text-destructive" aria-hidden />Answer: {q.options[q.correct]}</>}</p>}
            </div>
          ))}</div>
          <button type="button" className={cn(btnGhost, "mt-4")} onClick={() => setAnswers([null, null, null])}>New attempt</button>
        </>)}
        {tab === "Plan" && (<>
          <label className="flex flex-wrap items-center gap-3 text-sm font-medium">Exam date
            <input type="date" className={cn(input, "w-auto")} value={exam} min={today ? iso(new Date(today.getTime() + 86400000)) : undefined} onChange={(e) => { setExam(e.target.value); setChecked({}); }} />
          </label>
          <p className="mt-2 text-xs text-muted-foreground">{plan.length}-day plan · {Object.values(checked).filter(Boolean).length} done</p>
          <ul className="mt-3 space-y-1.5">{plan.map((p, i) => (
            <li key={i}><label className="flex items-center gap-3 rounded-lg border border-hairline px-3 py-2 text-sm">
              <input type="checkbox" className="size-4 accent-[var(--lavender)]" checked={!!checked[i]} onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))} />
              <span className="w-24 shrink-0 text-xs text-muted-foreground">{p.label}</span>
              <span className={cn(checked[i] && "text-muted-foreground line-through")}>{p.task}</span>
            </label></li>
          ))}</ul>
        </>)}
      </div>
      <p className="border-t border-hairline px-5 py-3 text-[11px] text-muted-foreground">Built to guide learning — schools can configure academic-integrity guardrails, and AI responses can be reviewed.</p>
    </div>
  );
}
