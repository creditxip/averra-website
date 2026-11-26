import { Fragment, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { demoSchema, ENROLLMENT, INTERESTS, PACKAGES, SOFTWARE, STEP_FIELDS, isFreeMail, packageFromInterest, type DemoForm } from "./schema";

const LABELS = ["About you", "Your school", "Interests", "Review"];

export function DemoRequestForm({ interest, onClose }: { interest: string | null; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "done">("idle");
  const reduce = useReducedMotion();
  const form = useForm<DemoForm>({
    resolver: zodResolver(demoSchema),
    mode: "onTouched",
    defaultValues: { fullName: "", email: "", jobTitle: "", schoolName: "", schoolLocation: "", enrollment: undefined as unknown as DemoForm["enrollment"], software: [], otherSoftware: "", interests: [], packagePreference: packageFromInterest(interest), notes: "" },
  });
  const { register, control, watch, formState: { errors }, trigger, handleSubmit } = form;
  const v = watch();

  const next = async () => { if (await trigger(STEP_FIELDS[step]!)) setStep((s) => s + 1); };

  const submit = handleSubmit(async (d) => {
    setStatus("saving");
    const { error } = await supabase.from("demo_requests").insert({
      full_name: d.fullName, email: d.email, job_title: d.jobTitle, school_name: d.schoolName, school_location: d.schoolLocation,
      enrollment: d.enrollment, current_software: d.software, other_software: d.otherSoftware || null, interests: d.interests,
      package_preference: d.packagePreference || null, notes: d.notes || null,
    });
    setStatus(error ? "error" : "done");
  });

  if (status === "done") {
    const first = v.fullName.trim().split(/\s+/)[0];
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <motion.div initial={reduce ? false : { scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="grid size-16 place-items-center rounded-full bg-mint text-navy shadow-[0_0_50px_-5px_var(--mint)]">
          <Check className="size-8" strokeWidth={3} aria-hidden />
        </motion.div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight">Thank you, {first}.</h2>
        <p className="mt-3 max-w-md text-muted-foreground">Your request has been received. A member of the Averra team will contact you at <span className="font-medium text-foreground">{v.email}</span> to arrange a personalized demonstration.</p>
        <Summary v={v} className="mt-6 w-full text-left" />
        <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="xl" className="flex-1" onClick={onClose}>Back to site</Button>
          <Button variant="hero" size="xl" className="flex-1" onClick={() => { onClose(); document.getElementById("platform")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }}>Explore the platform</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (step < 3) void next(); else void submit(); }} noValidate>
      <ol className="grid grid-cols-4 gap-2" aria-label="Progress">
        {LABELS.map((l, i) => (
          <li key={l} aria-current={i === step ? "step" : undefined}>
            <div className="h-1 overflow-hidden rounded-full bg-muted"><div className={cn("h-full bg-brand transition-all duration-500", i <= step ? "w-full" : "w-0")} /></div>
            <p className={cn("mt-2 text-[11px] font-medium sm:text-xs", i === step ? "text-foreground" : "text-muted-foreground")}>{l}</p>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? {} : { opacity: 0, x: -16 }} transition={{ duration: 0.25 }} className="mt-6 space-y-4">
          {step === 0 && <>
            <Field id="fullName" label="Full name" error={errors.fullName?.message}><Input id="fullName" autoComplete="name" {...register("fullName")} /></Field>
            <Field id="email" label="Professional email" error={errors.email?.message} hint={!errors.email && isFreeMail(v.email) ? "Looks like a personal email — a school address helps us prepare, but this works too." : undefined}>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
            </Field>
            <Field id="jobTitle" label="Job title" error={errors.jobTitle?.message}><Input id="jobTitle" autoComplete="organization-title" placeholder="e.g. Director of Technology" {...register("jobTitle")} /></Field>
          </>}

          {step === 1 && <>
            <Field id="schoolName" label="School name" error={errors.schoolName?.message}><Input id="schoolName" autoComplete="organization" {...register("schoolName")} /></Field>
            <Field id="schoolLocation" label="Location" error={errors.schoolLocation?.message}><Input id="schoolLocation" placeholder="City, state or country" {...register("schoolLocation")} /></Field>
            <Field id="enrollment" label="Approximate enrollment" error={errors.enrollment?.message}>
              <select id="enrollment" {...register("enrollment")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Select a range</option>
                {ENROLLMENT.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </Field>
            <Controller control={control} name="software" render={({ field }) => (
              <fieldset><legend className="mb-2 text-sm font-medium">Current school software <span className="font-normal text-muted-foreground">(optional)</span></legend>
                <div className="flex flex-wrap gap-2">
                  {SOFTWARE.map((s) => <Chip key={s} on={field.value.includes(s)} onClick={() => field.onChange(field.value.includes(s) ? field.value.filter((x) => x !== s) : [...field.value, s])}>{s}</Chip>)}
                </div>
              </fieldset>
            )} />
            {v.software.includes("Other") && <Field id="otherSoftware" label="Other software"><Input id="otherSoftware" {...register("otherSoftware")} /></Field>}
          </>}

          {step === 2 && <>
            <Controller control={control} name="interests" render={({ field }) => (
              <fieldset><legend className="mb-2 text-sm font-medium">Primary areas of interest</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {INTERESTS.map((s) => {
                    const on = field.value.includes(s);
                    return (
                      <button key={s} type="button" aria-pressed={on} onClick={() => field.onChange(on ? field.value.filter((x) => x !== s) : [...field.value, s])} className={cn("flex items-center justify-between rounded-xl border p-3 text-left text-sm transition", on ? "border-lavender bg-lavender-soft" : "border-border hover:border-lavender/50")}>
                        {s}<span className={cn("grid size-5 place-items-center rounded-full border", on ? "border-lavender bg-lavender text-primary-foreground" : "border-border")}>{on && <Check className="size-3" aria-hidden />}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.interests && <p role="alert" className="mt-2 text-sm text-destructive">{errors.interests.message}</p>}
              </fieldset>
            )} />
            <Controller control={control} name="packagePreference" render={({ field }) => (
              <fieldset><legend className="mb-2 text-sm font-medium">Package preference <span className="font-normal text-muted-foreground">(optional)</span></legend>
                <div className="flex flex-wrap gap-2">{PACKAGES.map((p) => <Chip key={p} on={field.value === p} onClick={() => field.onChange(field.value === p ? "" : p)}>{p}</Chip>)}</div>
              </fieldset>
            )} />
            <Field id="notes" label="Notes (optional)"><Textarea id="notes" rows={3} placeholder="Anything we should know before we reach out?" {...register("notes")} /></Field>
          </>}

          {step === 3 && <>
            <Summary v={v} onEdit={setStep} />
            {status === "error" && (
              <p role="alert" className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />We couldn't send your request just now. Please check your connection and try again.
              </p>
            )}
          </>}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex gap-2">
        {step > 0 && <Button type="button" variant="outline" size="xl" onClick={() => setStep((s) => s - 1)}><ArrowLeft aria-hidden />Back</Button>}
        <Button type="submit" variant="hero" size="xl" className="flex-1" disabled={status === "saving"}>
          {step < 3 ? <>Next<ArrowRight aria-hidden /></> : status === "saving" ? <><Loader2 className="animate-spin" aria-hidden />Sending…</> : status === "error" ? "Try again" : "Submit request"}
        </Button>
      </div>
    </form>
  );
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string | undefined; hint?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={on} onClick={onClick} className={cn("rounded-full border px-3 py-1.5 text-sm transition", on ? "border-lavender bg-lavender text-primary-foreground" : "border-border hover:border-lavender/60")}>{children}</button>;
}

function Summary({ v, onEdit, className }: { v: DemoForm; onEdit?: (s: number) => void; className?: string }) {
  const sw = [...v.software.filter((s) => s !== "Other"), ...(v.software.includes("Other") && v.otherSoftware ? [v.otherSoftware] : [])].join(", ");
  const groups: [string, number, [string, string][]][] = [
    ["About you", 0, [["Name", v.fullName], ["Email", v.email], ["Job title", v.jobTitle]]],
    ["Your school", 1, [["School", v.schoolName], ["Location", v.schoolLocation], ["Enrollment", v.enrollment], ["Current software", sw || "—"]]],
    ["Interests", 2, [["Areas", v.interests.join(", ")], ["Package", v.packagePreference || "—"], ...(v.notes ? [["Notes", v.notes] as [string, string]] : [])]],
  ];
  return (
    <div className={cn("space-y-3", className)}>
      {groups.map(([t, s, rows]) => (
        <div key={t} className="rounded-xl border border-border p-4">
          <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">{t}</h3>{onEdit && <button type="button" className="text-sm text-lavender hover:underline" onClick={() => onEdit(s)}>Edit</button>}</div>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {rows.map(([k, val]) => <Fragment key={k}><dt className="text-muted-foreground">{k}</dt><dd className="break-words">{val}</dd></Fragment>)}
          </dl>
        </div>
      ))}
    </div>
  );
}
