import { useEffect, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Bell, BookOpen, Check, CheckCircle2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- shared bits ---------- */
function Window({ children, className, label }: { children: ReactNode; className?: string; label: string }) {
  return (
    <div role="img" aria-label={label} className={cn("rounded-2xl border border-hairline bg-card shadow-float", className)}>
      {children}
    </div>
  );
}
function Chrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-hairline px-4 py-2.5">
      <span className="size-2 rounded-full bg-muted-foreground/25" />
      <span className="size-2 rounded-full bg-muted-foreground/25" />
      <span className="size-2 rounded-full bg-muted-foreground/25" />
      <span className="ml-2 text-[10px] font-medium text-muted-foreground">{title}</span>
    </div>
  );
}

/* ---------- 1. Student dashboard ---------- */
function StudentDashboard() {
  const schedule = [
    ["8:15", "AP Biology", "Rm 204", "bg-lavender"],
    ["9:30", "Calculus BC", "Rm 118", "bg-mint"],
    ["10:45", "English Literature", "Library", "bg-lavender/50"],
    ["12:30", "Spanish IV", "Rm 310", "bg-mint/60"],
  ];
  return (
    <Window label="Student dashboard showing Maya's schedule and progress" className="w-[380px]">
      <Chrome title="averra · student" />
      <div className="grid grid-cols-[1fr_auto] gap-5 p-5">
        <div>
          <p className="text-[11px] text-muted-foreground">Tuesday, March 10</p>
          <p className="mt-0.5 text-lg font-semibold tracking-tight">Good morning, Maya</p>
          <p className="mt-4 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Today</p>
          <ul className="mt-2 space-y-2">
            {schedule.map(([t, c, r, dot]) => (
              <li key={c} className="flex items-center gap-2.5 text-xs">
                <span className="w-9 font-mono text-[10px] text-muted-foreground">{t}</span>
                <span className={cn("h-4 w-0.5 rounded-full", dot)} />
                <span className="font-medium">{c}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative size-20">
            <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--muted)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--lavender)" strokeWidth="3" strokeLinecap="round" strokeDasharray="97.4" strokeDashoffset="9" />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <span className="text-base font-semibold leading-none">3.86<br /><span className="text-[9px] font-normal text-muted-foreground">GPA</span></span>
            </div>
          </div>
          <span className="mt-2 rounded-full bg-mint-soft px-2 py-0.5 text-[9px] font-medium text-navy">+0.12 this term</span>
        </div>
      </div>
      <div className="border-t border-hairline px-5 py-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Upcoming</p>
        <div className="mt-2 flex gap-2">
          {[["Lab report", "Thu"], ["Problem set 7", "Fri"]].map(([a, d]) => (
            <span key={a} className="rounded-lg bg-muted px-2.5 py-1.5 text-[10px]"><b className="font-medium">{a}</b> · {d}</span>
          ))}
        </div>
      </div>
    </Window>
  );
}

/* ---------- 2. Teacher workspace ---------- */
function TeacherWorkspace() {
  return (
    <Window label="Teacher workspace showing AP Biology submissions" className="w-[330px]">
      <Chrome title="averra · teach" />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold tracking-tight">AP Biology · Period 2</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground"><Users className="size-3" aria-hidden />24 students</p>
          </div>
          <BookOpen className="size-4 text-lavender" aria-hidden />
        </div>
        <div className="mt-4 rounded-xl border border-hairline p-3.5">
          <p className="text-xs font-medium">Cellular Respiration Lab</p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Submissions</span><span className="font-medium text-foreground">18/24</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="bg-brand h-full w-3/4 rounded-full" />
          </div>
          <div className="mt-3 flex -space-x-1.5">
            {["MR", "JL", "AK", "DT", "SO"].map((i) => (
              <span key={i} className="grid size-5 place-items-center rounded-full border border-card bg-lavender-soft text-[7px] font-semibold text-navy">{i}</span>
            ))}
            <span className="grid size-5 place-items-center rounded-full border border-card bg-muted text-[7px]">+13</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-lavender-soft px-3 py-2 text-[10px] text-navy">
          <Sparkles className="size-3 text-lavender" aria-hidden />
          Draft feedback ready for 6 submissions
        </div>
      </div>
    </Window>
  );
}

/* ---------- 3. Parent phone ---------- */
function ParentPhone() {
  return (
    <div role="img" aria-label="Parent mobile app showing a new grade and attendance" className="w-[200px] rounded-[2rem] border border-hairline bg-navy p-1.5 shadow-float">
      <div className="overflow-hidden rounded-[1.6rem] bg-cloud">
        <div className="mx-auto mt-2 h-4 w-16 rounded-full bg-navy" />
        <div className="p-3.5">
          <p className="text-[10px] text-muted-foreground">Family</p>
          <p className="text-sm font-semibold tracking-tight">Hi, Jennifer</p>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-card p-2 shadow-soft">
            <span className="bg-brand grid size-6 place-items-center rounded-full text-[8px] font-semibold text-primary-foreground">M</span>
            <div><p className="text-[10px] font-medium">Maya Chen</p><p className="text-[8px] text-muted-foreground">Grade 11</p></div>
          </div>
          <div className="mt-2 rounded-xl bg-card p-2.5 shadow-soft">
            <p className="flex items-center gap-1 text-[8px] font-medium text-lavender"><Bell className="size-2.5" aria-hidden />New grade posted</p>
            <p className="mt-1 text-[10px] font-medium">Chemistry Quiz</p>
            <p className="text-lg font-semibold tracking-tight">94%</p>
          </div>
          <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-mint-soft p-2 text-[9px] text-navy">
            <CheckCircle2 className="size-3" aria-hidden />Checked in · 7:52 AM
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 4. AI assistant ---------- */
function AiChat() {
  return (
    <Window label="AI assistant answering a question about the Spring Showcase" className="w-[300px] p-4">
      <div className="ml-auto w-fit rounded-2xl rounded-br-md bg-navy px-3 py-2 text-[11px] text-on-dark">When is the Spring Showcase?</div>
      <div className="mt-3 flex gap-2">
        <span className="bg-brand grid size-6 shrink-0 place-items-center rounded-full"><Sparkles className="size-3 text-primary-foreground" aria-hidden /></span>
        <div>
          <p className="rounded-2xl rounded-tl-md bg-muted px-3 py-2 text-[11px] leading-relaxed">
            The Spring Showcase is <b className="font-semibold">Thursday, April 23 at 6:00 PM</b> in the Performing Arts Center. Doors open at 5:30.
          </p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-hairline px-2 py-0.5 text-[9px] text-muted-foreground">
            <ShieldCheck className="size-2.5 text-mint" aria-hidden />Answer from approved school sources
          </span>
        </div>
      </div>
    </Window>
  );
}

/* ---------- 5. Admin analytics ---------- */
function AdminAnalytics() {
  const pts = [22, 30, 28, 40, 38, 52, 49, 61, 58, 70, 74, 82];
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * 280},${90 - p}`).join(" ");
  return (
    <Window label="Administrative analytics with engagement chart" className="w-[340px]">
      <Chrome title="averra · insights" />
      <div className="p-5">
        <div className="grid grid-cols-3 gap-3">
          {[["Weekly active families", "87%"], ["Avg. attendance", "96.4%"], ["Msgs resolved", "1,284"]].map(([k, v]) => (
            <div key={k}><p className="text-base font-semibold tracking-tight">{v}</p><p className="text-[9px] leading-tight text-muted-foreground">{k}</p></div>
          ))}
        </div>
        <svg viewBox="0 0 280 90" className="mt-4 h-20 w-full" aria-hidden>
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--lavender)" stopOpacity="0.25" />
              <stop offset="1" stopColor="var(--lavender)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${d} L280,90 L0,90 Z`} fill="url(#area)" />
          <path d={d} fill="none" stroke="var(--lavender)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground"><Check className="size-3 text-mint" aria-hidden />Engagement · last 12 weeks</p>
      </div>
    </Window>
  );
}

