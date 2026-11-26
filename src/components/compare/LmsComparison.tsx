import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  Database,
  Library,
  Megaphone,
  MessageSquare,
  Pause,
  Play,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TileId = "lms" | "parent" | "announce" | "resources" | "ai" | "mobile";

const TILES: { id: TileId; label: string; icon: LucideIcon }[] = [
  { id: "lms", label: "Learning management", icon: BookOpen },
  { id: "parent", label: "Parent communication", icon: MessageSquare },
  { id: "announce", label: "School announcements", icon: Megaphone },
  { id: "resources", label: "Student resources", icon: Library },
  { id: "ai", label: "AI tools", icon: Sparkles },
  { id: "mobile", label: "Mobile apps", icon: Smartphone },
];

const LEFT_POS: Record<TileId, { x: number; y: number }> = {
  lms: { x: 24, y: 18 },
  parent: { x: 73, y: 16 },
  announce: { x: 28, y: 48 },
  resources: { x: 76, y: 50 },
  ai: { x: 24, y: 80 },
  mobile: { x: 70, y: 78 },
};

const BREAKS: [TileId, TileId][] = [
  ["lms", "parent"],
  ["lms", "announce"],
  ["parent", "resources"],
  ["announce", "resources"],
  ["announce", "ai"],
  ["ai", "mobile"],
  ["resources", "mobile"],
];

type Step = { title: string; detail: string };

type Category = {
  id: string;
  label: string;
  tiles: TileId[];
  left: Step[];
  right: Step[];
  integration?: boolean;
};

const CATEGORIES: Category[] = [
  {
    id: "parent-communication",
    label: "Parent communication",
    tiles: ["parent", "mobile"],
    left: [
      { title: "Teacher writes an email", detail: "The note starts in a separate inbox." },
      {
        title: "Copies it to the portal",
        detail: "The same message is pasted into another login.",
      },
      {
        title: "Parent checks three places",
        detail: "Email, a portal, and an app, hoping one of them is current.",
      },
    ],
    right: [
      {
        title: "Teacher taps Notify Parent",
        detail: "The update goes out from the class they already have open.",
      },
      {
        title: "Parent receives it in the school app",
        detail: "One notification, under the school's name.",
      },
    ],
  },
  {
    id: "teacher-workflows",
    label: "Teacher workflows",
    tiles: ["lms", "parent", "resources"],
    left: [
      {
        title: "Open the gradebook in one system",
        detail: "Coursework lives behind its own login.",
      },
      { title: "Switch tools to record attendance", detail: "The class list is somewhere else." },
      {
        title: "Draft the family note in a third place",
        detail: "The update is rewritten before anyone sees it.",
      },
    ],
    right: [
      {
        title: "Open today's class in Averra",
        detail: "The roster, work, and family thread share one screen.",
      },
      {
        title: "Review work and attendance together",
        detail: "The teacher stays in the same flow.",
      },
      {
        title: "Notify families from that screen",
        detail: "The message keeps the school's identity.",
      },
    ],
  },
  {
    id: "school-branding",
    label: "School branding",
    tiles: ["announce", "mobile"],
    left: [
      {
        title: "Families see a generic vendor name",
        detail: "The tool looks like every other school that bought it.",
      },
      {
        title: "Announcements arrive from several senders",
        detail: "The school's voice is split across logins.",
      },
      { title: "The identity never quite holds", detail: "Colors, names, and icons disagree." },
    ],
    right: [
      {
        title: "The app opens under the school's name",
        detail: "The crest and colors are the school's own.",
      },
      { title: "Announcements keep one voice", detail: "Families recognize who sent them." },
      {
        title: "Every screen looks like the school",
        detail: "One identity, from the icon to the message.",
      },
    ],
  },
  {
    id: "student-engagement",
    label: "Student engagement",
    tiles: ["resources", "announce", "mobile"],
    left: [
      { title: "Assignments live in one system", detail: "Students sign in to find the work." },
      { title: "Resources live on another site", detail: "The link is posted somewhere else." },
      {
        title: "Updates are easy to miss",
        detail: "Announcements and deadlines do not share a home.",
      },
    ],
    right: [
      { title: "Today's schedule is on the home screen", detail: "Students open one school app." },
      {
        title: "Resources and deadlines sit together",
        detail: "The work and the materials share a place.",
      },
      { title: "Announcements arrive in that same app", detail: "There is one place to check." },
    ],
  },
  {
    id: "ai-assistance",
    label: "AI assistance",
    tiles: ["ai", "resources"],
    left: [
      {
        title: "A generic AI tool sits off to the side",
        detail: "It is another login, outside the school systems.",
      },
      {
        title: "Answers are not tied to school sources",
        detail: "Staff still have to check them against official information.",
      },
      {
        title: "Results get copied into a different tool",
        detail: "The draft leaves the AI and starts over somewhere else.",
      },
    ],
    right: [
      {
        title: "The assistant uses school-approved information",
        detail: "What it can say is set by the school.",
      },
      {
        title: "Teachers review drafts before they go out",
        detail: "A person approves the message.",
      },
      {
        title: "Students get study help in the school app",
        detail: "The help lives with the rest of the school day.",
      },
    ],
  },
  {
    id: "administrative-visibility",
    label: "Administrative visibility",
    tiles: ["lms", "parent", "announce"],
    left: [
      {
        title: "Engagement numbers live in separate dashboards",
        detail: "Each tool reports on itself.",
      },
      {
        title: "Leaders export spreadsheets to compare them",
        detail: "A full picture is a manual project.",
      },
      {
        title: "Getting there takes several logins",
        detail: "The view is only as current as the last export.",
      },
    ],
    right: [
      {
        title: "One view of community engagement",
        detail: "Families, students, and staff activity share a picture.",
      },
      {
        title: "Announcements stay next to their responses",
        detail: "Leaders see what was sent and what landed.",
      },
      {
        title: "Attention goes to what needs it",
        detail: "The school does not assemble the view by hand.",
      },
    ],
  },
  {
    id: "mobile-experience",
    label: "Mobile experience",
    tiles: ["mobile"],
    left: [
      {
        title: "Families install several vendor apps",
        detail: "Each product brings its own icon.",
      },
      { title: "Each app asks for its own login", detail: "Passwords pile up." },
      {
        title: "Notifications compete and get missed",
        detail: "The important alert is one of many.",
      },
    ],
    right: [
      {
        title: "One school app on the home screen",
        detail: "It carries the school's name and icon.",
      },
      {
        title: "One sign-in for the community",
        detail: "Families, students, and staff use the same front door.",
      },
      {
        title: "Alerts arrive in a single place",
        detail: "The notification is recognizably from the school.",
      },
    ],
  },
  {
    id: "existing-system-integration",
    label: "Existing system integration",
    tiles: ["lms"],
    integration: true,
    left: [
      {
        title: "Staff open the LMS, SIS, and calendar separately",
        detail: "Each system keeps its own login.",
      },
      { title: "The same update is re-entered", detail: "Information does not travel on its own." },
      {
        title: "Families still check more than one place",
        detail: "The systems stay where they are.",
      },
    ],
    right: [
      {
        title: "Averra connects to the LMS, SIS, and calendar",
        detail: "The school keeps the systems it already runs.",
      },
      {
        title: "Integrations scoped during implementation",
        detail: "What connects, and how, is decided with your team.",
      },
      {
        title: "The school app is the front door",
        detail: "The community sees one branded experience.",
      },
    ],
  },
];

