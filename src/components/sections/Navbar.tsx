import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Wordmark } from "@/components/ui/wordmark";
import { Button } from "@/components/ui/button";
import { useDemoRequest } from "@/context/DemoRequestContext";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Teachers", href: "#teachers" },
  { label: "Families", href: "#families" },
  { label: "AI", href: "#ai" },
  { label: "Pricing", href: "#pricing" },
  { label: "Trust", href: "#trust" },
];

export function Navbar() {
  const { openDemo } = useDemoRequest();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "glass fixed inset-x-0 top-0 z-40 border-b transition-colors",
        scrolled ? "border-hairline" : "border-transparent",
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" aria-label="AVERRA home"><Wordmark /></a>
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Button variant="hero" size="sm" className="hidden h-9 px-4 sm:inline-flex" onClick={openDemo}>
            Schedule a Demo
          </Button>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-foreground md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-hairline md:hidden"
          >
            <ul className="flex flex-col px-6 py-4">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-lg font-medium tracking-tight">
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-3">
                <Button variant="hero" size="xl" className="w-full" onClick={() => { setOpen(false); openDemo(); }}>
                  Schedule a Demo
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
