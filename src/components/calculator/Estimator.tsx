import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { useDemoRequest } from "@/context/DemoRequestContext";
import { cn } from "@/lib/utils";
import { estimate, SCHOOL_WEEKS, SCENARIOS, type ScenarioId } from "./estimate";

const usd = (n: number) =>
  Math.round(n).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
const int = (n: number) => Math.round(n).toLocaleString("en-US");

function Field({
  id,
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  onChange,
  prefix,
  suffix,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  const clamp = (next: number) => Math.min(max, Math.max(min, Number.isFinite(next) ? next : min));
  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <div className="flex w-fit max-w-full items-center rounded-lg border border-input bg-card px-2 focus-within:ring-2 focus-within:ring-ring">
          {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            autoComplete="off"
            onChange={(event) => onChange(clamp(Number(event.target.value)))}
            className="w-24 min-w-0 bg-transparent py-1.5 text-right text-sm tabular-nums outline-none sm:w-28"
          />
          {suffix && <span className="ml-0.5 text-sm text-muted-foreground">{suffix}</span>}
        </div>
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      <Slider
        className="mt-3"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(next) => onChange(next[0] ?? min)}
      />
    </div>
  );
}

export function Estimator() {
  const { openDemo } = useDemoRequest();
  const [enrollment, setEnrollment] = useState(480);
  const [admins, setAdmins] = useState(12);
  const [software, setSoftware] = useState(64000);
  const [parentComm, setParentComm] = useState(18000);
  const [other, setOther] = useState(22000);
  const [hours, setHours] = useState(15);
  const [cost, setCost] = useState(48);
  const [weeks, setWeeks] = useState(SCHOOL_WEEKS);
  const [consolidation, setConsolidation] = useState(0);
  const [scenario, setScenario] = useState<ScenarioId>("moderate");

  const result = useMemo(
    () =>
      estimate({
        enrollment,
        adminEmployees: admins,
        softwareExpenses: software,
        parentCommExpenses: parentComm,
        otherTechExpenses: other,
        hoursPerWeek: hours,
        hourlyCost: cost,
        weeksPerYear: weeks,
        scenario,
        consolidationPct: consolidation,
      }),
    [enrollment, admins, software, parentComm, other, hours, cost, weeks, scenario, consolidation],
  );

  const expenseMax = Math.max(result.currentAnnualTech, 1);
  const scenarioMax = Math.max(...result.scenarios.map((item) => item.laborCapacityValue), 1);

  return (
    <div className="mt-14 overflow-hidden rounded-3xl border border-hairline bg-card shadow-float">
      <fieldset className="border-b border-hairline p-6 sm:p-8">
        <legend className="text-sm font-medium">Automation scenario</legend>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Percent of repetitive administrative hours that could be returned. This is an assumption
          you set.
        </p>
        <div className="mt-4 grid gap-1 rounded-xl border border-hairline bg-muted/50 p-1 sm:grid-cols-3">
          {SCENARIOS.map((item) => (
            <label
              key={item.id}
              className={cn(
                "cursor-pointer rounded-lg px-2 py-2 text-center text-sm transition-colors focus-within:ring-2 focus-within:ring-ring",
                scenario === item.id ? "bg-card font-medium shadow-soft" : "text-muted-foreground",
              )}
            >
              <input
                type="radio"
                name="averra-scenario"
                className="sr-only"
                checked={scenario === item.id}
                onChange={() => setScenario(item.id)}
              />
              <span className="block">{item.label}</span>
              <span className="block text-xs tabular-nums">{Math.round(item.rate * 100)}%</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0 space-y-7 p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Your school
          </p>
          <Field
            id="enr"
            label="Student enrollment"
            value={enrollment}
            min={1}
            max={20000}
            step={10}
            onChange={setEnrollment}
          />
          <Field
            id="admins"
            label="Number of administrative employees"
            value={admins}
            min={0}
            max={400}
            onChange={setAdmins}
          />
          <Field
            id="software"
            label="Annual software expenses"
            value={software}
            min={0}
            max={2000000}
            step={1000}
            prefix="$"
            onChange={setSoftware}
          />
          <Field
            id="parent-comm"
            label="Annual parent communication expenses"
            value={parentComm}
            min={0}
            max={1000000}
            step={500}
            prefix="$"
            onChange={setParentComm}
          />
          <Field
            id="other-tech"
            label="Other technology expenses"
            value={other}
            min={0}
            max={1000000}
            step={500}
            prefix="$"
            onChange={setOther}
          />
          <Field
            id="hours"
            label="Weekly hours spent on repetitive administrative communication"
            value={hours}
            min={0}
            max={200}
            onChange={setHours}
          />
          <Field
            id="cost"
            label="Average hourly staff cost"
            value={cost}
            min={0}
            max={400}
            prefix="$"
            onChange={setCost}
          />
          <Field
            id="weeks"
            label="School weeks per year"
            hint="Annual hours = weekly hours × school weeks. The default is 40 school weeks, so the year is not treated as 52 weeks."
            value={weeks}
            min={1}
            max={52}
            onChange={setWeeks}
          />
          <Field
            id="consolidation"
            label="Consolidation opportunity"
            hint="Your assumption. Optional share of current technology expenses to include in the total. Starts at 0%."
            value={consolidation}
            min={0}
            max={100}
            suffix="%"
            onChange={setConsolidation}
          />
        </div>

        <div className="relative min-w-0 bg-navy p-6 text-on-dark sm:p-8" aria-live="polite">
          <div className="bg-brand absolute inset-x-0 top-0 h-px" aria-hidden />
          <p className="text-xs font-medium uppercase tracking-wider text-on-dark-muted">
            Illustrative estimate
          </p>
          <p className="mt-3 text-sm text-on-dark-muted">
            Modeled for {int(result.enrollment)} students and {int(result.adminEmployees)}{" "}
            administrative employees. Headcount is context for a proposal and does not change the
            totals.
          </p>

          <dl className="mt-6 grid gap-x-6 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm text-on-dark-muted">Current annual technology expenses</dt>
              <dd className="text-display mt-1 text-4xl tabular-nums sm:text-5xl">
                <AnimatedNumber value={result.currentAnnualTech} format={usd} />
              </dd>
            </div>
            <div>
              <dt className="text-sm text-on-dark-muted">
                Annual administrative hours on repetitive work
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">
                <AnimatedNumber value={result.annualAdminHours} format={int} />
                <span className="ml-1 text-base font-normal text-on-dark-muted">hrs</span>
              </dd>
              <p className="mt-1 text-xs text-on-dark-muted">
                Weekly hours × {int(result.weeksPerYear)} school weeks.
              </p>
            </div>
            <div>
              <dt className="text-sm text-on-dark-muted">
                Potential hours returned through automation
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-mint">
                <AnimatedNumber value={result.hoursReturned} format={int} />
                <span className="ml-1 text-base font-normal text-on-dark-muted">hrs</span>
              </dd>
              <p className="mt-1 text-xs text-on-dark-muted">
                {Math.round(result.scenarioRate * 100)}% · {result.scenarioLabel.toLowerCase()}{" "}
                assumption.
              </p>
            </div>
            <div>
              <dt className="text-sm text-on-dark-muted">Labor capacity value</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">
                <AnimatedNumber value={result.laborCapacityValue} format={usd} />
              </dd>
              <p className="mt-1 text-xs text-on-dark-muted">
                Hours returned × average hourly staff cost.
              </p>
            </div>
            <div>
              <dt className="text-sm text-on-dark-muted">Total potential operational value</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-mint">
                <AnimatedNumber value={result.totalOperationalValue} format={usd} />
              </dd>
              <p className="mt-1 text-xs text-on-dark-muted">
                {result.consolidationPct === 0
                  ? "Equals labor capacity value. Consolidation opportunity is 0%."
                  : `Labor capacity plus ${int(result.consolidationPct)}% of current technology expenses.`}
              </p>
            </div>
          </dl>

          <div className="mt-8 space-y-6">
            <ExpenseBreakdown
              software={result.software}
              parentComm={result.parentComm}
              other={result.other}
              total={expenseMax}
            />
            <ScenarioBars
              scenarios={result.scenarios}
              active={result.scenarioId}
              max={scenarioMax}
              onSelect={setScenario}
            />
          </div>

          <div className="mt-8 grid gap-4 rounded-2xl border border-hairline-dark p-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-on-dark-muted">Your current annual technology expenses</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                <AnimatedNumber value={result.currentAnnualTech} format={usd} />
              </p>
            </div>
            <div>
              <p className="text-sm text-on-dark-muted">A customized AVERRA proposal</p>
              <p className="mt-2 text-2xl font-semibold text-mint">Tailored to your school</p>
              <p className="mt-2 text-sm text-on-dark-muted">
                Prepared around your enrollment, systems, and implementation scope.
              </p>
            </div>
            <div className="sm:col-span-2">
              <Button variant="onDark" size="lg" onClick={() => openDemo()}>
                Request a customized proposal
                <ArrowRight aria-hidden />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <p className="border-t border-hairline bg-lavender-soft px-6 py-5 text-sm leading-relaxed text-navy sm:px-8">
        Illustrative estimate based on the figures and assumptions you enter. Not a quote or a
        guarantee of savings. Actual results and AVERRA pricing depend on enrollment, AI usage,
        integrations, customization, support requirements and implementation scope.
      </p>
    </div>
  );
}

function ExpenseBreakdown({
  software,
  parentComm,
  other,
  total,
}: {
  software: number;
  parentComm: number;
  other: number;
  total: number;
}) {
  const parts = [
    { label: "Software", value: software, className: "bg-lavender" },
    { label: "Parent communication", value: parentComm, className: "bg-mint" },
    { label: "Other technology", value: other, className: "bg-on-dark/80" },
  ];
  const sum = software + parentComm + other;
  return (
    <figure>
      <figcaption className="text-sm font-medium">Current expense breakdown</figcaption>
      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-on-dark/10" aria-hidden>
        {sum === 0
          ? null
          : parts.map((part) => (
              <div
                key={part.label}
                className={cn(
                  "h-full motion-safe:transition-[width] motion-safe:duration-500",
                  part.className,
                )}
                style={{ width: `${(part.value / total) * 100}%` }}
              />
            ))}
      </div>
      {sum === 0 && (
        <p className="mt-2 text-xs text-on-dark-muted">Enter expenses to see the breakdown.</p>
      )}
      <ul className="mt-3 space-y-1.5 text-sm">
        {parts.map((part) => (
          <li key={part.label} className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-on-dark-muted">
              <span className={cn("size-2.5 rounded-sm", part.className)} aria-hidden />
              {part.label}
            </span>
            <span className="tabular-nums">{usd(part.value)}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

function ScenarioBars({
  scenarios,
  active,
  max,
  onSelect,
}: {
  scenarios: { id: ScenarioId; label: string; laborCapacityValue: number; rate: number }[];
  active: ScenarioId;
  max: number;
  onSelect: (id: ScenarioId) => void;
}) {
  return (
    <figure>
      <figcaption className="text-sm font-medium">Labor capacity value by scenario</figcaption>
      <p className="mt-1 text-xs text-on-dark-muted">
        Hours returned × staff cost for each assumption.
      </p>
      <div className="mt-4 flex h-36 items-end gap-3">
        {scenarios.map((item) => {
          const height = Math.max(8, (item.laborCapacityValue / max) * 100);
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-pressed={selected}
              className="group flex h-full flex-1 flex-col items-center"
            >
              <span className="text-[11px] tabular-nums text-on-dark-muted">
                {usd(item.laborCapacityValue)}
              </span>
              <span className="relative mt-1 w-full flex-1">
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 rounded-t-lg motion-safe:transition-[height] motion-safe:duration-500",
                    selected ? "bg-mint" : "bg-lavender/70 group-hover:bg-lavender",
                  )}
                  style={{ height: `${height}%` }}
                />
              </span>
              <span
                className={cn(
                  "mt-2 text-xs",
                  selected ? "font-medium text-on-dark" : "text-on-dark-muted",
                )}
              >
                {item.label}
                <span className="mt-0.5 block tabular-nums">{Math.round(item.rate * 100)}%</span>
              </span>
            </button>
          );
        })}
      </div>
    </figure>
  );
}
