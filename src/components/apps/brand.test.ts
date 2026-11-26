import { describe, expect, it } from "vitest";
import { initialsFrom } from "./brand";
describe("initialsFrom", () => {
  it("builds WA for Westbrook Academy", () => expect(initialsFrom("Westbrook Academy")).toBe("WA"));
  it("skips connector words", () => expect(initialsFrom("Academy of the Sacred Heart")).toBe("ASH"));
});
