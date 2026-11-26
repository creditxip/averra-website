import { useMemo, useState } from "react";
import { CalendarCheck, FilePlus2, LayoutGrid, Mail, Search, Sparkles, Table2, Upload, Users, X } from "lucide-react";
import { AppShell, Chip, Panel, TypingDots, ViewTitle, btnGhost, btnPrimary, input, type NavItem } from "./AppShell";
import { cn } from "@/lib/utils";

type View = "classes" | "roster" | "create" | "uploads" | "grades" | "attendance" | "parents" | "ai";
const NAV: NavItem<View>[] = [
  { id: "classes", label: "Classes", icon: LayoutGrid },
  { id: "roster", label: "Roster", icon: Users },
  { id: "create", label: "Create assignment", icon: FilePlus2 },
  { id: "uploads", label: "Coursework uploads", icon: Upload },
  { id: "grades", label: "Grade entry", icon: Table2 },
  { id: "attendance", label: "Attendance", icon: CalendarCheck },
  { id: "parents", label: "Parent messages", icon: Mail },
  { id: "ai", label: "AI assistance", icon: Sparkles },
];
const CLASSES = ["AP Biology · Period 2", "AP Biology · Period 4", "Biology Honors · Period 6"];
const STUDENTS = ["Maya Chen", "Jordan Ellis", "Priya Shah", "Lucas Moreau", "Ava Thompson", "Noah Kim", "Sofia Alvarez", "Liam O'Connor"];
const ASSIGN_COLS = ["Lab 4", "Quiz 6", "Essay 2"];
type Status = "present" | "absent" | "tardy";
const AI_OUT: Record<string, string> = {
  "Draft rubric": "Cellular Respiration Lab — 20 pts\n• Hypothesis (4): clear, testable, references temperature\n• Data & graph (6): labeled axes, units, accurate plotting\n• Analysis (6): connects results to enzyme activity\n• Conventions (4): scientific tone, citations",
  "Differentiate instructions": "Support: provide a partially completed data table and sentence starters.\nCore: standard lab instructions.\nExtension: design a follow-up experiment varying glucose concentration.",
  "Summarize class performance": "Period 2 average on Quiz 6 is 87%. 3 students scored below 75% — common misconception: confusing the Krebs cycle with glycolysis. Suggest a 10-minute review at the start of Thursday's class.",
};

