import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bell, Check, FileText, KeyRound, RotateCcw, Sparkles, Upload } from "lucide-react";
import { Chip, Panel, btnGhost, btnPrimary, input } from "@/components/demos/AppShell";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const STEPS = ["Log in", "Select a class", "Upload coursework", "Add instructions", "Publish to students", "Notify families", "Enter grades"];
const CLASSES = [["AP Biology · P2", 24], ["Biology Honors · P4", 22], ["Environmental Science · P6", 26]] as const;
const ORIGINAL = "do the lab with yeast and sugar at diff temps. record co2. write it up w/ graph. due next week";
const IMPROVED = "In this lab you'll measure how temperature affects the rate of cellular respiration in yeast.\n1. Prepare four flasks at 10°C, 20°C, 30°C and 40°C.\n2. Record CO₂ output every 2 minutes for 20 minutes.\n3. Graph CO₂ vs. time for each temperature.\n4. Write a 300-word analysis connecting your results to enzyme activity.";
const STUDENTS = ["Maya Chen", "Jordan Ellis", "Priya Shah", "Lucas Moreau", "Ava Thompson", "Noah Kim"];

/** Pure: class average of entered scores and count of missing (empty) entries. */
export function gradeStats(scores: (number | null)[]) {
  const entered = scores.filter((s): s is number => s !== null);
  return { average: entered.length ? entered.reduce((a, b) => a + b, 0) / entered.length : 0, missing: scores.length - entered.length };
}

