import { useState } from "react";
import { Loader2, Megaphone, MessagesSquare, Sparkles } from "lucide-react";
import { btnPrimary, input } from "@/components/demos/AppShell";
import { cn } from "@/lib/utils";

const TOPICS = ["Early dismissal Friday due to weather", "Parent-teacher conferences next week", "New pickup lane procedure"];
const TONES = ["Warm", "Formal", "Brief"] as const;
function draft(topic: string, audience: string, tone: (typeof TONES)[number]): string {
  const hi = tone === "Formal" ? `Dear ${audience},` : tone === "Brief" ? `${audience}:` : `Hello ${audience}!`;
  const body: Record<string, string> = {
    [TOPICS[0]!]: "Due to the forecasted winter storm, Westbrook Academy will dismiss at 12:30 PM this Friday. Buses will run on the early schedule, and after-school activities are canceled.",
    [TOPICS[1]!]: "Parent-teacher conferences take place Tuesday through Thursday next week. Booking is open in the AVERRA FAMILY app under Events.",
    [TOPICS[2]!]: "Starting Monday, afternoon pickup will use the new north lane off Elm Street. Please follow staff directions and remain in your vehicle.",
  };
  const close = tone === "Brief" ? "" : tone === "Formal" ? "\n\nThank you for your attention.\nWestbrook Academy Administration" : "\n\nThank you for helping us keep everyone safe and informed!\n— The Westbrook team";
  return `${hi}\n\n${body[topic]}${close}`;
}
const QUESTIONS = [["When is early dismissal this Friday?", 64], ["How do I book a conference slot?", 41], ["What's on the lunch menu?", 33], ["Where is the new pickup lane?", 27], ["How do I report an absence?", 19]] as const;

export function AdminAiDemo() {
  const [mode, setMode] = useState<"announce" | "summary">("announce");
  const [audience, setAudience] = useState("Families");
  const [topic, setTopic] = useState(TOPICS[0]!);
  const [tone, setTone] = useState<(typeof TONES)[number]>("Warm");
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);
  const run = () => { setBusy(true); setShown(false); setTimeout(() => { setBusy(false); setShown(true); }, 900); };

  return (
    <div className="space-y-4 p-5">
      <div className="flex gap-2" role="tablist">{([["announce", "Generate announcement", Megaphone], ["summary", "Summarize common questions", MessagesSquare]] as const).map(([k, l, I]) => (
        <button key={k} role="tab" aria-selected={mode === k} type="button" onClick={() => { setMode(k); setShown(false); }} className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium", mode === k ? "border-lavender bg-lavender text-primary-foreground" : "border-hairline")}><I className="size-3.5" aria-hidden />{l}</button>
      ))}</div>
      {mode === "announce" ? <>
        <div className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
          <label className="text-xs font-medium">Audience<select className={cn(input, "mt-1")} value={audience} onChange={(e) => setAudience(e.target.value)}>{["Families", "Students", "Staff", "Everyone"].map((a) => <option key={a}>{a}</option>)}</select></label>
          <label className="text-xs font-medium">Topic<select className={cn(input, "mt-1")} value={topic} onChange={(e) => setTopic(e.target.value)}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select></label>
          <button type="button" className={cn(btnPrimary, "self-end")} onClick={run} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}Draft</button>
        </div>
        {shown && <>
          <div className="flex gap-1.5" role="group" aria-label="Tone">{TONES.map((t) => <button key={t} type="button" aria-pressed={tone === t} onClick={() => setTone(t)} className={cn("rounded-full border px-3 py-1 text-xs", tone === t ? "border-navy bg-navy text-on-dark" : "border-hairline")}>{t}</button>)}</div>
          <p className="whitespace-pre-line rounded-xl border border-hairline p-4 text-sm">{draft(topic, audience, tone)}</p>
        </>}
      </> : <>
        <button type="button" className={btnPrimary} onClick={run} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}Summarize this week</button>
        {shown && <div className="rounded-xl border border-hairline p-4 text-sm">
          <p className="font-semibold">Top recurring questions · this week (sample data)</p>
          <ul className="mt-3 space-y-2">{QUESTIONS.map(([q, n]) => (
            <li key={q}><div className="flex justify-between gap-3"><span>{q}</span><span className="font-semibold tabular-nums">{n}</span></div><div className="mt-1 h-1 rounded-full bg-muted"><div className="bg-brand h-full rounded-full" style={{ width: `${(n / 64) * 100}%` }} /></div></li>
          ))}</ul>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested FAQ updates</p>
          <ul className="mt-1 list-disc pl-5"><li>Pin the early-dismissal notice to the family home screen until Friday.</li><li>Add a "How to book conferences" step-by-step to the FAQ.</li><li>Publish the weekly lunch menu as an approved AI source.</li></ul>
        </div>}
      </>}
    </div>
  );
}
