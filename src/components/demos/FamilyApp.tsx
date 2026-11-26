import { useState } from "react";
import { Bell, BookOpen, CalendarDays, CheckCircle2, GraduationCap, Megaphone, MessageSquare, Send, Settings, UserCheck } from "lucide-react";
import { AppShell, Chip, Panel, ViewTitle, btnPrimary, input, type NavItem } from "./AppShell";
import { Wordmark } from "@/components/ui/wordmark";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type View = "progress" | "assign" | "attend" | "news" | "messages" | "events" | "notify";
const NAV: NavItem<View>[] = [
  { id: "progress", label: "Academic progress", icon: GraduationCap },
  { id: "assign", label: "Assignments", icon: BookOpen },
  { id: "attend", label: "Attendance", icon: UserCheck },
  { id: "news", label: "Announcements", icon: Megaphone },
  { id: "messages", label: "Teachers", icon: MessageSquare },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "notify", label: "Notifications", icon: Bell },
];

const KIDS = {
  maya: { name: "Maya Chen", grade: "Grade 11", grades: [["AP Biology", 95], ["Calculus BC", 91], ["English Literature", 88], ["Spanish IV", 96]] as [string, number][],
    assign: [["Chemistry Quiz", "Graded · 94%"], ["Cellular Respiration Lab", "Due Thu"], ["Problem Set 7", "Due Fri"]],
    attend: [["Mar 10", "Checked in 7:52 AM", "present"], ["Mar 9", "Present all day", "present"], ["Mar 6", "Tardy · 8:24 AM", "tardy"]] },
  ethan: { name: "Ethan Chen", grade: "Grade 8", grades: [["Pre-Algebra", 89], ["Earth Science", 93], ["English 8", 90], ["World Cultures", 87]] as [string, number][],
    assign: [["Volcano Model", "Due Mon"], ["Reading Log Week 9", "Submitted"], ["Equations Quiz", "Graded · 86%"]],
    attend: [["Mar 10", "Checked in 7:48 AM", "present"], ["Mar 9", "Excused · Orthodontist", "excused"], ["Mar 6", "Present all day", "present"]] },
};
type Kid = keyof typeof KIDS;

