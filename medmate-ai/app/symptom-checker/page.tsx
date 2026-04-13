"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SymptomCheckerInput, TriageLevel } from "@/types";
import type { CDSSOutcome } from "@/lib/cdss";

const BODY_AREAS = [
  "Head & neck",
  "Eyes",
  "Ears, nose & throat",
  "Chest & heart",
  "Lungs & breathing",
  "Abdomen & digestion",
  "Back",
  "Arms & hands",
  "Legs & feet",
  "Skin",
  "Mental health",
  "Urinary / reproductive",
  "General / whole body",
];

const COMMON_SYMPTOMS: Record<string, string[]> = {
  "Head & neck": [
    "Headache",
    "Dizziness",
    "Neck stiffness",
    "Jaw pain",
    "Facial numbness",
  ],
  "Chest & heart": [
    "Chest pain",
    "Palpitations",
    "Shortness of breath",
    "Tightness",
  ],
  "Lungs & breathing": [
    "Cough",
    "Wheeze",
    "Short of breath",
    "Coughing up blood",
  ],
  "Abdomen & digestion": [
    "Nausea",
    "Vomiting",
    "Diarrhoea",
    "Abdominal pain",
    "Bloating",
    "Constipation",
  ],
  Skin: ["Rash", "Itching", "New mole", "Swelling", "Bruise"],
  "Mental health": [
    "Anxiety",
    "Low mood",
    "Sleep problems",
    "Panic attacks",
    "Intrusive thoughts",
  ],
  "General / whole body": [
    "Fever",
    "Fatigue",
    "Weight loss",
    "Night sweats",
    "Chills",
  ],
};

const STEPS = [
  { num: 1, label: "Body area" },
  { num: 2, label: "Symptoms" },
  { num: 3, label: "Duration & severity" },
  { num: 4, label: "History" },
  { num: 5, label: "Review" },
] as const;

