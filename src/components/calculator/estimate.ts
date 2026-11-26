/** Illustrative operational estimate. Not a price, a quote, or a savings guarantee. */

export const SCHOOL_WEEKS = 40;

export const SCENARIOS = [
  { id: "conservative", label: "Conservative", rate: 0.15 },
  { id: "moderate", label: "Moderate", rate: 0.25 },
  { id: "ambitious", label: "Ambitious", rate: 0.4 },
] as const;

export type ScenarioId = (typeof SCENARIOS)[number]["id"];

export type EstimateInput = {
  enrollment: number;
  adminEmployees: number;
  softwareExpenses: number;
  parentCommExpenses: number;
  otherTechExpenses: number;
  hoursPerWeek: number;
  hourlyCost: number;
  /** School weeks used to annualize weekly hours. Default in the UI is 40. */
  weeksPerYear: number;
  scenario: ScenarioId;
  /** Share of current tech expenses the school chooses to model. Default 0. */
  consolidationPct: number;
};

export type ScenarioResult = {
  id: ScenarioId;
  label: string;
  rate: number;
  hoursReturned: number;
  laborCapacityValue: number;
  totalOperationalValue: number;
};

function finite(value: number, min: number, max = Number.POSITIVE_INFINITY) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function estimate(input: EstimateInput) {
  const enrollment = finite(input.enrollment, 0);
  const adminEmployees = finite(input.adminEmployees, 0);
  const software = finite(input.softwareExpenses, 0);
  const parentComm = finite(input.parentCommExpenses, 0);
  const other = finite(input.otherTechExpenses, 0);
  const hoursPerWeek = finite(input.hoursPerWeek, 0);
  const hourlyCost = finite(input.hourlyCost, 0);
  const weeksPerYear = finite(input.weeksPerYear, 0);
  const consolidationPct = finite(input.consolidationPct, 0, 100);

  const scenario = SCENARIOS.find((item) => item.id === input.scenario);
  if (!scenario) throw new Error(`Unknown scenario: ${input.scenario}`);

  const currentAnnualTech = software + parentComm + other;
  const annualAdminHours = hoursPerWeek * weeksPerYear;
  const consolidationValue = currentAnnualTech * (consolidationPct / 100);

  const scenarios: ScenarioResult[] = SCENARIOS.map((item) => {
    const hoursReturned = annualAdminHours * item.rate;
    const laborCapacityValue = hoursReturned * hourlyCost;
    return {
      id: item.id,
      label: item.label,
      rate: item.rate,
      hoursReturned,
      laborCapacityValue,
      totalOperationalValue: laborCapacityValue + consolidationValue,
    };
  });

  const selected = scenarios.find((item) => item.id === scenario.id);
  if (!selected) throw new Error(`Missing scenario result: ${scenario.id}`);

  return {
    enrollment,
    adminEmployees,
    software,
    parentComm,
    other,
    currentAnnualTech,
    weeksPerYear,
    annualAdminHours,
    scenarioId: scenario.id,
    scenarioLabel: scenario.label,
    scenarioRate: scenario.rate,
    hoursReturned: selected.hoursReturned,
    laborCapacityValue: selected.laborCapacityValue,
    consolidationPct,
    consolidationValue,
    totalOperationalValue: selected.totalOperationalValue,
    scenarios,
  };
}
