// ──────────────────────────────────────────────────────────────
// OzDoc CDSS — Public API
// ──────────────────────────────────────────────────────────────
//
// Re-exports the pieces callers need. Everything else is implementation
// detail.

export { evaluate } from "./engine";
export { RULES, validateRules } from "./rules";
export { PATHWAYS } from "./pathways";
export { extractSymptomCodes, mapSymptomsToCodes } from "./symptoms";
export { CDSS_ENGINE_VERSION } from "./types";
export type {
  CDSSInput,
  CDSSOutcome,
  CDSSDemographics,
  CareAction,
  MatchedRule,
  Rule,
  RuleCategory,
  SymptomCode,
} from "./types";