function categoryById(id: string) {
  const found = CATEGORIES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown category: ${id}`);
  return found;
}

export function LmsComparison() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(CATEGORIES[0]?.id ?? "parent-communication");
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const category = categoryById(activeId);
  const stepCount = Math.max(category.left.length, category.right.length);

  useEffect(() => {
    setStep(0);
  }, [category.id]);

  useEffect(() => {
    if (reduce || paused || stepCount < 1) return;
    const id = window.setInterval(() => {
      setStep((current) => (current + 1) % stepCount);
    }, 2400);
    return () => window.clearInterval(id);
  }, [reduce, paused, stepCount, category.id]);

  return (
    <div className="mt-12">
      <fieldset>
        <legend className="sr-only">Workflow category</legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <label
              key={item.id}
              className={cn(
                "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-lavender",
                activeId === item.id
                  ? "border-transparent bg-on-dark text-navy"
                  : "border-hairline-dark text-on-dark-muted hover:text-on-dark",
              )}
            >
              <input
                type="radio"
                name="averra-category"
                className="sr-only"
                checked={activeId === item.id}
                onChange={() => setActiveId(item.id)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel
          kicker="Traditional disconnected stack"
          title="Separate tools. Separate logins."
          tone="scattered"
        >
          <TileDiagram category={category} tone="scattered" />
          <TileList category={category} tone="scattered" />
        </Panel>
        <Panel kicker="Unified AVERRA" title="One login. One school identity." tone="unified">
          <TileDiagram category={category} tone="unified" />
          <TileList category={category} tone="unified" />
        </Panel>
      </div>

      <div className="mt-6 rounded-3xl border border-hairline-dark bg-on-dark/[0.03] p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">Workflow · {category.label}</h3>
          {!reduce && (
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-hairline-dark px-3 py-1.5 text-sm text-on-dark-muted hover:text-on-dark"
            >
              {paused ? (
                <Play className="size-3.5" aria-hidden />
              ) : (
                <Pause className="size-3.5" aria-hidden />
              )}
              {paused ? "Play workflow" : "Pause workflow"}
            </button>
          )}
        </div>

        <motion.div
          key={category.id}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
        >
          {category.integration && <IntegrationStrip />}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <StepColumn
              title="Disconnected path"
              steps={category.left}
              step={step}
              reduce={!!reduce}
              tone="scattered"
            />
            <StepColumn
              title="With AVERRA"
              steps={category.right}
              step={step}
              reduce={!!reduce}
              tone="unified"
            />
          </div>
        </motion.div>
      </div>

      <aside className="mt-8 rounded-2xl border border-hairline-dark bg-on-dark/[0.04] p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-on-dark">
          Many schools rely on a learning management system such as Canvas by Instructure, which
          already offers assignments, gradebooks, teacher tools, parent observer access,
          notifications, mobile apps, and AI features. AVERRA is designed to complement your
          existing systems, not replace them — adding one branded, unified experience for your
          entire school community.
        </p>
        <p className="mt-4 text-xs leading-relaxed text-on-dark-muted">
          Canvas is a trademark of Instructure, Inc. Averra is not affiliated with or endorsed by
          Instructure. This describes how Averra can sit alongside an existing learning management
          system. It is not a pricing comparison, and capabilities vary by institution
          configuration.
        </p>
      </aside>
    </div>
  );
}

function Panel({
  kicker,
  title,
  tone,
  children,
}: {
  kicker: string;
  title: string;
  tone: "scattered" | "unified";
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border p-4 sm:p-6",
        tone === "unified"
          ? "relative border-lavender/30 bg-on-dark/[0.06]"
          : "border-hairline-dark bg-on-dark/[0.03]",
      )}
      aria-label={kicker}
    >
      {tone === "unified" && <div className="bg-brand absolute inset-x-0 top-0 h-px" aria-hidden />}
      <p
        className={cn(
          "text-xs font-medium uppercase tracking-wider",
          tone === "unified" ? "text-mint" : "text-on-dark-muted",
        )}
      >
        {kicker}
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>
      {children}
    </section>
  );
}

function TileDiagram({ category, tone }: { category: Category; tone: "scattered" | "unified" }) {
  if (tone === "scattered") {
    return (
      <div className="relative mt-6 hidden h-[440px] lg:block">
        <svg
          className="absolute inset-0 h-full w-full text-on-dark-muted"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {BREAKS.map(([from, to]) => {
            const start = LEFT_POS[from];
            const end = LEFT_POS[to];
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            const leftX = start.x + (midX - start.x) * 0.7;
            const leftY = start.y + (midY - start.y) * 0.7;
            const rightX = end.x + (midX - end.x) * 0.7;
            const rightY = end.y + (midY - end.y) * 0.7;
            return (
              <g key={`${from}-${to}`}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={leftX}
                  y2={leftY}
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeDasharray="1.5 1.3"
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1={rightX}
                  y1={rightY}
                  x2={end.x}
                  y2={end.y}
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeDasharray="1.5 1.3"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          })}
        </svg>
        {TILES.map((tile) => {
          const pos = LEFT_POS[tile.id];
          return (
            <div
              key={tile.id}
              className="absolute z-10 w-36 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <Tile tile={tile} active={category.tiles.includes(tile.id)} tone="scattered" />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative mx-auto mt-6 hidden aspect-square w-full max-w-[420px] lg:block">
      <svg
        className="absolute inset-0 h-full w-full text-mint"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {TILES.map((tile, index) => {
          const pos = orbitPoint(index);
          const x2 = 50 + (pos.x - 50) * 0.58;
          const y2 = 50 + (pos.y - 50) * 0.58;
          const active = category.tiles.includes(tile.id);
          return (
            <line
              key={tile.id}
              x1="50"
              y1="50"
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
              opacity={active ? 0.95 : 0.28}
            />
          );
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 z-20 w-28 -translate-x-1/2 -translate-y-1/2">
        <div className="bg-brand grid aspect-square place-items-center rounded-3xl text-center text-navy shadow-cta">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em]">AVERRA</p>
            <p className="mt-1 text-[10px] font-medium leading-tight">One login</p>
          </div>
        </div>
      </div>
      {TILES.map((tile, index) => {
        const pos = orbitPoint(index);
        return (
          <div
            key={tile.id}
            className="absolute z-10 w-[7.25rem] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <Tile tile={tile} active={category.tiles.includes(tile.id)} tone="unified" />
          </div>
        );
      })}
    </div>
  );
}

function orbitPoint(index: number) {
  const angle = (index / TILES.length) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + Math.cos(angle) * 37, y: 50 + Math.sin(angle) * 36 };
}

function TileList({ category, tone }: { category: Category; tone: "scattered" | "unified" }) {
  return (
    <div className="mt-6 lg:hidden">
      {tone === "unified" && (
        <div className="bg-brand mb-4 grid place-items-center rounded-2xl px-4 py-5 text-center text-navy">
          <p className="text-sm font-semibold tracking-[0.18em]">AVERRA</p>
          <p className="mt-1 text-xs">One login · one school identity</p>
        </div>
      )}
      <ul className="grid grid-cols-2 gap-2">
        {TILES.map((tile) => (
          <li key={tile.id}>
            <Tile tile={tile} active={category.tiles.includes(tile.id)} tone={tone} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tile({
  tile,
  active,
  tone,
}: {
  tile: (typeof TILES)[number];
  active: boolean;
  tone: "scattered" | "unified";
}) {
  const Icon = tile.icon;
  return (
    <div
      className={cn(
        "h-full rounded-2xl border px-3 py-2.5 transition-colors duration-300",
        active
          ? tone === "unified"
            ? "border-mint/70 bg-mint/15"
            : "border-lavender/70 bg-lavender/15"
          : "border-hairline-dark bg-navy/50",
      )}
    >
      <Icon className={cn("size-4", active ? "text-mint" : "text-on-dark-muted")} aria-hidden />
      <p
        className={cn(
          "mt-1.5 text-sm font-medium leading-tight",
          active ? "text-on-dark" : "text-on-dark-muted",
        )}
      >
        {tile.label}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-on-dark-muted">
        {tone === "scattered" ? "Separate login" : "Connected"}
      </p>
    </div>
  );
}

function IntegrationStrip() {
  const systems = [
    { icon: BookOpen, label: "LMS" },
    { icon: Database, label: "SIS" },
    { icon: CalendarDays, label: "Calendar" },
  ];
  return (
    <div className="mt-6 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
      <ul className="grid gap-2">
        {systems.map((system) => (
          <li
            key={system.label}
            className="flex items-center gap-3 rounded-xl border border-dashed border-hairline-dark px-3 py-2.5 text-sm"
          >
            <system.icon className="size-4 text-on-dark-muted" aria-hidden />
            {system.label}
            <span className="ml-auto text-[10px] uppercase tracking-wider text-on-dark-muted">
              Separate
            </span>
          </li>
        ))}
      </ul>
      <p className="rounded-full border border-mint/40 px-3 py-2 text-center text-xs font-medium text-mint">
        Integrations scoped during implementation
      </p>
      <div className="rounded-2xl border border-lavender/40 bg-lavender/10 px-4 py-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-mint">AVERRA</p>
        <p className="mt-1 text-sm font-medium">Connected to the systems the school already runs</p>
      </div>
    </div>
  );
}

function StepColumn({
  title,
  steps,
  step,
  reduce,
  tone,
}: {
  title: string;
  steps: Step[];
  step: number;
  reduce: boolean;
  tone: "scattered" | "unified";
}) {
  const activeIndex = Math.min(step, Math.max(steps.length - 1, 0));
  return (
    <div>
      <p
        className={cn(
          "text-xs font-medium uppercase tracking-wider",
          tone === "unified" ? "text-mint" : "text-on-dark-muted",
        )}
      >
        {title}
      </p>
      <ol className="mt-3 space-y-3">
        {steps.map((item, index) => {
          const on = reduce || index === activeIndex;
          return (
            <li
              key={item.title}
              aria-current={!reduce && index === activeIndex ? "step" : undefined}
              className={cn(
                "rounded-2xl border px-4 py-3 transition-colors duration-300",
                on
                  ? tone === "unified"
                    ? "border-mint/50 bg-mint/10"
                    : "border-lavender/40 bg-on-dark/[0.06]"
                  : "border-hairline-dark",
              )}
            >
              <p className="text-xs font-medium text-on-dark-muted">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-medium">{item.title}</p>
              <p className="mt-1 text-sm text-on-dark-muted">{item.detail}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
