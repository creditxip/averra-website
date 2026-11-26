import { describe, expect, it } from "vitest";
import { answerFor } from "./AssistantApp";
import { buildCsv } from "./AdminApp";

describe("AVERRA AI knowledge base", () => {
  it("cites the handbook for the formal dress code", () => {
    expect(answerFor("What's the dress code for formal events?").source).toBe("2026–27 Student Handbook, p.14");
  });
  it("flags unknown questions for the school office", () => {
    const a = answerFor("What is the cafeteria wifi password?");
    expect(a.source).toBeUndefined();
    expect(a.text).toBe("I don't have approved school information on that yet. I've flagged it for the school office.");
  });
});

describe("Admin CSV export", () => {
  it("quotes cells and escapes quotes", () => {
    expect(buildCsv([["a", 1], ['say "hi"', 2]])).toBe('"a","1"\n"say ""hi""","2"');
  });
});