export default function FamilyApp() {
  const [signedIn, setSignedIn] = useState(false);
  const [kid, setKid] = useState<Kid>("maya");
  const [view, setView] = useState<View>("progress");
  const [thread, setThread] = useState([
    { from: "Ms. Rivera", text: "Hi Jennifer — Maya's lab presentation today was excellent. She led her group's analysis.", time: "9:12 AM" },
    { from: "You", text: "Thank you so much for letting me know! She's been really excited about this unit.", time: "9:40 AM" },
  ]);
  const [draft, setDraft] = useState("");
  const [prefs, setPrefs] = useState({ grades: true, attendance: true, announcements: true, events: false, weekly: true });
  const k = KIDS[kid];

  if (!signedIn) {
    return (
      <div className="grid h-full place-items-center bg-muted/40 p-6">
        <form onSubmit={(e) => { e.preventDefault(); setSignedIn(true); }} className="w-full max-w-sm rounded-2xl border border-hairline bg-card p-7 shadow-float">
          <Wordmark />
          <h3 className="mt-6 text-xl font-semibold tracking-tight">Westbrook Academy Families</h3>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your parent account</p>
          <label className="mt-5 block text-xs font-medium" htmlFor="fam-email">Email</label>
          <input id="fam-email" className={cn(input, "mt-1")} defaultValue="jennifer.chen@example.com" />
          <label className="mt-3 block text-xs font-medium" htmlFor="fam-pass">Password</label>
          <input id="fam-pass" type="password" className={cn(input, "mt-1")} defaultValue="demo-password" />
          <button type="submit" className={cn(btnPrimary, "mt-5 w-full")}>Sign in to demo</button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">Demo only — no real authentication.</p>
        </form>
      </div>
    );
  }

  const switcher = (
    <div className="space-y-1">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Linked students</p>
      {(Object.keys(KIDS) as Kid[]).map((id) => (
        <button key={id} type="button" onClick={() => setKid(id)} aria-pressed={kid === id} className={cn("flex w-full items-center gap-2 rounded-lg p-2 text-left text-xs", kid === id ? "bg-card shadow-soft" : "hover:bg-card/60")}>
          <span className="bg-brand grid size-6 place-items-center rounded-full text-[10px] font-semibold text-primary-foreground">{KIDS[id].name[0]}</span>
          <span><span className="block font-medium">{KIDS[id].name}</span><span className="text-muted-foreground">{KIDS[id].grade}</span></span>
        </button>
      ))}
    </div>
  );

  return (
    <AppShell nav={NAV} active={view} onChange={setView} footer={switcher}>
      <div className="mb-5 flex gap-2 md:hidden">{(Object.keys(KIDS) as Kid[]).map((id) => (
        <button key={id} type="button" onClick={() => setKid(id)} aria-pressed={kid === id} className={cn("rounded-full border px-3 py-1 text-xs", kid === id ? "border-lavender bg-lavender-soft" : "border-hairline")}>{KIDS[id].name}</button>
      ))}</div>
      {view === "progress" && (<>
        <ViewTitle title={`Hi, Jennifer`} sub={`${k.name} · ${k.grade} · Shown where authorized by the school`} />
        <div className="space-y-3">{k.grades.map(([c, g]) => (
          <Panel key={c}><div className="flex justify-between text-sm"><span className="font-medium">{c}</span><span>{g}%</span></div>
            <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="bg-brand h-full rounded-full" style={{ width: `${g}%` }} /></div></Panel>
        ))}</div>
      </>)}
      {view === "assign" && (<>
        <ViewTitle title="Assignment updates" sub={k.name} />
        <ul className="divide-y divide-hairline rounded-xl border border-hairline bg-card">{k.assign.map(([t, s]) => (
          <li key={t} className="flex items-center justify-between p-3 text-sm"><span className="font-medium">{t}</span><Chip tone={s!.startsWith("Graded") ? "lavender" : s === "Submitted" ? "mint" : "muted"}>{s}</Chip></li>
        ))}</ul>
      </>)}
      {view === "attend" && (<>
        <ViewTitle title="Attendance" sub={k.name} />
        <div className="space-y-2">{k.attend.map(([d, t, s]) => (
          <Panel key={d} className="flex items-center gap-3 text-sm"><CheckCircle2 className={cn("size-4", s === "present" ? "text-mint" : "text-muted-foreground")} aria-hidden /><span className="font-medium">{d}</span><span className="text-muted-foreground">{t}</span></Panel>
        ))}</div>
      </>)}
      {view === "news" && (<>
        <ViewTitle title="School announcements" />
        <div className="space-y-3">{[["Spring Showcase — April 23", "Tickets are available for families in the Events tab."], ["Parent-teacher conferences", "Booking opens March 16 for conferences on March 26–27."], ["Campus closure", "No school on Friday, March 20 (faculty development day)."]].map(([t, b]) => (
          <Panel key={t}><p className="text-sm font-medium">{t}</p><p className="mt-1 text-sm text-muted-foreground">{b}</p></Panel>
        ))}</div>
      </>)}
      {view === "messages" && (<>
        <ViewTitle title="Ms. Rivera" sub="AP Biology · re: Maya Chen" />
        <div className="space-y-3">{thread.map((m, i) => (
          <div key={i} className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm", m.from === "You" ? "ml-auto rounded-br-md bg-navy text-on-dark" : "rounded-bl-md bg-muted")}>
            <p>{m.text}</p><p className={cn("mt-1 text-[10px]", m.from === "You" ? "text-on-dark-muted" : "text-muted-foreground")}>{m.from} · {m.time}</p>
          </div>
        ))}</div>
        <form className="mt-5 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!draft.trim()) return; setThread((t) => [...t, { from: "You", text: draft.trim(), time: "Just now" }]); setDraft(""); }}>
          <input aria-label="Message to Ms. Rivera" className={input} placeholder="Write a message…" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button type="submit" className={btnPrimary} aria-label="Send message"><Send className="size-4" /></button>
        </form>
      </>)}
      {view === "events" && (<>
        <ViewTitle title="Upcoming events" />
        <div className="grid gap-3 sm:grid-cols-2">{[["MAR", "26", "Parent-Teacher Conferences", "3:00–7:00 PM · Main Hall"], ["APR", "02", "College Info Night (Gr 11)", "6:30 PM · Auditorium"], ["APR", "23", "Spring Showcase", "6:00 PM · Performing Arts Center"], ["MAY", "08", "Family Field Day", "All day · North Fields"]].map(([m, d, t, w]) => (
          <Panel key={t} className="flex gap-3"><div className="grid w-12 shrink-0 place-items-center rounded-lg bg-lavender-soft py-1 text-center text-navy"><span className="text-[10px] font-semibold">{m}</span><span className="text-lg font-semibold leading-none">{d}</span></div><div><p className="text-sm font-medium">{t}</p><p className="text-xs text-muted-foreground">{w}</p></div></Panel>
        ))}</div>
      </>)}
      {view === "notify" && (<>
        <ViewTitle title="Notifications" sub="Parent-only feed and preferences" />
        <div className="space-y-2">{[["New grade posted: Chemistry Quiz — 94%", "Maya · 10 min ago"], ["Ethan's absence on Mar 9 marked excused", "Attendance · Yesterday"], ["Conference booking opens Monday", "Front Office · 2 days ago"]].map(([t, m]) => (
          <Panel key={t} className="text-sm"><p className="font-medium">{t}</p><p className="text-xs text-muted-foreground">{m}</p></Panel>
        ))}</div>
        <p className="mt-6 mb-2 flex items-center gap-2 text-sm font-medium"><Settings className="size-4" aria-hidden />Preferences</p>
        <Panel className="divide-y divide-hairline p-0">{(Object.keys(prefs) as (keyof typeof prefs)[]).map((key) => (
          <label key={key} className="flex items-center justify-between p-3 text-sm">
            {{ grades: "New grades", attendance: "Attendance alerts", announcements: "School announcements", events: "Event reminders", weekly: "Weekly summary email" }[key]}
            <Switch checked={prefs[key]} onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))} />
          </label>
        ))}</Panel>
      </>)}
    </AppShell>
  );
}
