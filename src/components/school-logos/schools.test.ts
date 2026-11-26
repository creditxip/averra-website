import { describe, expect, it } from "vitest";
import { PARTNER_SCHOOLS } from "./schools";

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

describe("partner school logos", () => {
  it("lists the twelve confirmed schools in region order", () => {
    expect(PARTNER_SCHOOLS.map((school) => school.name)).toEqual(NAMES);
    expect(PARTNER_SCHOOLS.filter((school) => school.region === "Florida")).toHaveLength(6);
    expect(PARTNER_SCHOOLS.filter((school) => school.region === "Georgia")).toHaveLength(3);
    expect(PARTNER_SCHOOLS.filter((school) => school.region === "Boston")).toHaveLength(3);
  });

  it("does not include the five schools that were removed", () => {
    const text = PARTNER_SCHOOLS.map((school) => school.name).join(" ");
    expect(text).not.toMatch(/Benjamin|Oxbridge|Windermere|Woodward|Commonwealth/);
  });
});
