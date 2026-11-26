import { PARTNER_SCHOOLS } from "@/components/school-logos/schools";
import { cn } from "@/lib/utils";

function LogoCard({ name, src, className }: { name: string; src: string; className?: string }) {
  return (
    <figure
      className={cn(
        "group flex h-28 flex-col items-center justify-center rounded-2xl border border-hairline bg-card px-3",
        className,
      )}
    >
      <img
        src={src}
        alt=""
        className="h-12 w-full object-contain grayscale opacity-80 transition-[filter,opacity] duration-200 group-hover:grayscale-0 group-hover:opacity-100 motion-reduce:transition-none"
      />
      <figcaption className="mt-2 line-clamp-2 text-center text-[11px] leading-snug text-muted-foreground">
        {name}
      </figcaption>
    </figure>
  );
}

export function SchoolLogosSection() {
  return (
    <section
      id="schools"
      aria-labelledby="schools-title"
      data-tone="light"
      className="relative scroll-mt-24 py-16 sm:py-20"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <h2 id="schools-title" className="text-display text-3xl sm:text-4xl">
          Trusted by leading independent schools
        </h2>
      </div>

      <div className="relative z-10 mt-8 hidden overflow-hidden motion-safe:md:block">
        <ul className="animate-logo-marquee flex w-max gap-3 px-3 hover:[animation-play-state:paused]">
          {PARTNER_SCHOOLS.map((school) => (
            <li key={school.name}>
              <LogoCard name={school.name} src={school.src} className="w-[10.5rem] shrink-0" />
            </li>
          ))}
          {PARTNER_SCHOOLS.map((school) => (
            <li key={`${school.name}-repeat`} aria-hidden>
              <LogoCard name={school.name} src={school.src} className="w-[10.5rem] shrink-0" />
            </li>
          ))}
        </ul>
      </div>

      <ul className="relative z-10 mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 px-6 sm:grid-cols-3 motion-safe:md:hidden">
        {PARTNER_SCHOOLS.map((school) => (
          <li key={school.name}>
            <LogoCard name={school.name} src={school.src} />
          </li>
        ))}
      </ul>
    </section>
  );
}