export default function TeacherApp() {
  const [view, setView] = useState<View>("classes");
  const [cls, setCls] = useState(CLASSES[0]!);
  const [q, setQ] = useState("");
  const [assignments, setAssignments] = useState([{ title: "Cellular Respiration Lab", due: "2026-03-12", points: 20 }]);
  const [form, setForm] = useState({ title: "", instructions: "", due: "", points: "10" });
  const [files, setFiles] = useState<string[]>(["Unit4_Notes.pdf"]);
  const [drag, setDrag] = useState(false);
  const [scores, setScores] = useState<number[][]>(() => STUDENTS.map((_, i) => [18 - (i % 3), 9 - (i % 2), 85 + ((i * 7) % 14)]));
  const [att, setAtt] = useState<Status[]>(() => STUDENTS.map((_, i) => (i === 3 ? "tardy" : "present")));
  const [selected, setSelected] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [ai, setAi] = useState<{ k: string; loading: boolean } | null>(null);

  const averages = useMemo(() => ASSIGN_COLS.map((_, c) => (scores.reduce((s, r) => s + (r[c] ?? 0), 0) / scores.length).toFixed(1)), [scores]);
  const counts = { present: att.filter((a) => a === "present").length, absent: att.filter((a) => a === "absent").length, tardy: att.filter((a) => a === "tardy").length };
  const addFile = () => setFiles((f) => [...f, ["Lab_Handout_v2.docx", "Krebs_Cycle_Diagram.png", "Practice_Set_5.pdf", "Lecture_Slides_Mar10.pptx"][f.length % 4]!]);

  return (
    <AppShell nav={NAV} active={view} onChange={setView} footer={<p className="text-xs text-muted-foreground">Ms. Rivera · Science</p>}>
      {view === "classes" && (<>
        <ViewTitle title="Good morning, Ms. Rivera" sub="Select a class" />
        <div className="grid gap-3 sm:grid-cols-3">{CLASSES.map((c, i) => (
          <button key={c} type="button" onClick={() => { setCls(c); setView("roster"); }} className={cn("rounded-xl border bg-card p-4 text-left transition-colors hover:border-lavender/50", cls === c ? "border-lavender" : "border-hairline")}>
            <p className="text-sm font-semibold">{c}</p><p className="mt-1 text-xs text-muted-foreground">{[24, 22, 26][i]} students</p>
          </button>
        ))}</div>
        <p className="mt-6 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Assignments · {cls}</p>
        <ul className="space-y-2">{assignments.map((a) => <Panel key={a.title} className="flex justify-between text-sm"><span className="font-medium">{a.title}</span><span className="text-muted-foreground">{a.points} pts · due {a.due || "TBD"}</span></Panel>)}</ul>
      </>)}
      {view === "roster" && (<>
        <ViewTitle title="Roster" sub={cls} action={<div className="relative"><Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" aria-hidden /><input aria-label="Search students" className={cn(input, "pl-8")} placeholder="Search students" value={q} onChange={(e) => setQ(e.target.value)} /></div>} />
        <table className="w-full text-sm"><thead><tr className="text-left text-xs text-muted-foreground"><th className="pb-2 font-medium">Student</th><th className="pb-2 font-medium">Grade</th><th className="pb-2 font-medium">Avg</th></tr></thead>
          <tbody className="divide-y divide-hairline">{STUDENTS.map((s, i) => ({ s, i })).filter(({ s }) => s.toLowerCase().includes(q.toLowerCase())).map(({ s, i }) => (
            <tr key={s}><td className="py-2.5 font-medium">{s}</td><td>11</td><td>{(((scores[i]![0]! / 20) * 100 + (scores[i]![1]! / 10) * 100 + scores[i]![2]!) / 3).toFixed(0)}%</td></tr>
          ))}</tbody></table>
      </>)}
      {view === "create" && (<>
        <ViewTitle title="Create assignment" sub={cls} />
        <form className="grid max-w-lg gap-3" onSubmit={(e) => { e.preventDefault(); if (!form.title.trim()) return; setAssignments((a) => [...a, { title: form.title.trim(), due: form.due, points: Number(form.points) || 0 }]); setForm({ title: "", instructions: "", due: "", points: "10" }); setView("classes"); }}>
          <label className="text-xs font-medium">Title<input required className={cn(input, "mt-1")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Photosynthesis Pre-lab" /></label>
          <label className="text-xs font-medium">Instructions<textarea className={cn(input, "mt-1 h-24")} value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-medium">Due date<input type="date" className={cn(input, "mt-1")} value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} /></label>
            <label className="text-xs font-medium">Points<input type="number" min={0} className={cn(input, "mt-1")} value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} /></label>
          </div>
          <button type="submit" className={cn(btnPrimary, "w-fit")}>Save assignment</button>
        </form>
      </>)}
      {view === "uploads" && (<>
        <ViewTitle title="Coursework uploads" sub="Simulated — files are not actually uploaded" />
        <button type="button" onClick={addFile} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); addFile(); }}
          className={cn("grid w-full place-items-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors", drag ? "border-lavender bg-lavender-soft" : "border-hairline bg-muted/40")}>
          <Upload className="size-6 text-lavender" aria-hidden /><p className="mt-2 text-sm font-medium">Drag files here or click to add</p><p className="text-xs text-muted-foreground">PDF, DOCX, PPTX, images</p>
        </button>
        <div className="mt-4 flex flex-wrap gap-2">{files.map((f, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-card px-3 py-1 text-xs">{f}<button type="button" aria-label={`Remove ${f}`} onClick={() => setFiles((x) => x.filter((_, j) => j !== i))}><X className="size-3" /></button></span>
        ))}</div>
      </>)}
      {view === "grades" && (<>
        <ViewTitle title="Gradebook" sub={`${cls} · Lab /20 · Quiz /10 · Essay /100`} />
        <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-sm">
          <thead><tr className="text-left text-xs text-muted-foreground"><th className="pb-2 font-medium">Student</th>{ASSIGN_COLS.map((c) => <th key={c} className="pb-2 font-medium">{c}</th>)}</tr></thead>
          <tbody className="divide-y divide-hairline">{STUDENTS.map((s, r) => (
            <tr key={s}><td className="py-1.5 font-medium">{s}</td>{ASSIGN_COLS.map((c, ci) => (
              <td key={c} className="py-1.5"><input aria-label={`${s} ${c} score`} type="number" className="w-16 rounded-md border border-input bg-card px-2 py-1 text-sm" value={scores[r]![ci]} onChange={(e) => setScores((sc) => sc.map((row, ri) => (ri === r ? row.map((v, k) => (k === ci ? Number(e.target.value) : v)) : row)))} /></td>
            ))}</tr>
          ))}</tbody>
          <tfoot><tr className="border-t border-hairline font-semibold"><td className="pt-2">Class average</td>{averages.map((a, i) => <td key={i} className="pt-2 text-lavender">{a}</td>)}</tr></tfoot>
        </table></div>
      </>)}
      {view === "attendance" && (<>
        <ViewTitle title="Attendance" sub={`${cls} · Today`} action={<div className="flex gap-2"><Chip tone="mint">{counts.present} present</Chip><Chip tone="warn">{counts.absent} absent</Chip><Chip tone="lavender">{counts.tardy} tardy</Chip></div>} />
        <ul className="divide-y divide-hairline rounded-xl border border-hairline bg-card">{STUDENTS.map((s, i) => (
          <li key={s} className="flex items-center justify-between p-2.5 text-sm"><span className="font-medium">{s}</span>
            <div role="radiogroup" aria-label={`${s} attendance`} className="flex gap-1">{(["present", "absent", "tardy"] as Status[]).map((st) => (
              <button key={st} type="button" role="radio" aria-checked={att[i] === st} onClick={() => setAtt((a) => a.map((v, j) => (j === i ? st : v)))}
                className={cn("rounded-md px-2.5 py-1 text-xs capitalize", att[i] === st ? (st === "present" ? "bg-mint-soft text-navy" : st === "absent" ? "bg-destructive/10 text-destructive" : "bg-lavender-soft text-navy") : "text-muted-foreground hover:bg-muted")}>{st}</button>
            ))}</div></li>
        ))}</ul>
      </>)}
      {view === "parents" && (<>
        <ViewTitle title="Parent communication" sub="Select students — messages go to their linked families" />
        <div className="flex flex-wrap gap-2">{STUDENTS.map((s) => (
          <button key={s} type="button" aria-pressed={selected.includes(s)} onClick={() => setSelected((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s]))} className={cn("rounded-full border px-3 py-1 text-xs", selected.includes(s) ? "border-lavender bg-lavender-soft" : "border-hairline")}>{s}</button>
        ))}</div>
        <textarea aria-label="Message to families" className={cn(input, "mt-4 h-28")} placeholder="Write to families…" value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button type="button" disabled={!selected.length || !msg.trim()} className={cn(btnPrimary, "mt-3 disabled:opacity-50")} onClick={() => { setSent(`Simulated: sent to ${selected.length} ${selected.length === 1 ? "family" : "families"}.`); setMsg(""); setSelected([]); }}>Send to {selected.length || "…"} {selected.length === 1 ? "family" : "families"}</button>
        {sent && <p className="mt-3 text-sm text-muted-foreground">{sent}</p>}
      </>)}
      {view === "ai" && (<>
        <ViewTitle title="AI teaching assistance" sub="AI drafts are reviewed by the teacher before use" />
        <div className="flex flex-wrap gap-2">{Object.keys(AI_OUT).map((k) => (
          <button key={k} type="button" className={cn(btnGhost, ai?.k === k && "border-lavender")} onClick={() => { setAi({ k, loading: true }); setTimeout(() => setAi({ k, loading: false }), 900); }}><Sparkles className="size-4 text-lavender" />{k}</button>
        ))}</div>
        {ai && <Panel className="mt-4 bg-lavender-soft/50">{ai.loading ? <TypingDots /> : <><Chip>Draft · needs review</Chip><p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{AI_OUT[ai.k]}</p></>}</Panel>}
      </>)}
    </AppShell>
  );
}
