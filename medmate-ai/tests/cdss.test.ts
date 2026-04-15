// ──────────────────────────────────────────────────────────────
// OzDoc CDSS — test suite
// ──────────────────────────────────────────────────────────────
//
// Run with:  npm test
//
// Uses Node's built-in test runner + assert. No external deps.
// Executed via `node --experimental-strip-types --test` so TypeScript
// is stripped at runtime. All imports from the CDSS modules must be
// relative (no path aliases), and the CDSS modules themselves only
// use `import type` for cross-module type references — which strip
// mode correctly erases.
//
// These tests are the safety net for the clinical rule set. Every
// red-flag rule should have a case here so that a future edit
// breaking red-flag coverage is caught immediately.

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  evaluate,
  validateRules,
  RULES,
  PATHWAYS,
  extractSymptomCodes,
  mapSymptomsToCodes,
  CDSS_ENGINE_VERSION,
} from "../lib/cdss/index.ts";
import type { CDSSInput } from "../lib/cdss/index.ts";

// Helper: build a minimal valid CDSSInput with sensible defaults.
function buildInput(overrides: Partial<CDSSInput> = {}): CDSSInput {
  return {
    symptoms: [],
    demographics: {},
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════
// Rule integrity
// ══════════════════════════════════════════════════════════════

describe("rule integrity", () => {
  test("validateRules passes on the current rule set", () => {
    assert.doesNotThrow(() => validateRules());
  });

  test("every rule has a unique stable id", () => {
    const ids = new Set<string>();
    for (const rule of RULES) {
      assert.ok(rule.id, `rule ${rule.name} is missing an id`);
      assert.ok(!ids.has(rule.id), `duplicate rule id: ${rule.id}`);
      ids.add(rule.id);
    }
  });

  test("every rule cites a clinical source", () => {
    for (const rule of RULES) {
      assert.ok(
        rule.clinicalSource && rule.clinicalSource.trim().length > 0,
        `rule ${rule.id} missing clinicalSource`,
      );
    }
  });

  test("every rule has a pure when predicate", () => {
    for (const rule of RULES) {
      assert.equal(typeof rule.when, "function", `rule ${rule.id} missing when`);
    }
  });

  test("every rule outcome has a triage level and a reason", () => {
    for (const rule of RULES) {
      assert.ok(rule.outcome.triage, `rule ${rule.id} missing outcome.triage`);
      assert.ok(rule.outcome.reason, `rule ${rule.id} missing outcome.reason`);
    }
  });

  test("every triage level has a pathway", () => {
    const triageLevels = new Set(RULES.map((r) => r.outcome.triage));
    for (const level of triageLevels) {
      assert.ok(
        PATHWAYS[level],
        `triage level ${level} has no pathway in PATHWAYS`,
      );
    }
  });
});

// ══════════════════════════════════════════════════════════════
// Engine determinism and reproducibility
// ══════════════════════════════════════════════════════════════

describe("engine determinism", () => {
  test("same input produces same triage, urgency, matched rules", () => {
    const input = buildInput({
      symptoms: ["chest-pain", "shortness-of-breath"],
      demographics: { age: 55, sex: "male" },
      durationDays: 1,
      severity: 8,
    });
    const a = evaluate(input);
    const b = evaluate(input);
    assert.equal(a.triage, b.triage);
    assert.equal(a.urgency, b.urgency);
    assert.equal(a.confidence, b.confidence);
    assert.deepEqual(
      a.matchedRules.map((r) => r.id).sort(),
      b.matchedRules.map((r) => r.id).sort(),
    );
  });

  test("outcome carries the engine version for reproducibility", () => {
    const out = evaluate(buildInput({ symptoms: ["headache"] }));
    assert.equal(out.engineVersion, CDSS_ENGINE_VERSION);
  });
});

// ══════════════════════════════════════════════════════════════
// Red-flag rules — each one must fire on its trigger symptoms
// ══════════════════════════════════════════════════════════════

describe("red-flag rules fire correctly", () => {
  test("FAST stroke signs → emergency", () => {
    const out = evaluate(
      buildInput({ symptoms: ["facial-droop", "arm-weakness"] }),
    );
    assert.equal(out.triage, "emergency");
    assert.ok(
      out.matchedRules.some((r) => r.id === "STROKE_SIGNS_FAST"),
      "STROKE_SIGNS_FAST should fire on facial droop",
    );
  });

  test("chest pain radiating to arm/jaw → emergency", () => {
    const out = evaluate(
      buildInput({
        symptoms: ["chest-pain-radiating-arm-jaw"],
        demographics: { age: 30, sex: "male" },
      }),
    );
    assert.equal(out.triage, "emergency");
    assert.ok(out.matchedRules.some((r) => r.id === "CARDIAC_CHEST_PAIN"));
  });

  test("chest pain + severe shortness of breath → emergency", () => {
    const out = evaluate(
      buildInput({
        symptoms: ["chest-pain", "shortness-of-breath-severe"],
      }),
    );
    assert.equal(out.triage, "emergency");
  });

  test("anaphylaxis → emergency", () => {
    const out = evaluate(buildInput({ symptoms: ["anaphylaxis"] }));
    assert.equal(out.triage, "emergency");
  });

  test("suicidal ideation with plan → emergency", () => {
    const out = evaluate(
      buildInput({ symptoms: ["suicidal-ideation-plan"] }),
    );
    assert.equal(out.triage, "emergency");
  });

  test("non-blanching rash (meningococcal) → emergency", () => {
    const out = evaluate(
      buildInput({ symptoms: ["rash-non-blanching", "fever-high"] }),
    );
    assert.equal(out.triage, "emergency");
  });

  test("severe sudden headache (thunderclap) → emergency", () => {
    const out = evaluate(buildInput({ symptoms: ["headache-severe-sudden"] }));
    assert.equal(out.triage, "emergency");
  });

  test("haemoptysis (coughing blood) → urgent or higher", () => {
    const out = evaluate(buildInput({ symptoms: ["cough-blood"] }));
    assert.ok(
      out.triage === "emergency" || out.triage === "urgent",
      `expected urgent+, got ${out.triage}`,
    );
  });

  test("haematemesis (vomiting blood) → emergency", () => {
    const out = evaluate(buildInput({ symptoms: ["vomiting-blood"] }));
    assert.equal(out.triage, "emergency");
  });

  test("severe bleeding → emergency", () => {
    const out = evaluate(buildInput({ symptoms: ["severe-bleeding"] }));
    assert.equal(out.triage, "emergency");
  });

  test("seizure → emergency or urgent", () => {
    const out = evaluate(buildInput({ symptoms: ["seizure"] }));
    assert.ok(
      out.triage === "emergency" || out.triage === "urgent",
      `expected urgent+, got ${out.triage}`,
    );
  });

  test("loss of consciousness → urgent or higher", () => {
    const out = evaluate(
      buildInput({ symptoms: ["loss-of-consciousness"] }),
    );
    assert.ok(
      out.triage === "emergency" || out.triage === "urgent",
      `expected urgent+, got ${out.triage}`,
    );
  });

  test("neck stiffness + high fever (meningitis) → emergency or urgent", () => {
    const out = evaluate(
      buildInput({ symptoms: ["neck-stiffness", "fever-high"] }),
    );
    assert.ok(
      out.triage === "emergency" || out.triage === "urgent",
      `expected urgent+, got ${out.triage}`,
    );
  });
});

// ══════════════════════════════════════════════════════════════
// Priority resolution — red flags must always win
// ══════════════════════════════════════════════════════════════

describe("priority resolution", () => {
  test("red flag overrides a self-care match", () => {
    const out = evaluate(
      buildInput({
        // fatigue alone is self-care, but adding FAST stroke signs must
        // escalate the whole outcome to emergency.
        symptoms: ["fatigue", "facial-droop"],
        durationDays: 1,
      }),
    );
    assert.equal(out.triage, "emergency");
  });

  test("red flag overrides a telehealth match", () => {
    const out = evaluate(
      buildInput({
        symptoms: ["cough", "chest-pain-radiating-arm-jaw"],
      }),
    );
    assert.equal(out.triage, "emergency");
  });

  test("the top matched rule is the red flag, not the lower-priority rule", () => {
    const out = evaluate(
      buildInput({
        symptoms: ["headache", "speech-slurred"],
      }),
    );
    assert.equal(out.triage, "emergency");
    assert.equal(out.matchedRules[0].category, "red-flag");
  });
});

// ══════════════════════════════════════════════════════════════
// No-match fallback
// ══════════════════════════════════════════════════════════════

describe("no-match fallback", () => {
  test("empty symptoms yields telehealth with a visible no-match reason", () => {
    const out = evaluate(buildInput({ symptoms: [] }));
    assert.equal(out.triage, "telehealth");
    assert.ok(
      out.reasoning.some((r) => r.includes("NO_RULE_MATCH")),
      "reasoning should mention NO_RULE_MATCH so the fallback is explicit",
    );
    assert.equal(out.confidence, "low");
    assert.ok(out.careAction, "fallback must still include a care action");
  });

  test("fallback pathway is the telehealth pathway", () => {
    const out = evaluate(buildInput({ symptoms: [] }));
    assert.equal(out.careAction.primary, PATHWAYS.telehealth.primary);
  });
});

// ══════════════════════════════════════════════════════════════
// Confidence scoring
// ══════════════════════════════════════════════════════════════

describe("confidence scoring", () => {
  test("two or more matches → high confidence", () => {
    const out = evaluate(
      buildInput({
        symptoms: ["chest-pain-radiating-arm-jaw", "shortness-of-breath-severe"],
      }),
    );
    assert.equal(out.confidence, "high");
  });

  test("single match → moderate confidence", () => {
    const out = evaluate(buildInput({ symptoms: ["anaphylaxis"] }));
    assert.equal(out.confidence, "moderate");
  });

  test("no match → low confidence", () => {
    const out = evaluate(buildInput({ symptoms: [] }));
    assert.equal(out.confidence, "low");
  });
});

// ══════════════════════════════════════════════════════════════
// Audit trail
// ══════════════════════════════════════════════════════════════

describe("audit trail", () => {
  test("every matched rule carries its clinical source", () => {
    const out = evaluate(
      buildInput({ symptoms: ["chest-pain-radiating-arm-jaw"] }),
    );
    assert.ok(out.matchedRules.length > 0);
    for (const m of out.matchedRules) {
      assert.ok(
        m.clinicalSource && m.clinicalSource.length > 0,
        `matched rule ${m.id} missing clinicalSource in audit trail`,
      );
    }
  });

  test("reasoning includes one line per matched rule", () => {
    const out = evaluate(
      buildInput({ symptoms: ["chest-pain-radiating-arm-jaw"] }),
    );
    // At minimum, we get one reasoning line per matched rule.
    assert.ok(out.reasoning.length >= out.matchedRules.length);
  });

  test("outcome includes a disclaimer", () => {
    const out = evaluate(buildInput({ symptoms: [] }));
    assert.ok(out.disclaimer && out.disclaimer.toLowerCase().includes("not a doctor"));
  });

  test("redFlagsChecked is always true when the engine completes normally", () => {
    const out = evaluate(buildInput({ symptoms: ["headache"] }));
    assert.equal(out.redFlagsChecked, true);
  });
});

// ══════════════════════════════════════════════════════════════
// Free-text symptom extraction
// ══════════════════════════════════════════════════════════════

describe("free-text symptom extraction", () => {
  test("extracts chest-pain-radiating-arm-jaw from typical phrasing", () => {
    const codes = extractSymptomCodes(
      "I have chest pain radiating down my left arm",
    );
    assert.ok(codes.includes("chest-pain-radiating-arm-jaw"));
  });

  test("extracts FAST stroke signs from plain language", () => {
    const codes = extractSymptomCodes(
      "Half my face is drooping and my speech is slurred",
    );
    assert.ok(codes.includes("facial-droop"));
    assert.ok(codes.includes("speech-slurred"));
  });

  test("extracts suicidal-ideation-plan over generic suicidal-ideation", () => {
    const codes = extractSymptomCodes(
      "I have a plan to end my life tonight",
    );
    assert.ok(
      codes.includes("suicidal-ideation-plan"),
      "more specific code should be picked when a plan is mentioned",
    );
  });

  test("is case-insensitive", () => {
    const lower = extractSymptomCodes("chest pain");
    const upper = extractSymptomCodes("CHEST PAIN");
    assert.deepEqual(lower, upper);
  });

  test("returns empty array for empty input", () => {
    assert.deepEqual(extractSymptomCodes(""), []);
    assert.deepEqual(extractSymptomCodes("  "), []);
  });

  test("mapSymptomsToCodes unions results across multiple items", () => {
    const codes = mapSymptomsToCodes(["chest pain", "shortness of breath"]);
    assert.ok(codes.includes("chest-pain"));
    assert.ok(codes.includes("shortness-of-breath"));
  });

  test("anaphylaxis keyword fires from natural language", () => {
    const codes = extractSymptomCodes(
      "My throat is closing and I used my epipen",
    );
    assert.ok(codes.includes("anaphylaxis"));
  });
});

// ══════════════════════════════════════════════════════════════
// End-to-end: free text → codes → triage
// ══════════════════════════════════════════════════════════════

describe("end-to-end", () => {
  test("'crushing chest pain in my arm' triages to emergency", () => {
    const codes = extractSymptomCodes(
      "crushing chest pain going into my arm and jaw",
    );
    const out = evaluate(
      buildInput({ symptoms: codes, demographics: { age: 62 } }),
    );
    assert.equal(out.triage, "emergency");
  });

  test("'mild headache for 2 days' triages to self-care or telehealth", () => {
    const codes = extractSymptomCodes("mild headache for 2 days");
    const out = evaluate(
      buildInput({
        symptoms: codes,
        durationDays: 2,
        severity: 3,
      }),
    );
    assert.ok(
      out.triage === "self-care" || out.triage === "telehealth",
      `expected self-care or telehealth, got ${out.triage}`,
    );
  });
});
