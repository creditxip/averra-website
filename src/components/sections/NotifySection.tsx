import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Bell, Check, Pause, Play, RotateCcw, Send } from "lucide-react";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { btnPrimary, input } from "@/components/demos/AppShell";
import { cn } from "@/lib/utils";
import {
  FLAGSHIP_TYPES,
  TEMPLATES,
  notifyBeat,
  type NotifyPhase,
  type NotifyType,
} from "@/components/teachers/notifyTemplates";

const ROSTER = [
  ["Priya Shah", "A", "96%"],
  ["Alex Morgan", "B+", "87%"],
  ["Daniel Kim", "A-", "92%"],
  ["Sofia Alvarez", "A", "95%"],
] as const;

const PHASE_MS: Record<NotifyPhase, number> = {
  select: 1400,
  notify: 1200,
  compose: 1700,
  send: 900,
  deliver: 1600,
  open: 2300,
};

const NEXT: Record<NotifyPhase, NotifyPhase> = {
  select: "notify",
  notify: "compose",
  compose: "send",
  send: "deliver",
  deliver: "open",
  open: "select",
};

const BEATS = ["Select", "Send", "Delivered"] as const;

export function NotifySection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const [phase, setPhase] = useState<NotifyPhase>("select");
  const [type, setType] = useState<NotifyType>("Assignment reminder");
  const [draft, setDraft] = useState<string | null>(null);
  const [handsOn, setHandsOn] = useState(false);
  const [replying, setReplying] = useState(false);
  const [run, setRun] = useState(0);
  const message = draft ?? TEMPLATES[type];
  const beat = notifyBeat(phase);

  useEffect(() => {
    if (!inView) return;
    const wait = reduce ? 500 : PHASE_MS[phase];
    if (phase === "send" || phase === "deliver") {
      const id = window.setTimeout(() => setPhase(NEXT[phase]), wait);
      return () => window.clearTimeout(id);
    }
    if (handsOn) return;
    const id = window.setTimeout(() => setPhase(NEXT[phase]), wait);
    return () => window.clearTimeout(id);
  }, [phase, inView, handsOn, reduce, run]);

  const takeOver = () => setHandsOn(true);

  const replay = () => {
    setHandsOn(false);
    setType("Assignment reminder");
    setDraft(null);
    setReplying(false);
    setPhase("select");
    setRun((value) => value + 1);
  };

  const chooseType = (next: NotifyType) => {
    takeOver();
    setType(next);
    setDraft(null);
    setPhase("compose");
  };

  return (
    <section
      ref={ref}
      id="notify"
      aria-labelledby="notify-title"
      data-tone="light"
      className="relative scroll-mt-20 py-20 sm:py-28"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <p className="text-sm font-medium text-lavender">Simulated demonstration</p>
        <h2 id="notify-title" className="text-display mt-3 max-w-3xl text-4xl sm:text-5xl">
          From the gradebook to a parent's phone.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          No separate email. One click from the gradebook.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ol aria-label="Demonstration steps" className="flex items-center gap-2 text-sm">
            {BEATS.map((label, index) => (
              <li
                key={label}
                className="flex items-center gap-2"
                aria-current={label === beat ? "step" : undefined}
              >
                {index > 0 && (
                  <span className="text-muted-foreground" aria-hidden>
                    ·
                  </span>
                )}
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1",
                    label === beat ? "bg-navy font-medium text-on-dark" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-card px-3 py-1.5 text-sm"
              aria-pressed={handsOn}
              onClick={() => setHandsOn((value) => !value)}
            >
              {handsOn ? (
                <Play className="size-3.5" aria-hidden />
              ) : (
                <Pause className="size-3.5" aria-hidden />
              )}
              {handsOn ? "Play" : "Pause"}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-card px-3 py-1.5 text-sm"
              onClick={replay}
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Replay
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {beat === "Select"
              ? "Selecting Alex Morgan."
              : beat === "Send"
                ? "Sending the parent notification."
                : "Delivered to the parent's phone."}
          </p>
        </div>

        <div className="mt-8 grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-6">
          <TeacherWorkspace
            phase={phase}
            type={type}
            message={message}
            onPickStudent={() => {
              takeOver();
              setPhase("notify");
            }}
            onNotify={() => {
              takeOver();
              setPhase("compose");
            }}
            onType={chooseType}
            onMessage={(value) => {
              takeOver();
              setDraft(value);
            }}
            onSend={() => {
              takeOver();
              if (message.trim()) setPhase("send");
            }}
          />
          <Connector active={phase === "send"} reduce={!!reduce} />
          <ParentPhone
            phase={phase}
            type={type}
            message={message}
            replying={replying}
            reduce={!!reduce}
            onOpen={() => {
              takeOver();
              setPhase("open");
            }}
            onReply={() => {
              takeOver();
              setReplying(true);
            }}
          />
        </div>
      </div>
    </section>
  );
}

function TeacherWorkspace({
  phase,
  type,
  message,
  onPickStudent,
  onNotify,
  onType,
  onMessage,
  onSend,
}: {
  phase: NotifyPhase;
  type: NotifyType;
  message: string;
  onPickStudent: () => void;
  onNotify: () => void;
  onType: (type: NotifyType) => void;
  onMessage: (value: string) => void;
  onSend: () => void;
}) {
  const composing = phase === "compose" || phase === "send";
  const sent = phase === "deliver" || phase === "open";
  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-float">
        <div className="flex items-center gap-1.5 border-b border-hairline bg-muted/50 px-4 py-2.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-2.5 rounded-full bg-muted-foreground/30" />
          ))}
          <span className="ml-3 min-w-0 flex-1 truncate text-xs font-medium text-muted-foreground">
            AVERRA Teacher · AP Biology · Period 2
          </span>
          <span className="ml-auto shrink-0 rounded-full bg-mint-soft px-2.5 py-0.5 text-[11px] font-medium text-navy">
            Simulated demonstration
          </span>
        </div>
        <div className="min-h-[380px] p-4 sm:p-5">
          {phase === "select" && (
            <div>
              <p className="text-sm font-semibold">Class roster</p>
              <ul className="mt-3 divide-y divide-hairline rounded-xl border border-hairline">
                {ROSTER.map(([name, grade, score]) => {
                  const alex = name === "Alex Morgan";
                  return (
                    <li key={name}>
                      <button
                        type="button"
                        disabled={!alex}
                        onClick={onPickStudent}
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm",
                          alex
                            ? "bg-lavender-soft font-medium"
                            : "cursor-default text-muted-foreground",
                        )}
                      >
                        <span className="grid size-7 place-items-center rounded-full bg-muted text-[10px] font-semibold">
                          {name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </span>
                        <span className="flex-1">{name}</span>
                        <span className="text-xs">
                          {grade} · {score}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {phase === "notify" && (
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-brand grid size-12 place-items-center rounded-full text-sm font-semibold text-primary-foreground">
                  AM
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Alex Morgan</p>
                  <p className="text-sm text-muted-foreground">
                    Grade 11 · B+ · 87% · Guardian: Jordan Morgan
                  </p>
                </div>
                <button type="button" className={btnPrimary} onClick={onNotify}>
                  <Bell className="size-4" aria-hidden />
                  Notify Parent
                </button>
              </div>
              <p className="mt-4 rounded-xl border border-hairline px-3 py-2 text-sm">
                Cellular Respiration Lab · due tomorrow · not submitted
              </p>
            </div>
          )}
          {composing && (
            <div>
              <p className="text-sm font-semibold">
                Notify Jordan Morgan{" "}
                <span className="font-normal text-muted-foreground">· parent of Alex Morgan</span>
              </p>
              <div
                className="mt-3 flex flex-wrap gap-2"
                role="group"
                aria-label="Notification type"
              >
                {FLAGSHIP_TYPES.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    aria-pressed={type === item.type}
                    onClick={() => onType(item.type)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs",
                      type === item.type
                        ? "border-lavender bg-lavender text-primary-foreground"
                        : "border-hairline hover:border-lavender/60",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <label
                htmlFor="flagship-message"
                className="mt-3 block text-xs font-medium text-muted-foreground"
              >
                Message
              </label>
              <textarea
                id="flagship-message"
                rows={4}
                value={message}
                onChange={(event) => onMessage(event.target.value)}
                className={cn(input, "mt-1")}
              />
              <button
                type="button"
                className={cn(btnPrimary, "mt-3")}
                disabled={phase === "send" || !message.trim()}
                onClick={onSend}
              >
                <Send className="size-4" aria-hidden />
                {phase === "send" ? "Sending…" : "Send"}
              </button>
            </div>
          )}
          {sent && (
            <div className="grid min-h-[300px] place-items-center text-center">
              <div>
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-mint text-navy">
                  <Check className="size-6" aria-hidden />
                </span>
                <p className="mt-4 font-semibold">Sent to Jordan Morgan</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {FLAGSHIP_TYPES.find((item) => item.type === type)?.label} · just now
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mx-auto h-2 w-[88%] rounded-b-xl bg-navy/80" aria-hidden />
      <div className="mx-auto h-1.5 w-[36%] rounded-b-md bg-navy/40" aria-hidden />
    </div>
  );
}

function Connector({ active, reduce }: { active: boolean; reduce: boolean }) {
  return (
    <div className="flex items-center justify-center" aria-hidden>
      <div className="relative h-8 w-px overflow-hidden bg-lavender/40 lg:hidden">
        {active && !reduce && (
          <motion.span
            className="absolute left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-mint"
            animate={{ top: ["-20%", "110%"] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
      </div>
      <div className="relative hidden h-px w-16 overflow-hidden bg-lavender/40 lg:block">
        {active && !reduce && (
          <motion.span
            className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-mint"
            animate={{ left: ["-20%", "110%"] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
}

function ParentPhone({
  phase,
  type,
  message,
  replying,
  reduce,
  onOpen,
  onReply,
}: {
  phase: NotifyPhase;
  type: NotifyType;
  message: string;
  replying: boolean;
  reduce: boolean;
  onOpen: () => void;
  onReply: () => void;
}) {
  const label = FLAGSHIP_TYPES.find((item) => item.type === type)?.label ?? type;
  const locked = phase !== "open";
  return (
    <div className="mx-auto">
      <PhoneFrame
        label="Parent iPhone, Averra Family"
        className="h-[460px] w-[220px] sm:h-[520px] sm:w-[250px]"
      >
        {locked ? (
          <div className="flex h-full flex-col bg-gradient-to-b from-navy via-navy to-lavender/70 px-3 pt-8 text-on-dark">
            <p className="text-center text-4xl font-light">9:41</p>
            <p className="text-center text-[11px] opacity-80">Wednesday, March 18</p>
            {phase === "deliver" ? (
              <motion.button
                type="button"
                onClick={onOpen}
                initial={reduce ? false : { y: -28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-8 w-full rounded-2xl bg-card/95 p-3 text-left text-navy shadow-lg"
              >
                <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <Bell className="size-2.5" aria-hidden />
                  AVERRA FAMILY · now
                </p>
                <p className="mt-1 text-xs font-semibold">{label} · Ms. Rivera</p>
                <p className="line-clamp-3 text-[11px] text-muted-foreground">{message}</p>
              </motion.button>
            ) : (
              <p className="mt-10 text-center text-[11px] opacity-70">
                {phase === "send" ? "Connecting…" : "Lock screen"}
              </p>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col bg-cloud px-3 pt-4 text-navy">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Averra Family
            </p>
            <p className="text-sm font-semibold">Ms. Rivera · AP Biology</p>
            <p className="text-[11px] text-muted-foreground">About Alex Morgan · just now</p>
            <p className="mt-3 rounded-2xl rounded-tl-md bg-card p-3 text-[11px] leading-relaxed shadow-soft">
              {message}
            </p>
            {replying ? (
              <label className="mt-3 block text-[11px]">
                Reply to teacher
                <textarea
                  className="mt-1 w-full rounded-xl border border-hairline p-2 text-[11px]"
                  rows={2}
                  placeholder="Write a reply…"
                />
              </label>
            ) : (
              <button
                type="button"
                className={cn(btnPrimary, "mt-3 w-full text-xs")}
                onClick={onReply}
              >
                Reply to teacher
              </button>
            )}
          </div>
        )}
      </PhoneFrame>
      <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Parent iPhone
      </p>
    </div>
  );
}
