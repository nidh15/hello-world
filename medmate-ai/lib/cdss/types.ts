// ──────────────────────────────────────────────────────────────
// OzDoc CDSS — Clinical Decision Support System: types
// ──────────────────────────────────────────────────────────────
//
// This is a deterministic, rule-based CDSS for triage (not diagnosis).
// It is inspired architecturally by Healthdirect's Infermedica-backed
// CDSS and the Australian Triage Scale, but the rule set here is a
// first-pass clinical starter — it must be reviewed and signed off by
// an Australian-registered medical advisor before any clinical use.
//
// Engine output is always paired with:
//   - A recommended care venue + pathway
//   - A plain-language reason
//   - The list of rules that matched (for audit / explainability)
//   - An explicit disclaimer
//
// This module intentionally has ZERO runtime dependencies so it can be
// unit tested, run on the edge, or executed from a CLI.

import type { Sex, TriageLevel } from "@/types";

export const CDSS_ENGINE_VERSION = "0.1.0";

// ──────────────────────────────────────────────────────────────
// Symptom codes — canonical internal identifiers
// ──────────────────────────────────────────────────────────────
//
// Every free-text symptom a user types must be mapped to one of these
// codes before the engine evaluates it. This keeps rules deterministic
// and makes the knowledge base explicit.

export type SymptomCode =
  // Cardiovascular
  | "chest-pain"
  | "chest-pain-radiating-arm-jaw"
  | "palpitations"
  // Respiratory
  | "shortness-of-breath"
  | "shortness-of-breath-severe"
  | "cough"
  | "cough-blood"
  | "wheeze"
  // Neurological
  | "headache"
  | "headache-severe-sudden"
  | "neck-stiffness"
  | "dizziness"
  | "confusion"
  | "loss-of-consciousness"
  | "facial-droop"
  | "arm-weakness"
  | "speech-slurred"
  | "seizure"
  // Gastrointestinal
  | "abdominal-pain"
  | "abdominal-pain-severe"
  | "nausea"
  | "vomiting"
  | "vomiting-blood"
  | "diarrhoea"
  | "diarrhoea-bloody"
  | "constipation"
  // Genitourinary
  | "urinary-burning"
  | "urinary-frequency"
  | "urinary-blood"
  // Skin
  | "rash"
  | "rash-non-blanching"
  | "new-mole"
  | "swelling"
  | "bruise"
  // Mental health
  | "anxiety"
  | "low-mood"
  | "panic-attacks"
  | "sleep-problems"
  | "intrusive-thoughts"
  | "suicidal-ideation"
  | "suicidal-ideation-plan"
  // Systemic
  | "fever"
  | "fever-high"
  | "fatigue"
  | "weight-loss-unintentional"
  | "night-sweats"
  // Allergy
  | "anaphylaxis"
  | "allergic-reaction-mild"
  // Trauma / bleeding
  | "severe-bleeding"
  | "head-injury"
  | "suspected-fracture";

// ──────────────────────────────────────────────────────────────
// Input to the engine
// ──────────────────────────────────────────────────────────────

export interface CDSSDemographics {
  age?: number;
  sex?: Sex;
  isPregnant?: boolean;
}

export interface CDSSInput {
  /** Canonical symptom codes (required) */
  symptoms: SymptomCode[];
  /** Verbatim free-text from the user (preserved for GP handoff) */
  freeText?: string;
  /** How long the primary symptom has been present */
  durationDays?: number;
  /** Patient-reported severity 1-10 */
  severity?: number;
  /** Body area (from guided symptom checker) */
  bodyArea?: string;
  /** Patient demographics */
  demographics: CDSSDemographics;
  /** Known chronic conditions (free-text from health profile) */
  chronicConditions?: string[];
  /** Current medications (free-text from health profile) */
  currentMedications?: string[];
  /** Known allergies */
  allergies?: string[];
}

// ──────────────────────────────────────────────────────────────
// Rules
// ──────────────────────────────────────────────────────────────

export type RuleCategory =
  | "red-flag"
  | "urgent"
  | "routine"
  | "telehealth"
  | "self-care";

export interface Rule {
  /** Stable identifier — never rename; used in audit logs */
  id: string;
  /** Short human name */
  name: string;
  /** Longer clinical description */
  description: string;
  /** Clinical source / citation — required for every rule */
  clinicalSource: string;
  /** Category (used for sorting and UI display) */
  category: RuleCategory;
  /** Pure predicate — must be deterministic, no side effects */
  when: (input: CDSSInput) => boolean;
  /** Outcome if the rule fires */
  outcome: {
    triage: TriageLevel;
    urgency: string;
    reason: string;
  };
}

// ──────────────────────────────────────────────────────────────
// Output from the engine
// ──────────────────────────────────────────────────────────────

export interface MatchedRule {
  id: string;
  name: string;
  category: RuleCategory;
  triage: TriageLevel;
  reason: string;
  clinicalSource: string;
}

export interface CareAction {
  /** Primary action in one sentence */
  primary: string;
  /** Where to go */
  venue: string;
  /** Phone number to call, if relevant */
  phoneNumber?: string;
  /** Step-by-step instructions */
  instructions: string[];
  /** Australian resources and hotlines relevant to this triage */
  australianResources: {
    name: string;
    phone?: string;
    url?: string;
    description: string;
  }[];
}

export interface CDSSOutcome {
  /** Final triage decision */
  triage: TriageLevel;
  /** Human-readable urgency string */
  urgency: string;
  /** Confidence in the decision based on matched rules */
  confidence: "high" | "moderate" | "low";
  /** Ordered list of clinical reasoning statements */
  reasoning: string[];
  /** Every rule that fired, in rule-order (for audit trail) */
  matchedRules: MatchedRule[];
  /** What the user should do next */
  careAction: CareAction;
  /** True if the engine ran all red-flag rules without error */
  redFlagsChecked: boolean;
  /** Standard disclaimer (must be shown to the user) */
  disclaimer: string;
  /** ISO timestamp of evaluation */
  timestamp: string;
  /** Engine version (for reproducibility) */
  engineVersion: string;
}
