import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem<T extends string> = { id: T; label: string; icon: LucideIcon };

/** Shared demo app chrome: sidebar (desktop) / scrolling tab bar (mobile) + content. */
export function AppShell<T extends string>({ nav, active, onChange, children, footer }: {
  nav: NavItem<T>[]; active: T; onChange: (id: T) => void; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      <nav aria-label="App sections" className="shrink-0 border-b border-hairline bg-muted/40 md:w-52 md:border-b-0 md:border-r">
        <ul className="flex gap-1 overflow-x-auto p-2 md:flex-col md:overflow-visible md:p-3">
          {nav.map((n) => (
            <li key={n.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onChange(n.id)}
                aria-current={active === n.id ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  active === n.id ? "bg-card font-medium text-foreground shadow-soft" : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                )}
              >
                <n.icon className="size-4 shrink-0" aria-hidden />
                <span className="whitespace-nowrap">{n.label}</span>
              </button>
            </li>
          ))}
        </ul>
        {footer && <div className="hidden p-3 md:block">{footer}</div>}
      </nav>
      <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">{children}</div>
    </div>
  );
}

export function ViewTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        {sub && <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-hairline bg-card p-4", className)}>{children}</div>;
}

export function Chip({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "lavender" | "mint" | "warn" }) {
  const t = { muted: "bg-muted text-muted-foreground", lavender: "bg-lavender-soft text-navy", mint: "bg-mint-soft text-navy", warn: "bg-destructive/10 text-destructive" }[tone];
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", t)}>{children}</span>;
}

export const btn = "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors";
export const btnPrimary = cn(btn, "bg-primary text-primary-foreground hover:brightness-110");
export const btnGhost = cn(btn, "border border-hairline bg-card hover:bg-muted");
export const input = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Canned "AI" response with a short simulated delay. */
export function TypingDots() {
  return (
    <span className="inline-flex gap-1" aria-label="Typing">
      {[0, 1, 2].map((i) => <span key={i} className="animate-typing size-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 0.15}s` }} />)}
    </span>
  );
}
