import { describe, expect, it } from "vitest";
import { daysUntil, nextFriday } from "./examPlan";
describe("exam study schedule", () => {
  it("from Wednesday Nov 25 2026, next Friday is Dec 4", () => {
    expect(nextFriday(new Date(2026, 10, 25)).getDate()).toBe(4);
  });
  it("on a Friday, picks the following Friday", () => expect(nextFriday(new Date(2026, 10, 27)).getDate()).toBe(4));
  it("from Monday Nov 23, next Friday is Nov 27", () => expect(nextFriday(new Date(2026, 10, 23)).getDate()).toBe(27));
  it("plans one day per day before the exam", () => expect(daysUntil(new Date(2026, 10, 23), new Date(2026, 10, 27)).length).toBe(3));
});
