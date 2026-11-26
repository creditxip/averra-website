import { Suspense } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { DEMO_APPS } from "./registry";
import { cn } from "@/lib/utils";

export function DemoModal({ index, onIndexChange, onClose, onCloseAutoFocus }: {
  index: number | null; onIndexChange: (i: number) => void; onClose: () => void; onCloseAutoFocus: (e: Event) => void;
}) {
  const app = index === null ? null : DEMO_APPS[index];
  const n = DEMO_APPS.length;
  const iconBtn = "grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
  return (
    <Dialog.Root open={!!app} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          onCloseAutoFocus={onCloseAutoFocus}
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background shadow-float data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 sm:inset-6 sm:rounded-2xl sm:border sm:border-hairline lg:inset-x-[6vw] lg:inset-y-[5vh]"
        >
          {app && (<>
            <header className="flex items-center gap-3 border-b border-hairline px-3 py-2.5 sm:px-4">
              <span className={cn("squircle icon-sheen grid size-8 shrink-0 place-items-center text-primary-foreground", app.gradient)}><app.icon className="size-4" aria-hidden /></span>
              <Dialog.Title className="truncate text-sm font-semibold tracking-tight sm:text-base">{app.name}</Dialog.Title>
              <span className="hidden rounded-full bg-mint-soft px-2.5 py-0.5 text-[11px] font-medium text-navy sm:inline">Simulated demo — sample data</span>
              <div className="ml-auto flex items-center gap-1">
                <button type="button" className={iconBtn} aria-label={`Previous app: ${DEMO_APPS[(index! - 1 + n) % n]!.name}`} onClick={() => onIndexChange((index! - 1 + n) % n)}><ChevronLeft className="size-4" /></button>
                <button type="button" className={iconBtn} aria-label={`Next app: ${DEMO_APPS[(index! + 1) % n]!.name}`} onClick={() => onIndexChange((index! + 1) % n)}><ChevronRight className="size-4" /></button>
                <Dialog.Close className={iconBtn} aria-label="Close demo"><X className="size-4" /></Dialog.Close>
              </div>
            </header>
            <p className="border-b border-hairline bg-mint-soft px-4 py-1 text-center text-[11px] font-medium text-navy sm:hidden">Simulated demo — sample data</p>
            <div className="min-h-0 flex-1">
              <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground">Loading demo…</div>}>
                <app.Component key={app.id} />
              </Suspense>
            </div>
          </>)}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
