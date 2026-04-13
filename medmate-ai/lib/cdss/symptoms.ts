// ──────────────────────────────────────────────────────────────
// OzDoc CDSS — Symptom mapping (free-text → canonical codes)
// ──────────────────────────────────────────────────────────────
//
// The symptom checker and chat collect free-text symptoms. Before the
// CDSS engine can evaluate them, they must be mapped to canonical
// SymptomCodes. This file holds that mapping.
//
// The mapper is deliberately simple and case-insensitive — it matches
// on keywords and phrases. It is NOT an NLP model. For anything
// complex or ambiguous, the LLM layer should be used to extract
// structured symptoms (not yet implemented — roadmap).

import type { SymptomCode } from "./types";

// ──────────────────────────────────────────────────────────────
// Keyword → SymptomCode mapping
// ──────────────────────────────────────────────────────────────
//
// Keyword order matters: more specific patterns first so that
// "chest pain radiating to arm" matches the specific code before the
// generic "chest pain" code.

interface SymptomPattern {
  /** Regex or keyword array — matched case-insensitively */
  patterns: (RegExp | string)[];
  code: SymptomCode;
}

const SYMPTOM_PATTERNS: SymptomPattern[] = [
  // ─── Red-flag cardiovascular ───
  {
    patterns: [
      /chest pain.*(arm|jaw|shoulder|back|radiat)/i,
      /crushing chest/i,
      /chest.*(pressure|heavy|tight).*(arm|jaw|sweat)/i,
    ],
    code: "chest-pain-radiating-arm-jaw",
  },
  {
    patterns: [/chest pain/i, /chest pressure/i, /chest tight/i],
    code: "chest-pain",
  },
  { patterns: [/palpitations/i, /heart racing/i, /irregular heart/i], code: "palpitations" },

  // ─── Respiratory ───
  {
    patterns: [
      /severe.*(breath|breathing|short of breath)/i,
      /can('?t| ?not) breathe/i,
      /gasping/i,
      /struggling to breathe/i,
    ],
    code: "shortness-of-breath-severe",
  },
  {
    patterns: [/short(ness)? of breath/i, /breathless/i, /dyspn(o|oea|ea)/i],
    code: "shortness-of-breath",
  },
  {
    patterns: [/cough(ing)?.*(blood|bloody)/i, /haemoptysis/i, /hemoptysis/i],
    code: "cough-blood",
  },
  { patterns: [/cough/i], code: "cough" },
  { patterns: [/wheeze/i, /wheezing/i], code: "wheeze" },

  // ─── Neurological red flags ───
  {
    patterns: [
      /sudden.*(severe|worst).*headache/i,
      /thunderclap/i,
      /worst headache/i,
    ],
    code: "headache-severe-sudden",
  },
  {
    patterns: [
      /face(.*)droop/i,
      /facial droop/i,
      /half my face/i,
      /one side of (my|the) face/i,
    ],
    code: "facial-droop",
  },
  {
    patterns: [/arm weakness/i, /weak arm/i, /can('?t| ?not) lift.*arm/i],
    code: "arm-weakness",
  },
  {
    patterns: [/slurred speech/i, /can('?t| ?not) (speak|talk)/i, /speech.*(slurred|confused)/i],
    code: "speech-slurred",
  },
  { patterns: [/neck stiff(ness)?/i, /stiff neck/i], code: "neck-stiffness" },
  { patterns: [/confus(ed|ion)/i, /disoriented/i], code: "confusion" },
  {
    patterns: [/fainted/i, /passed out/i, /loss of consciousness/i, /unconscious/i],
    code: "loss-of-consciousness",
  },
  { patterns: [/seizure/i, /convulsion/i, /fit/i], code: "seizure" },
  { patterns: [/headache/i, /migraine/i], code: "headache" },
  { patterns: [/dizz(y|iness)/i, /lighthead/i, /vertigo/i], code: "dizziness" },

  // ─── Gastrointestinal ───
  {
    patterns: [/vomit.*(blood|bloody)/i, /haematemesis/i, /hematemesis/i],
    code: "vomiting-blood",
  },
  {
    patterns: [/severe.*(abdominal|stomach|belly|tummy).*pain/i, /acute abdom/i],
    code: "abdominal-pain-severe",
  },
  {
    patterns: [/abdominal pain/i, /stomach pain/i, /belly pain/i, /tummy (pain|ache)/i],
    code: "abdominal-pain",
  },
  { patterns: [/vomiting/i, /throwing up/i], code: "vomiting" },
  { patterns: [/nausea(ted)?/i, /feel sick/i], code: "nausea" },
  { patterns: [/diarrhoea.*blood/i, /bloody diarrhoea/i], code: "diarrhoea-bloody" },
  { patterns: [/diarrhoea/i, /diarrhea/i, /loose stool/i], code: "diarrhoea" },
  { patterns: [/constipat/i], code: "constipation" },

  // ─── Urinary ───
  { patterns: [/urine.*blood/i, /blood in (my|the) urine/i, /haematuria/i], code: "urinary-blood" },
  { patterns: [/burning.*urin/i, /painful urin/i, /dysuria/i], code: "urinary-burning" },
  { patterns: [/frequent urin/i, /going (a lot|often).*(loo|toilet|bathroom)/i], code: "urinary-frequency" },

  // ─── Skin ───
  {
    patterns: [
      /non[- ]?blanching.*rash/i,
      /purple spots/i,
      /purpuric/i,
      /petechiae/i,
    ],
    code: "rash-non-blanching",
  },
  { patterns: [/rash/i, /hives/i, /urticaria/i], code: "rash" },
  { patterns: [/new mole/i, /changing mole/i], code: "new-mole" },
  { patterns: [/swollen/i, /swelling/i, /oedema/i, /edema/i], code: "swelling" },
  { patterns: [/bruise/i, /bruising/i], code: "bruise" },

  // ─── Mental health ───
  {
    patterns: [/suicid.*(plan|going to|ready to)/i, /plan.*to end.*life/i],
    code: "suicidal-ideation-plan",
  },
  {
    patterns: [/suicid/i, /end.*my.*life/i, /don('?t| ?not) want to be alive/i],
    code: "suicidal-ideation",
  },
  { patterns: [/panic attack/i], code: "panic-attacks" },
  { patterns: [/anxious/i, /anxiety/i, /worried a lot/i], code: "anxiety" },
  { patterns: [/low mood/i, /depressed/i, /sad all the time/i, /hopeless/i], code: "low-mood" },
  { patterns: [/can('?t| ?not) sleep/i, /insomnia/i, /sleep problem/i], code: "sleep-problems" },
  { patterns: [/intrusive thought/i], code: "intrusive-thoughts" },

  // ─── Systemic ───
  { patterns: [/high fever/i, /fever.*(39|40|41)/i, /burning up/i], code: "fever-high" },
  { patterns: [/fever/i, /temperature/i, /pyrexia/i], code: "fever" },
  { patterns: [/fatigue/i, /tired all the time/i, /exhausted/i], code: "fatigue" },
  {
    patterns: [/weight loss/i, /losing weight/i, /lost.*kg/i],
    code: "weight-loss-unintentional",
  },
  { patterns: [/night sweat/i, /sweating at night/i], code: "night-sweats" },

  // ─── Allergy ───
  {
    patterns: [
      /anaphylax/i,
      /throat.*(closing|swelling)/i,
      /can('?t| ?not) swallow.*allerg/i,
      /epipen/i,
    ],
    code: "anaphylaxis",
  },
  { patterns: [/allergic reaction/i, /mild allerg/i], code: "allergic-reaction-mild" },

  // ─── Trauma / bleeding ───
  {
    patterns: [/severe.*bleed/i, /heavy bleed/i, /won('?t| ?not) stop bleed/i],
    code: "severe-bleeding",
  },
  { patterns: [/head injury/i, /hit my head/i, /knocked out/i], code: "head-injury" },
  {
    patterns: [/broken bone/i, /fracture/i, /suspected.*fracture/i],
    code: "suspected-fracture",
  },
];

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Map free-text (from the symptom checker or chat) to a set of canonical
 * symptom codes. Order is preserved and duplicates are removed.
 */
export function extractSymptomCodes(text: string): SymptomCode[] {
  if (!text) return [];
  const codes = new Set<SymptomCode>();
  const normalized = text.toLowerCase();

  for (const { patterns, code } of SYMPTOM_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern instanceof RegExp) {
        if (pattern.test(normalized)) {
          codes.add(code);
          break;
        }
      } else if (normalized.includes(pattern.toLowerCase())) {
        codes.add(code);
        break;
      }
    }
  }

  return Array.from(codes);
}

/**
 * Given an array of symptom strings (e.g. ["Chest pain", "Shortness of breath"]),
 * return the union of canonical codes.
 */
export function mapSymptomsToCodes(symptoms: string[]): SymptomCode[] {
  const codes = new Set<SymptomCode>();
  for (const sym of symptoms) {
    for (const code of extractSymptomCodes(sym)) {
      codes.add(code);
    }
  }
  return Array.from(codes);
}