export default function SymptomCheckerPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<SymptomCheckerInput>({
    bodyArea: "",
    symptoms: [],
    freeText: "",
    durationDays: null,
    severity: null,
    relevantHistory: [],
  });
  const [cdssOutcome, setCdssOutcome] = useState<CDSSOutcome | null>(null);
  const [cdssLoading, setCdssLoading] = useState(false);
  const [cdssError, setCdssError] = useState<string | null>(null);

  async function next() {
    const newStep = Math.min(step + 1, 5);
    setStep(newStep);
    // When entering the review step, run the deterministic CDSS.
    if (newStep === 5 && !cdssOutcome) {
      await runCdss();
    }
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function runCdss() {
    setCdssLoading(true);
    setCdssError(null);
    try {
      const res = await fetch("/api/cdss/triage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          symptoms: input.symptoms,
          freeText: [input.freeText, ...input.relevantHistory]
            .filter(Boolean)
            .join("\n"),
          durationDays: input.durationDays ?? undefined,
          severity: input.severity ? input.severity * 2 : undefined, // 1-5 → 1-10
          bodyArea: input.bodyArea,
          demographics: {},
        }),
      });
      if (!res.ok) throw new Error(`CDSS responded ${res.status}`);
      const data = (await res.json()) as { outcome: CDSSOutcome };
      setCdssOutcome(data.outcome);
    } catch (err) {
      setCdssError(
        err instanceof Error ? err.message : "Failed to run triage engine",
      );
    } finally {
      setCdssLoading(false);
    }
  }

  function goToChat() {
    const summary = buildSummary(input, cdssOutcome);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("medmate:symptom-input", summary);
    }
    router.push("/chat?from=symptom-checker");
  }

  const symptomsForArea =
    COMMON_SYMPTOMS[input.bodyArea] ??
    COMMON_SYMPTOMS["General / whole body"];

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-500/25">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>
        <div>
          <h1 className="heading text-2xl font-bold">Symptom checker</h1>
          <p className="text-sm text-muted-foreground">
            A quick, guided walkthrough to help OzDoc triage your concern.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8 flex items-center justify-between gap-1">
        {STEPS.map((s, i) => (
          <div
            key={s.num}
            className="flex flex-1 flex-col items-center gap-1.5 text-center"
          >
            <div className="flex items-center gap-0 w-full">
              {i > 0 && (
                <div className={cn("h-0.5 flex-1 rounded-full transition-colors", step >= s.num ? "bg-ocean-400" : "bg-border")} />
              )}
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold transition-all duration-300",
                  step > s.num &&
                    "bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-md shadow-ocean-500/20",
                  step === s.num &&
                    "border-2 border-ocean-500 bg-ocean-50 text-ocean-600 shadow-glow dark:bg-ocean-900/30 dark:text-ocean-200",
                  step < s.num &&
                    "border border-border bg-background text-muted-foreground",
                )}
              >
                {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("h-0.5 flex-1 rounded-full transition-colors", step > s.num ? "bg-ocean-400" : "bg-border")} />
              )}
            </div>
            <span
              className={cn(
                "hidden text-[11px] md:block",
                step === s.num ? "font-semibold text-ocean-600 dark:text-ocean-400" : "text-muted-foreground",
              )}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step - 1].label}</CardTitle>
          <CardDescription>Step {step} of {STEPS.length}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {BODY_AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() =>
                    setInput((s) => ({ ...s, bodyArea: area, symptoms: [] }))
                  }
                  className={cn(
                    "rounded-xl border p-3.5 text-left text-sm font-medium transition-all duration-200",
                    input.bodyArea === area
                      ? "border-ocean-400 bg-gradient-to-r from-ocean-50 to-ocean-50/50 text-ocean-700 shadow-glow dark:from-ocean-900/30 dark:to-ocean-900/10 dark:text-ocean-200"
                      : "border-border/60 hover:-translate-y-0.5 hover:border-ocean-300 hover:shadow-warm dark:hover:border-ocean-700",
                  )}
                >
                  {area}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-muted-foreground">
                Tick anything that applies, or describe it in your own words.
              </p>
              <div className="flex flex-wrap gap-2">
                {symptomsForArea.map((sym) => {
                  const active = input.symptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      onClick={() =>
                        setInput((s) => ({
                          ...s,
                          symptoms: active
                            ? s.symptoms.filter((x) => x !== sym)
                            : [...s.symptoms, sym],
                        }))
                      }
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                        active
                          ? "border-ocean-400 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white shadow-md shadow-ocean-500/20"
                          : "border-border/60 hover:border-ocean-300 hover:bg-ocean-50 dark:hover:border-ocean-700 dark:hover:bg-ocean-900/20",
                      )}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-2 pt-2">
                <Label>Describe anything else in your own words</Label>
                <Textarea
                  value={input.freeText}
                  onChange={(e) =>
                    setInput((s) => ({ ...s, freeText: e.target.value }))
                  }
                  placeholder="E.g. sharp pain behind my right eye, worse when I bend forward…"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>How long have you had these symptoms? (days)</Label>
                <Input
                  type="number"
                  min={0}
                  value={input.durationDays ?? ""}
                  onChange={(e) =>
                    setInput((s) => ({
                      ...s,
                      durationDays: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }))
                  }
                  placeholder="e.g. 3"
                />
              </div>
              <div className="space-y-2">
                <Label>Severity (1 = mild, 5 = severe)</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() =>
                        setInput((s) => ({
                          ...s,
                          severity: n as 1 | 2 | 3 | 4 | 5,
                        }))
                      }
                      className={cn(
                        "h-12 flex-1 rounded-xl border text-sm font-semibold transition-all duration-200",
                        input.severity === n
                          ? "border-ocean-400 bg-gradient-to-b from-ocean-500 to-ocean-600 text-white shadow-md shadow-ocean-500/20"
                          : "border-border/60 hover:-translate-y-0.5 hover:border-ocean-300 hover:shadow-warm dark:hover:border-ocean-700",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <Label>Relevant medical history</Label>
              <p className="text-xs text-muted-foreground">
                Anything you think is relevant — conditions, recent illness,
                medications, recent travel, injuries.
              </p>
              <Textarea
                rows={6}
                value={input.relevantHistory.join("\n")}
                onChange={(e) =>
                  setInput((s) => ({
                    ...s,
                    relevantHistory: e.target.value
                      .split("\n")
                      .map((l) => l.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="E.g.&#10;Asthma, using a reliever more than usual&#10;Just got back from Bali last week"
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                Here&apos;s what you&apos;ve told us, and OzDoc&apos;s
                deterministic CDSS triage result. Continue to chat to discuss
                it in more detail.
              </p>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <ReviewRow label="Body area" value={input.bodyArea || "—"} />
                <ReviewRow
                  label="Symptoms"
                  value={
                    [...input.symptoms, input.freeText]
                      .filter(Boolean)
                      .join(", ") || "—"
                  }
                />
                <ReviewRow
                  label="Duration"
                  value={
                    input.durationDays != null
                      ? `${input.durationDays} day${input.durationDays === 1 ? "" : "s"}`
                      : "—"
                  }
                />
                <ReviewRow
                  label="Severity"
                  value={input.severity ? `${input.severity} / 5` : "—"}
                />
                <ReviewRow
                  label="History"
                  value={input.relevantHistory.join("; ") || "—"}
                />
              </div>

              {cdssLoading && (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/20 p-4 text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ocean-400 border-t-transparent" />
                  Running CDSS triage engine…
                </div>
              )}

              {cdssError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-semibold">
                      Couldn&apos;t run the triage engine
                    </p>
                    <p className="mt-1 text-xs">{cdssError}</p>
                    <button
                      onClick={runCdss}
                      className="mt-2 text-xs font-semibold underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {cdssOutcome && !cdssLoading && (
                <TriageResultCard outcome={cdssOutcome} />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={back} disabled={step === 1}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {step < 5 ? (
          <Button
            onClick={next}
            disabled={
              (step === 1 && !input.bodyArea) ||
              (step === 2 &&
                input.symptoms.length === 0 &&
                !input.freeText.trim())
            }
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={goToChat}>
            Continue to chat
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="col-span-2 font-medium">{value}</span>
    </div>
  );
}

const TRIAGE_STYLES: Record<
  TriageLevel,
  {
    label: string;
    tone: string;
    icon: typeof Stethoscope;
  }
> = {
  emergency: {
    label: "Emergency — call 000",
    tone: "border-red-300 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200",
    icon: AlertTriangle,
  },
  urgent: {
    label: "Urgent — same-day care",
    tone: "border-orange-300 bg-orange-50 text-orange-900 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-200",
    icon: AlertTriangle,
  },
  "see-gp-soon": {
    label: "See your GP soon",
    tone: "border-coral-300 bg-coral-50 text-coral-900 dark:border-coral-900/50 dark:bg-coral-950/30 dark:text-coral-200",
    icon: Stethoscope,
  },
  telehealth: {
    label: "Telehealth appropriate",
    tone: "border-ocean-300 bg-ocean-50 text-ocean-900 dark:border-ocean-900/50 dark:bg-ocean-950/30 dark:text-ocean-100",
    icon: Stethoscope,
  },
  "self-care": {
    label: "Self-care at home",
    tone: "border-sage-300 bg-sage-50 text-sage-900 dark:border-sage-900/50 dark:bg-sage-950/30 dark:text-sage-100",
    icon: ShieldCheck,
  },
};

function TriageResultCard({ outcome }: { outcome: CDSSOutcome }) {
  const style = TRIAGE_STYLES[outcome.triage];
  const Icon = style.icon;

  return (
    <div className={cn("rounded-2xl border-2 p-5 shadow-warm", style.tone)}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60 dark:bg-black/20">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="heading text-base font-bold">{style.label}</h3>
            <Badge variant="outline" className="text-[10px]">
              Confidence: {outcome.confidence}
            </Badge>
          </div>
          <p className="mt-1 text-sm font-semibold opacity-90">
            {outcome.urgency}
          </p>
          <p className="mt-2 text-sm opacity-85">{outcome.careAction.primary}</p>
        </div>
      </div>

      {outcome.matchedRules.length > 0 && (
        <div className="mt-4 border-t border-current/10 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
            Why (matched {outcome.matchedRules.length}{" "}
            {outcome.matchedRules.length === 1 ? "rule" : "rules"})
          </p>
          <ul className="mt-1.5 space-y-1.5">
            {outcome.matchedRules.slice(0, 3).map((rule) => (
              <li key={rule.id} className="text-xs opacity-90">
                <span className="font-semibold">{rule.name}.</span>{" "}
                <span className="opacity-80">{rule.reason}</span>
                <span className="mt-0.5 block text-[10px] opacity-60">
                  Source: {rule.clinicalSource}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 border-t border-current/10 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
          Next step
        </p>
        <p className="mt-1 text-xs opacity-90">{outcome.careAction.venue}</p>
        {outcome.careAction.phoneNumber && (
          <a
            href={`tel:${outcome.careAction.phoneNumber.replace(/\s/g, "")}`}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-bold shadow-sm dark:bg-black/30"
          >
            Call {outcome.careAction.phoneNumber}
          </a>
        )}
      </div>

      <p className="mt-4 text-[10px] opacity-60">
        Engine v{outcome.engineVersion} · Rule-based CDSS · {outcome.disclaimer}
      </p>
    </div>
  );
}

function buildSummary(
  input: SymptomCheckerInput,
  outcome: CDSSOutcome | null,
): string {
  const parts: string[] = [
    "I've just completed a symptom checker. Here's what I filled in:",
  ];
  parts.push(`- Body area: ${input.bodyArea || "not specified"}`);
  const symptoms = [...input.symptoms, input.freeText]
    .filter(Boolean)
    .join(", ");
  parts.push(`- Symptoms: ${symptoms || "not specified"}`);
  parts.push(
    `- Duration: ${
      input.durationDays != null
        ? `${input.durationDays} day${input.durationDays === 1 ? "" : "s"}`
        : "not specified"
    }`,
  );
  parts.push(`- Severity (1-5): ${input.severity ?? "not specified"}`);
  if (input.relevantHistory.length) {
    parts.push(`- Relevant history: ${input.relevantHistory.join("; ")}`);
  }

  if (outcome) {
    parts.push("");
    parts.push(
      `OzDoc's rule-based CDSS (v${outcome.engineVersion}) triaged this as: **${outcome.triage}** — ${outcome.urgency}.`,
    );
    if (outcome.matchedRules.length) {
      parts.push(
        `Matched rules: ${outcome.matchedRules.map((r) => r.name).join("; ")}.`,
      );
    }
  }

  parts.push(
    "\nCan you help me understand what might be going on and walk me through the next step?",
  );
  return parts.join("\n");
}
