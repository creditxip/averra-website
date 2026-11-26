import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) { el.textContent = format(value); prev.current = value; return; }
    const c = animate(prev.current, value, { duration: 0.5, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => { el.textContent = format(v); } });
    prev.current = value;
    return () => c.stop();
  }, [value, format, reduce]);
  return <span ref={ref}>{format(value)}</span>;
}
