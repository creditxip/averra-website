import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type Props = {
  id: string;
  eyebrow?: string;
  title: string;
  tone?: "light" | "dark";
  children?: ReactNode;
};

/** Section bg is deliberately non-positioned so the fixed orb canvas (z-0) paints above it and below content (z-10). */
/** Shared anchored section wrapper with eyebrow + display title. */
export function SectionShell({ id, eyebrow, title, tone = "light", children }: Props) {
  const dark = tone === "dark";
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-tone={tone}
      className={cn("py-28 sm:py-36", dark ? "bg-navy text-on-dark" : "text-foreground")}
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal className="max-w-3xl">
          {eyebrow && (
            <p className={cn("mb-4 text-sm font-medium", dark ? "text-mint" : "text-lavender")}>{eyebrow}</p>
          )}
          <h2 id={`${id}-title`} className="text-display text-4xl sm:text-5xl md:text-6xl">
            {title}
          </h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
