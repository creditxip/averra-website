import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bell, BookOpen, KeyRound, Lock, RotateCcw, User, CalendarDays, CheckCircle2, Clock, GraduationCap, Megaphone, MessageSquare, Users, type LucideIcon } from "lucide-react";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { cn } from "@/lib/utils";

type ScreenId = "login" | "home" | "progress" | "assign" | "attend" | "news" | "messages" | "events" | "detail";
const FEATURES: { id: ScreenId; label: string; icon: LucideIcon; desc: string }[] = [
  { id: "login", label: "Parent login", icon: KeyRound, desc: "Secure sign-in to your family account." },
  { id: "home", label: "Student-linked dashboard", icon: Users, desc: "Every linked child, one calm overview." },
  { id: "news", label: "Announcements", icon: Megaphone, desc: "Official updates from the school office." },
  { id: "messages", label: "Teacher messages", icon: MessageSquare, desc: "Direct, respectful threads with teachers." },
  { id: "events", label: "Events", icon: CalendarDays, desc: "Conferences, performances and games." },
  { id: "progress", label: "Academic updates", icon: GraduationCap, desc: "Course progress, where your school authorizes it." },
  { id: "assign", label: "Assignment reminders", icon: BookOpen, desc: "New work, due dates and submissions." },
  { id: "attend", label: "Attendance alerts", icon: Clock, desc: "Know right away about absences and tardies." },
];

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={cn("rounded-2xl bg-card p-3 shadow-soft", className)}>{children}</div>;
const H = ({ children }: { children: React.ReactNode }) => <p className="mb-3 text-lg font-semibold tracking-tight">{children}</p>;

