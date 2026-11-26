/** "Next Friday": the coming Friday if at least 4 days away, otherwise the one after. */
export function nextFriday(from: Date): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  let add = ((5 - d.getDay() + 7) % 7) || 7;
  if (add < 4) add += 7;
  d.setDate(d.getDate() + add);
  return d;
}
/** Days from tomorrow up to and including the day before the exam. */
export function daysUntil(from: Date, exam: Date): Date[] {
  const out: Date[] = [];
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1);
  while (d < exam) { out.push(new Date(d)); d.setDate(d.getDate() + 1); }
  return out;
}
