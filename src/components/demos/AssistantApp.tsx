import { useEffect, useRef, useState } from "react";
import { Send, ShieldCheck, Sparkles } from "lucide-react";
import { TypingDots, btnPrimary, input } from "./AppShell";
import { cn } from "@/lib/utils";

type KB = { keys: string[]; answer: string; source: string };
export const KNOWLEDGE: KB[] = [
  { keys: ["midterm", "exam"], answer: "Midterm exams run Monday, March 16 through Thursday, March 19. Morning sessions start at 8:30 AM and afternoon sessions at 12:45 PM. Classes do not meet during exam week.", source: "2026–27 Academic Calendar" },
  { keys: ["dress code", "formal", "attire"], answer: "For formal events, students wear business formal attire: suits or blazers with ties, or dresses/skirts of knee length or longer. School blazers are encouraged for the Spring Showcase.", source: "2026–27 Student Handbook, p.14" },
  { keys: ["transcript"], answer: "Request a transcript through the Registrar tab in AVERRA or by emailing registrar@westbrook.example. Official transcripts are processed within 3 business days; there's no fee for current students.", source: "Registrar Policies, §3.2" },
  { keys: ["parent-teacher", "conference", "conferences"], answer: "The next parent-teacher conferences are Thursday, March 26 and Friday, March 27, 3:00–7:00 PM in the Main Hall. Booking opens March 16 in the Family app.", source: "Family Engagement Calendar, Spring 2027" },
  { keys: ["spring showcase", "showcase"], answer: "The Spring Showcase is Thursday, April 23 at 6:00 PM in the Performing Arts Center. Doors open at 5:30 PM.", source: "2026–27 Events Calendar" },
  { keys: ["library", "hours"], answer: "The Hartwell Library is open 7:30 AM–6:00 PM on school days, with extended hours until 9:00 PM during exam weeks.", source: "Library Services Guide" },
];
const SUGGESTED = ["When are midterm exams?", "What's the dress code for formal events?", "How do I request a transcript?", "When is the next parent-teacher conference?"];
const FALLBACK = "I don't have approved school information on that yet. I've flagged it for the school office.";

export function answerFor(q: string): { text: string; source?: string } {
  const lower = q.toLowerCase();
  const hit = KNOWLEDGE.find((k) => k.keys.some((key) => lower.includes(key)));
  return hit ? { text: hit.answer, source: hit.source } : { text: FALLBACK };
}

type Msg = { role: "user" | "ai"; text: string; source?: string | undefined };

export default function AssistantApp() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: "Hi! I'm the Westbrook Academy assistant. I answer using approved school information only. What can I help you find?" }]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [msgs, typing]);

  const ask = (q: string) => {
    if (!q.trim() || typing) return;
    setMsgs((m) => [...m, { role: "user", text: q.trim() }]);
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      const a = answerFor(q);
      setMsgs((m) => [...m, { role: "ai", text: a.text, source: a.source }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 sm:p-7" aria-live="polite">
        {msgs.map((m, i) => m.role === "user" ? (
          <div key={i} className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-navy px-4 py-2.5 text-sm text-on-dark">{m.text}</div>
        ) : (
          <div key={i} className="flex max-w-[85%] gap-2.5">
            <span className="bg-brand grid size-7 shrink-0 place-items-center rounded-full"><Sparkles className="size-3.5 text-primary-foreground" aria-hidden /></span>
            <div>
              <p className="rounded-2xl rounded-tl-md bg-muted px-4 py-2.5 text-sm leading-relaxed">{m.text}</p>
              {m.source && <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-hairline bg-card px-2.5 py-0.5 text-[11px] text-muted-foreground"><ShieldCheck className="size-3 text-mint" aria-hidden />Source: {m.source}</span>}
            </div>
          </div>
        ))}
        {typing && <div className="flex gap-2.5"><span className="bg-brand grid size-7 place-items-center rounded-full"><Sparkles className="size-3.5 text-primary-foreground" aria-hidden /></span><div className="rounded-2xl bg-muted px-4 py-3"><TypingDots /></div></div>}
        <div ref={end} />
      </div>
      <div className="border-t border-hairline p-4">
        <div className="mb-3 flex flex-wrap gap-2">{SUGGESTED.map((s) => (
          <button key={s} type="button" onClick={() => ask(s)} className="rounded-full border border-hairline bg-card px-3 py-1 text-xs hover:border-lavender/50">{s}</button>
        ))}</div>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(draft); }}>
          <input aria-label="Ask the school assistant" className={input} placeholder="Ask about policies, events, deadlines…" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button type="submit" className={cn(btnPrimary)} aria-label="Send question" disabled={typing}><Send className="size-4" /></button>
        </form>
      </div>
    </div>
  );
}
