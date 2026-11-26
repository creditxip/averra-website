import { useState } from "react";
import { Check, KeyRound, ShieldAlert } from "lucide-react";
import { SectionShell } from "@/components/ui/section-shell";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandedPhones } from "@/components/apps/BrandedPhones";
import { SWATCHES, initialsFrom } from "@/components/apps/brand";

const STEPS = [
  ["Discovery", "Understand your school, goals, users and existing systems."],
  [
    "Platform configuration",
    "Roles, permissions, modules, content and approved AI knowledge sources.",
  ],
  ["Branding and customization", "Your name, colors, icon and app experience."],
  [
    "App Store and Google Play submission assistance",
    "We prepare builds, listings and submission materials.",
  ],
  ["Launch and ongoing support", "Rollout, training and continuous improvement."],
];

export function AppsSection() {
  const [color, setColor] = useState(SWATCHES[0]!);
  const [name, setName] = useState("Westbrook Academy");
  const [initials, setInitials] = useState("WA");
  const brand = {
    color,
    name: name || "Your School",
    initials: (initials || initialsFrom(name)).slice(0, 3).toUpperCase(),
  };

  return (
    <SectionShell
      id="apps"
      eyebrow="iPhone and Android"
      title="Your School's Own Application. We Handle the Technology."
      tone="light"
    >
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Averra prepares your school's own iPhone and Android application — logo, colors, home
        screen, and the experiences families and students open every day. Your school keeps the
        identity. We handle the technology.
      </p>

      <Reveal className="mt-14">
        <BrandedPhones brand={brand} />
      </Reveal>

      <Reveal className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-card/80 p-6 shadow-float backdrop-blur">
        <h3 className="text-lg font-semibold tracking-tight">Try your branding</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor="brand-name">School name</Label>
            <Input
              id="brand-name"
              value={name}
              maxLength={40}
              onChange={(e) => {
                setName(e.target.value);
                setInitials(initialsFrom(e.target.value));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand-initials">Initials</Label>
            <Input
              id="brand-initials"
              value={initials}
              maxLength={3}
              onChange={(e) => setInitials(e.target.value)}
            />
          </div>
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-medium">Primary color</legend>
            <div className="flex items-center gap-2">
              {SWATCHES.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-label={`Use color ${s}`}
                  aria-pressed={color === s}
                  onClick={() => setColor(s)}
                  className="grid size-8 place-items-center rounded-full ring-offset-2 transition hover:scale-110 aria-pressed:ring-2 aria-pressed:ring-foreground"
                  style={{ background: s }}
                >
                  {color === s && <Check className="size-4 text-primary-foreground" aria-hidden />}
                </button>
              ))}
              <label className="relative size-8 cursor-pointer overflow-hidden rounded-full border border-border bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]">
                <span className="sr-only">Custom color</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
          </fieldset>
        </div>
      </Reveal>

      <ol className="mt-24 grid gap-6 md:grid-cols-5">
        {STEPS.map(([t, d], i) => (
          <Reveal
            key={t}
            delay={i * 0.08}
            className="relative border-l border-border pl-5 md:border-l-0 md:border-t md:pl-0 md:pt-6"
          >
            <li className="list-none">
              <span
                className="absolute -left-1.5 top-0 size-3 rounded-full bg-brand md:-top-1.5 md:left-0"
                aria-hidden
              />
              <p className="text-sm font-semibold text-lavender">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </li>
          </Reveal>
        ))}
      </ol>

      <div className="mt-16 grid gap-5 md:grid-cols-2">
        <Callout
          icon={<KeyRound className="size-5" aria-hidden />}
          title="Your school owns its identity."
        >
          Schools retain ownership of their Apple and Google developer accounts and their app's
          identity; Averra receives authorized access to manage deployment on your behalf.
        </Callout>
        <Callout
          icon={<ShieldAlert className="size-5" aria-hidden />}
          title="Store review is up to Apple and Google."
        >
          Publication depends on Apple App Store and Google Play review and approval. Averra assists
          with submission but cannot guarantee approval or review timelines.
        </Callout>
      </div>
    </SectionShell>
  );
}

function Callout({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card/80 p-6 backdrop-blur">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-lavender-soft text-lavender">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