/* ---------- composition ---------- */
function Layer({ x, y, depth, className, float, children }: { x: MotionValue<number>; y: MotionValue<number>; depth: number; className: string; float: string; children: ReactNode }) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return (
    <motion.div style={{ x: tx, y: ty }} className={cn("absolute", className)}>
      <div className={float}>{children}</div>
    </motion.div>
  );
}

export function HeroInterfaces() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 18 });
  const y = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <>
      {/* Desktop: layered composition */}
      <div className="relative hidden h-[600px] lg:block" style={{ perspective: "1600px" }}>
        <div className="absolute inset-0" style={{ transform: "rotateY(-8deg) rotateX(4deg)", transformStyle: "preserve-3d" }}>
          <Layer x={x} y={y} depth={-8} className="right-0 top-0" float="animate-float-slow"><AdminAnalytics /></Layer>
          <Layer x={x} y={y} depth={10} className="left-0 top-16" float="animate-float"><StudentDashboard /></Layer>
          <Layer x={x} y={y} depth={16} className="left-24 bottom-6" float="animate-float-slow [animation-delay:-3s]"><TeacherWorkspace /></Layer>
          <Layer x={x} y={y} depth={24} className="right-6 bottom-0" float="animate-float [animation-delay:-2s]"><ParentPhone /></Layer>
          <Layer x={x} y={y} depth={30} className="right-44 top-[230px]" float="animate-float [animation-delay:-5s]"><AiChat /></Layer>
        </div>
      </div>
      {/* Mobile / tablet: simplified stack */}
      <div className="flex flex-col items-center gap-4 lg:hidden">
        <div className="w-full max-w-[380px] [&>div]:w-full"><StudentDashboard /></div>
        <div className="w-full max-w-[380px] [&>div]:w-full"><AiChat /></div>
        <div className="w-full max-w-[380px] [&>div]:w-full"><TeacherWorkspace /></div>
      </div>
    </>
  );
}
