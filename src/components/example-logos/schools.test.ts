import { describe, expect, it } from "vitest";
import { EXAMPLE_LOGO_DISCLAIMER, EXAMPLE_SCHOOLS } from "./schools";

const NAMES = [
  "Pine Crest School",
  "Carrollton School of the Sacred Heart",
  "American Heritage Schools",
  "Berkeley Preparatory School",
  "Lake Highland Preparatory School",
  "The Bolles School",
  "The Westminster Schools",
  "Pace Academy",
  "The Lovett School",
  "Milton Academy",
  "Noble and Greenough School",
  "The Roxbury Latin School",
];

describe("example school logos", () => {
  it("lists exactly the twelve preview schools", () => {
    expect(EXAMPLE_SCHOOLS).toHaveLength(12);
    expect(EXAMPLE_SCHOOLS.map((school) => school.name)).toEqual(NAMES);
  });

  it("does not include the schools that were dropped", () => {
    const text = EXAMPLE_SCHOOLS.map((school) => school.name).join(" ");
    expect(text).not.toMatch(/Andover|Exeter|Ransom|Buckingham|Browne/);
  });

  it("keeps the preview-only disclaimer", () => {
    expect(EXAMPLE_LOGO_DISCLAIMER).toBe(
      "Example logos for design preview only — not current customers.",
    );
  });
});
