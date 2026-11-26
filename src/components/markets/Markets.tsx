import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Check, Landmark, Server, Shield, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MAPS = {
  ne: {
    label: "New England",
    d: "M101.2 79.5 L135.4 71.6 L154.3 23.9 L182.8 16 L222.6 76.9 L199.8 100.7 L169.5 113.9 L154.3 137.7 L148.6 149.6 L165.7 157.5 L166.4 166.8 L156.2 169.4 L142.9 173.4 L131.6 177.4 L108.8 184 L97.4 177.4 L101.2 140.3 L102.2 79.5 Z",
    points: [{ x: 145.6, y: 149.3, delay: 0 }],
  },
  se: {
    label: "The Southeast",
    d: "M104.8 95.7 L104.8 84.6 L134.4 84.6 L134.4 16 L171.5 16.3 L195.2 65.7 L196.7 89.7 L199.7 115.4 L208.6 146.3 L215.2 173.7 L210.1 184 L196.7 180.6 L190.8 160 L178.9 139.4 L173 117.1 L152.2 106.9 L125.5 96.6 L104.8 95.7 Z",
    points: [
      { x: 152.2, y: 38.3, delay: 0.2 },
      { x: 193.7, y: 127.4, delay: 0.8 },
      { x: 213, y: 166.9, delay: 1.3 },
    ],
  },
  us: {
    label: "Nationwide",
    d: "M14 28.3 L15.5 42.3 L17 60 L16.5 70.2 L15.5 79.1 L18.6 87.9 L23.1 94.3 L25.6 99.4 L28.7 105.1 L33.2 112.1 L39.3 117.1 L45.9 120.9 L52 129.2 L64.1 129.2 L82.8 136.8 L97.5 136.8 L105.6 133.6 L116.2 147.6 L123.8 151.4 L131.9 147 L141.5 160.3 L152.2 171.1 L154.2 159 L163.3 150.1 L169.4 147.6 L182 150.1 L192.6 150.1 L197.7 143.1 L206.8 142.5 L214.9 147.6 L221 146.3 L226.5 159 L230.1 167.9 L238.2 175.5 L239.7 164.7 L233.1 142.5 L234.1 136.2 L240.2 127.9 L245.3 122.2 L251.3 118.4 L262 112.1 L263 101.3 L260.5 94.9 L264.5 91.8 L268.6 86 L270.6 78.4 L279.7 74 L290.3 72.1 L290.8 68.3 L287.3 65.1 L289.8 58.1 L306 51.1 L301.4 36.6 L294.9 34.6 L284.7 48.6 L267 49.9 L225 41 L192.1 29.6 L163.3 24.5 L118.8 24.5 L58 24.5 L22.6 24.5 Z",
    points: [
      { x: 283.2, y: 65.7, delay: 0 },
      { x: 232.1, y: 156.5, delay: 0.4 },
      { x: 173.4, y: 71.4, delay: 0.9 },
      { x: 46.9, y: 96.8, delay: 1.2 },
      { x: 149.1, y: 137.4, delay: 1.6 },
    ],
  },
} as const;

const REGIONS = [
  {
    id: "ne" as const,
    kicker: "New England",
    copy: "Private and independent schools throughout Boston and the surrounding region.",
  },
  {
    id: "se" as const,
    kicker: "The Southeast",
    copy: "Independent schools across Georgia and Florida.",
  },
  {
    id: "us" as const,
    kicker: "Nationwide",
    copy: "Technology designed to support institutions across the country.",
  },
];

type RoleId = "headmasters" | "deans" | "technology" | "teachers" | "parents";

