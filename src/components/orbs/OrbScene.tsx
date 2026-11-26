import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type OrbConfig = {
  range: [number, number]; // page scroll progress window
  from: [number, number]; // viewport fractions (-1..1)
  to: [number, number];
  scale: number;
  spin: [number, number, number];
};

// Deterministic PRNG so the "random" drift is stable between visits.
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildOrbs(isMobile: boolean): OrbConfig[] {
  const r = mulberry32(2026);
  const j = () => (r() - 0.5) * 0.25;
  const all: OrbConfig[] = [
    { range: [0.04, 0.36], from: [1.25, 0.1 + j()], to: [0.62, -0.25 + j()], scale: 1.25, spin: [0.07, 0.11, 0.03] }, // emerges right near platform
    { range: [0.3, 0.62], from: [-1.2, -0.9], to: [-0.55 + j(), 0.35 + j()], scale: 0.95, spin: [-0.05, 0.09, 0.06] }, // rises lower-left
    { range: [0.55, 0.88], from: [0.9 + j(), -1.1], to: [0.35, 0.9], scale: 1.6, spin: [0.04, -0.07, 0.05] }, // passes behind pricing
    { range: [0.8, 1.02], from: [-0.2 + j(), 1.2], to: [-0.6, -0.1 + j()], scale: 0.8, spin: [0.09, 0.05, -0.04] },
  ];
  return isMobile ? [all[0]!, all[2]!] : all;
}

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function Orb({ cfg, geo, ghostGeo, scrollRef, darkRef, reduce, staticPos }: {
  cfg: OrbConfig; geo: THREE.BufferGeometry; ghostGeo: THREE.BufferGeometry;
  scrollRef: React.MutableRefObject<number>; darkRef: React.MutableRefObject<boolean>;
  reduce: boolean; staticPos?: [number, number] | undefined;
}) {
  const group = useRef<THREE.Group>(null);
  const ghost = useRef<THREE.Mesh>(null);
  const mainMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#2D7BFF", wireframe: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const ghostMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#0E7C86", wireframe: true, transparent: true, opacity: 0, depthWrite: false }), []);
  const { viewport } = useThree();
  const bright = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const [a, b] = cfg.range;
    let vis: number, px: number, py: number;
    if (reduce && staticPos) {
      vis = 1; [px, py] = staticPos;
    } else {
      const p = scrollRef.current;
      const t = (p - a) / (b - a);
      vis = smooth(0, 0.22, t) * (1 - smooth(0.75, 1, t));
      const e = Math.min(1, Math.max(0, t));
      px = cfg.from[0] + (cfg.to[0] - cfg.from[0]) * e;
      py = cfg.from[1] + (cfg.to[1] - cfg.from[1]) * e;
    }
    bright.current += ((darkRef.current ? 1 : 0) - bright.current) * (1 - Math.exp(-4 * dt));
    const base = 0.12 - bright.current * 0.06; // additive lines stack up on navy, so dim there
    mainMat.opacity = base * vis;
    ghostMat.opacity = base * 0.45 * vis;
    g.visible = vis > 0.005;
    const s = cfg.scale * (0.85 + 0.15 * vis) * Math.min(1, viewport.width / 9 + 0.35);
    g.scale.setScalar(s);
    const bob = reduce ? 0 : Math.sin(state.clock.elapsedTime * 0.5 + cfg.scale * 3) * 0.15;
    g.position.set(px * viewport.width * 0.5, py * viewport.height * 0.5 + bob, 0);
    if (!reduce) {
      g.rotation.x += cfg.spin[0] * dt;
      g.rotation.y += cfg.spin[1] * dt;
      g.rotation.z += cfg.spin[2] * dt;
      if (ghost.current) ghost.current.rotation.z -= 0.03 * dt;
    }
  });

  return (
    <group ref={group} rotation={[0.4, 0.2, 0]}>
      <mesh geometry={geo} material={mainMat} />
      <mesh ref={ghost} geometry={ghostGeo} material={ghostMat} scale={1.14} rotation={[0.35, 0.5, 0.6]} position={[0, 0, -0.6]} />
    </group>
  );
}

function Orbs({ reduce, isMobile }: { reduce: boolean; isMobile: boolean }) {
  const scrollRef = useRef(0);
  const darkRef = useRef(false);
  const orbs = useMemo(() => buildOrbs(isMobile), [isMobile]);
  const [geo, ghostGeo] = useMemo(() => {
    const seg = isMobile ? 100 : 160;
    const rad = isMobile ? 12 : 18;
    return [new THREE.TorusKnotGeometry(1, 0.35, seg, rad, 2, 3), new THREE.TorusKnotGeometry(1, 0.35, Math.round(seg * 0.6), Math.round(rad * 0.6), 2, 3)];
  }, [isMobile]);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
      const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      darkRef.current = !!el?.closest('[data-tone="dark"]');
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  useEffect(() => { if (reduce) invalidate(); }, [reduce, invalidate]);

  const staticSpots: [number, number][] = [[0.6, 0.15], [-0.65, -0.4]];
  const list = reduce ? orbs.slice(0, 2) : orbs;
  return (
    <>
      {list.map((cfg, i) => (
        <Orb key={i} cfg={cfg} geo={geo} ghostGeo={ghostGeo} scrollRef={scrollRef} darkRef={darkRef} reduce={reduce} staticPos={reduce ? staticSpots[i] : undefined} />
      ))}
    </>
  );
}

export default function OrbScene({ reduce }: { reduce: boolean }) {
  const [visible, setVisible] = useState(true);
  const [isMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={reduce ? "demand" : visible ? "always" : "never"}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ alpha: true, antialias: !isMobile, powerPreference: "low-power" }}
      style={{ pointerEvents: "none" }}
    >
      <Orbs reduce={reduce} isMobile={isMobile} />
    </Canvas>
  );
}
