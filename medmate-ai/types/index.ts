// ──────────────────────────────────────────────────────────────
// MedMate AI — Shared TypeScript types
// ──────────────────────────────────────────────────────────────

export type TriageLevel =
  | "emergency" // Call 000
  | "urgent" // Go to ED
  | "see-gp-soon" // GP in 24-48h
  | "telehealth" // Telehealth appropriate
  | "self-care"; // Home care OK

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  userId: string | null;
  title: string;
  summary: string | null;
  triage: TriageLevel | null;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export type Sex = "female" | "male" | "intersex" | "prefer-not-to-say";

export type BloodType =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "unknown";

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface HealthProfile {
  id?: string;
  userId: string;
  fullName: string | null;
  dateOfBirth: string | null; // ISO yyyy-mm-dd
  sex: Sex | null;
  heightCm: number | null;
  weightKg: number | null;
  bloodType: BloodType | null;
  chronicConditions: string[];
  pastSurgeries: string[];
  medications: string[]; // PBS / generic names
  allergies: string[];
  medicareNumber: string | null; // encrypted at rest
  emergencyContacts: EmergencyContact[];
  consentedToTerms: boolean;
  updatedAt: string;
}

export interface SymptomCheckerInput {
  bodyArea: string;
  symptoms: string[];
  freeText: string;
  durationDays: number | null;
  severity: 1 | 2 | 3 | 4 | 5 | null;
  relevantHistory: string[];
}

export interface TelehealthBooking {
  id: string;
  userId: string | null;
  slotIso: string;
  doctorName: string;
  priceAud: number;
  bulkBilled: boolean;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}
