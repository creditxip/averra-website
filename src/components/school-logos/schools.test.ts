import { describe, expect, it } from "vitest";
import { PARTNER_SCHOOLS } from "./schools";

const NAMES = [
  "Carrollton School of the Sacred Heart",
  "Pine Crest School",
  "American Heritage Schools",
  "The Benjamin School",
  "Oxbridge Academy",
  "Berkeley Preparatory School",
  "Lake Highland Preparatory School",
  "The Bolles School",
  "Windermere Preparatory School",
  "The Westminster Schools",
  "Pace Academy",
  "The Lovett School",
  "Woodward Academy",
  "Commonwealth School",
  "Noble and Greenough School",
  "Milton Academy",
  "The Roxbury Latin School",
];

describe("partner school logos", () => {
  it("lists the seventeen confirmed schools in region order", () => {
    expect(PARTNER_SCHOOLS.map((school) => school.name)).toEqual(NAMES);
    expect(PARTNER_SCHOOLS.filter((school) => school.region === "Florida")).toHaveLength(9);
    expect(PARTNER_SCHOOLS.filter((school) => school.region === "Georgia")).toHaveLength(4);
    expect(PARTNER_SCHOOLS.filter((school) => school.region === "Boston")).toHaveLength(4);
  });
});
