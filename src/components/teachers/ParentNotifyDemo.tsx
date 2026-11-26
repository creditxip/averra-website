import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Bell, Check, Loader2, RotateCcw, Send, Users } from "lucide-react";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { Chip, btnGhost, btnPrimary, input } from "@/components/demos/AppShell";
import { Reveal } from "@/components/ui/reveal";
import { NOTIFY_TYPES, TEMPLATES, type NotifyType } from "./notifyTemplates";
import { cn } from "@/lib/utils";

const ROSTER = [
  ["Priya Shah", "A", "96%"], ["Alex Morgan", "B+", "87%"], ["Daniel Kim", "A-", "92%"], ["Sofia Alvarez", "A", "95%"], ["Marcus Lee", "B", "84%"], ["Hannah Brooks", "A-", "91%"],
] as const;
const STEPS = ["Select student", "Student profile", "Notify parent", "Compose", "Send", "Parent receives"];

export function ParentNotifyDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<NotifyType>("Assignment reminder");
  const [msg, setMsg] = useState(TEMPLATES["Assignment reminder"]);
  const [phone, setPhone] = useState<"idle" | "lock" | "inbox" | "open">("idle");

  useEffect(() => {
    if (step !== 4) return;
    const t = setTimeout(() => { setStep(5); setPhone("lock"); }, reduce ? 50 : 1400);
    return () => clearTimeout(t);
  }, [step, reduce]);
  useEffect(() => {
    if (phone !== "lock") return;
    const t = setTimeout(() => setPhone((p) => (p === "lock" ? "inbox" : p)), 2600);
    return () => clearTimeout(t);
  }, [phone]);

  const restart = () => { setStep(0); setType("Assignment reminder"); setMsg(TEMPLATES["Assignment reminder"]); setPhone("idle"); };
  const pickType = (t: NotifyType) => { setType(t); setMsg(TEMPLATES[t]); };

  return (
    <Reveal className="mt-24">
      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">From one click to the right parent.</h3>
      <p className="mt-2 max-w-2xl text-muted-foreground">No separate email to compose — the message reaches the right parent inside your school's app.</p>

      <ol className="mt-8 flex flex-wrap gap-2" aria-label="Notification steps">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} className={cn("flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium", i < step ? "border-mint bg-mint-soft" : i === step ? "border-lavender bg-lavender-soft" : "border-hairline text-muted-foreground")}>
            <span className={cn("grid size-4 place-items-center rounded-full text-[9px]", i < step ? "bg-mint text-navy" : "bg-card")}>{i < step ? <Check className="size-2.5" aria-hidden /> : i + 1}</span>{s}
          </li>
        ))}
        <li className="ml-auto"><button type="button" className={btnGhost} onClick={restart}><RotateCcw className="size-3.5" aria-hidden />Restart</button></li>
      </ol>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_auto]">
        <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-float">
          <div className="flex items-center gap-1.5 border-b border-hairline bg-muted/50 px-4 py-2.5">
            {[0, 1, 2].map((i) => <span key={i} className="size-2.5 rounded-full bg-muted-foreground/30" />)}
            <span className="ml-3 text-xs font-medium text-muted-foreground">AVERRA TEACHER · AP Biology · Period 2</span>
            <span className="ml-auto"><Chip tone="mint">Simulated demo — sample data</Chip></span>
          </div>
          <div className="min-h-[420px] p-5">
            {step === 0 && (
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Users className="size-4 text-lavender" aria-hidden />Class roster · 24 students</p>
                <ul className="divide-y divide-hairline rounded-xl border border-hairline">
                  {ROSTER.map(([n, g, p]) => {
                    const alex = n === "Alex Morgan";
                    return (
                      <li key={n}>
                        <button type="button" disabled={!alex} onClick={() => setStep(1)} className={cn("flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm", alex ? "relative bg-lavender-soft font-medium ring-2 ring-lavender/60 ring-inset hover:bg-lavender-soft/70" : "cursor-default text-muted-foreground")}>
                          {alex && !reduce && <span className="absolute inset-0 animate-pulse rounded bg-lavender/10" aria-hidden />}
                          <span className="relative grid size-7 place-items-center rounded-full bg-muted text-[10px] font-semibold">{n.split(" ").map((w) => w[0]).join("")}</span>
                          <span className="relative flex-1">{n}</span><span className="relative text-xs">{g} · {p}</span>
                          {alex && <span className="relative text-xs text-lavender">Open →</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {(step === 1 || step === 2) && (
              <div>
                <button type="button" className="mb-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground" onClick={() => setStep(0)}><ArrowLeft className="size-3" aria-hidden />Roster</button>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="bg-brand grid size-14 place-items-center rounded-full text-lg font-semibold text-primary-foreground">AM</span>
                  <div className="flex-1"><p className="text-lg font-semibold">Alex Morgan</p><p className="text-sm text-muted-foreground">Grade 11 · AP Biology · Period 2</p></div>
                  <button type="button" className={cn(btnPrimary, !reduce && "animate-pulse")} onClick={() => setStep(3)}><Bell className="size-4" aria-hidden />Notify Parent</button>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <Stat k="Current grade" v="B+ · 87%" /><Stat k="Attendance" v="96% · 1 tardy" /><Stat k="Linked guardian" v="Jordan Morgan (parent)" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent assignments</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {[["Cellular Respiration Lab", "Due tomorrow · Not submitted", "warn"], ["Cell Structure Quiz", "46/50", "mint"], ["Mitosis Diagram", "Submitted · 18/20", "mint"]].map(([t, s, tone]) => (
                    <li key={t} className="flex items-center justify-between rounded-lg border border-hairline px-3 py-2"><span>{t}</span><Chip tone={tone as "warn" | "mint"}>{s}</Chip></li>
                  ))}
                </ul>
              </div>
            )}
            {(step === 3 || step === 4) && (
              <div>
                <p className="text-sm font-semibold">Notify Jordan Morgan <span className="font-normal text-muted-foreground">· parent of Alex Morgan</span></p>
                <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Notification type">
                  {NOTIFY_TYPES.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => pickType(t)} className={cn("rounded-full border px-3 py-1.5 text-xs", type === t ? "border-lavender bg-lavender text-primary-foreground" : "border-hairline hover:border-lavender/60")}>{t}</button>)}
                </div>
                <label htmlFor="notify-msg" className="mt-4 block text-xs font-medium text-muted-foreground">Message</label>
                <textarea id="notify-msg" rows={5} value={msg} onChange={(e) => setMsg(e.target.value)} className={cn(input, "mt-1")} />
                <div className="mt-4 flex items-center gap-3">
                  <button type="button" className={btnPrimary} disabled={step === 4 || !msg.trim()} onClick={() => setStep(4)}>
                    {step === 4 ? <><Loader2 className="size-4 animate-spin" aria-hidden />Sending…</> : <><Send className="size-4" aria-hidden />Send</>}
                  </button>
                  <span className="text-xs text-muted-foreground">Delivered inside the AVERRA FAMILY app</span>
                </div>
              </div>
            )}
            {step === 5 && (
              <div className="grid h-full place-items-center py-16 text-center">
                <div><span className="mx-auto grid size-12 place-items-center rounded-full bg-mint text-navy"><Check className="size-6" aria-hidden /></span>
                  <p className="mt-4 font-semibold">Sent to Jordan Morgan</p><p className="mt-1 text-sm text-muted-foreground">{type} · just now</p>
                  <p className="mt-4 text-sm text-muted-foreground">Tap the notification on the phone to open it →</p></div>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto">
          <PhoneFrame label="Parent's AVERRA FAMILY app" className="h-[560px] w-[270px]">
            <div className="relative h-full">
              {phone === "lock" || phone === "idle" ? (
                <div className="flex h-full flex-col items-center bg-gradient-to-b from-navy to-lavender/60 px-3 pt-10 text-on-dark">
                  <p className="text-5xl font-light">9:41</p><p className="text-xs opacity-80">Wednesday, March 18</p>
                  <AnimatePresence>
                    {phone === "lock" && (
                      <motion.button type="button" onClick={() => setPhone("open")} initial={reduce ? false : { y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 w-full rounded-2xl bg-card/95 p-3 text-left text-navy shadow-lg">
                        <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground"><Bell className="size-2.5" aria-hidden />AVERRA FAMILY · now</p>
                        <p className="mt-1 text-xs font-semibold">{type} · Ms. Rivera</p><p className="line-clamp-2 text-[11px] text-muted-foreground">{msg}</p>
                      </motion.button>
                    )}
                  </AnimatePresence>
                  {phone === "idle" && <p className="mt-10 text-[11px] opacity-60">Waiting for a message…</p>}
                </div>
              ) : phone === "inbox" ? (
                <div className="h-full px-4 pt-5">
                  <p className="text-lg font-semibold">Inbox</p>
                  <button type="button" onClick={() => setPhone("open")} className="mt-3 w-full rounded-2xl border-l-4 border-lavender bg-card p-3 text-left shadow-soft">
                    <div className="flex justify-between text-xs"><span className="font-semibold">Ms. Rivera</span><span className="text-[10px] text-muted-foreground">now</span></div>
                    <p className="text-[11px] font-medium">{type} · Alex</p><p className="line-clamp-2 text-[11px] text-muted-foreground">{msg}</p>
                  </button>
                  {[["Westbrook Academy", "Conferences booking opens Monday"], ["Attendance", "Alex · present all day"]].map(([a, b]) => <div key={a} className="mt-2 rounded-2xl bg-card p-3 text-[11px] opacity-70 shadow-soft"><p className="font-semibold">{a}</p><p className="text-muted-foreground">{b}</p></div>)}
                </div>
              ) : (
                <div className="h-full px-4 pt-5">
                  <button type="button" onClick={() => setPhone("inbox")} className="flex items-center gap-1 text-[11px] text-lavender"><ArrowLeft className="size-3" aria-hidden />Inbox</button>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{type}</p>
                  <p className="text-base font-semibold">Ms. Rivera · AP Biology</p><p className="text-[11px] text-muted-foreground">About Alex Morgan · just now</p>
                  <p className="mt-4 rounded-2xl rounded-tl-md bg-card p-3 text-xs leading-relaxed shadow-soft">{msg}</p>
                  <div className="mt-4 rounded-xl border border-hairline p-2 text-[11px] text-muted-foreground">Reply to Ms. Rivera…</div>
                </div>
              )}
            </div>
          </PhoneFrame>
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Demonstration workflow. Delivery channels (push, email, SMS) and integrations with your existing systems are configured during implementation.</p>
    </Reveal>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return <div className="rounded-xl border border-hairline p-3"><p className="text-[11px] text-muted-foreground">{k}</p><p className="mt-0.5 text-sm font-semibold">{v}</p></div>;
}
