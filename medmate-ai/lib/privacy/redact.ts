// ──────────────────────────────────────────────────────────────
// OzDoc AI — PII redaction for outbound LLM calls
// ──────────────────────────────────────────────────────────────
//
// Australian health apps handle Sensitive Information under the
// Privacy Act 1988. Even though Anthropic does not train on API
// traffic and OzDoc terms prohibit third-party training, it is good
// hygiene to strip high-risk identifiers before they cross the
// network boundary. That way if there is ever a breach, log leak,
// or accidental prompt capture, the impact is limited.
//
// This module is PURE: no network, no filesystem, no env access.
// It can be unit tested and run on the edge.
//
// Scope — what we redact:
//   - Email addresses                → [EMAIL_REDACTED]
//   - Australian phone numbers       → [PHONE_REDACTED]
//   - Medicare numbers (10-11 digit) → [MEDICARE_REDACTED]
//   - Individual Healthcare Identifiers (IHI, 16 digit)
//                                    → [IHI_REDACTED]
//   - TFNs (8-9 digit)               → [TFN_REDACTED]
//   - Credit card numbers            → [CARD_REDACTED]
//   - Australian addresses (numeric street + suburb)
//                                    → [ADDRESS_REDACTED]
//
// Scope — what we do NOT redact (and why):
//   - Names: the app intentionally gets the user's first name for
//     personalisation ("G'day, Sarah"). The user opts in by filling
//     out a profile. Aggressive name redaction would break medical
//     context ("my daughter's name is Sarah and she has a fever").
//   - Ages, genders, conditions: these are clinical context the LLM
//     needs to give a useful response.
//   - Dates of birth: we do not currently extract and strip these;
//     they're usually needed for age-based triage. If we ever start
//     piping the raw DoB from the profile into the prompt we should
//     strip it at the profile layer instead.

export interface RedactionReport {
  /** Text with PII replaced */
  text: string;
  /** How many replacements were made, by type */
  counts: Record<RedactionType, number>;
  /** True if any PII was detected */
  redacted: boolean;
}

export type RedactionType =
  | "email"
  | "phone"
  | "medicare"
  | "ihi"
  | "tfn"
  | "card"
  | "address";

// ──────────────────────────────────────────────────────────────
// Individual redactors
// ──────────────────────────────────────────────────────────────
//
// Order matters: more-specific patterns must run first so that a
// Medicare number isn't accidentally matched as a generic 10-digit
// phone number.

interface Redactor {
  type: RedactionType;
  pattern: RegExp;
  replacement: string;
}

// Australian mobile: 04xx xxx xxx or +61 4xx xxx xxx (spaces, dashes
// optional). Landline: 02/03/07/08 + 8 digits. 1300/1800: 6-10 digits.
const PHONE_RE =
  /(?:\+?61[\s-]?)?(?:\(?0?[2-578]\)?[\s-]?\d{4}[\s-]?\d{4}|\(?04\)?[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{3}|1[38]00[\s-]?\d{3}[\s-]?\d{3})/g;

// Medicare: 10 digits optionally formatted as "xxxx xxxxx x" or
// "xxxx-xxxxx-x" or "xxxxxxxxxx". Accepts a trailing IRN digit too
// ("xxxx xxxxx x 1") so we catch the full 11-digit form.
const MEDICARE_RE =
  /\b(?:medicare(?:\s*(?:number|card|no\.?|#))?[:\s-]*)?[2-6]\d{3}[\s-]?\d{5}[\s-]?\d(?:[\s-]?\d)?\b/gi;

// Individual Healthcare Identifier (IHI): 16 digits, often starts 800
// in Australia.
const IHI_RE = /\b800[2-3]\s?\d{4}\s?\d{4}\s?\d{4}\b/g;

// TFN: 8-9 digits. Require explicit "tfn" or "tax file" nearby to
// avoid catching random 9-digit runs.
const TFN_RE =
  /\b(?:tfn|tax\s*file(?:\s*number)?)[:\s#-]*\d{3}[\s-]?\d{3}[\s-]?\d{2,3}\b/gi;

// Credit card: 13-19 digits, grouped in 4s optionally with spaces or
// dashes. We don't run a Luhn check — we're being aggressive.
const CARD_RE = /\b(?:\d[ -]?){13,19}\b/g;

// Email — standard-ish. Allows plus-aliases.
const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

// Address — "12 Main St, Bondi NSW 2026" style. Number + words +
// street type + optional suburb/state/postcode.
const ADDRESS_RE =
  /\b\d{1,5}[a-z]?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:St|Street|Rd|Road|Ave|Avenue|Dr|Drive|Ln|Lane|Ct|Court|Pl|Place|Pde|Parade|Cres|Crescent|Hwy|Highway|Tce|Terrace|Blvd|Boulevard|Cl|Close|Wy|Way)\b[,.\s]*(?:[A-Z][a-z]+\s*)*(?:NSW|VIC|QLD|WA|SA|TAS|NT|ACT)?\s*\d{0,4}/g;

// NOTE: the order below is deliberate. Medicare and IHI go FIRST
// because their digit patterns can overlap with phone/card runs.
const REDACTORS: Redactor[] = [
  { type: "email", pattern: EMAIL_RE, replacement: "[EMAIL_REDACTED]" },
  { type: "ihi", pattern: IHI_RE, replacement: "[IHI_REDACTED]" },
  { type: "medicare", pattern: MEDICARE_RE, replacement: "[MEDICARE_REDACTED]" },
  { type: "tfn", pattern: TFN_RE, replacement: "[TFN_REDACTED]" },
  { type: "card", pattern: CARD_RE, replacement: "[CARD_REDACTED]" },
  { type: "phone", pattern: PHONE_RE, replacement: "[PHONE_REDACTED]" },
  { type: "address", pattern: ADDRESS_RE, replacement: "[ADDRESS_REDACTED]" },
];

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Redact high-risk PII from a single string. Pure function.
 */
export function redactPII(input: string): RedactionReport {
  const counts: Record<RedactionType, number> = {
    email: 0,
    phone: 0,
    medicare: 0,
    ihi: 0,
    tfn: 0,
    card: 0,
    address: 0,
  };

  if (!input) {
    return { text: input, counts, redacted: false };
  }

  let text = input;
  for (const redactor of REDACTORS) {
    // Reset regex state (global flag keeps lastIndex between calls).
    redactor.pattern.lastIndex = 0;
    const matches = text.match(redactor.pattern);
    if (matches && matches.length > 0) {
      counts[redactor.type] += matches.length;
      text = text.replace(redactor.pattern, redactor.replacement);
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return { text, counts, redacted: total > 0 };
}

/**
 * Redact PII from an array of chat messages in-place-style: returns
 * a new array with content fields replaced, and a merged counts
 * object so the caller can log the totals.
 */
export function redactMessages<T extends { content: string }>(
  messages: T[],
): { messages: T[]; counts: Record<RedactionType, number>; redacted: boolean } {
  const merged: Record<RedactionType, number> = {
    email: 0,
    phone: 0,
    medicare: 0,
    ihi: 0,
    tfn: 0,
    card: 0,
    address: 0,
  };

  const out = messages.map((m) => {
    const report = redactPII(m.content);
    (Object.keys(merged) as RedactionType[]).forEach((k) => {
      merged[k] += report.counts[k];
    });
    return { ...m, content: report.text };
  });

  const total = Object.values(merged).reduce((a, b) => a + b, 0);
  return { messages: out, counts: merged, redacted: total > 0 };
}