export function TeacherWalkthrough() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<boolean[]>(STEPS.map(() => false));
  const [cls, setCls] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [text, setText] = useState(ORIGINAL);
  const [improved, setImproved] = useState(false);
  const [due, setDue] = useState("2026-03-19");
  const [published, setPublished] = useState(false);
  const [notify, setNotify] = useState(true);
  const [sent, setSent] = useState(false);
  const [scores, setScores] = useState<(number | null)[]>([46, 44, null, 48, 41, null]);
  const stats = useMemo(() => gradeStats(scores), [scores]);
  const className = cls === null ? "AP Biology · P2" : CLASSES[cls]![0];
  const count = cls === null ? 24 : CLASSES[cls]![1];

  const complete = (i: number) => {
    setDone((d) => d.map((v, j) => (j === i ? true : v)));
    if (i < STEPS.length - 1) setTimeout(() => setStep(i + 1), reduce ? 0 : 600);
  };
  const restart = () => { setStep(0); setDone(STEPS.map(() => false)); setCls(null); setUpload(null); setFiles([]); setText(ORIGINAL); setImproved(false); setPublished(false); setNotify(true); setSent(false); setScores([46, 44, null, 48, 41, null]); };
  const simulateUpload = () => {
    setUpload(0);
    let p = 0;
    const t = setInterval(() => {
      p += 20; setUpload(p);
      if (p >= 100) { clearInterval(t); setFiles(["Cellular_Respiration_Lab.pdf", "Lab_Data_Template.xlsx"]); complete(2); }
    }, reduce ? 10 : 180);
  };

  return (
    <div className="mt-14 grid gap-6 lg:grid-cols-[260px_1fr]">
      <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible" aria-label="Walkthrough steps">
        {STEPS.map((s, i) => (
          <li key={s} className="shrink-0">
            <button type="button" onClick={() => setStep(i)} aria-current={step === i ? "step" : undefined}
              className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors", step === i ? "bg-card font-medium shadow-soft" : "text-muted-foreground hover:bg-card/60")}>
              <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold", done[i] ? "bg-mint text-navy" : step === i ? "bg-primary text-primary-foreground" : "border border-hairline")}>
                {done[i] ? <Check className="size-3.5" aria-label="Completed" /> : i + 1}
              </span>
              <span className="whitespace-nowrap">{s}</span>
            </button>
          </li>
        ))}
        <li className="mt-4 hidden rounded-xl border border-hairline bg-card/70 p-3 text-xs text-muted-foreground lg:block">
          <span className="text-gradient text-sm font-semibold">3 tools → 1 workspace</span>
          <p className="mt-1">Coursework, grading and family updates in one flow.</p>
        </li>
      </ol>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-float">
        <div className="flex items-center gap-1.5 border-b border-hairline px-4 py-2.5">
          {[0, 1, 2].map((i) => <span key={i} className="size-2.5 rounded-full bg-muted-foreground/20" />)}
          <span className="ml-3 text-xs font-medium text-muted-foreground">AVERRA Teacher · {step > 0 ? className : "Sign in"}</span>
          <span className="ml-auto rounded-full bg-mint-soft px-2.5 py-0.5 text-[11px] font-medium text-navy">Simulated demo — sample data</span>
        </div>
        <div className="min-h-[420px] p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? {} : { opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
              {step === 0 && (
                <div className="mx-auto max-w-sm rounded-2xl border border-hairline p-7 text-center">
                  <span className="bg-brand mx-auto grid size-12 place-items-center rounded-full text-lg font-semibold text-primary-foreground">ER</span>
                  <p className="mt-4 font-semibold">Ms. Elena Rivera</p><p className="text-sm text-muted-foreground">Westbrook Academy</p>
                  <button type="button" className={cn(btnGhost, "mt-6 w-full")} onClick={() => complete(0)}><KeyRound className="size-4" />Continue with school SSO</button>
                  <button type="button" className={cn(btnPrimary, "mt-2 w-full")} onClick={() => complete(0)}>Sign in</button>
                </div>
              )}
              {step === 1 && (
                <><h4 className="text-lg font-semibold tracking-tight">Select a class</h4>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">{CLASSES.map(([n, c], i) => (
                  <button key={n} type="button" aria-pressed={cls === i} onClick={() => { setCls(i); complete(1); }} className={cn("rounded-xl border p-4 text-left transition-colors hover:border-lavender/50", cls === i ? "border-lavender bg-lavender-soft" : "border-hairline")}>
                    <p className="text-sm font-semibold">{n}</p><p className="mt-1 text-xs text-muted-foreground">{c} students</p>
                  </button>
                ))}</div></>
              )}
              {step === 2 && (
                <><h4 className="text-lg font-semibold tracking-tight">Upload coursework</h4>
                <div className="mt-4 grid place-items-center rounded-2xl border-2 border-dashed border-hairline bg-muted/40 p-10 text-center">
                  <Upload className="size-6 text-lavender" aria-hidden />
                  <p className="mt-2 text-sm font-medium">Drag files here</p>
                  {upload !== null && upload < 100 ? (
                    <div className="mt-4 h-1.5 w-56 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={upload} aria-valuemin={0} aria-valuemax={100}><div className="bg-brand h-full transition-all" style={{ width: `${upload}%` }} /></div>
                  ) : (
                    <button type="button" className={cn(btnPrimary, "mt-4")} onClick={simulateUpload} disabled={files.length > 0}>Simulate upload</button>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">{files.map((f) => <span key={f} className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1 text-xs"><FileText className="size-3.5 text-lavender" aria-hidden />{f}</span>)}</div></>
              )}
              {step === 3 && (
                <><h4 className="text-lg font-semibold tracking-tight">Cellular Respiration Lab</h4>
                <label className="mt-4 block text-xs font-medium">Instructions<textarea className={cn(input, "mt-1 h-36")} value={text} onChange={(e) => setText(e.target.value)} /></label>
                <div className="mt-3 grid max-w-sm grid-cols-2 gap-3">
                  <label className="text-xs font-medium">Due date<input type="date" className={cn(input, "mt-1")} value={due} onChange={(e) => setDue(e.target.value)} /></label>
                  <label className="text-xs font-medium">Points<input type="number" className={cn(input, "mt-1")} defaultValue={50} /></label>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button type="button" className={btnGhost} onClick={() => { setText(IMPROVED); setImproved(true); }}><Sparkles className="size-4 text-lavender" />AI assist: improve clarity</button>
                  <button type="button" className={btnPrimary} onClick={() => complete(3)}>Save instructions</button>
                  {improved && <Chip tone="lavender">Review before publishing</Chip>}
                </div></>
              )}
              {step === 4 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div><h4 className="text-lg font-semibold tracking-tight">Publish to students</h4>
                    <Panel className="mt-4 text-sm"><p><b className="font-medium">Audience:</b> {count} students in {className}</p><p className="mt-1"><b className="font-medium">Due:</b> {due}</p><p className="mt-1"><b className="font-medium">Attachments:</b> {files.length || 2} files</p></Panel>
                    {published ? <p className="mt-4 flex items-center gap-2 text-sm font-medium text-navy"><span className="grid size-6 place-items-center rounded-full bg-mint"><Check className="size-3.5" aria-hidden /></span>Published to students</p>
                      : <button type="button" className={cn(btnPrimary, "mt-4")} onClick={() => { setPublished(true); complete(4); }}>Publish</button>}
                  </div>
                  <div className="rounded-2xl bg-muted/50 p-4"><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Student view</p>
                    {published ? <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><Panel className="mt-3 text-sm"><Chip tone="lavender">New</Chip><p className="mt-2 font-medium">Cellular Respiration Lab</p><p className="text-xs text-muted-foreground">{className} · due {due} · 50 pts</p></Panel></motion.div>
                      : <p className="mt-3 text-sm text-muted-foreground">Nothing new yet.</p>}
                  </div>
                </div>
              )}
              {step === 5 && (
                <><h4 className="text-lg font-semibold tracking-tight">Notify families</h4>
                <label className="mt-4 flex max-w-md items-center justify-between rounded-xl border border-hairline p-3 text-sm">Notify families of this assignment<Switch checked={notify} onCheckedChange={setNotify} /></label>
                {notify && <Panel className="mt-3 max-w-md bg-lavender-soft/50 text-sm"><p className="flex items-center gap-1.5 text-xs font-medium text-lavender"><Bell className="size-3.5" aria-hidden />Parent notification preview</p><p className="mt-2">New assignment for your student in {className}: <b className="font-medium">Cellular Respiration Lab</b>, due {due}.</p></Panel>}
                {sent ? <p className="mt-4 text-sm font-medium">{notify ? `Sent to ${count} families (simulated).` : "Saved without notifying families."}</p>
                  : <button type="button" className={cn(btnPrimary, "mt-4")} onClick={() => { setSent(true); complete(5); }}>{notify ? "Send" : "Continue"}</button>}</>
              )}
              {step === 6 && (
                <><div className="flex flex-wrap items-end justify-between gap-3"><h4 className="text-lg font-semibold tracking-tight">Enter grades · /50</h4>
                  <div className="flex gap-2"><Chip tone="lavender">Average {stats.average.toFixed(1)}</Chip><Chip tone={stats.missing ? "warn" : "mint"}>{stats.missing} missing</Chip></div></div>
                <ul className="mt-4 divide-y divide-hairline rounded-xl border border-hairline">{STUDENTS.map((s, i) => (
                  <li key={s} className="flex items-center justify-between px-3 py-2 text-sm"><span className="font-medium">{s}</span>
                    <input aria-label={`${s} score`} type="number" min={0} max={50} placeholder="—" className="w-20 rounded-md border border-input bg-card px-2 py-1"
                      value={scores[i] ?? ""} onChange={(e) => setScores((sc) => sc.map((v, j) => (j === i ? (e.target.value === "" ? null : Number(e.target.value)) : v)))} /></li>
                ))}</ul>
                <button type="button" className={cn(btnPrimary, "mt-4")} onClick={() => complete(6)}>Save grades</button>
                {done[6] && <p className="mt-3 text-sm text-muted-foreground">Walkthrough complete — that's a full assignment cycle in one workspace.</p>}</>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2 border-t border-hairline px-4 py-3">
          <button type="button" className={btnGhost} onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</button>
          <button type="button" className={btnGhost} onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}>Next</button>
          <button type="button" className={cn(btnGhost, "ml-auto")} onClick={restart}><RotateCcw className="size-4" />Restart demo</button>
        </div>
      </div>
    </div>
  );
}
