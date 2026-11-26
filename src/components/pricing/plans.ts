export type Plan = { name: string; impl: string; monthly: string; features: string[]; note?: string; cta: string; highlight?: boolean };
export const PLANS: Plan[] = [
  { name: "Essential", impl: "$1,500", monthly: "$249/mo", cta: "Schedule a Personalized Demo",
    features: ["Branded school portal", "Student dashboard", "Announcements", "School resource center", "Basic administration", "Initial configuration"],
    note: "Branded mobile application deployment available as an additional service." },
  { name: "Plus", impl: "$3,500", monthly: "$499/mo", cta: "Schedule a Personalized Demo", highlight: true,
    features: ["Everything in Essential", "AI school assistant", "AI study companion", "Parent portal", "Teacher workspace", "Parent notifications", "Coursework workflows", "Grade management workflows", "Branded iOS and Android deployment", "Administrative analytics", "Initial staff training"] },
  { name: "Institutional", impl: "$7,500", monthly: "Custom quote", cta: "Request a Quote",
    features: ["Everything in Plus", "Advanced integrations", "Custom AI workflows", "Advanced administrative controls", "Multi-campus configuration", "Dedicated onboarding", "Custom institutional requirements"] },
];
/** Feature row → availability per [Essential, Plus, Institutional]; string = qualifier. */
export const TABLE: [string, (boolean | string)[]][] = [
  ["Branded school portal", [true, true, true]],
  ["Student dashboard & announcements", [true, true, true]],
  ["School resource center", [true, true, true]],
  ["AI school assistant & study companion", [false, true, true]],
  ["Parent portal & notifications", [false, true, true]],
  ["Teacher workspace, coursework & grades", [false, true, true]],
  ["Branded iOS and Android deployment", ["Add-on", true, true]],
  ["Administrative analytics", [false, true, true]],
  ["Initial staff training", [false, true, true]],
  ["Advanced integrations & custom AI workflows", [false, false, true]],
  ["Multi-campus configuration", [false, false, true]],
  ["Dedicated onboarding", [false, false, true]],
];