const ROLES: {
  id: RoleId;
  label: string;
  icon: LucideIcon;
  summary: string;
  benefits: string[];
}[] = [
  {
    id: "headmasters",
    label: "Headmasters",
    icon: Landmark,
    summary: "The school's identity, held in one place for the whole community.",
    benefits: [
      "One branded experience for the whole community",
      "Visibility into engagement",
      "A modern image for prospective families",
    ],
  },
  {
    id: "deans",
    label: "Deans of Students",
    icon: Shield,
    summary: "Attendance, outreach, and student engagement in the same picture.",
    benefits: [
      "Attendance and communication in one place",
      "Faster family outreach",
      "Insight into student engagement",
    ],
  },
  {
    id: "technology",
    label: "Technology Directors",
    icon: Server,
    summary: "Fewer separate tools, with permissions and integrations your team scopes.",
    benefits: [
      "Fewer disconnected tools",
      "Role-based permissions",
      "Integrations scoped to your systems",
      "Managed app deployment",
    ],
  },
  {
    id: "teachers",
    label: "Teachers",
    icon: BookOpen,
    summary: "Classwork and family updates without another login.",
    benefits: ["Less administrative work", "One-click parent notifications", "AI drafting help"],
  },
  {
    id: "parents",
    label: "Parents",
    icon: Users,
    summary: "Updates, alerts, and teacher messages in the school's own app.",
    benefits: [
      "One app for everything about their child",
      "Timely alerts",
      "Direct teacher messages",
    ],
  },
];

export function Markets() {
  const reduce = useReducedMotion();
  const [roleId, setRoleId] = useState<RoleId>("headmasters");
  const role = ROLES.find((item) => item.id === roleId) ?? ROLES[0];
  if (!role) return null;

  return (
    <>
      <ul className="mt-12 grid gap-4 lg:grid-cols-3">
        {REGIONS.map((region) => (
          <li key={region.id}>
            <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-hairline-dark bg-on-dark/[0.04]">
              <RegionMap id={region.id} />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xs font-semibold tracking-[0.18em] text-mint">
                  {region.kicker.toUpperCase()}
                </h3>
                <p className="mt-3 text-base leading-relaxed">{region.copy}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-24">
        <h3 id="roles-heading" className="text-display text-3xl sm:text-4xl">
          Every role, one school experience.
        </h3>
        <fieldset className="mt-8">
          <legend className="sr-only">School roles</legend>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((item) => (
              <label
                key={item.id}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-lavender",
                  roleId === item.id
                    ? "border-transparent bg-on-dark text-navy"
                    : "border-hairline-dark text-on-dark-muted hover:text-on-dark",
                )}
              >
                <input
                  type="radio"
                  name="averra-role"
                  className="sr-only"
                  checked={roleId === item.id}
                  onChange={() => setRoleId(item.id)}
                />
                <item.icon className="size-4" aria-hidden />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div
          className="mt-6 rounded-3xl border border-hairline-dark bg-on-dark/[0.03] p-6 sm:p-10"
          aria-live="polite"
        >
          <motion.div
            key={role.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-mint">{role.label}</p>
            <p className="mt-3 max-w-xl text-lg text-on-dark-muted">{role.summary}</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {role.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex gap-3 rounded-2xl border border-hairline-dark px-4 py-4 text-base font-medium tracking-tight"
                >
                  <Check className="mt-0.5 size-5 shrink-0 text-mint" aria-hidden />
                  {benefit}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </>
  );
}

function RegionMap({ id }: { id: keyof typeof MAPS }) {
  const reduce = useReducedMotion();
  const map = MAPS[id];
  const clipId = `region-clip-${id}`;
  const dotId = `region-dots-${id}`;
  return (
    <div className="relative h-44 border-b border-hairline-dark bg-navy-soft/40">
      <svg viewBox="0 0 320 200" className="h-full w-full text-mint" aria-hidden>
        <defs>
          <pattern id={dotId} width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="1.1" cy="1.1" r="0.9" fill="currentColor" opacity="0.55" />
          </pattern>
          <clipPath id={clipId}>
            <path d={map.d} />
          </clipPath>
        </defs>
        <rect width="320" height="200" fill={`url(#${dotId})`} clipPath={`url(#${clipId})`} />
        <path
          d={map.d}
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        {map.points.map((point) => (
          <g key={`${point.x}-${point.y}`}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={10}
              fill="currentColor"
              initial={false}
              animate={reduce ? { opacity: 0.15 } : { opacity: [0.08, 0.28, 0.08] }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 2.8, repeat: Infinity, delay: point.delay, ease: "easeInOut" }
              }
            />
            <circle cx={point.x} cy={point.y} r="3.2" fill="currentColor" />
          </g>
        ))}
      </svg>
    </div>
  );
}
