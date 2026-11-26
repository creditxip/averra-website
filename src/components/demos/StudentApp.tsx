import { useState } from "react";
import { ArrowDownUp, Bell, BookOpen, CalendarDays, CheckCircle2, ClipboardList, GraduationCap, LayoutDashboard, LifeBuoy, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { AppShell, Chip, Panel, TypingDots, ViewTitle, btnGhost, btnPrimary, type NavItem } from "./AppShell";
import { cn } from "@/lib/utils";

type View = "dash" | "schedule" | "work" | "deadlines" | "grades" | "resources" | "news" | "ai";
const NAV: NavItem<View>[] = [
  { id: "dash", label: "Dashboard", icon: LayoutDashboard },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "work", label: "Coursework", icon: BookOpen },
  { id: "deadlines", label: "Deadlines", icon: ClipboardList },
  { id: "grades", label: "Grades", icon: GraduationCap },
  { id: "resources", label: "Resources", icon: LifeBuoy },
  { id: "news", label: "Announcements", icon: Bell },
  { id: "ai", label: "AI Study Tools", icon: Sparkles },
];

const TODAY = [
  ["8:15", "AP Biology", "Rm 204 · Ms. Rivera"],
  ["9:30", "Calculus BC", "Rm 118 · Mr. Okafor"],
  ["10:45", "English Literature", "Library · Dr. Patel"],
  ["12:30", "Spanish IV", "Rm 310 · Sra. Morales"],
  ["1:45", "US History", "Rm 221 · Mr. Grant"],
];
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const PERIODS = ["8:15", "9:30", "10:45", "12:30", "1:45"];
const GRID: string[][] = [
  ["AP Biology", "Calculus BC", "English Lit", "Spanish IV", "US History"],
  ["Calculus BC", "AP Biology", "Study Hall", "US History", "Spanish IV"],
  ["AP Biology", "English Lit", "Calculus BC", "Advisory", "Chamber Choir"],
  ["Spanish IV", "AP Biology", "US History", "Calculus BC", "English Lit"],
  ["Calculus BC", "Spanish IV", "AP Biology", "English Lit", "Assembly"],
];

type Assignment = { id: number; course: string; title: string; due: string; days: number; instructions: string; submitted: boolean };
const ASSIGNMENTS: Assignment[] = [
  { id: 1, course: "AP Biology", title: "Cellular Respiration Lab Report", due: "Thu, Mar 12", days: 2, instructions: "Write up your yeast fermentation results. Include a hypothesis, data table, graph of CO₂ output vs. temperature, and a 300-word analysis.", submitted: false },
  { id: 2, course: "Calculus BC", title: "Problem Set 7 — Series Convergence", due: "Fri, Mar 13", days: 3, instructions: "Complete problems 1–18 on p. 412. Show all work for ratio and comparison tests.", submitted: false },
  { id: 3, course: "English Literature", title: "The Great Gatsby — Chapter 5 Response", due: "Mon, Mar 16", days: 6, instructions: "In 500 words, analyze the symbolism of the green light in the reunion scene.", submitted: false },
  { id: 4, course: "Spanish IV", title: "Presentación oral: Mi comunidad", due: "Wed, Mar 11", days: 1, instructions: "Prepare a 3-minute oral presentation about a community you belong to. Use at least five subjunctive constructions.", submitted: true },
  { id: 5, course: "US History", title: "Primary Source Analysis: New Deal", due: "Thu, Mar 19", days: 9, instructions: "Analyze two primary sources from the provided packet and compare their perspectives.", submitted: false },
];
const GRADES = [
  ["AP Biology", "A", 95, 1], ["Calculus BC", "A-", 91, 1], ["English Literature", "B+", 88, -1], ["Spanish IV", "A", 96, 1], ["US History", "A-", 92, 0],
] as const;
const NEWS = [
  ["Spring Showcase tickets now available", "Performing Arts · 2h ago", "Reserve seats for the April 23 Spring Showcase through the Events tab."],
  ["Junior college counseling sessions", "Counseling Office · Yesterday", "Sign up for a 1:1 session with your college counselor before spring break."],
  ["Library extended hours during midterms", "Library · Mar 6", "The Hartwell Library will be open until 9:00 PM March 16–20."],
];
const AI_RESP: Record<string, string> = {
  "Explain a concept": "Cellular respiration converts glucose into usable energy (ATP). It happens in three stages: glycolysis in the cytoplasm, the Krebs cycle in the mitochondrial matrix, and the electron transport chain across the inner membrane — which produces most of the ~36 ATP.",
  "Make practice questions": "1. Where does glycolysis occur?\n2. What is the final electron acceptor in the ETC?\n3. Why does fermentation produce less ATP than aerobic respiration?\n4. Name the two products of the Krebs cycle that carry electrons.",
  "Build a study plan": "Mon — Review glycolysis notes (20 min)\nTue — Krebs cycle flashcards (15 min)\nWed — ETC diagram practice (25 min)\nThu — Practice questions + check answers\nFri — Teach it back to a classmate",
};

