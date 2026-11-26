import { useState, type KeyboardEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bell, BookOpen, CalendarDays, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { AndroidFrame, PhoneFrame } from "@/components/ui/phone-frame";
import { cn } from "@/lib/utils";

type Brand = { color: string; name: string; initials: string };
type ScreenId = "brand" | "home" | "parent" | "student" | "assistant";
type Platform = "ios" | "android";

const SCREENS: { id: ScreenId; label: string }[] = [
  { id: "brand", label: "Logo and branding" },
  { id: "home", label: "Home screen" },
  { id: "parent", label: "Parent portal" },
  { id: "student", label: "Student dashboard" },
  { id: "assistant", label: "AI assistant" },
];

function Crest({ brand, size = 56 }: { brand: Brand; size?: number }) {
  return (
    <div
      className="grid place-items-center rounded-[28%] font-semibold text-primary-foreground shadow-lg"
      style={{
        background: `linear-gradient(145deg, ${brand.color}, color-mix(in oklab, ${brand.color} 55%, black))`,
        width: size,
        height: size,
        fontSize: size * 0.34,
      }}
    >
      {brand.initials}
    </div>
  );
}

function Screen({ id, brand, platform }: { id: ScreenId; brand: Brand; platform: Platform }) {
  if (id === "brand") return <Splash brand={brand} />;
  if (id === "home") return <Home brand={brand} platform={platform} />;
  if (id === "parent") return <Parent brand={brand} />;
  if (id === "student") return <Student brand={brand} />;
  return <Assistant brand={brand} />;
}

function Splash({ brand }: { brand: Brand }) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-4 text-primary-foreground"
      style={{
        background: `linear-gradient(170deg, ${brand.color}, color-mix(in oklab, ${brand.color} 45%, black))`,
      }}
    >
      <div className="grid size-20 place-items-center rounded-full border-2 border-current/60 text-2xl font-semibold tracking-wide">
        {brand.initials}
      </div>
      <p className="px-6 text-center text-base font-semibold">{brand.name}</p>
      <p className="text-[10px] uppercase tracking-[0.2em] opacity-75">School application</p>
    </div>
  );
}

function Home({ brand, platform }: { brand: Brand; platform: Platform }) {
  const icons =
    platform === "android"
      ? ["Phone", "Messages", "Browser", "Camera", "Photos", "Clock", "Files", "Settings"]
      : ["Phone", "Messages", "Browser", "Camera", "Photos", "Clock", "Maps", "Settings"];
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-lavender-soft to-mint-soft px-3.5 pt-4">
      {platform === "android" && (
        <div className="mb-4 rounded-full bg-card/90 px-3 py-2 text-[11px] text-muted-foreground shadow-sm">
          Search
        </div>
      )}
      <div className="grid grid-cols-4 content-start gap-x-2 gap-y-4">
        {icons.slice(0, 4).map((name) => (
          <AppDot key={name} name={name} round={platform === "android"} />
        ))}
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-[28%] ring-2 ring-primary ring-offset-2">
            <Crest brand={brand} size={44} />
          </div>
          <span className="max-w-full truncate text-[9px] font-semibold">{brand.initials}</span>
        </div>
        {icons.slice(4).map((name) => (
          <AppDot key={name} name={name} round={platform === "android"} />
        ))}
      </div>
      <div className="mt-auto mb-3 flex items-center justify-around rounded-2xl bg-card/80 px-3 py-2 shadow-sm">
        <Crest brand={brand} size={36} />
        <AppDot name="Mail" round={platform === "android"} />
        <AppDot name="Calendar" round={platform === "android"} />
      </div>
    </div>
  );
}

function AppDot({ name, round }: { name: string; round: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn("size-11 bg-card/80 shadow-sm", round ? "rounded-full" : "rounded-[28%]")}
        aria-hidden
      />
      <span className="text-[9px] text-muted-foreground">{name}</span>
    </div>
  );
}

function Header({ brand, title }: { brand: Brand; title: string }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 text-primary-foreground"
      style={{ background: brand.color }}
    >
      <Crest brand={brand} size={26} />
      <div className="min-w-0">
        <p className="truncate text-[10px] opacity-80">{brand.name}</p>
        <p className="text-xs font-semibold">{title}</p>
      </div>
    </div>
  );
}

