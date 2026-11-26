export type Role = "Student" | "Parent" | "Teacher";
export type SourceId = "handbook" | "calendar" | "athletics" | "dining" | "transport";

export const SOURCES: { id: SourceId; name: string }[] = [
  { id: "handbook", name: "Westbrook Family Handbook 2026–27" },
  { id: "calendar", name: "Academic Calendar 2026–27" },
  { id: "athletics", name: "Athletics Schedule — Spring" },
  { id: "dining", name: "Dining Menu — March" },
  { id: "transport", name: "Transportation Policy" },
];

type Entry = { keys: string[]; source: SourceId; answer: string };
const KB: Entry[] = [
  { keys: ["midterm", "exam"], source: "calendar", answer: "Midterm exams run Monday, March 16 through Thursday, March 19. Morning sessions begin at 8:30 AM and classes do not meet during exam week." },
  { keys: ["spring break", "break"], source: "calendar", answer: "Spring break is March 23–27. Classes resume Monday, March 30." },
  { keys: ["grading period", "report card", "progress report"], source: "calendar", answer: "Third-quarter progress reports are released to families on Friday, April 10." },
  { keys: ["dress code", "uniform", "formal"], source: "handbook", answer: "Students wear the Westbrook uniform on class days. For formal events, business formal attire is expected and school blazers are encouraged." },
  { keys: ["absence", "absent", "sick"], source: "handbook", answer: "Families report an absence in the AVERRA Family app or by calling the attendance office before 8:30 AM. Absences of three or more days require a note." },
  { keys: ["phone", "device"], source: "handbook", answer: "Phones stay in lockers during class periods. Students may use them at lunch and between classes in common areas." },
  { keys: ["late work", "extension"], source: "handbook", answer: "Teachers may grant extensions at their discretion. Unexcused late work loses 10% per day, up to three days." },
  { keys: ["game", "soccer", "basketball", "athletic", "practice"], source: "athletics", answer: "Varsity soccer plays Ridgeview on Saturday at 10:00 AM at the North Fields. Practice is weekdays 3:45–5:30 PM." },
  { keys: ["lunch", "menu", "dining", "food"], source: "dining", answer: "Today's lunch: herb-roasted chicken, a vegetarian lentil curry, and the salad bar. Gluten-free options are labeled at each station." },
  { keys: ["bus", "pickup", "drop-off", "transport"], source: "transport", answer: "Morning buses arrive by 7:50 AM. Afternoon pickup is at the Elm Street loop at 3:20 PM; late buses leave at 5:45 PM." },
];
export const FALLBACK = "I don't have approved school information on that yet. I've flagged it for the school office.";

export const SUGGESTED: Record<Role, string[]> = {
  Student: ["When are midterm exams?", "What's the late work policy?", "What's for lunch today?", "When is the next soccer game?"],
  Parent: ["How do I report an absence?", "When is spring break?", "What time is afternoon bus pickup?", "When are progress reports released?"],
  Teacher: ["When are midterm exams?", "What's the phone policy in class?", "What's the late work policy?", "When are progress reports released?"],
};

/** Answer only from enabled (school-approved) sources. */
export function answerQuestion(q: string, enabled: Record<SourceId, boolean>) {
  const lower = q.toLowerCase();
  const hit = KB.find((k) => k.keys.some((key) => lower.includes(key)));
  if (!hit || !enabled[hit.source]) return { text: FALLBACK, source: null as string | null };
  return { text: hit.answer, source: SOURCES.find((s) => s.id === hit.source)!.name };
}

/** Number of study days from today (exclusive) through the exam date (exclusive), capped 1..14. */
export function studyDays(today: Date, exam: Date) {
  const ms = Date.UTC(exam.getFullYear(), exam.getMonth(), exam.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.round(ms / 86400000);
  return Math.max(1, Math.min(14, days));
}
