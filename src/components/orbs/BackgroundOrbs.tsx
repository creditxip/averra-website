import { lazy, Suspense, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const OrbScene = lazy(() => import("./OrbScene"));

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Site-wide decorative 3D knot orbs behind all content. Client-only, lazy, fails silently. */
export function BackgroundOrbs() {
  const reduce = useReducedMotion() ?? false;
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!hasWebGL()) return;
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (idle) idle(() => setReady(true));
    else setTimeout(() => setReady(true), 300);
  }, []);
  if (!ready) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Suspense fallback={null}>
        <OrbScene reduce={reduce} />
      </Suspense>
    </div>
  );
}
