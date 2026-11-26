import { useEffect, useRef, useState } from "react";
import { Send, ShieldCheck, Sparkles } from "lucide-react";
import { TypingDots, btnPrimary, input } from "@/components/demos/AppShell";
import { Switch } from "@/components/ui/switch";
import { answerQuestion, SOURCES, SUGGESTED, type Role, type SourceId } from "./knowledge";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "ai"; text: string; shown: number; source?: string | null };

export function SchoolAssistantPanel() {
  const [role, setRole] = useState<Role>("Student");
  const [enabled, setEnabled] = useState<Record<SourceId, boolean>>({ handbook: true, calendar: true, athletics: true, dining: true, transport: true });
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight }); }, [msgs, busy]);

  const ask = (q: string) => {
    if (!q.trim() || busy) return;
    const a = answerQuestion(q, enabled);
    const words = a.text.split(" ");
    setMsgs((m) => [...m, { role: "user", text: q.trim(), shown: 1 }]);
    setDraft(""); setBusy(true);
    timers.current.push(setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: a.text, shown: 0, source: a.source }]);
      words.forEach((_, i) => timers.current.push(setTimeout(() => {
        setMsgs((m) => m.map((x, j) => (j === m.length - 1 ? { ...x, shown: i + 1 } : x)));
        if (i === words.length - 1) setBusy(false);
      }, i * 45)));
    }, 700));
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-float">
      <header className="flex flex-wrap items-center gap-3 border-b border-hairline px-5 py-3.5">
        <span className="squircle icon-ai icon-sheen grid size-8 place-items-center text-primary-foreground"><Sparkles className="size-4" aria-hidden /></span>
        <div><p className="text-sm font-semibold">AVERRA AI</p><p className="text-[11px] text-muted-foreground">School Assistant</p></div>
        <span className="ml-auto rounded-full bg-mint-soft px-2.5 py-0.5 text-[11px] font-medium text-navy">Simulated demo — sample data</span>
      </header>
      <div className="flex gap-1 border-b border-hairline px-5 py-2.5" role="group" aria-label="Ask as">
        {(["Student", "Parent", "Teacher"] as Role[]).map((r) => (
          <button key={r} type="button" aria-pressed={role === r} onClick={() => setRole(r)} className={cn("rounded-full px-3 py-1 text-xs", role === r ? "bg-navy text-on-dark" : "text-muted-foreground hover:bg-muted")}>{r}</button>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 md:grid-cols-[1fr_200px]">
        <div className="flex min-h-0 flex-col">
          <div ref={box} className="h-80 space-y-3 overflow-y-auto p-5" aria-live="polite">
            {!msgs.length && <p className="text-sm text-muted-foreground">Ask as a {role.toLowerCase()} — answers come only from the sources your school approves.</p>}
            {msgs.map((m, i) => m.role === "user" ? (
              <p key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-navy px-3.5 py-2 text-sm text-on-dark">{m.text}</p>
            ) : (
              <div key={i} className="max-w-[90%]">
                <p className="rounded-2xl rounded-tl-md bg-muted px-3.5 py-2 text-sm leading-relaxed">{m.text.split(" ").slice(0, m.shown).join(" ")}</p>
                {m.source && m.shown >= m.text.split(" ").length && <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-hairline px-2.5 py-0.5 text-[11px] text-muted-foreground"><ShieldCheck className="size-3 text-mint" aria-hidden />Source: {m.source}</span>}
              </div>
            ))}
            {busy && msgs.at(-1)?.role === "user" && <div className="w-fit rounded-2xl bg-muted px-4 py-3"><TypingDots /></div>}
          </div>
          <div className="border-t border-hairline p-4">
            <div className="mb-3 flex flex-wrap gap-1.5">{SUGGESTED[role].map((s) => (
              <button key={s} type="button" onClick={() => ask(s)} disabled={busy} className="rounded-full border border-hairline px-2.5 py-1 text-[11px] hover:border-lavender/50 disabled:opacity-50">{s}</button>
            ))}</div>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(draft); }}>
              <input aria-label="Ask the school assistant" className={input} placeholder="Ask anything about Westbrook…" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <button type="submit" className={btnPrimary} aria-label="Send" disabled={busy}><Send className="size-4" /></button>
            </form>
          </div>
        </div>
        <aside className="border-t border-hairline bg-muted/40 p-4 md:border-l md:border-t-0" aria-label="Knowledge sources">
          <p className="text-[11px] font-semibold leading-snug">Knowledge sources approved by your school</p>
          <ul className="mt-3 space-y-2.5">{SOURCES.map((s) => (
            <li key={s.id}><label className="flex items-center justify-between gap-2 text-[11px]">
              <span className={cn(!enabled[s.id] && "text-muted-foreground line-through")}>{s.name}</span>
              <Switch checked={enabled[s.id]} onCheckedChange={(v) => setEnabled((e) => ({ ...e, [s.id]: v }))} />
            </label></li>
          ))}</ul>
          <p className="mt-3 text-[10px] text-muted-foreground">Turn a source off and related questions stop being answered.</p>
        </aside>
      </div>
    </div>
  );
}
