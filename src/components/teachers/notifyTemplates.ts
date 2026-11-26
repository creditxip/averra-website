export const NOTIFY_TYPES = [
  "Assignment reminder",
  "Attendance notification",
  "Academic progress",
  "General message",
] as const;
export type NotifyType = (typeof NOTIFY_TYPES)[number];
export const TEMPLATES: Record<NotifyType, string> = {
  "Assignment reminder":
    "Hi Jordan, a reminder that Alex's Cellular Respiration Lab is due tomorrow, Thursday.",
  "Attendance notification":
    "Hi Jordan, Alex arrived 10 minutes late to AP Biology this morning (Period 2). Please let the office know if there's anything we should be aware of.",
  "Academic progress":
    "Hi Jordan, Alex scored 46/50 on this week's cell structure quiz — great progress this unit. Keep encouraging the lab review sessions!",
  "General message":
    "Hi Jordan, a quick note about Alex's day in AP Biology. Happy to talk if you have questions.",
};

/** Short labels for the flagship demonstration. Values still key the shared templates. */
export const FLAGSHIP_TYPES: { type: NotifyType; label: string }[] = [
  { type: "Assignment reminder", label: "Assignment reminder" },
  { type: "Attendance notification", label: "Attendance" },
  { type: "Academic progress", label: "Academic progress" },
  { type: "General message", label: "General" },
];

export type NotifyPhase = "select" | "notify" | "compose" | "send" | "deliver" | "open";

export function notifyBeat(phase: NotifyPhase): "Select" | "Send" | "Delivered" {
  if (phase === "select" || phase === "notify") return "Select";
  if (phase === "compose" || phase === "send") return "Send";
  return "Delivered";
}
