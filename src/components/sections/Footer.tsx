import { Wordmark } from "@/components/ui/wordmark";
import { NAV_LINKS } from "./Navbar";

export function Footer() {
  return (
    <footer className="relative border-t border-hairline-dark bg-navy text-on-dark">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <div>
          <Wordmark tone="light" />
          <p className="mt-3 max-w-xs text-sm text-on-dark-muted">The Modern School Experience, Powered by AI.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-on-dark-muted">
            {NAV_LINKS.map((l) => (
              <li key={l.href}><a href={l.href} className="transition-colors hover:text-on-dark">{l.label}</a></li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-hairline-dark">
        <p className="mx-auto max-w-6xl px-6 py-6 text-xs text-on-dark-muted">
          © 2026 AVERRA. All product demonstrations on this site use simulated data.
        </p>
      </div>
    </footer>
  );
}
