import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** HTML/CSS iPhone mockup: dynamic island, status bar, home indicator. */
export function PhoneFrame({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "relative rounded-[3rem] bg-navy p-2.5 shadow-float ring-1 ring-on-dark/15",
        className,
      )}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[2.4rem] bg-cloud text-navy">
        <div className="flex items-center justify-between px-7 pt-3.5 text-[11px] font-semibold">
          <span>9:41</span>
          <span
            className="absolute left-1/2 top-2.5 h-6 w-24 -translate-x-1/2 rounded-full bg-navy"
            aria-hidden
          />
          <span className="flex items-center gap-1" aria-hidden>
            <span className="flex items-end gap-px">
              {[3, 5, 7, 9].map((h) => (
                <span key={h} className="w-0.5 rounded-sm bg-navy" style={{ height: h }} />
              ))}
            </span>
            <span className="ml-1 h-2.5 w-5 rounded-[3px] border border-navy p-px">
              <span className="block h-full w-3/4 rounded-[1px] bg-navy" />
            </span>
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        <div className="mx-auto mb-2 mt-1 h-1 w-28 rounded-full bg-navy/80" aria-hidden />
      </div>
    </div>
  );
}

/** Pixel-style Android mockup: punch-hole camera and three-button navigation. */
export function AndroidFrame({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "relative rounded-[2.15rem] bg-navy p-2 shadow-float ring-1 ring-on-dark/15",
        className,
      )}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.7rem] bg-cloud text-navy">
        <div className="relative flex items-center justify-between px-5 pt-2.5 text-[11px] font-semibold">
          <span>9:41</span>
          <span
            className="absolute left-1/2 top-2 z-10 grid size-3.5 -translate-x-1/2 place-items-center rounded-full bg-navy ring-[3px] ring-navy/15"
            aria-hidden
          >
            <span className="size-1 rounded-full bg-on-dark/40" />
          </span>
          <span className="flex items-center gap-1" aria-hidden>
            <span className="flex items-end gap-px">
              {[3, 5, 7, 9].map((h) => (
                <span key={h} className="w-0.5 rounded-sm bg-navy" style={{ height: h }} />
              ))}
            </span>
            <span className="ml-1 h-2.5 w-5 rounded-[3px] border border-navy p-px">
              <span className="block h-full w-4/5 rounded-[1px] bg-navy" />
            </span>
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        <div
          className="flex items-center justify-around border-t border-navy/10 px-8 py-2.5 text-navy"
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 5 L7 12 L15 19" />
          </svg>
          <span className="size-4 rounded-full border-2 border-current" />
          <span className="size-3.5 rounded-[3px] border-2 border-current" />
        </div>
      </div>
    </div>
  );
}
