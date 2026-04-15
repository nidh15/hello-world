// ──────────────────────────────────────────────────────────────
// OzDoc CDSS — Clinical rule set
// ──────────────────────────────────────────────────────────────
//
// This is the CDSS knowledge base. Every rule has:
//   - A stable ID (never rename; used in audit logs)
//   - A clinical source citation
//   - A category (red-flag / urgent / routine / telehealth / self-care)
//   - A pure `when` predicate
//   - An outcome with triage level + plain-language reason
//
// IMPORTANT: this rule set is a first-pass starter — it MUST be reviewed
// and signed off by an Australian-registered medical advisor before any
// clinical use. It does not attempt to replicate the breadth of
// Infermedica or any other licensed CDSS knowledge base. It covers the
// most common red flags and triage patterns for the presentations the
// OzDoc symptom checker currently supports.
//
// Rule evaluation order: rules are listed in PRIORITY order. The engine
// evaluates all of them and picks the highest-severity outcome, but
// listing them by priority keeps the audit trail readable.

import type { Rule } from "./types.ts";

export const RULES: Rule[] = [
  // ══════════════════════════════════════════════════════════════
  // RED FLAGS — always escalate to 000 / ED
  // ══════════════════════════════════════════════════════════════

  {
    id: "STROKE_SIGNS_FAST",
    name: "Stroke signs (FAST test)",
    description:
      "Any of: facial droop, arm weakness, or slurred speech. Time-critical.",
    clinicalSource:
      "Stroke Foundation Australia — FAST (Face, Arms, Speech, Time)",
    category: "red-flag",
    when: (i) =>
      i.symptoms.includes("facial-droop") ||
      i.symptoms.includes("arm-weakness") ||
      i.symptoms.includes("speech-slurred"),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — call 000 (time-critical)",
      reason:
        "Facial droop, arm weakness or slurred speech can be a stroke. Every minute of delay loses brain tissue — treatment must start within 4.5 hours.",
    },
  },

  {
    id: "CARDIAC_CHEST_PAIN",
    name: "Cardiac-pattern chest pain",
    description:
      "Chest pain radiating to arm or jaw, or chest pain with shortness of breath.",
    clinicalSource:
      "Heart Foundation of Australia — chest pain assessment; RACGP Red Book",
    category: "red-flag",
    when: (i) =>
      i.symptoms.includes("chest-pain-radiating-arm-jaw") ||
      (i.symptoms.includes("chest-pain") &&
        (i.symptoms.includes("shortness-of-breath") ||
          i.symptoms.includes("shortness-of-breath-severe"))),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — call 000",
      reason:
        "Chest pain with radiation to the arm/jaw or with shortness of breath is a red flag for acute coronary syndrome and needs urgent cardiac assessment.",
    },
  },

  {
    id: "CHEST_PAIN_AGE_RISK",
    name: "Chest pain in adults ≥40",
    description: "New chest pain in a patient aged 40 or older.",
    clinicalSource:
      "Heart Foundation of Australia — every chest pain in an older adult warrants assessment",
    category: "red-flag",
    when: (i) =>
      i.symptoms.includes("chest-pain") &&
      i.demographics.age != null &&
      i.demographics.age >= 40,
    outcome: {
      triage: "emergency",
      urgency: "Immediately — ED or call 000",
      reason:
        "New chest pain in an adult ≥40 should be assessed immediately to rule out a cardiac cause.",
    },
  },

  {
    id: "THUNDERCLAP_HEADACHE",
    name: "Thunderclap (sudden severe) headache",
    description: "Sudden-onset severe headache, peak within seconds/minutes.",
    clinicalSource: "RACGP Red Flags; Brain Foundation Australia",
    category: "red-flag",
    when: (i) => i.symptoms.includes("headache-severe-sudden"),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — ED or call 000",
      reason:
        "A sudden severe (‘worst ever’) headache can indicate subarachnoid haemorrhage and must be investigated urgently.",
    },
  },

  {
    id: "MENINGITIS_TRIAD",
    name: "Possible meningitis (neck stiffness with fever or headache)",
    description:
      "Neck stiffness with fever and/or headache — suspicious for meningitis. Neck stiffness is the high-specificity red flag; combined with either fever or headache it must be treated as a time-critical emergency workup.",
    clinicalSource: "RACGP — meningitis red flags",
    category: "red-flag",
    when: (i) =>
      i.symptoms.includes("neck-stiffness") &&
      (i.symptoms.includes("fever") ||
        i.symptoms.includes("fever-high") ||
        i.symptoms.includes("headache")),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — ED",
      reason:
        "Neck stiffness with fever or headache is suspicious for meningitis and needs urgent assessment. Do not wait for a rash to appear.",
    },
  },

  {
    id: "MENINGOCOCCAL_RASH",
    name: "Non-blanching rash with fever",
    description: "Purpuric (non-blanching) rash with fever.",
    clinicalSource: "Australian Immunisation Handbook — meningococcal disease",
    category: "red-flag",
    when: (i) =>
      i.symptoms.includes("rash-non-blanching") &&
      (i.symptoms.includes("fever") || i.symptoms.includes("fever-high")),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — ED or call 000",
      reason:
        "A non-blanching rash with fever can indicate meningococcal sepsis — a life-threatening emergency.",
    },
  },

  {
    id: "ANAPHYLAXIS",
    name: "Anaphylaxis",
    description:
      "Severe allergic reaction — airway/breathing/circulation compromise.",
    clinicalSource:
      "ASCIA (Australasian Society of Clinical Immunology and Allergy) — anaphylaxis action plan",
    category: "red-flag",
    when: (i) => i.symptoms.includes("anaphylaxis"),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — use EpiPen if available, then call 000",
      reason:
        "Anaphylaxis is life-threatening and requires immediate adrenaline and emergency care.",
    },
  },

  {
    id: "SEVERE_SHORTNESS_OF_BREATH",
    name: "Severe shortness of breath",
    description: "Severe difficulty breathing at rest.",
    clinicalSource: "Lung Foundation Australia; Asthma Australia",
    category: "red-flag",
    when: (i) => i.symptoms.includes("shortness-of-breath-severe"),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — call 000 or go to ED",
      reason:
        "Severe shortness of breath can indicate asthma attack, pulmonary embolism, heart failure or severe infection and needs emergency assessment.",
    },
  },

  {
    id: "LOSS_OF_CONSCIOUSNESS",
    name: "Loss of consciousness",
    description: "Syncope or unexplained loss of consciousness.",
    clinicalSource: "RACGP Red Flags; Heart Foundation of Australia",
    category: "red-flag",
    when: (i) => i.symptoms.includes("loss-of-consciousness"),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — ED",
      reason:
        "Loss of consciousness needs medical assessment to rule out cardiac, neurological or metabolic causes.",
    },
  },

  {
    id: "SEIZURE_FIRST",
    name: "Seizure",
    description: "A seizure (convulsion/fit).",
    clinicalSource: "Epilepsy Action Australia — first seizure guidelines",
    category: "red-flag",
    when: (i) => i.symptoms.includes("seizure"),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — ED",
      reason:
        "A seizure (especially a first seizure) needs urgent assessment to identify the cause.",
    },
  },

  {
    id: "SEVERE_BLEEDING",
    name: "Severe bleeding",
    description: "Uncontrolled or heavy bleeding.",
    clinicalSource: "St John Ambulance Australia — first aid guidelines",
    category: "red-flag",
    when: (i) => i.symptoms.includes("severe-bleeding"),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — call 000, apply firm pressure",
      reason:
        "Severe bleeding requires immediate first aid and emergency care.",
    },
  },

  {
    id: "HAEMATEMESIS",
    name: "Vomiting blood (haematemesis)",
    description: "Vomiting fresh or altered blood.",
    clinicalSource: "RACGP Red Flags — upper GI bleeding",
    category: "red-flag",
    when: (i) => i.symptoms.includes("vomiting-blood"),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — ED",
      reason:
        "Vomiting blood can indicate a serious upper GI bleed and needs urgent endoscopic assessment.",
    },
  },

  {
    id: "SUICIDAL_PLAN",
    name: "Suicidal ideation with a plan",
    description: "Active suicidal thoughts with a plan or intent.",
    clinicalSource:
      "Lifeline Australia; Beyond Blue; Royal Australian and New Zealand College of Psychiatrists",
    category: "red-flag",
    when: (i) => i.symptoms.includes("suicidal-ideation-plan"),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — Lifeline 13 11 14 or call 000",
      reason:
        "Active suicidal ideation with a plan is a mental health emergency. Please contact Lifeline (13 11 14) or emergency services immediately.",
    },
  },

  {
    id: "HEAD_INJURY_SEVERE",
    name: "Head injury with concerning features",
    description:
      "Head injury with loss of consciousness, confusion or vomiting.",
    clinicalSource: "RACGP — head injury assessment; Brain Injury Australia",
    category: "red-flag",
    when: (i) =>
      i.symptoms.includes("head-injury") &&
      (i.symptoms.includes("loss-of-consciousness") ||
        i.symptoms.includes("confusion") ||
        i.symptoms.includes("vomiting")),
    outcome: {
      triage: "emergency",
      urgency: "Immediately — ED",
      reason:
        "Head injury with loss of consciousness, confusion, or vomiting can indicate intracranial bleeding and needs urgent imaging.",
    },
  },

  // ══════════════════════════════════════════════════════════════
  // URGENT — same-day assessment (ED or urgent GP)
  // ══════════════════════════════════════════════════════════════

  {
    id: "HAEMOPTYSIS",
    name: "Coughing up blood",
    description: "Haemoptysis.",
    clinicalSource: "RACGP Red Flags — haemoptysis",
    category: "urgent",
    when: (i) => i.symptoms.includes("cough-blood"),
    outcome: {
      triage: "urgent",
      urgency: "Same day — urgent GP or ED",
      reason:
        "Coughing up blood needs urgent assessment to rule out infection, pulmonary embolism, or malignancy.",
    },
  },

  {
    id: "SEVERE_ABDO_PAIN",
    name: "Severe abdominal pain",
    description: "Severe, unexplained abdominal pain.",
    clinicalSource: "RACGP — acute abdomen assessment",
    category: "urgent",
    when: (i) =>
      i.symptoms.includes("abdominal-pain-severe") ||
      (i.symptoms.includes("abdominal-pain") && (i.severity ?? 0) >= 8),
    outcome: {
      triage: "urgent",
      urgency: "Same day — ED",
      reason:
        "Severe abdominal pain may indicate an acute surgical abdomen (appendicitis, perforation, obstruction) and needs same-day assessment.",
    },
  },

  {
    id: "FEVER_IN_PREGNANCY",
    name: "Fever in pregnancy",
    description: "Any fever during pregnancy.",
    clinicalSource:
      "RANZCOG (Royal Australian and New Zealand College of Obstetricians and Gynaecologists) — fever in pregnancy",
    category: "urgent",
    when: (i) =>
      i.demographics.isPregnant === true &&
      (i.symptoms.includes("fever") || i.symptoms.includes("fever-high")),
    outcome: {
      triage: "urgent",
      urgency: "Same day — GP or pregnancy assessment unit",
      reason:
        "Fever during pregnancy needs prompt assessment to rule out infection that could affect mother or baby.",
    },
  },

  {
    id: "SUSPECTED_FRACTURE",
    name: "Suspected fracture",
    description: "Suspected broken bone.",
    clinicalSource: "St John Ambulance Australia — first aid guidelines",
    category: "urgent",
    when: (i) => i.symptoms.includes("suspected-fracture"),
    outcome: {
      triage: "urgent",
      urgency: "Same day — ED for imaging",
      reason:
        "Suspected fractures need imaging (X-ray) and appropriate immobilisation.",
    },
  },

  {
    id: "BLOODY_DIARRHOEA",
    name: "Bloody diarrhoea",
    description: "Diarrhoea with blood.",
    clinicalSource: "RACGP — acute gastroenteritis red flags",
    category: "urgent",
    when: (i) => i.symptoms.includes("diarrhoea-bloody"),
    outcome: {
      triage: "urgent",
      urgency: "Same day — GP",
      reason:
        "Bloody diarrhoea can indicate serious infection or inflammatory bowel disease and needs prompt assessment.",
    },
  },

  {
    id: "HIGH_FEVER_UNDER_3_MONTHS",
    name: "Fever in infant <3 months",
    description: "Any fever in a baby under 3 months old.",
    clinicalSource: "RCH Melbourne — fever in the young infant clinical guideline",
    category: "urgent",
    when: (i) =>
      (i.symptoms.includes("fever") || i.symptoms.includes("fever-high")) &&
      i.demographics.age != null &&
      i.demographics.age < 0.25,
    outcome: {
      triage: "urgent",
      urgency: "Immediately — ED",
      reason:
        "Any fever in an infant under 3 months is a paediatric red flag and needs immediate assessment.",
    },
  },

  {
    id: "WEIGHT_LOSS_NIGHT_SWEATS",
    name: "Unexplained weight loss with night sweats",
    description:
      "Unintentional weight loss combined with night sweats — systemic red flag.",
    clinicalSource: "RACGP Red Flags — constitutional symptoms",
    category: "urgent",
    when: (i) =>
      i.symptoms.includes("weight-loss-unintentional") &&
      i.symptoms.includes("night-sweats"),
    outcome: {
      triage: "see-gp-soon",
      urgency: "Within 3 days — GP",
      reason:
        "Unexplained weight loss with night sweats is a systemic red flag that needs GP assessment to rule out serious causes.",
    },
  },

  // ══════════════════════════════════════════════════════════════
  // SEE GP SOON — 24–72 hours
  // ══════════════════════════════════════════════════════════════

  {
    id: "PERSISTENT_COUGH",
    name: "Persistent cough ≥3 weeks",
    description:
      "Cough lasting 3 weeks or more — needs GP review (including TB screening consideration).",
    clinicalSource:
      "RACGP — chronic cough guidelines; Lung Foundation Australia",
    category: "routine",
    when: (i) =>
      i.symptoms.includes("cough") && (i.durationDays ?? 0) >= 21,
    outcome: {
      triage: "see-gp-soon",
      urgency: "Within 48 hours — GP",
      reason:
        "A cough lasting more than 3 weeks needs GP review to rule out serious causes such as TB, asthma, or malignancy.",
    },
  },

  {
    id: "URINARY_BLOOD",
    name: "Blood in urine",
    description: "Haematuria.",
    clinicalSource: "RACGP — haematuria referral guidelines",
    category: "routine",
    when: (i) => i.symptoms.includes("urinary-blood"),
    outcome: {
      triage: "see-gp-soon",
      urgency: "Within 48 hours — GP",
      reason:
        "Blood in the urine needs GP assessment to investigate urinary tract infection, stones, or malignancy.",
    },
  },

  {
    id: "NEW_MOLE",
    name: "New or changing mole",
    description: "A new, changing, or concerning mole.",
    clinicalSource: "Cancer Council Australia — skin cancer screening",
    category: "routine",
    when: (i) => i.symptoms.includes("new-mole"),
    outcome: {
      triage: "see-gp-soon",
      urgency: "Within 1–2 weeks — GP or skin clinic",
      reason:
        "Australia has the highest skin cancer rates in the world — any new or changing mole should be checked by a GP or skin clinic.",
    },
  },

  {
    id: "MENTAL_HEALTH_NON_CRISIS",
    name: "Mental health — non-crisis",
    description:
      "Low mood, anxiety, panic, or sleep problems without imminent risk.",
    clinicalSource: "Beyond Blue; Black Dog Institute; RACGP mental health",
    category: "routine",
    when: (i) =>
      (i.symptoms.includes("anxiety") ||
        i.symptoms.includes("low-mood") ||
        i.symptoms.includes("panic-attacks") ||
        i.symptoms.includes("sleep-problems") ||
        i.symptoms.includes("intrusive-thoughts")) &&
      !i.symptoms.includes("suicidal-ideation") &&
      !i.symptoms.includes("suicidal-ideation-plan"),
    outcome: {
      triage: "see-gp-soon",
      urgency: "Within 1–2 weeks — GP for Mental Health Care Plan",
      reason:
        "A GP can create a Mental Health Care Plan, giving you access to 10 Medicare-subsidised psychology sessions per year.",
    },
  },

  {
    id: "SUICIDAL_NO_PLAN",
    name: "Suicidal thoughts without a plan",
    description: "Passive suicidal ideation without immediate plan or intent.",
    clinicalSource: "Lifeline Australia; Beyond Blue",
    category: "urgent",
    when: (i) =>
      i.symptoms.includes("suicidal-ideation") &&
      !i.symptoms.includes("suicidal-ideation-plan"),
    outcome: {
      triage: "urgent",
      urgency: "Today — Lifeline 13 11 14 and GP same-day",
      reason:
        "Please reach out to Lifeline (13 11 14) or Beyond Blue (1300 22 4636) today, and book a same-day GP appointment to discuss a Mental Health Care Plan.",
    },
  },

  // ══════════════════════════════════════════════════════════════
  // TELEHEALTH appropriate
  // ══════════════════════════════════════════════════════════════

  {
    id: "UTI_UNCOMPLICATED",
    name: "Uncomplicated UTI symptoms",
    description: "Dysuria or urinary frequency without red flags.",
    clinicalSource:
      "eTG (Therapeutic Guidelines Australia) — uncomplicated UTI",
    category: "telehealth",
    when: (i) =>
      (i.symptoms.includes("urinary-burning") ||
        i.symptoms.includes("urinary-frequency")) &&
      !i.symptoms.includes("urinary-blood") &&
      !i.symptoms.includes("fever-high") &&
      !(i.demographics.age != null && i.demographics.age < 16),
    outcome: {
      triage: "telehealth",
      urgency: "Today — telehealth GP",
      reason:
        "Uncomplicated UTIs in adults can be effectively managed via telehealth with an eScript for antibiotics if appropriate.",
    },
  },

  {
    id: "MILD_RESP_INFECTION",
    name: "Mild respiratory infection",
    description: "Cough or cold symptoms without red flags.",
    clinicalSource: "Healthdirect — cold and flu; RACGP",
    category: "telehealth",
    when: (i) =>
      i.symptoms.includes("cough") &&
      (i.durationDays ?? 0) < 21 &&
      !i.symptoms.includes("cough-blood") &&
      !i.symptoms.includes("shortness-of-breath-severe") &&
      !i.symptoms.includes("chest-pain"),
    outcome: {
      triage: "telehealth",
      urgency: "Today if needed — telehealth GP",
      reason:
        "Uncomplicated respiratory infections without red flags can often be managed via telehealth, including medical certificates and treatment advice.",
    },
  },

  {
    id: "MILD_ALLERGIC_REACTION",
    name: "Mild allergic reaction",
    description: "Localised rash or mild reaction without anaphylaxis.",
    clinicalSource: "ASCIA — allergic reactions",
    category: "telehealth",
    when: (i) =>
      i.symptoms.includes("allergic-reaction-mild") &&
      !i.symptoms.includes("anaphylaxis") &&
      !i.symptoms.includes("shortness-of-breath-severe"),
    outcome: {
      triage: "telehealth",
      urgency: "Today — telehealth GP",
      reason:
        "Mild allergic reactions without airway compromise can be assessed via telehealth.",
    },
  },

  // ══════════════════════════════════════════════════════════════
  // SELF-CARE — manage at home, review if worse
  // ══════════════════════════════════════════════════════════════

  {
    id: "MILD_HEADACHE",
    name: "Mild headache",
    description: "Mild, short-duration headache without red flags.",
    clinicalSource: "Healthdirect — headache self-care; Brain Foundation",
    category: "self-care",
    when: (i) =>
      i.symptoms.includes("headache") &&
      !i.symptoms.includes("headache-severe-sudden") &&
      !i.symptoms.includes("neck-stiffness") &&
      !(i.symptoms.includes("fever") || i.symptoms.includes("fever-high")) &&
      (i.severity ?? 0) <= 4 &&
      (i.durationDays ?? 0) < 3,
    outcome: {
      triage: "self-care",
      urgency: "Self-care at home",
      reason:
        "Mild, short-duration headaches without red flags can usually be managed with rest, hydration, and simple analgesia. See a GP if it persists or worsens.",
    },
  },

  {
    id: "MILD_FATIGUE",
    name: "Mild isolated fatigue",
    description: "Fatigue without red flag features.",
    clinicalSource: "RACGP — tired all the time (TATT) guidelines",
    category: "self-care",
    when: (i) =>
      i.symptoms.includes("fatigue") &&
      i.symptoms.length === 1 &&
      (i.durationDays ?? 0) < 14,
    outcome: {
      triage: "self-care",
      urgency: "Self-care and review if persistent",
      reason:
        "Short-term fatigue without other symptoms is usually benign. If it persists beyond 2 weeks, see a GP for blood tests to investigate.",
    },
  },

  {
    id: "MILD_GASTRO",
    name: "Mild gastroenteritis",
    description: "Short-duration diarrhoea without red flags.",
    clinicalSource: "Healthdirect — gastro self-care; RACGP",
    category: "self-care",
    when: (i) =>
      i.symptoms.includes("diarrhoea") &&
      !i.symptoms.includes("diarrhoea-bloody") &&
      !i.symptoms.includes("fever-high") &&
      !i.symptoms.includes("abdominal-pain-severe") &&
      (i.durationDays ?? 0) < 3,
    outcome: {
      triage: "self-care",
      urgency: "Self-care with oral rehydration",
      reason:
        "Short-duration gastro without red flags is usually managed at home with oral rehydration. See a GP if it persists >3 days, if you can't keep fluids down, or if blood appears.",
    },
  },
];

// ──────────────────────────────────────────────────────────────
// Rule integrity check — call this at startup in dev mode
// ──────────────────────────────────────────────────────────────

/**
 * Validates that every rule has the required fields. Throws on invalid
 * rules — call this from tests or at dev-server startup.
 */
export function validateRules(): void {
  const seen = new Set<string>();
  for (const rule of RULES) {
    if (!rule.id) throw new Error("Rule missing id");
    if (seen.has(rule.id)) throw new Error(`Duplicate rule id: ${rule.id}`);
    seen.add(rule.id);
    if (!rule.clinicalSource)
      throw new Error(`Rule ${rule.id} missing clinicalSource`);
    if (!rule.outcome?.reason)
      throw new Error(`Rule ${rule.id} missing outcome.reason`);
    if (typeof rule.when !== "function")
      throw new Error(`Rule ${rule.id} missing when predicate`);
  }
}