export default function StudentApp() {
  const [view, setView] = useState<View>("dash");
  const [items, setItems] = useState(ASSIGNMENTS);
  const [openId, setOpenId] = useState<number | null>(null);
  const [asc, setAsc] = useState(true);
  const [ai, setAi] = useState<{ q: string; loading: boolean } | null>(null);
  const open = items.find((a) => a.id === openId);

  const submit = (id: number) => setItems((xs) => xs.map((a) => (a.id === id ? { ...a, submitted: true } : a)));
  const askAi = (q: string) => { setAi({ q, loading: true }); setTimeout(() => setAi({ q, loading: false }), 900); };

  return (
    <AppShell nav={NAV} active={view} onChange={(v) => { setView(v); setOpenId(null); }} footer={<p className="text-xs text-muted-foreground">Maya Chen · Grade 11</p>}>
      {view === "dash" && (
        <>
          <ViewTitle title="Good morning, Maya" sub="Tuesday, March 10 · Westbrook Academy" />
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Today's classes</p>
              <ul className="space-y-2.5">{TODAY.map(([t, c, r]) => (
                <li key={c} className="flex items-center gap-3 text-sm"><span className="w-12 font-mono text-xs text-muted-foreground">{t}</span><span className="font-medium">{c}</span><span className="ml-auto text-xs text-muted-foreground">{r}</span></li>
              ))}</ul>
            </Panel>
            <Panel>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Upcoming deadlines</p>
              <ul className="space-y-2.5">{items.filter((a) => !a.submitted).slice(0, 4).map((a) => (
                <li key={a.id}><button type="button" className="flex w-full items-center gap-2 text-left text-sm hover:text-lavender" onClick={() => { setView("work"); setOpenId(a.id); }}>
                  <span className="truncate">{a.title}</span><span className="ml-auto shrink-0">{a.days <= 2 ? <Chip tone="warn">Due {a.due.split(",")[0]}</Chip> : <Chip>{a.due}</Chip>}</span>
                </button></li>
              ))}</ul>
            </Panel>
            <Panel className="lg:col-span-2">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Recent announcements</p>
              <ul className="space-y-3">{NEWS.slice(0, 2).map(([t, m]) => <li key={t} className="text-sm"><p className="font-medium">{t}</p><p className="text-xs text-muted-foreground">{m}</p></li>)}</ul>
            </Panel>
          </div>
        </>
      )}
      {view === "schedule" && (
        <>
          <ViewTitle title="Weekly schedule" sub="Week of March 9" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-separate border-spacing-1 text-xs">
              <thead><tr><th className="w-14" />{WEEK_DAYS.map((d) => <th key={d} className="pb-1 text-left font-medium text-muted-foreground">{d}</th>)}</tr></thead>
              <tbody>{PERIODS.map((p, pi) => (
                <tr key={p}><td className="font-mono text-muted-foreground">{p}</td>{WEEK_DAYS.map((d, di) => {
                  const c = GRID[di]![pi]!;
                  return <td key={d} className={cn("rounded-lg p-2.5 font-medium", c.startsWith("AP") ? "bg-lavender-soft" : c.startsWith("Calc") ? "bg-mint-soft" : "bg-muted")}>{c}</td>;
                })}</tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
      {view === "work" && (open ? (
        <>
          <button type="button" className="mb-4 text-sm text-muted-foreground hover:text-foreground" onClick={() => setOpenId(null)}>← All coursework</button>
          <Chip tone="lavender">{open.course}</Chip>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">{open.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Due {open.due}</p>
          <Panel className="mt-4"><p className="text-sm leading-relaxed">{open.instructions}</p></Panel>
          <div className="mt-4">{open.submitted
            ? <Chip tone="mint"><CheckCircle2 className="size-3" />Submitted</Chip>
            : <button type="button" className={btnPrimary} onClick={() => submit(open.id)}>Mark as submitted</button>}</div>
        </>
      ) : (
        <>
          <ViewTitle title="Coursework" sub="Select an assignment for details" />
          {[...new Set(items.map((a) => a.course))].map((course) => (
            <div key={course} className="mb-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{course}</p>
              {items.filter((a) => a.course === course).map((a) => (
                <button key={a.id} type="button" onClick={() => setOpenId(a.id)} className="mb-2 flex w-full items-center gap-3 rounded-xl border border-hairline bg-card p-3 text-left text-sm hover:border-lavender/40">
                  <span className="font-medium">{a.title}</span>
                  <span className="ml-auto shrink-0">{a.submitted ? <Chip tone="mint">Submitted</Chip> : <Chip>{a.due}</Chip>}</span>
                </button>
              ))}
            </div>
          ))}
        </>
      ))}
      {view === "deadlines" && (
        <>
          <ViewTitle title="Deadlines" action={<button type="button" className={btnGhost} onClick={() => setAsc((v) => !v)}><ArrowDownUp className="size-4" />{asc ? "Soonest first" : "Latest first"}</button>} />
          <ul className="divide-y divide-hairline rounded-xl border border-hairline bg-card">
            {[...items].sort((a, b) => (asc ? a.days - b.days : b.days - a.days)).map((a) => (
              <li key={a.id} className="flex items-center gap-3 p-3 text-sm">
                <div><p className={cn("font-medium", a.submitted && "text-muted-foreground line-through")}>{a.title}</p><p className="text-xs text-muted-foreground">{a.course} · {a.due}</p></div>
                <span className="ml-auto">{a.submitted ? <Chip tone="mint">Done</Chip> : a.days <= 2 ? <Chip tone="warn">Due soon</Chip> : <Chip>{a.days} days</Chip>}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {view === "grades" && (
        <>
          <ViewTitle title="Grades" sub="Visible where authorized by your school" />
          <div className="grid gap-3 sm:grid-cols-2">{GRADES.map(([c, l, p, t]) => (
            <Panel key={c} className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-xl bg-lavender-soft text-lg font-semibold text-navy">{l}</span>
              <div><p className="text-sm font-medium">{c}</p><p className="text-xs text-muted-foreground">{p}% current</p></div>
              <span className="ml-auto">{t > 0 ? <TrendingUp className="size-4 text-mint" aria-label="Trending up" /> : t < 0 ? <TrendingDown className="size-4 text-destructive" aria-label="Trending down" /> : <span className="text-xs text-muted-foreground">Steady</span>}</span>
            </Panel>
          ))}</div>
        </>
      )}
      {view === "resources" && (
        <>
          <ViewTitle title="Resources" />
          <div className="grid gap-3 sm:grid-cols-2">{[
            ["Hartwell Library", "Databases, e-books and research help", BookOpen],
            ["Counseling", "Book time with Ms. Alvarez or the college office", LifeBuoy],
            ["Tech Help", "Device support and password resets", Sparkles],
            ["Student Handbook", "2026–27 policies and expectations", ClipboardList],
          ].map(([t, d, I]) => { const Icon = I as typeof BookOpen; return (
            <Panel key={t as string}><Icon className="size-5 text-lavender" aria-hidden /><p className="mt-3 text-sm font-medium">{t as string}</p><p className="text-xs text-muted-foreground">{d as string}</p></Panel>
          ); })}</div>
        </>
      )}
      {view === "news" && (
        <>
          <ViewTitle title="Announcements" />
          <div className="space-y-3">{NEWS.map(([t, m, b]) => <Panel key={t}><p className="text-sm font-medium">{t}</p><p className="text-xs text-muted-foreground">{m}</p><p className="mt-2 text-sm">{b}</p></Panel>)}</div>
        </>
      )}
      {view === "ai" && (
        <>
          <ViewTitle title="AI Study Tools" sub="Topic: Cellular Respiration (AP Biology)" />
          <div className="flex flex-wrap gap-2">{Object.keys(AI_RESP).map((q) => (
            <button key={q} type="button" className={cn(btnGhost, ai?.q === q && "border-lavender")} onClick={() => askAi(q)}><Sparkles className="size-4 text-lavender" />{q}</button>
          ))}</div>
          {ai && <Panel className="mt-4 bg-lavender-soft/50">{ai.loading ? <TypingDots /> : <p className="whitespace-pre-line text-sm leading-relaxed">{AI_RESP[ai.q]}</p>}</Panel>}
        </>
      )}
    </AppShell>
  );
}
