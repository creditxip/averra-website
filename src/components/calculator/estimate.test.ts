import { describe, expect, it } from "vitest";
import { estimate } from "./estimate";

const base = {
  enrollment: 480,
  adminEmployees: 12,
  softwareExpenses: 64000,
  parentCommExpenses: 18000,
  otherTechExpenses: 22000,
  hoursPerWeek: 15,
  hourlyCost: 48,
  weeksPerYear: 40,
  scenario: "moderate" as const,
  consolidationPct: 0,
};

describe("operational estimate", () => {
  it("sums current annual technology expenses", () => {
    expect(estimate(base).currentAnnualTech).toBe(104000);
  });

  it("annualizes repetitive hours with the school-week assumption", () => {
    const result = estimate(base);
    expect(result.weeksPerYear).toBe(40);
    expect(result.annualAdminHours).toBe(600);
  });

  it("returns hours at the selected scenario rate", () => {
    const result = estimate(base);
    expect(result.scenarioRate).toBe(0.25);
    expect(result.hoursReturned).toBe(150);
    expect(result.laborCapacityValue).toBe(7200);
    expect(result.totalOperationalValue).toBe(7200);
  });

  it("adds a consolidation assumption only when the school sets one", () => {
    const result = estimate({ ...base, consolidationPct: 10 });
    expect(result.consolidationValue).toBe(10400);
    expect(result.totalOperationalValue).toBe(17600);
  });

  it("compares conservative, moderate, and ambitious from the same inputs", () => {
    const result = estimate(base);
    expect(result.scenarios.map((item) => item.rate)).toEqual([0.15, 0.25, 0.4]);
    expect(result.scenarios.find((item) => item.id === "conservative")?.hoursReturned).toBe(90);
    expect(result.scenarios.find((item) => item.id === "ambitious")?.hoursReturned).toBe(240);
    expect(result.scenarios.find((item) => item.id === "ambitious")?.laborCapacityValue).toBe(
      11520,
    );
  });

  it("keeps enrollment and headcount as context that does not change the totals", () => {
    const original = estimate(base);
    const changed = estimate({ ...base, enrollment: 2000, adminEmployees: 40 });
    expect(changed.enrollment).toBe(2000);
    expect(changed.adminEmployees).toBe(40);
    expect(changed.currentAnnualTech).toBe(original.currentAnnualTech);
    expect(changed.totalOperationalValue).toBe(original.totalOperationalValue);
  });

  it("treats blank or negative figures as zero and caps the consolidation assumption at 100%", () => {
    const result = estimate({
      ...base,
      softwareExpenses: -5,
      hoursPerWeek: Number.NaN,
      consolidationPct: 250,
    });
    expect(result.currentAnnualTech).toBe(40000);
    expect(result.annualAdminHours).toBe(0);
    expect(result.consolidationPct).toBe(100);
    expect(result.consolidationValue).toBe(40000);
  });
});
