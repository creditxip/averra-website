import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionShell } from "@/components/ui/section-shell";
import { DEMO_APPS } from "@/components/demos/registry";
import { DemoModal } from "@/components/demos/DemoModal";
import { cn } from "@/lib/utils";

export function PlatformSection() {
  const [index, setIndex] = useState<number | null>(null);
  const lastIndex = useRef(0);
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();

  return (
    <SectionShell id="platform" eyebrow="The AVERRA ecosystem" title="Everything Your School Needs. One Connected Experience.">
      <p className="mt-5 max-w-xl text-lg text-muted-foreground">Six connected experiences, one secure platform, one school identity.</p>
      <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-3">
        {DEMO_APPS.map((app, i) => (
          <motion.li
            key={app.id}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              ref={(el) => { iconRefs.current[i] = el; }}
              type="button"
              onClick={() => { lastIndex.current = i; setIndex(i); }}
              aria-label={`Open ${app.name} demo`}
              className="group flex w-full flex-col items-center rounded-2xl p-3 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className={cn("squircle icon-sheen relative grid size-24 place-items-center text-primary-foreground transition-all duration-300 group-hover:-translate-y-1.5 group-hover:icon-glow group-focus-visible:icon-glow sm:size-28", app.gradient)}>
                <span className="pointer-events-none absolute inset-x-3 top-1.5 h-1/3 rounded-full bg-primary-foreground/15 blur-sm" aria-hidden />
                <app.icon className="relative size-10 sm:size-12" strokeWidth={1.6} aria-hidden />
              </span>
              <span className="mt-5 text-base font-semibold tracking-tight">{app.name}</span>
              <span className="mt-1 max-w-[16rem] text-sm text-muted-foreground">{app.description}</span>
            </button>
          </motion.li>
        ))}
      </ul>
      <p className="mt-12 text-center text-xs text-muted-foreground">Tap any app to try an interactive demo · Westbrook Academy is a fictional school with sample data.</p>
      <DemoModal
        index={index}
        onIndexChange={(i) => { lastIndex.current = i; setIndex(i); }}
        onClose={() => setIndex(null)}
        onCloseAutoFocus={(e) => { e.preventDefault(); iconRefs.current[lastIndex.current]?.focus(); }}
      />
    </SectionShell>
  );
}
