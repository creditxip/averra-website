import { ArrowRight } from "lucide-react";
import { FLAGSHIP_TYPES, TEMPLATES } from "./notifyTemplates";

/** The interactive phone flow lives in the flagship section. This keeps the message types next to the teacher workspace. */
export function ParentNotifyDemo() {
  return (
    <div className="mt-16 rounded-3xl border border-hairline bg-card/80 p-6 shadow-soft sm:p-8">
      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        From one click to the right parent.
      </h3>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        No separate email. One click from the gradebook sends a message into the Averra Family app.
      </p>
      <a
        href="#notify"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-lavender"
      >
        Watch the demonstration
        <ArrowRight className="size-4" aria-hidden />
      </a>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {FLAGSHIP_TYPES.map((item) => (
          <li key={item.type} className="rounded-2xl border border-hairline p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-lavender">
              {item.label}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{TEMPLATES[item.type]}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        Simulated sample messages for Alex Morgan. Delivery channels are configured during
        implementation.
      </p>
    </div>
  );
}
