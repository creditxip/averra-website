import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CalendarClock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DemoRequestForm } from "@/components/demo-request/DemoRequestForm";

type DemoRequestValue = { openDemo: (interest?: unknown) => void; interest: string | null; closeDemo: () => void; isOpen: boolean };

const DemoRequestContext = createContext<DemoRequestValue | null>(null);

export function DemoRequestProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [interest, setInterest] = useState<string | null>(null);
  const openDemo = useCallback((i?: unknown) => { setInterest(typeof i === "string" ? i : null); setIsOpen(true); }, []);
  const closeDemo = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ openDemo, closeDemo, isOpen, interest }), [openDemo, closeDemo, isOpen, interest]);

  return (
    <DemoRequestContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex h-[100dvh] max-h-[100dvh] w-full max-w-none flex-col gap-0 overflow-y-auto rounded-none border-hairline p-6 sm:h-auto sm:max-h-[90vh] sm:max-w-xl sm:rounded-2xl sm:p-8">
          <DialogHeader className="mb-6 text-left">
            <div className="bg-brand mb-3 grid size-11 place-items-center rounded-xl text-primary-foreground">
              <CalendarClock className="size-5" aria-hidden />
            </div>
            <DialogTitle className="text-xl tracking-tight">Schedule a Personalized Demo</DialogTitle>
            <DialogDescription>Tell us a little about you and your school. It takes about two minutes.</DialogDescription>
          </DialogHeader>
          {isOpen && <DemoRequestForm key={interest ?? "none"} interest={interest} onClose={closeDemo} />}
        </DialogContent>
      </Dialog>
    </DemoRequestContext.Provider>
  );
}

export function useDemoRequest() {
  const ctx = useContext(DemoRequestContext);
  if (!ctx) throw new Error("useDemoRequest must be used within DemoRequestProvider");
  return ctx;
}