function Parent({ brand }: { brand: Brand }) {
  return (
    <div className="h-full bg-cloud">
      <Header brand={brand} title="Parent portal" />
      <div className="space-y-2 p-3 text-[11px]">
        <p className="text-sm font-semibold">Good afternoon</p>
        <Row
          icon={<Bell className="size-3.5" />}
          brand={brand}
          text="New grade posted in Chemistry"
        />
        <Row
          icon={<CheckCircle2 className="size-3.5" />}
          brand={brand}
          text="Attendance recorded · 8:02 AM"
        />
        <Row
          icon={<CalendarDays className="size-3.5" />}
          brand={brand}
          text="Spring Showcase · Apr 18"
        />
        <Row
          icon={<MessageCircle className="size-3.5" />}
          brand={brand}
          text="A teacher sent a message"
        />
      </div>
    </div>
  );
}

function Student({ brand }: { brand: Brand }) {
  return (
    <div className="h-full bg-cloud">
      <Header brand={brand} title="Student dashboard" />
      <div className="space-y-2 p-3 text-[11px]">
        <p className="text-sm font-semibold">Today</p>
        {[
          ["8:15", "AP Biology"],
          ["9:30", "Calculus"],
          ["11:00", "English"],
        ].map(([time, course]) => (
          <div key={course} className="flex items-center gap-2 rounded-lg bg-card p-2 shadow-sm">
            <span className="w-9 font-medium" style={{ color: brand.color }}>
              {time}
            </span>
            {course}
          </div>
        ))}
        <Row
          icon={<BookOpen className="size-3.5" />}
          brand={brand}
          text="Lab report due Thursday"
        />
      </div>
    </div>
  );
}

function Assistant({ brand }: { brand: Brand }) {
  return (
    <div className="flex h-full flex-col bg-cloud">
      <Header brand={brand} title="AI assistant" />
      <div className="flex-1 space-y-2 p-3 text-[11px]">
        <p
          className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm px-3 py-2 text-primary-foreground"
          style={{ background: brand.color }}
        >
          When is the Spring Showcase?
        </p>
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-card p-3 shadow-sm">
          Friday, April 18 at 6:30 PM in the Performing Arts Center.
          <span className="mt-2 flex w-fit items-center gap-1 rounded-full bg-mint-soft px-2 py-0.5 text-[9px]">
            <Sparkles className="size-2.5" aria-hidden />
            Academic Calendar
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, text, brand }: { icon: ReactNode; text: string; brand: Brand }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-card p-2 shadow-sm">
      <span style={{ color: brand.color }}>{icon}</span>
      {text}
    </div>
  );
}

export function BrandedPhones({ brand }: { brand: Brand }) {
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState<ScreenId>("parent");
  const current = SCREENS.find((item) => item.id === screen) ?? SCREENS[2];
  if (!current) return null;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = SCREENS.findIndex((item) => item.id === screen);
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = SCREENS[(index + direction + SCREENS.length) % SCREENS.length];
    if (next) setScreen(next.id);
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="School app screens"
        className="flex flex-wrap justify-center gap-2"
        onKeyDown={onKeyDown}
      >
        {SCREENS.map((item) => {
          const selected = item.id === screen;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`app-tab-${item.id}`}
              aria-selected={selected}
              aria-controls="school-app-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setScreen(item.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                selected
                  ? "border-transparent bg-navy text-on-dark"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        id="school-app-panel"
        role="tabpanel"
        aria-labelledby={`app-tab-${current.id}`}
        className="mt-8"
      >
        <div className="flex flex-col items-center justify-center gap-10 sm:flex-row sm:items-end sm:gap-12">
          <Device caption="iPhone" reduce={!!reduce}>
            <PhoneFrame
              label={`iPhone showing ${current.label} for ${brand.name}`}
              className="h-[520px] w-[250px] max-w-full"
            >
              <Screen id={current.id} brand={brand} platform="ios" />
            </PhoneFrame>
          </Device>
          <Device caption="Android" reduce={!!reduce} delay={0.4}>
            <AndroidFrame
              label={`Android showing ${current.label} for ${brand.name}`}
              className="h-[520px] w-[250px] max-w-full"
            >
              <Screen id={current.id} brand={brand} platform="android" />
            </AndroidFrame>
          </Device>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          The same {current.label.toLowerCase()} on iPhone and Android. Preview with sample
          branding.
        </p>
      </div>
    </div>
  );
}

function Device({
  caption,
  children,
  reduce,
  delay = 0,
}: {
  caption: string;
  children: ReactNode;
  reduce: boolean;
  delay?: number;
}) {
  return (
    <motion.figure
      className="flex flex-col items-center"
      animate={reduce ? { y: 0 } : { y: [0, -8, 0] }}
      transition={
        reduce ? { duration: 0 } : { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay }
      }
    >
      {children}
      <figcaption className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {caption}
      </figcaption>
    </motion.figure>
  );
}
