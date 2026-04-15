// ──────────────────────────────────────────────────────────────
// OzDoc — Clinical Advisory Panel (seat placeholders)
// ──────────────────────────────────────────────────────────────
//
// This page lists the seats on the OzDoc Clinical Advisory Panel.
// Every seat currently shows "Open — pending appointment" because
// the clinical panel has not yet been filled. This is deliberate
// and honest: OzDoc is pre-clinical until these seats are named.
//
// When real clinicians are onboarded, their names, registration
// numbers, and signed scope-of-practice should be added to the
// SEATS array below.

import Link from "next/link";
import {
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Brain,
  Baby,
  Pill,
  AlertTriangle,
  Users,
  Scale,
  FileCheck2,
  ArrowLeft,
  Mail,
  GitCommitHorizontal,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ──────────────────────────────────────────────────────────────
// Panel seat definitions
// ──────────────────────────────────────────────────────────────
//
// Status can be:
//   "open"     — seat is vacant and actively recruited for
//   "in-review" — candidate under assessment
//   "filled"   — seat is filled; populate appointee fields
//
// When filling a seat, add:
//   appointee: { name, title, ahpraNumber, appointedAt, bio }

type SeatStatus = "open" | "in-review" | "filled";

interface Seat {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  status: SeatStatus;
  responsibilities: string[];
  requirements: string[];
  scopeOfReview: string;
  appointee?: {
    name: string;
    title: string;
    ahpraNumber: string;
    appointedAt: string;
    bio: string;
  };
}

const SEATS: Seat[] = [
  {
    id: "cmo",
    title: "Chief Medical Officer",
    icon: Stethoscope,
    status: "open",
    responsibilities: [
      "Overall clinical safety and accountability for OzDoc AU Pty Ltd.",
      "Sign off every version of the CDSS rule set before release.",
      "Chair the Clinical Incident Response process.",
      "Report to the board on clinical quality, safety events, and KPIs.",
    ],
    requirements: [
      "RACGP Fellow or equivalent specialist registration.",
      "Minimum 10 years post-fellowship clinical experience.",
      "Prior experience in digital health, telehealth, or clinical governance.",
      "Current AHPRA general registration with no conditions.",
    ],
    scopeOfReview:
      "Final sign-off on every rule set release, care pathway, and escalation protocol.",
  },
  {
    id: "em",
    title: "Emergency Medicine Advisor",
    icon: AlertTriangle,
    status: "open",
    responsibilities: [
      "Review red-flag rules against the Australasian Triage Scale.",
      "Validate all emergency-triage escalations (chest pain, stroke, anaphylaxis, sepsis, severe bleeding).",
      "Advise on when OzDoc should recommend ambulance vs. self-presentation.",
    ],
    requirements: [
      "FACEM (Fellow of the Australasian College for Emergency Medicine).",
      "Current practice in an Australian Emergency Department.",
      "AHPRA specialist registration in emergency medicine.",
    ],
    scopeOfReview:
      "All rules in the red-flag category, ambulance criteria, and ED escalation pathways.",
  },
  {
    id: "gp",
    title: "General Practice Advisor",
    icon: HeartPulse,
    status: "open",
    responsibilities: [
      "Review routine and telehealth-appropriate rules against the RACGP Red Book.",
      "Advise on the GP handoff workflow and consult summary format.",
      "Ensure CDSS output is useful at the point of consult.",
    ],
    requirements: [
      "RACGP Fellow with active general practice.",
      "Current AHPRA general or specialist registration.",
      "Telehealth experience preferred.",
    ],
    scopeOfReview:
      "All rules in the routine and telehealth categories, plus the GP-facing consult summary.",
  },
  {
    id: "mental-health",
    title: "Mental Health Advisor",
    icon: Brain,
    status: "open",
    responsibilities: [
      "Review all mental-health rules, especially suicide-risk red flags.",
      "Validate crisis escalation pathways (Lifeline, Beyond Blue, Kids Helpline).",
      "Advise on trauma-informed language and safeguarding.",
    ],
    requirements: [
      "FRANZCP (psychiatry) or AHPRA-registered clinical psychologist with suicide-risk assessment experience.",
      "Ongoing clinical practice in mental health.",
      "Familiarity with Australian crisis services.",
    ],
    scopeOfReview:
      "All mental-health rules, suicide-risk protocols, and crisis hotline integration.",
  },
  {
    id: "paeds",
    title: "Paediatrics Advisor",
    icon: Baby,
    status: "open",
    responsibilities: [
      "Review paediatric red flags (fever in infants, dehydration, non-blanching rash, respiratory distress).",
      "Advise on age-based triage thresholds.",
      "Validate escalation to RCH Melbourne / state children's hospitals.",
    ],
    requirements: [
      "FRACP (paediatrics) or RACGP Fellow with significant paediatric scope.",
      "Current practice in paediatric care.",
    ],
    scopeOfReview:
      "All paediatric-specific rules, age-based cutoffs, and RCH Melbourne guideline alignment.",
  },
  {
    id: "pharmacy",
    title: "Clinical Pharmacist",
    icon: Pill,
    status: "open",
    responsibilities: [
      "Review medication-related guidance (OTC advice, interaction warnings).",
      "Advise on PBS-aligned generic naming in CDSS output.",
      "Review the eScript issuance workflow once telehealth goes live.",
    ],
    requirements: [
      "AHPRA-registered pharmacist with clinical or hospital pharmacy experience.",
      "Familiarity with the PBS, eRx Script Exchange, and MediSecure.",
    ],
    scopeOfReview:
      "Medication rules, interaction warnings, and the ePrescribing pipeline.",
  },
  {
    id: "privacy",
    title: "Privacy Officer",
    icon: Lock,
    status: "open",
    responsibilities: [
      "Accountable for Privacy Act 1988 and the 13 APPs.",
      "OAIC point of contact for Notifiable Data Breach events.",
      "Advises on My Health Records Act 2012 obligations.",
      "Reviews data-handling changes before release.",
    ],
    requirements: [
      "IAPP certification (CIPP/E or CIPM) or equivalent privacy qualification.",
      "Experience with Australian health privacy law.",
      "Reports independently of the CMO to the board.",
    ],
    scopeOfReview:
      "All data flows, third-party data processors, breach response runbook, and privacy policy.",
  },
  {
    id: "consumer",
    title: "Consumer Representative",
    icon: Users,
    status: "open",
    responsibilities: [
      "Represents the lived-experience perspective on the panel.",
      "Reviews UX copy for clarity, tone, and accessibility.",
      "Advises on how triage recommendations land with patients.",
    ],
    requirements: [
      "Lived experience with the Australian health system — patient advocate, carer, or peer-support worker.",
      "No clinical qualification required. Independence from OzDoc's commercial operations is required.",
    ],
    scopeOfReview:
      "All user-facing copy, onboarding flow, and triage messaging.",
  },
];

// ──────────────────────────────────────────────────────────────
// How rules get reviewed
// ──────────────────────────────────────────────────────────────

const REVIEW_PROCESS = [
  {
    icon: GitCommitHorizontal,
    title: "1. Proposal",
    body: "Any rule addition, removal, or edit is opened as a pull request against lib/cdss/rules.ts with a clinical rationale, at least one Australian source citation, and expected triage outcomes.",
  },
  {
    icon: FileCheck2,
    title: "2. Category-owner review",
    body: "The advisor responsible for the rule's category (emergency medicine for red flags, GP for routine, etc.) reviews the predicate, the cited source, and the triage mapping.",
  },
  {
    icon: ShieldCheck,
    title: "3. Unit test coverage",
    body: "Every new or changed rule must have a corresponding test case in tests/cdss.test.ts. CI blocks merge if tests fail or coverage drops.",
  },
  {
    icon: Stethoscope,
    title: "4. CMO sign-off",
    body: "The Chief Medical Officer signs off the rule set version before a production release. Sign-off is recorded against the engine version string (currently v0.1.0).",
  },
  {
    icon: Scale,
    title: "5. Post-deployment monitoring",
    body: "Triage outputs are monitored for drift and feedback loops to the advisory panel. Any clinical incident triggers an immediate review and, if needed, a hotfix release.",
  },
];

// ──────────────────────────────────────────────────────────────
// Status badge
// ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SeatStatus }) {
  if (status === "filled") {
    return (
      <Badge className="bg-sage-100 text-sage-800 dark:bg-sage-900/40 dark:text-sage-200">
        Filled
      </Badge>
    );
  }
  if (status === "in-review") {
    return (
      <Badge className="bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
        Candidate in review
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-coral-300 text-coral-700 dark:border-coral-800 dark:text-coral-300"
    >
      Open — recruiting
    </Badge>
  );
}

// ──────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────

export const metadata = {
  title: "Clinical Advisory Panel",
  description:
    "The seats on the OzDoc Clinical Advisory Panel, their responsibilities, and how clinical rules get reviewed before release.",
};

export default function AdvisoryPanelPage() {
  const openCount = SEATS.filter((s) => s.status === "open").length;
  const filledCount = SEATS.filter((s) => s.status === "filled").length;

  return (
    <div className="container max-w-4xl py-10">
      {/* Back link */}
      <Link
        href="/clinical-governance"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to clinical governance
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-500/25">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="heading text-2xl font-bold">
            Clinical Advisory Panel
          </h1>
          <p className="text-sm text-muted-foreground">
            Who reviews OzDoc&apos;s clinical rules — and the seats that need
            to be filled before launch.
          </p>
        </div>
      </div>

      {/* Honest-status card */}
      <Card className="mb-8 border-amber-300/60 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <h2 className="heading text-base font-semibold">
                OzDoc is pre-clinical until this panel is filled
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                OzDoc&apos;s CDSS rule set has been drafted from public Australian
                clinical guidelines (RACGP, Heart Foundation, Stroke Foundation,
                ASCIA, eTG, RCH Melbourne, Beyond Blue, Lifeline), but it has
                not yet been reviewed or signed off by a named
                AHPRA-registered clinician. Until the Chief Medical Officer
                seat and the category-specific advisor seats below are filled
                and the rule set is formally signed off, OzDoc must not be
                positioned as a clinical triage tool, only as a consumer
                information aid. This page is the public record of who is
                accountable for what, and where we are on the way to launch.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-white/60 dark:bg-white/5">
                  {filledCount} filled
                </Badge>
                <Badge variant="outline" className="bg-white/60 dark:bg-white/5">
                  {openCount} open
                </Badge>
                <Badge variant="outline" className="bg-white/60 dark:bg-white/5">
                  {SEATS.length} total seats
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat grid */}
      <section className="mb-10">
        <h2 className="heading mb-4 text-lg font-bold">Panel seats</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SEATS.map((seat) => {
            const Icon = seat.icon;
            return (
              <Card key={seat.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="heading text-sm font-semibold">
                        {seat.title}
                      </h3>
                    </div>
                    <StatusBadge status={seat.status} />
                  </div>

                  {seat.appointee ? (
                    <div className="mt-4 rounded-xl border border-sage-300/60 bg-sage-50/40 p-3 dark:border-sage-900/40 dark:bg-sage-950/20">
                      <p className="text-sm font-semibold">
                        {seat.appointee.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {seat.appointee.title} · AHPRA{" "}
                        {seat.appointee.ahpraNumber}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {seat.appointee.bio}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs italic text-muted-foreground">
                      This seat is currently unfilled. No named clinician has
                      accepted responsibility for this scope.
                    </p>
                  )}

                  <div className="mt-4">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Responsibilities
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                      {seat.responsibilities.map((r) => (
                        <li key={r} className="flex gap-1.5">
                          <span
                            aria-hidden
                            className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-60"
                          />
                          <span className="leading-relaxed">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Requirements
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                      {seat.requirements.map((r) => (
                        <li key={r} className="flex gap-1.5">
                          <span
                            aria-hidden
                            className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-60"
                          />
                          <span className="leading-relaxed">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-2.5">
                    <p className="text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Scope of review:
                      </span>{" "}
                      {seat.scopeOfReview}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Review process */}
      <section className="mb-10">
        <h2 className="heading mb-4 text-lg font-bold">
          How a clinical rule gets reviewed
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {REVIEW_PROCESS.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title}>
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ocean-100 text-ocean-700 dark:bg-ocean-900/40 dark:text-ocean-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="heading text-sm font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <Card className="border-ocean-200/60 bg-gradient-to-r from-ocean-50/80 to-ocean-50/30 dark:border-ocean-800/40 dark:from-ocean-950/30 dark:to-ocean-950/10">
        <CardContent className="p-6 text-center">
          <h2 className="heading text-lg font-bold">
            Apply to a seat
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            If you&apos;re an Australian-registered clinician, privacy officer
            or consumer advocate who wants to review OzDoc&apos;s rule set
            before launch, we want to hear from you. Please include your
            AHPRA registration number (for clinical seats) and the seat you
            are interested in.
          </p>
          <a
            href="mailto:clinical@ozdoc.au?subject=Clinical%20Advisory%20Panel%20application"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-ocean-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean-600"
          >
            <Mail className="h-4 w-4" />
            clinical@ozdoc.au
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
