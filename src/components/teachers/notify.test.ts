import { describe, expect, it } from "vitest";
import { TEMPLATES } from "./notifyTemplates";
describe("parent notification templates", () => {
  it("assignment reminder pre-fills the brief's text", () => expect(TEMPLATES["Assignment reminder"]).toBe("Hi Jordan, a reminder that Alex's Cellular Respiration Lab is due tomorrow, Thursday."));
});
