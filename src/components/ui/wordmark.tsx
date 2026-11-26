import { cn } from "@/lib/utils";

export function Wordmark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <defs>
          <linearGradient id="averra-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--lavender)" />
            <stop offset="1" stopColor="var(--mint)" />
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="7" fill="url(#averra-mark)" />
        <path d="M7 17 L12 6.5 L17 17" fill="none" stroke="var(--primary-foreground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="14" r="1.4" fill="var(--primary-foreground)" />
      </svg>
      <span className={cn("text-[15px] font-semibold tracking-[0.22em]", tone === "light" ? "text-on-dark" : "text-navy")}>
        AVERRA
      </span>
    </span>
  );
}
