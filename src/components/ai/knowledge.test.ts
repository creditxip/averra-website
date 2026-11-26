import { describe, expect, it } from "vitest";
import { answerQuestion, FALLBACK, studyDays } from "./knowledge";

const all = { handbook: true, calendar: true, athletics: true, dining: true, transport: true };

describe("school assistant sources", () => {
  it("cites the approved source", () => {
    expect(answerQuestion("When are midterm exams?", all).source).toBe("Academic Calendar 2026–27");
  });
  it("falls back when the related source is turned off", () => {
    expect(answerQuestion("When are midterm exams?", { ...all, calendar: false })).toEqual({ text: FALLBACK, source: null });
  });
});

describe("study plan length", () => {
  it("is the number of days until the exam", () => {
    expect(studyDays(new Date(2026, 2, 10), new Date(2026, 2, 15))).toBe(5);
  });
});
