// ──────────────────────────────────────────────────────────────
// OzDoc CDSS — Public API
// ──────────────────────────────────────────────────────────────
//
// Re-exports the pieces callers need. Everything else is implementation
// detail.

export { evaluate } from "./engine.ts";
export { RULES, validateRules } from "./rules.ts";
export { PATHWAYS } from "./pathways.ts";
export { extractSymptomCodes, mapSymptomsToCodes } from "./symptoms.ts";
export { CDSS_ENGINE_VERSION } from "./types.ts";
export type {
  CDSSInput,
  CDSSOutcome,
  CDSSDemographics,
  CareAction,
  MatchedRule,
  Rule,
  RuleCategory,
  SymptomCode,
} from "./types.ts";
