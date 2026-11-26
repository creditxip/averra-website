import { describe, expect, it } from "vitest";
import { demoSchema, isFreeMail, packageFromInterest } from "./schema";

const valid = { fullName: "A B", email: "a@school.edu", jobTitle: "Head", schoolName: "S", schoolLocation: "Boston, MA", enrollment: "500–999", software: [], otherSoftware: "", interests: ["Teacher workflows"], packagePreference: "", notes: "" };

describe("demo request rules", () => {
  it("rejects a malformed email", () => expect(demoSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false));
  it("warns on gmail but still accepts it", () => {
    expect(isFreeMail("x@gmail.com")).toBe(true);
    expect(demoSchema.safeParse({ ...valid, email: "x@gmail.com" }).success).toBe(true);
  });
  it("requires at least one interest", () => expect(demoSchema.safeParse({ ...valid, interests: [] }).success).toBe(false));
  it("preselects package from pricing CTA", () => expect(packageFromInterest("AVERRA Institutional")).toBe("Institutional"));
});
