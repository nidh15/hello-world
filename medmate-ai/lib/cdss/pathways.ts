// ──────────────────────────────────────────────────────────────
// OzDoc CDSS — Care pathways
// ──────────────────────────────────────────────────────────────
//
// Maps a TriageLevel to a concrete CareAction: where to go, what to
// do, and which Australian resources to surface.
//
// Every pathway includes Australian-specific resources (Healthdirect,
// Lifeline, 13HEALTH, NURSE-ON-CALL, RFDS, etc.) rather than generic
// "call a nurse line" text.

import type { TriageLevel } from "@/types";
import type { CareAction } from "./types";

const HEALTHDIRECT = {
  name: "Healthdirect",
  phone: "1800 022 222",
  url: "https://www.healthdirect.gov.au",
  description: "24/7 national health advice line staffed by registered nurses",
};

const LIFELINE = {
  name: "Lifeline",
  phone: "13 11 14",
  url: "https://www.lifeline.org.au",
  description: "24/7 crisis support and suicide prevention",
};

const BEYOND_BLUE = {
  name: "Beyond Blue",
  phone: "1300 22 4636",
  url: "https://www.beyondblue.org.au",
  description: "Mental health and wellbeing support",
};

const THIRTEEN_HEALTH = {
  name: "13HEALTH (QLD)",
  phone: "13 43 25 84",
  description: "Queensland 24/7 health line",
};

const NURSE_ON_CALL = {
  name: "NURSE-ON-CALL (VIC)",
  phone: "1300 60 60 24",
  description: "Victoria 24/7 registered nurse advice line",
};

const POISONS = {
  name: "Poisons Information Centre",
  phone: "13 11 26",
  description: "24/7 poisons advice",
};

const RFDS = {
  name: "Royal Flying Doctor Service",
  url: "https://www.flyingdoctor.org.au",
  description: "Emergency medical care for remote Australia",
};

export const PATHWAYS: Record<TriageLevel, CareAction> = {
  emergency: {
    primary: "Call 000 or go to your nearest Emergency Department right now",
    venue: "Emergency Department / Ambulance",
    phoneNumber: "000",
    instructions: [
      "If you are unable to speak, stay on the line — emergency services can trace the call.",
      "If safe, have someone else drive you — do not drive yourself if you are the patient.",
      "Bring a list of current medications and allergies if possible.",
      "If a cardiac event is suspected and you are not allergic, chew one 300 mg aspirin.",
      "For suspected stroke, note the time symptoms started (this determines treatment eligibility).",
    ],
    australianResources: [
      { name: "Ambulance / Fire / Police", phone: "000", description: "Emergency services" },
      HEALTHDIRECT,
      POISONS,
      RFDS,
    ],
  },

  urgent: {
    primary: "Get seen today — urgent GP appointment or Emergency Department",
    venue: "Urgent GP (same day) or ED",
    instructions: [
      "Call your regular GP and ask for an urgent same-day appointment.",
      "If no same-day appointment is available, go to your nearest Emergency Department or bulk-billed walk-in clinic.",
      "Call Healthdirect 1800 022 222 for immediate nurse advice if unsure.",
      "Bring a list of medications, allergies, and your Medicare card.",
      "If symptoms worsen while waiting, call 000 immediately.",
    ],
    australianResources: [
      HEALTHDIRECT,
      THIRTEEN_HEALTH,
      NURSE_ON_CALL,
      { name: "After-hours GP (Home Doctor Service)", phone: "13 74 25", description: "Bulk-billed after-hours home visits in metro areas" },
    ],
  },

  "see-gp-soon": {
    primary: "Book a GP appointment in the next 24–72 hours",
    venue: "Your regular GP or a bulk-billing clinic",
    instructions: [
      "Book a GP appointment within the next 1–3 days.",
      "If no appointment is available, consider OzDoc telehealth for same-day review.",
      "Bring your health summary — OzDoc can generate one for you to share.",
      "Write down any questions you want to ask the GP.",
      "If symptoms worsen, escalate to urgent care or call Healthdirect.",
    ],
    australianResources: [
      HEALTHDIRECT,
      { name: "Find a GP (Healthdirect Service Finder)", url: "https://www.healthdirect.gov.au/australian-health-services", description: "National Health Services Directory" },
      BEYOND_BLUE,
    ],
  },

  telehealth: {
    primary: "OzDoc telehealth is appropriate for this — AHPRA-registered GP in under 30 minutes",
    venue: "OzDoc telehealth (or your regular GP via telehealth)",
    instructions: [
      "Book an OzDoc telehealth consult — $59 AUD, or bulk-billed when eligible.",
      "Your OzDoc AI summary is automatically shared with the GP before the call.",
      "The GP can issue an eScript directly to your chosen pharmacy if medication is needed.",
      "If symptoms change or worsen before the consult, update OzDoc or escalate.",
    ],
    australianResources: [
      HEALTHDIRECT,
      { name: "OzDoc telehealth", url: "/telehealth", description: "AHPRA-registered GPs in under 30 minutes" },
    ],
  },

  "self-care": {
    primary: "Manage at home — see a GP if symptoms worsen or don't resolve",
    venue: "Home",
    instructions: [
      "Rest, hydrate, and monitor your symptoms.",
      "Track how symptoms change over the next 24–48 hours.",
      "Use simple over-the-counter options as advised by a pharmacist if needed.",
      "Come back to OzDoc if anything changes, gets worse, or you develop new symptoms.",
      "If symptoms persist beyond the expected timeframe, book a GP review.",
    ],
    australianResources: [
      HEALTHDIRECT,
      { name: "Healthdirect Symptom Checker", url: "https://www.healthdirect.gov.au/symptom-checker", description: "Government symptom checker" },
    ],
  },
};
