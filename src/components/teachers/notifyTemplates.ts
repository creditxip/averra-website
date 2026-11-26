export const NOTIFY_TYPES = ["Assignment reminder", "Attendance notification", "Academic progress", "General message"] as const;
export type NotifyType = (typeof NOTIFY_TYPES)[number];
export const TEMPLATES: Record<NotifyType, string> = {
  "Assignment reminder": "Hi Jordan, a reminder that Alex's Cellular Respiration Lab is due tomorrow, Thursday.",
  "Attendance notification": "Hi Jordan, Alex arrived 10 minutes late to AP Biology this morning (Period 2). Please let the office know if there's anything we should be aware of.",
  "Academic progress": "Hi Jordan, Alex scored 46/50 on this week's cell structure quiz — great progress this unit. Keep encouraging the lab review sessions!",
  "General message": "Hi Jordan, ",
};
