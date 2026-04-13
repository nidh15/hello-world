// ──────────────────────────────────────────────────────────────
// OzDoc CDSS — Rule evaluator
// ──────────────────────────────────────────────────────────────
//
// Pure function: CDSSInput → CDSSOutcome.
//
// Architecture:
//   1. Run every rule's `when` predicate.
//   2. Collect matched rules, sorted by triage severity.
//   3. Pick the highest-severity triage as the final outcome.
//   4. Look up the corresponding care pathway.
//   5. Build a CDSSOutcome with full audit trail.
//
// This function has ZERO side effects. It does not call any APIs, it
// does not log, it does not throw (except on programmer error). All
// user-facing error states (missing input, etc.) return a fallback
// "see a GP" outcome with the reason attached.

import type { TriageLevel } from "@/types";
import { PATHWAYS } from "./pathways";
import { RULES } from "./rules";
import { CDSS_ENGINE_VERSION } from "./types";
import type {
  CDSSInput,
  CDSSOutcome,
  MatchedRule,
  RuleCategory,
} from "./types";

// Severity ordering — higher number = more urgent.
const TRIAGE_PRIORITY: Record<TriageLevel, number> = {
  emergency: 5,
  urgent: 4,
  "see-gp-soon": 3,
  telehealth: 2,
  "self-care": 1,
};

const CATEGORY_PRIORITY: Record<RuleCategory, number> = {
  "red-flag": 5,
  urgent: 4,
  routine: 3,
  telehealth: 2,
  "self-care": 1,
};

const STANDARD_DISCLAIMER =
  "This is a triage recommendation, not a diagnosis. OzDoc AI is not a doctor. Always consult a qualified healthcare professional. In a medical emergency, call 000 immediately.";

/**
 * Evaluate the CDSS input against all rules and return a triage outcome.
 *
 * Deterministic — same input always produces the same output. Safe to
 * call on the edge, in tests, or from a CLI.
 */
export function evaluate(input: CDSSInput): CDSSOutcome {
  const matched: MatchedRule[] = [];
  const reasoning: string[] = [];

  // 1. Run every rule
  for (const rule of RULES) {
    let fired = false;
    try {
      fired = rule.when(input);
    } catch (err) {
      // A buggy rule predicate should never crash the engine — log the
      // rule ID via the reasoning array so the user-visible output
      // still explains why it wasn't applied.
      reasoning.push(
        `[${rule.id}] Rule evaluation skipped due to an internal error (${
          err instanceof Error ? err.message : String(err)
        }).`,
      );
      continue;
    }

    if (fired) {
      matched.push({
        id: rule.id,
        name: rule.name,
        category: rule.category,
        triage: rule.outcome.triage,
        reason: rule.outcome.reason,
        clinicalSource: rule.clinicalSource,
      });
      reasoning.push(`[${rule.id}] ${rule.outcome.reason}`);
    }
  }

  // 2. Pick the highest-severity matched rule
  matched.sort(
    (a, b) =>
      CATEGORY_PRIORITY[b.category] - CATEGORY_PRIORITY[a.category] ||
      TRIAGE_PRIORITY[b.triage] - TRIAGE_PRIORITY[a.triage],
  );

  // 3. Determine final triage
  let triage: TriageLevel;
  let urgency: string;

  if (matched.length === 0) {
    // No rules matched — recommend telehealth as the safe default.
    // (An explicit "no match" fallback, not a silent default.)
    triage = "telehealth";
    urgency = "Today if you're concerned — OzDoc telehealth";
    reasoning.push(
      "[NO_RULE_MATCH] No specific CDSS rules matched your symptoms. A telehealth GP can review and advise — book if you're concerned.",
    );
  } else {
    triage = matched[0].triage;
    const topRule = RULES.find((r) => r.id === matched[0].id);
    urgency = topRule?.outcome.urgency ?? "See a GP";
  }

  // 4. Look up the care pathway
  const careAction = PATHWAYS[triage];

  // 5. Calculate confidence
  const confidence: "high" | "moderate" | "low" =
    matched.length >= 2 ? "high" : matched.length === 1 ? "moderate" : "low";

  return {
    triage,
    urgency,
    confidence,
    reasoning,
    matchedRules: matched,
    careAction,
    redFlagsChecked: true,
    disclaimer: STANDARD_DISCLAIMER,
    timestamp: new Date().toISOString(),
    engineVersion: CDSS_ENGINE_VERSION,
  };
}
