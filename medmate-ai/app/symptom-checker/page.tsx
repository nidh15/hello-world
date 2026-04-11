"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  ClipboardList,
  CheckCircle2,
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
import { cn } from "@/lib/utils";
import type { SymptomCheckerInput } from "@/types";

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

  function next() {
    setStep((s) => Math.min(s + 1, 5));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function goToChat() {
    const summary = buildSummary(input);
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
            A quick, guided walkthrough to help MedMate triage your concern.
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
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Here&apos;s what you&apos;ve told us. Continue to chat with
                MedMate for a provisional assessment and clear next step.
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

function buildSummary(input: SymptomCheckerInput): string {
  const parts: string[] = ["I've just completed a symptom checker. Here's what I filled in:"];
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
  parts.push(
    `- Severity (1-5): ${input.severity ?? "not specified"}`,
  );
  if (input.relevantHistory.length) {
    parts.push(`- Relevant history: ${input.relevantHistory.join("; ")}`);
  }
  parts.push("\nCan you help me understand what might be going on and what I should do next?");
  return parts.join("\n");
}
