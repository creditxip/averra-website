import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { btnGhost, btnPrimary, input } from "@/components/demos/AppShell";
import { cn } from "@/lib/utils";

const LESSONS: Record<string, { obj: string[]; warm: string; acts: string[]; assess: string }> = {
  "Cellular respiration": { obj: ["Trace glucose through glycolysis, Krebs cycle and ETC", "Explain why oxygen is the final electron acceptor"], warm: "Exit-ticket recall: where does the energy in food come from?", acts: ["Mini-lecture with animated diagram (10 min)", "Pea germination CO₂ lab in pairs (25 min)", "Group whiteboard: ATP accounting"], assess: "Five-question check for understanding + lab data analysis" },
  Photosynthesis: { obj: ["Compare light-dependent reactions and Calvin cycle", "Relate photosynthesis to cellular respiration"], warm: "Why do leaves change color in autumn?", acts: ["Leaf-disk flotation lab (25 min)", "Card sort: inputs and outputs", "Pair-share: the carbon cycle"], assess: "Diagram labeling + short constructed response" },
  "Mendelian genetics": { obj: ["Predict offspring ratios with Punnett squares", "Distinguish genotype and phenotype"], warm: "Which traits do you share with relatives?", acts: ["Coin-flip inheritance simulation", "Guided Punnett square practice", "Pedigree puzzle in groups"], assess: "Problem set of six crosses, increasing difficulty" },
};
const QBANK: Record<string, string[]> = {
  Standard: ["What is the main function of the mitochondria?", "Name the two stages of photosynthesis.", "Define 'allele'.", "What is produced by glycolysis?", "What gas is released during photosynthesis?", "What is a homozygous genotype?"],
  Challenging: ["Explain why cyanide poisoning stops ATP production.", "Predict how a CO₂ shortage affects the Calvin cycle.", "Why can two brown-eyed parents have a blue-eyed child?", "Compare substrate-level and oxidative phosphorylation.", "How does temperature affect enzyme activity in respiration?", "Design an experiment testing light intensity on photosynthesis."],
};

export function TeacherAiDemo() {
  const [mode, setMode] = useState<"lesson" | "questions">("lesson");
  const [topic, setTopic] = useState("Cellular respiration");
  const [grade, setGrade] = useState("Grade 11");
  const [count, setCount] = useState(3);
  const [level, setLevel] = useState<"Standard" | "Challenging">("Standard");
  const [out, setOut] = useState<null | "lesson" | "questions">(null);
  const [busy, setBusy] = useState(false);
  const gen = (k: "lesson" | "questions") => { setBusy(true); setOut(null); setTimeout(() => { setBusy(false); setOut(k); }, 900); };
  const L = LESSONS[topic]!;

  return (
    <div className="space-y-4 p-5">
      <div className="flex gap-2" role="tablist">{([["lesson", "Lesson outline"], ["questions", "Practice questions"]] as const).map(([k, l]) => (
        <button key={k} role="tab" aria-selected={mode === k} type="button" onClick={() => { setMode(k); setOut(null); }} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", mode === k ? "border-lavender bg-lavender text-primary-foreground" : "border-hairline")}>{l}</button>
      ))}</div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs font-medium">Topic<select className={cn(input, "mt-1")} value={topic} onChange={(e) => setTopic(e.target.value)}>{Object.keys(LESSONS).map((t) => <option key={t}>{t}</option>)}</select></label>
        {mode === "lesson" ? <label className="text-xs font-medium">Grade<select className={cn(input, "mt-1")} value={grade} onChange={(e) => setGrade(e.target.value)}>{["Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((g) => <option key={g}>{g}</option>)}</select></label> : <>
          <label className="text-xs font-medium">Count<select className={cn(input, "mt-1")} value={count} onChange={(e) => setCount(Number(e.target.value))}>{[3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}</select></label>
          <label className="text-xs font-medium">Difficulty<select className={cn(input, "mt-1")} value={level} onChange={(e) => setLevel(e.target.value as "Standard" | "Challenging")}><option>Standard</option><option>Challenging</option></select></label></>}
        <button type="button" className={cn(btnPrimary, "self-end")} onClick={() => gen(mode)} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}Generate</button>
      </div>
      {out === "lesson" && <div className="rounded-xl border border-hairline p-4 text-sm">
        <p className="font-semibold">{topic} · {grade} · 50 min</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Objectives</p><ul className="mt-1 list-disc pl-5">{L.obj.map((o) => <li key={o}>{o}</li>)}</ul>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Warm-up</p><p>{L.warm}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Activities</p><ol className="list-decimal pl-5">{L.acts.map((a) => <li key={a}>{a}</li>)}</ol>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assessment</p><p>{L.assess}</p>
      </div>}
      {out === "questions" && <ol className="list-decimal space-y-1.5 rounded-xl border border-hairline p-4 pl-9 text-sm">{QBANK[level]!.slice(0, count).map((q) => <li key={q}>{q}</li>)}</ol>}
      {out && <button type="button" className={btnGhost} onClick={() => gen(out)}>Regenerate</button>}
      <p className="text-xs text-muted-foreground">Teachers review and edit AI drafts before use.</p>
    </div>
  );
}