function Screen({ id, kid, setKid, go }: { id: ScreenId; kid: "Maya" | "Ethan"; setKid: (k: "Maya" | "Ethan") => void; go: (s: ScreenId) => void }) {
  switch (id) {
    case "login": return (<div className="flex h-full flex-col justify-center pb-16">
      <span className="bg-brand mx-auto grid size-14 place-items-center rounded-2xl text-lg font-semibold text-primary-foreground">WA</span>
      <p className="mt-3 text-center text-lg font-semibold">Westbrook Academy</p><p className="text-center text-[11px] text-muted-foreground">AVERRA FAMILY</p>
      <div className="mt-6 space-y-2 text-xs"><div className="rounded-xl border border-hairline bg-card p-2.5">jennifer.chen@example.com</div><div className="rounded-xl border border-hairline bg-card p-2.5">••••••••••</div></div>
      <button type="button" onClick={() => go("home")} className="mt-4 rounded-xl bg-navy py-2.5 text-sm font-semibold text-on-dark">Sign in</button>
      <p className="mt-2 text-center text-[9px] text-muted-foreground">Demo sign-in · no real account</p></div>);
    case "detail": return (<>
      <button type="button" onClick={() => go("assign")} className="text-[11px] text-lavender">← Assignments</button>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">AP Biology · Maya</p><H>Cellular Respiration Lab</H>
      <div className="space-y-2 text-xs">
        <Card className="flex justify-between"><span className="text-muted-foreground">Due</span><span className="font-semibold">Tomorrow · Thu, Mar 19, 11:59 PM</span></Card>
        <Card className="flex justify-between"><span className="text-muted-foreground">Teacher</span><span className="font-semibold">Ms. Rivera</span></Card>
        <Card className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="rounded-full bg-destructive/10 px-2 text-[10px] font-semibold text-destructive">Not yet submitted</span></Card>
        <Card><p className="font-semibold">Instructions</p><p className="mt-1 text-muted-foreground">Measure CO₂ output of germinating peas at two temperatures, record data in the template, and write a one-page analysis.</p></Card>
      </div>
      <button type="button" onClick={() => go("messages")} className="mt-3 w-full rounded-xl bg-navy py-2 text-xs font-semibold text-on-dark">Message teacher</button></>);
    case "home": return (<>
      <p className="text-[11px] text-muted-foreground">Westbrook Academy</p><H>Good evening, Jennifer</H>
      <div className="flex gap-2">{(["Maya", "Ethan"] as const).map((k) => (
        <button key={k} type="button" onClick={() => setKid(k)} aria-pressed={kid === k} className={cn("flex flex-1 items-center gap-2 rounded-2xl p-2 text-left text-xs", kid === k ? "bg-navy text-on-dark" : "bg-card shadow-soft")}>
          <span className="bg-brand grid size-7 place-items-center rounded-full text-[10px] font-semibold text-primary-foreground">{k[0]}</span>
          <span><span className="block font-semibold">{k} Chen</span><span className="opacity-70">Grade {k === "Maya" ? 11 : 8}</span></span>
        </button>))}</div>
      <p className="mt-4 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Today for {kid}</p>
      <div className="space-y-2">
        <Card className="flex items-center gap-2 text-xs"><CheckCircle2 className="size-4 text-mint" aria-hidden />{kid === "Maya" ? "Checked in at 7:52 AM" : "Tardy at 8:07 AM — Period 1"}</Card>
        <Card className="text-xs"><p className="font-semibold">{kid === "Maya" ? "Chemistry Quiz — 94%" : "Volcano model due Monday"}</p><p className="text-muted-foreground">{kid === "Maya" ? "New grade posted" : "Earth Science"}</p></Card>
        <Card className="text-xs"><p className="font-semibold">Spring Showcase</p><p className="text-muted-foreground">Thu, Apr 23 · 6:00 PM</p></Card>
      </div></>);
    case "progress": return (<><H>Progress · Maya</H><p className="-mt-2 mb-3 text-[10px] text-muted-foreground">Shown where authorized by Westbrook</p>
      <div className="space-y-2">{[["AP Biology", 95], ["Calculus BC", 91], ["English Literature", 88], ["Spanish IV", 96], ["US History", 92]].map(([c, g]) => (
        <Card key={c} className="text-xs"><div className="flex justify-between"><span className="font-medium">{c}</span><span>{g}%</span></div><div className="mt-1.5 h-1 rounded-full bg-muted"><div className="bg-brand h-full rounded-full" style={{ width: `${g}%` }} /></div></Card>
      ))}</div></>);
    case "assign": return (<><H>Assignments</H><div className="space-y-2">{[["Cellular Respiration Lab", "AP Biology · Due tomorrow", "New"], ["Problem Set 7", "Calculus BC · Due Fri", ""], ["Gatsby Ch. 5 Response", "English · Submitted", "Done"], ["Volcano Model", "Ethan · Earth Science · Mon", ""]].map(([t, s, b]) => (
      <Card key={t} className={cn("flex items-center justify-between text-xs", t === "Cellular Respiration Lab" && "cursor-pointer ring-1 ring-lavender/40")}><div onClick={() => t === "Cellular Respiration Lab" && go("detail")}><p className="font-semibold">{t}</p><p className="text-muted-foreground">{s}</p></div>{b && <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-semibold", b === "New" ? "bg-lavender-soft" : "bg-mint-soft")}>{b}</span>}</Card>
    ))}</div></>);
    case "attend": return (<><H>Attendance</H>
      <Card className="border-l-4 border-lavender text-xs"><p className="flex items-center gap-1 text-[10px] font-semibold text-lavender"><Clock className="size-3" aria-hidden />Alert · 8:09 AM</p><p className="mt-1 font-semibold">Ethan was marked tardy at 8:07 AM — Period 1</p><p className="mt-1 text-muted-foreground">Pre-Algebra · Mr. Lawson</p></Card>
      <div className="mt-3 space-y-2">{[["Maya", "Present · checked in 7:52 AM"], ["Ethan · Mar 9", "Excused · Orthodontist"], ["Maya · Mar 9", "Present all day"]].map(([n, s]) => <Card key={n} className="flex items-center gap-2 text-xs"><CheckCircle2 className="size-3.5 text-mint" aria-hidden /><span className="font-medium">{n}</span><span className="text-muted-foreground">{s}</span></Card>)}</div></>);
    case "news": return (<><H>Announcements</H><div className="space-y-2">{[["Parent-teacher conferences", "Booking opens Monday, March 16."], ["No school Friday, March 20", "Faculty development day."], ["Spring Showcase tickets", "Reserve seats in Events."]].map(([t, b]) => <Card key={t} className="text-xs"><p className="font-semibold">{t}</p><p className="text-muted-foreground">{b}</p></Card>)}</div></>);
    case "messages": return (<><H>Ms. Rivera</H><p className="-mt-2 mb-3 text-[10px] text-muted-foreground">AP Biology · re: Maya</p>
      <div className="space-y-2 text-[11px]">
        <p className="w-[85%] rounded-2xl rounded-bl-md bg-card p-2.5 shadow-soft">Maya's lab presentation today was excellent — she led her group's analysis.</p>
        <p className="ml-auto w-[80%] rounded-2xl rounded-br-md bg-navy p-2.5 text-on-dark">Thank you! She's loved this unit.</p>
        <p className="w-[85%] rounded-2xl rounded-bl-md bg-card p-2.5 shadow-soft">Wonderful. The lab report is due Thursday — she's in great shape.</p>
      </div></>);
    case "events": return (<><H>Upcoming</H><div className="space-y-2">{[["MAR", "26", "Parent-Teacher Conferences", "3:00 PM · Main Hall"], ["APR", "02", "College Info Night", "6:30 PM · Auditorium"], ["APR", "23", "Spring Showcase", "6:00 PM · Arts Center"], ["MAY", "08", "Family Field Day", "North Fields"]].map(([m, d, t, w]) => (
      <Card key={t} className="flex items-center gap-2.5 text-xs"><span className="grid w-10 place-items-center rounded-lg bg-lavender-soft py-1 leading-none"><span className="text-[8px] font-semibold">{m}</span><span className="text-sm font-semibold">{d}</span></span><div><p className="font-semibold">{t}</p><p className="text-muted-foreground">{w}</p></div></Card>
    ))}</div></>);
  }
}

export function FamilyShowcase() {
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState<ScreenId>("login");
  const [kid, setKid] = useState<"Maya" | "Ethan">("Maya");
  const [banner, setBanner] = useState(false);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    if (screen === "login") return;
    const t = setTimeout(() => setBanner(true), reduce ? 200 : 1800);
    return () => clearTimeout(t);
  }, [replay, screen === "login", reduce]);

  const openBanner = () => { setBanner(false); setKid("Maya"); setScreen("detail"); };
  const replayIt = () => { setBanner(false); if (screen === "login") setScreen("home"); setReplay((r) => r + 1); };

  return (
    <div className="mt-14 grid items-center gap-14 lg:grid-cols-[1fr_auto]">
      <div>
        <ul className="grid gap-2 sm:grid-cols-2" aria-label="Family app features">
          {FEATURES.map((f) => {
            const on = screen === f.id || (f.id === "assign" && screen === "detail");
            return (
              <li key={f.id}>
                <button type="button" onClick={() => setScreen(f.id)} aria-pressed={on}
                  className={cn("flex w-full gap-3 rounded-2xl border p-4 text-left transition-colors", on ? "border-hairline-dark bg-on-dark/10" : "border-transparent hover:bg-on-dark/5")}>
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", on ? "bg-brand text-navy" : "bg-on-dark/10 text-on-dark")}><f.icon className="size-4" aria-hidden /></span>
                  <span><span className="block text-sm font-semibold text-on-dark">{f.label}</span><span className="mt-0.5 block text-xs text-on-dark-muted">{f.desc}</span></span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 rounded-2xl border border-hairline-dark bg-on-dark/5 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-on-dark"><ShieldIcon />Role-based access</p>
          <p className="mt-1 text-sm text-on-dark-muted">Parents only see students linked to their account and the information the school authorizes.</p>
          <ul className="mt-4 space-y-2 text-sm">
            {(["Maya", "Ethan"] as const).map((k) => (
              <li key={k}><button type="button" onClick={() => { setKid(k); if (screen === "login") setScreen("home"); }} aria-pressed={kid === k} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-on-dark", kid === k ? "bg-on-dark/15" : "bg-on-dark/5 hover:bg-on-dark/10")}>
                <User className="size-4 text-mint" aria-hidden />{k} Chen · Grade {k === "Maya" ? 11 : 8}<span className="ml-auto text-xs text-mint">Linked</span></button></li>
            ))}
            <li className="flex items-center gap-3 rounded-xl border border-dashed border-hairline-dark px-3 py-2 text-on-dark-muted"><Lock className="size-4" aria-hidden />Other students — not visible</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto">
        <div className="animate-float-slow">
          <PhoneFrame label="AVERRA FAMILY app on iPhone" className="h-[620px] w-[300px]">
            <div className="relative h-full">
              <AnimatePresence>
                {banner && (
                  <motion.button type="button" onClick={openBanner} initial={reduce ? false : { y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? { opacity: 0 } : { y: -80, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    className="absolute inset-x-2 top-1 z-20 rounded-2xl bg-navy/95 p-3 text-left text-on-dark shadow-float backdrop-blur" aria-label="Notification: Your student's biology assignment is due tomorrow. Open">
                    <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide opacity-70"><Bell className="size-2.5" aria-hidden />AVERRA FAMILY · now</p>
                    <p className="mt-1 text-xs font-semibold">Assignment reminder</p>
                    <p className="text-[11px] opacity-85">Your student's biology assignment is due tomorrow.</p>
                  </motion.button>
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div key={screen} className="h-full overflow-hidden px-4 pt-5" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? {} : { opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
                  <Screen id={screen} kid={kid} setKid={setKid} go={setScreen} />
                </motion.div>
              </AnimatePresence>
            </div>
          </PhoneFrame>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3">
          <button type="button" onClick={replayIt} className="inline-flex items-center gap-1.5 rounded-full border border-hairline-dark px-4 py-2 text-sm text-on-dark hover:bg-on-dark/10"><RotateCcw className="size-3.5" aria-hidden />Replay notification</button>
          <p className="text-center text-xs text-on-dark-muted">Simulated demo — sample data.</p>
        </div>
      </div>
    </div>
  );
}

function ShieldIcon() { return <Lock className="size-4 text-mint" aria-hidden />; }
