import { z } from "zod";

export const ENROLLMENT = ["Under 250", "250–499", "500–999", "1,000–4,999", "5,000+"] as const;
export const SOFTWARE = ["Canvas", "Blackboard", "Schoology", "Google Classroom", "Moodle", "Veracross", "Blackbaud", "PowerSchool", "Other"] as const;
export const INTERESTS = ["AI student support", "Parent communication", "Teacher workflows", "School applications", "Administrative automation", "Full platform implementation"] as const;
export const PACKAGES = ["Essential", "Plus", "Institutional", "Not sure"] as const;

const FREE_MAIL = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "icloud.com", "live.com", "proton.me", "protonmail.com", "msn.com", "me.com"];
export function isFreeMail(email: string): boolean {
  const d = email.split("@")[1]?.trim().toLowerCase();
  return !!d && FREE_MAIL.includes(d);
}

export const demoSchema = z.object({
  fullName: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  jobTitle: z.string().trim().min(1, "Please enter your job title").max(120),
  schoolName: z.string().trim().min(1, "Please enter your school's name").max(160),
  schoolLocation: z.string().trim().min(1, "Please enter a city and state or country").max(160),
  enrollment: z.enum(ENROLLMENT, { message: "Please choose an enrollment range" }),
  software: z.array(z.enum(SOFTWARE)),
  otherSoftware: z.string().trim().max(200),
  interests: z.array(z.enum(INTERESTS)).min(1, "Choose at least one area of interest"),
  packagePreference: z.enum(PACKAGES).or(z.literal("")),
  notes: z.string().trim().max(2000),
});
export type DemoForm = z.infer<typeof demoSchema>;

export const STEP_FIELDS: (keyof DemoForm)[][] = [
  ["fullName", "email", "jobTitle"],
  ["schoolName", "schoolLocation", "enrollment", "software", "otherSoftware"],
  ["interests", "packagePreference", "notes"],
  [],
];

/** Map a free-form openDemo() interest (e.g. "AVERRA Plus") to a package preference. */
export function packageFromInterest(interest: string | null): DemoForm["packagePreference"] {
  if (!interest) return "";
  const hit = PACKAGES.find((p) => p !== "Not sure" && interest.toLowerCase().includes(p.toLowerCase()));
  return hit ?? "";
}
