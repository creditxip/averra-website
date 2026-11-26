import { EXAMPLE_LOGO_DISCLAIMER, EXAMPLE_SCHOOLS } from "@/components/example-logos/schools";
import { cn } from "@/lib/utils";

const REGIONS = ["Florida", "Georgia", "Boston"] as const;

export function ExampleLogosSection() {
  return (
    <section
      id="example-logos"
      aria-labelledby="example-logos-title"
      data-tone="light"
      className="relative scroll-mt-24 py-16 sm:py-20"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <h2 id="example-logos-title" className="text-display text-3xl sm:text-4xl">
          Trusted by schools like
        </h2>
        <p className="mt-4 max-w-3xl rounded-2xl border border-lavender/40 bg-lavender-soft px-4 py-3 text-sm font-medium leading-relaxed text-navy sm:text-base">
          {EXAMPLE_LOGO_DISCLAIMER}
        </p>
        <div className="mt-8 grid gap-8">
          {REGIONS.map((region) => (
            <div key={region}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {region}
              </h3>
              <ul
                className={cn(
                  "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3",
                  region === "Florida" ? "lg:grid-cols-6" : "lg:grid-cols-3",
                )}
              >
                {EXAMPLE_SCHOOLS.filter((school) => school.region === region).map((school) => (
                  <li key={school.name}>
                    <figure className="group flex h-full flex-col items-center justify-between rounded-2xl border border-hairline bg-card px-3 py-4">
                      <img
                        src={school.src}
                        alt=""
                        className="h-16 w-full object-contain grayscale opacity-80 transition-[filter,opacity] duration-200 group-hover:grayscale-0 group-hover:opacity-100 motion-reduce:transition-none"
                      />
                      <figcaption className="mt-3 text-center text-[11px] leading-snug text-muted-foreground">
                        {school.name}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
