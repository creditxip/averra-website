import { useEffect, useMemo, useState } from "react";
import { BookOpen, CalendarDays, CheckCircle2, GraduationCap, ListChecks, Send, XCircle } from "lucide-react";
import { Chip, TypingDots, btnPrimary, input } from "@/components/demos/AppShell";
import { daysUntil, nextFriday } from "./examPlan";
import { cn } from "@/lib/utils";

const PROMPT = "Can you help me prepare for my biology exam next Friday?";
const TOPICS = ["Cell structure & organelles", "Cellular respiration", "Photosynthesis", "Genetics & inheritance"];
const QUIZ = [
  { q: "Where does the Krebs cycle take place?", o: ["Cytoplasm", "Mitochondrial matrix", "Chloroplast stroma", "Nucleus"], c: 1 },
  { q: "Which molecule is the main product of photosynthesis' Calvin cycle?", o: ["Oxygen", "ATP", "G3P (sugar)", "Water"], c: 2 },
  { q: "A heterozygous (Aa) × heterozygous (Aa) cross yields what share of recessive phenotypes?", o: ["0%", "25%", "50%", "75%"], c: 1 },
];
const MATERIALS = ["Class notes · Unit 4: Cellular Energy (sample)", "Textbook · Chapter 9: Cellular Respiration and Fermentation", "Ms. Rivera's posted review guide · Exam 2 (sample)"];
const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

export function StudentPrepDemo() {
  const [text, setText] = useState(PROMPT);
  const [phase, setPhase] = useState<"idle" | "typing" | "streaming" | "done">("idle");
  const [shown, setShown] = useState(0);
  const [ans, setAns] = useState<(number | null)[]>([null, null, null]);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const plan = useMemo(() => { const now = new Date(); const exam = nextFriday(now); return { exam, days: daysUntil(now, exam) }; }, []);

  useEffect(() => {
    if (phase === "typing") { const t = setTimeout(() => setPhase("streaming"), 900); return () => clearTimeout(t); }
    if (phase === "streaming") {
      if (shown >= 4) { setPhase("done"); return; }
      const t = setTimeout(() => setShown((s) => s + 1), 550); return () => clearTimeout(t);
    }
    return undefined;
  }, [phase, shown]);

  const send = () => { if (!text.trim()) return; setShown(0); setAns([null, null, null]); setPhase("typing"); };
  const score = ans.filter((a, i) => a === QUIZ[i]!.c).length;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {phase !== "idle" && <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">{text}</p>}
        {phase === "typing" && <TypingDots />}
        {shown >= 1 && <Block icon={CalendarDays} title={`Study schedule · exam ${fmt(plan.exam)}`}>
          {plan.days.length === 0 ? <p className="text-sm">Your exam is tomorrow — focus on the review guide tonight.</p> :
          <ul className="space-y-1.5">{plan.days.map((d, i) => (
            <li key={i}><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!done[i]} onChange={(e) => setDone({ ...done, [i]: e.target.checked })} className="accent-primary" />
              <span className="w-24 shrink-0 font-medium">{fmt(d)}</span><span className={cn(done[i] && "line-through text-muted-foreground")}>{i === plan.days.length - 1 ? "Full practice test + review mistakes" : TOPICS[i % TOPICS.length]}</span></label></li>
          ))}</ul>}
        </Block>}
        {shown >= 2 && <Block icon={GraduationCap} title="Key concepts"><div className="flex flex-wrap gap-1.5">{TOPICS.map((t) => <Chip key={t} tone="lavender">{t}</Chip>)}</div></Block>}
        {shown >= 3 && <Block icon={ListChecks} title={`Practice questions${ans.every((a) => a !== null) ? ` · ${score}/3` : ""}`}>
          <div className="space-y-3">{QUIZ.map((q, qi) => (
            <fieldset key={qi}><legend className="text-sm font-medium">{qi + 1}. {q.q}</legend>
              <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">{q.o.map((o, oi) => {
                const picked = ans[qi] === oi, answered = ans[qi] !== null;
                return <button key={o} type="button" disabled={answered} onClick={() => setAns(ans.map((a, i) => (i === qi ? oi : a)))}
                  className={cn("flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left text-xs", answered && oi === q.c ? "border-mint bg-mint-soft" : picked ? "border-destructive bg-destructive/10" : "border-hairline hover:border-lavender/60")}>
                  {answered && oi === q.c && <CheckCircle2 className="size-3.5 text-navy" aria-hidden />}{picked && oi !== q.c && <XCircle className="size-3.5 text-destructive" aria-hidden />}{o}</button>;
              })}</div></fieldset>
          ))}</div>
        </Block>}
        {shown >= 4 && <Block icon={BookOpen} title="Suggested review materials"><ul className="space-y-1 text-sm">{MATERIALS.map((m) => <li key={m}>• {m}</li>)}</ul></Block>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 border-t border-hairline p-3">
        <label htmlFor="student-prompt" className="sr-only">Ask AVERRA</label>
        <input id="student-prompt" className={input} value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" className={btnPrimary} disabled={phase === "typing" || phase === "streaming"}><Send className="size-4" aria-hidden /><span className="sr-only sm:not-sr-only">Send</span></button>
      </form>
    </div>
  );
}

function Block({ icon: I, title, children }: { icon: typeof BookOpen; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><I className="size-4 text-lavender" aria-hidden />{title}</p>{children}
    </div>
  );
}
