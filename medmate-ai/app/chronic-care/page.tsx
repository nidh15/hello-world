"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Activity,
  Wind,
  Gauge,
  Stethoscope,
  Heart,
  Brain,
  Droplets,
  CalendarCheck,
  Pill,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ChronicCarePlan } from "@/types";

const CONDITIONS = [
  {
    id: "diabetes-type2",
    name: "Type 2 Diabetes",
    icon: Droplets,
    description:
      "Blood sugar monitoring, HbA1c tracking, and lifestyle management with AI-powered check-ins.",
  },
  {
    id: "asthma",
    name: "Asthma",
    icon: Wind,
    description:
      "Trigger tracking, preventer medication reminders, and action plan management.",
  },
  {
    id: "hypertension",
    name: "Hypertension",
    icon: Gauge,
    description:
      "Blood pressure monitoring, medication adherence, and cardiovascular risk management.",
  },
  {
    id: "copd",
    name: "COPD / Respiratory",
    icon: Activity,
    description:
      "Lung function tracking, flare-up detection, and pulmonary rehabilitation support.",
  },
  {
    id: "cardiovascular",
    name: "Cardiovascular",
    icon: Heart,
    description:
      "Heart health monitoring, cholesterol management, and exercise guidance.",
  },
  {
    id: "kidney-disease",
    name: "Kidney Disease",
    icon: Stethoscope,
    description:
      "eGFR tracking, dietary guidance, and specialist coordination for CKD management.",
  },
  {
    id: "mental-health",
    name: "Mental Health",
    icon: Brain,
    description:
      "Mood tracking, medication reminders, and Mental Health Care Plan coordination.",
  },
];

const FEATURES = [
  {
    icon: CalendarCheck,
    title: "Monthly AI check-ins",
    description:
      "OzDoc checks in every month to review your symptoms, medication, and progress. Flagged changes go to your GP.",
  },
  {
    icon: Pill,
    title: "Medication tracking",
    description:
      "Track your medications, dosages, and adherence. Get reminders and alerts for missed doses or refills.",
  },
  {
    icon: Users,
    title: "GP coordination",
    description:
      "Share AI-generated summaries with your GP before appointments. Keep your care team in the loop.",
  },
  {
    icon: TrendingUp,
    title: "Progress monitoring",
    description:
      "Track key health metrics over time — blood pressure, HbA1c, weight, mood scores, and more.",
  },
];

export default function ChronicCarePage() {
  const [plans] = useState<ChronicCarePlan[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null,
  );

  return (
    <div className="container max-w-4xl py-10">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-500/25">
          <HeartPulse className="h-6 w-6" />
        </div>
        <div>
          <h1 className="heading text-2xl font-bold">Chronic Care Plans</h1>
          <p className="text-sm text-muted-foreground">
            Ongoing AI-powered management for chronic conditions.
          </p>
        </div>
      </div>

      {/* Supported conditions grid */}
      <div className="mb-8">
        <h2 className="heading mb-4 text-lg font-bold">
          Supported conditions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONDITIONS.map((condition) => {
            const active = selectedCondition === condition.id;
            return (
              <button
                key={condition.id}
                onClick={() =>
                  setSelectedCondition(active ? null : condition.id)
                }
                className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                  active
                    ? "border-ocean-400 bg-gradient-to-r from-ocean-50 to-ocean-50/50 shadow-glow dark:from-ocean-900/30 dark:to-ocean-900/10"
                    : "border-border/60 hover:-translate-y-0.5 hover:border-ocean-300 hover:shadow-warm dark:hover:border-ocean-700"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ocean-50 text-ocean-600 dark:bg-ocean-900/40 dark:text-ocean-400">
                    <condition.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {condition.name}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {condition.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active care plans / empty state */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your care plans</CardTitle>
          <CardDescription>
            Active chronic condition management plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-500/20 animate-float">
                <HeartPulse className="h-7 w-7" />
              </div>
              <h2 className="heading text-lg font-bold">
                No active care plans
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Start by adding a condition you&apos;d like to manage with
                monthly AI check-ins. OzDoc will help you track your progress
                and coordinate with your GP.
              </p>
              <Link href="/chat?prompt=I%27d+like+to+set+up+a+chronic+care+plan">
                <Button className="group">
                  <HeartPulse className="h-4 w-4" />
                  Start a care plan
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {plan.conditionName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Next check-in:{" "}
                      {new Date(plan.nextCheckinAt).toLocaleDateString("en-AU")}
                    </p>
                  </div>
                  <Badge
                    variant={plan.status === "active" ? "secondary" : "outline"}
                  >
                    {plan.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chronic care features */}
      <div className="mb-8">
        <h2 className="heading mb-4 text-lg font-bold">
          How OzDoc manages chronic conditions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border/60 bg-card p-4 shadow-warm"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ocean-50 text-ocean-600 dark:bg-ocean-900/40 dark:text-ocean-400">
                  <feature.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {feature.title}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Medicare CDM callout */}
      <Card className="mb-4 border-ocean-200/60 bg-gradient-to-r from-ocean-50/80 to-ocean-50/30 dark:border-ocean-800/40 dark:from-ocean-950/30 dark:to-ocean-950/10">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-md shadow-ocean-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="heading text-sm font-semibold">
              Medicare Chronic Disease Management (CDM) Plans
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              If you have a chronic condition, your GP can create a GP Management
              Plan (GPMP) and Team Care Arrangement (TCA). This entitles you to{" "}
              <strong className="text-foreground">
                5 Medicare-subsidised allied health visits per year
              </strong>{" "}
              — including physiotherapy, dietetics, psychology, and more. Ask
              your GP or mention it in your next OzDoc consult.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Aboriginal and Torres Strait Islander health */}
      <Card className="mb-8 border-sage-200/60 bg-gradient-to-r from-sage-50/80 to-sage-50/30 dark:border-sage-800/40 dark:from-sage-900/20 dark:to-sage-900/10">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 text-white shadow-md shadow-sage-500/20">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h3 className="heading text-sm font-semibold">
              Aboriginal and Torres Strait Islander Health Assessment
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Indigenous Australians are eligible for an annual health assessment
              under{" "}
              <strong className="text-foreground">Medicare item 715</strong>.
              This comprehensive check covers chronic disease screening,
              immunisations, social and emotional wellbeing, and follow-up care
              planning. OzDoc can help you prepare for and follow up after your
              715 assessment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Start a care plan CTA */}
      <div className="flex justify-center">
        <Link href="/chat?prompt=I%27d+like+to+set+up+a+chronic+care+plan">
          <Button size="lg" className="group">
            <HeartPulse className="h-4 w-4" />
            Start a care plan
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
