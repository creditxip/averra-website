import { describe, expect, it } from "vitest";
import { gradeStats } from "./TeacherWalkthrough";

describe("walkthrough gradebook", () => {
  it("averages entered scores and counts empty ones as missing", () => {
    expect(gradeStats([40, 50, null])).toEqual({ average: 45, missing: 1 });
  });
});
