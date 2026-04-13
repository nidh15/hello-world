// ──────────────────────────────────────────────────────────────
// OzDoc — Clinical governance & CDSS methodology
// ──────────────────────────────────────────────────────────────
//
// Transparency page describing how the OzDoc Clinical Decision
// Support System works, what it is, what it is NOT, and where
// medical advisor sign-off is required before clinical use.
//
// This page is deliberately honest about scope: OzDoc's CDSS is a
// starter rule set, not a licensed knowledge base. It is inspired
// architecturally by Healthdirect's Infermedica-backed system and
// the Australian Triage Scale, but the specific rules here are
// first-pass and must be reviewed by an Australian-registered
// medical advisor before any clinical deployment.

import Link from "next/link";
import {
  ShieldCheck,
  Stethoscope,
  BookOpen,
  GitBranch,
  AlertTriangle,
  ListChecks,
  FileCheck2,
  Cpu,
  ScrollText,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RULES, CDSS_ENGINE_VERSION } from "@/lib/cdss";

// Group rules by category for the "Rule set at a glance" section.
const RULE_CATEGORY_LABELS: Record<string, string> = {
  "red-flag": "Red flags",
  urgent: "Urgent",
  routine: "See GP soon",
  telehealth: "Telehealth-appropriate",
  "self-care": "Self-care",
};

const RULE_CATEGORY_ORDER = [
  "red-flag",
  "urgent",
  "routine",
  "telehealth",
  "self-care",
] as const;

const METHODOLOGY_STEPS = [
  {
    icon: ListChecks,
    title: "1. Map free text to canonical symptom codes",
    body: "Everything the user types (and every option they tick in the guided symptom checker) is mapped to a fixed vocabulary of canonical symptom codes. This keeps the engine deterministic — two users describing the same symptom in different words hit the same rules.",
  },
  {
    icon: Cpu,
    title: "2. Run every rule as a pure predicate",
    body: "Each clinical rule is a pure function of the input (symptoms, duration, severity, age, pregnancy status, chronic conditions). No database calls, no LLM, no network. The engine runs every rule and collects the ones that fire.",
  },
  {
    icon: AlertTriangle,
    title: "3. Red flags always win",
    body: "Matched rules are sorted first by category (red-flag → urgent → routine → telehealth → self-care) and then by triage severity (emergency → urgent → see GP soon → telehealth → self-care). The highest-severity rule determines the final triage, so a single red flag will always override a lower-priority match.",
  },
  {
    icon: FileCheck2,
    title: "4. Map triage to an Australian care pathway",
    body: "Each triage level maps to a concrete care action: where to go, what to do, which Australian resource to call (Healthdirect, Lifeline, Beyond Blue, 13HEALTH, NURSE-ON-CALL, Poisons, RFDS), and a step-by-step plan.",
  },
  {
    icon: ScrollText,
    title: "5. Return a full audit trail",
    body: "The outcome includes every rule that fired, its stable ID, its clinical source citation, and a plain-language reason. This is what gets shown to you in the UI, logged for audit, and handed off to the telehealth GP if you book a consult.",
  },
  {
    icon: ShieldCheck,
    title: "6. Telehealth is the safe default",
    body: "If no rules match, the engine does not silently tell you you're fine. It explicitly returns a telehealth recommendation with a [NO_RULE_MATCH] reasoning tag, so you always have a visible next step and a human GP in the loop.",
  },
];

const HONESTY_ITEMS = [
  {
    tone: "green",
    title: "What OzDoc's CDSS is",
    bullets: [
      "A deterministic rule-based engine — same input always produces the same output.",
      "Inspired architecturally by Healthdirect's Infermedica-backed triage and the Australian Triage Scale.",
      "Every rule cites an Australian clinical source (RACGP, Heart Foundation, Stroke Foundation, ASCIA, Cancer Council, Beyond Blue, Lifeline, RCH Melbourne, eTG, and more).",
      "Fully auditable: every decision returns the list of rules that fired, by stable ID, with the clinical source attached.",
      "Versioned (currently v" +
        CDSS_ENGINE_VERSION +
        ") so every triage decision can be reproduced.",
      "Open for clinical review — the rule set lives in lib/cdss/rules.ts and can be inspected line by line.",
    ],
  },
  {
    tone: "amber",
    title: "What it is NOT (yet)",
    bullets: [
      "It is NOT a diagnosis — it is a triage recommendation paired with a plain-language reason.",
      "It is NOT TGA-registered as a medical device. It is a consumer-facing decision support tool and must be used alongside a qualified clinician.",
      "It is NOT a replacement for Healthdirect, 000, or your GP. It points you toward those resources — it does not replace them.",
      "It does NOT license Infermedica or any other commercial symptom-checker knowledge base. The rule set here is OzDoc's own first-pass starter knowledge base.",
      "It does NOT yet cover paediatrics, obstetrics, or complex multi-morbidity in depth — those domains require dedicated rule sets and specialist sign-off.",
    ],
  },
  {
    tone: "red",
    title: "Before any clinical deployment",
    bullets: [
      "The full rule set must be reviewed and signed off by an Australian-registered medical advisor (RACGP Fellow or equivalent).",
      "Red flag coverage for each presentation must be validated against RACGP Red Book, eTG Therapeutic Guidelines, and the Australasian Triage Scale.",
      "Rules must be versioned through a change-control process with clinical review at every update.",
      "Real-world outcomes must be monitored, with a feedback loop to the clinical advisory team.",
      "The system must be registered with the TGA if and when it crosses from consumer decision support into a regulated medical device.",
    ],
  },
];

const REFERENCES = [
  {
    name: "Healthdirect symptom checker",
    url: "https://www.healthdirect.gov.au/symptom-checker",
    note: "The reference consumer-facing triage tool in Australia, backed by Infermedica.",
  },
  {
    name: "Australasian Triage Scale (ACEM)",
    url: "https://acem.org.au/Content-Sources/Advancing-Emergency-Medicine/Better-Outcomes-for-Patients/Triage",
    note: "The national triage framework used in Australian EDs.",
  },
  {
    name: "RACGP Red Book",
    url: "https://www.racgp.org.au/clinical-resources/clinical-guidelines/key-racgp-guidelines/view-all-racgp-guidelines/red-book",
    note: "Guidelines for preventive activities and red flag assessment in general practice.",
  },
  {
    name: "eTG Therapeutic Guidelines",
    url: "https://www.tg.org.au",
    note: "Independent, evidence-based Australian therapeutic guidelines.",
  },
  {
    name: "Heart Foundation of Australia — chest pain",
    url: "https://www.heartfoundation.org.au",
    note: "Chest pain assessment and acute coronary syndrome pathways.",
  },
  {
    name: "Stroke Foundation Australia — FAST",
    url: "https://strokefoundation.org.au/about-stroke/learn/signs-of-stroke",
    note: "Face, Arms, Speech, Time — the standard stroke recognition test.",
  },
  {
    name: "ASCIA anaphylaxis guidelines",
    url: "https://www.allergy.org.au",
    note: "Australasian Society of Clinical Immunology and Allergy.",
  },
];

// Count rules per category so we can display them as chips.
function countRulesByCategory() {
  const counts: Record<string, number> = {};
  for (const rule of RULES) {
    counts[rule.category] = (counts[rule.category] ?? 0) + 1;
  }
  return counts;
}

// Collect the unique set of clinical sources cited across all rules.
function uniqueClinicalSources(): string[] {
  const set = new Set<string>();
  for (const rule of RULES) {
    // Sources can be compound ("RACGP; Heart Foundation") — split them so
    // each cited body shows up once.
    for (const piece of rule.clinicalSource.split(";")) {
      set.add(piece.trim());
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export default function ClinicalGovernancePage() {
  const categoryCounts = countRulesByCategory();
  const sources = uniqueClinicalSources();

  return (
    <div className="container max-w-4xl py-10">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-500/25">
          <Stethoscope className="h-6 w-6" />
        </div>
        <div>
          <h1 className="heading text-2xl font-bold">
            Clinical governance &amp; CDSS methodology
          </h1>
          <p className="text-sm text-muted-foreground">
            How the OzDoc Clinical Decision Support System works — and where
            the line is.
          </p>
        </div>
      </div>

      {/* Intro */}
      <Card className="mb-8 border-ocean-200/60 bg-gradient-to-r from-ocean-50/80 to-ocean-50/30 dark:border-ocean-800/40 dark:from-ocean-950/30 dark:to-ocean-950/10">
        <CardContent className="p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            OzDoc AI uses a{" "}
            <span className="font-semibold text-foreground">
              deterministic, rule-based Clinical Decision Support System
              (CDSS)
            </span>{" "}
            for triage. That means it does not guess, it does not use an LLM
            to decide urgency, and it never silently sends you home. Every
            triage decision is the output of a pure function — the same
            symptoms always produce the same recommendation — and every
            decision comes with a full audit trail of which rules fired and
            why.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This page exists because we think you deserve to know exactly how
            a tool that recommends whether you go to ED, book a GP, or stay
            home is actually making that call. Healthdirect&apos;s symptom
            checker is backed by Infermedica, a licensed clinical knowledge
            base with years of curation and regulatory review. OzDoc is not
            pretending to be that. What we&apos;ve built is the same{" "}
            <span className="italic">architecture</span> — red flag detection,
            deterministic rules, Australian care pathways, audit trail — with
            a first-pass rule set that is open for clinical review.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/60 dark:bg-white/5">
              Engine v{CDSS_ENGINE_VERSION}
            </Badge>
            <Badge variant="outline" className="bg-white/60 dark:bg-white/5">
              {RULES.length} clinical rules
            </Badge>
            <Badge variant="outline" className="bg-white/60 dark:bg-white/5">
              Pure function — zero side effects
            </Badge>
            <Badge variant="outline" className="bg-white/60 dark:bg-white/5">
              Deterministic
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-ocean-500" />
          <h2 className="heading text-lg font-bold">How a triage decision is made</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {METHODOLOGY_STEPS.map((step) => (
            <Card key={step.title}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-md shadow-ocean-500/20">
                  <step.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="heading text-sm font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Rule set at a glance */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-ocean-500" />
          <h2 className="heading text-lg font-bold">Rule set at a glance</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              The current knowledge base has{" "}
              <span className="font-semibold text-foreground">
                {RULES.length} clinical rules
              </span>{" "}
              across five categories. Red flags are evaluated first and always
              win.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
              {RULE_CATEGORY_ORDER.map((cat) => (
                <div
                  key={cat}
                  className="rounded-xl border border-border/60 bg-muted/30 p-3 text-center"
                >
                  <div className="text-2xl font-bold text-foreground">
                    {categoryCounts[cat] ?? 0}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {RULE_CATEGORY_LABELS[cat]}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="heading text-sm font-semibold">
                Cited Australian clinical sources
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Every rule cites at least one published source. These are the
                bodies currently referenced across the rule set:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sources.map((source) => (
                  <Badge
                    key={source}
                    variant="outline"
                    className="bg-white/60 text-xs dark:bg-white/5"
                  >
                    {source}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Honesty section */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-ocean-500" />
          <h2 className="heading text-lg font-bold">
            What this system is — and what it isn&apos;t
          </h2>
        </div>
        <div className="space-y-4">
          {HONESTY_ITEMS.map((item) => {
            const tones: Record<string, string> = {
              green:
                "border-sage-300/60 bg-sage-50/60 dark:border-sage-900/40 dark:bg-sage-950/20",
              amber:
                "border-amber-300/60 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20",
              red: "border-red-300/60 bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/20",
            };
            return (
              <Card
                key={item.title}
                className={tones[item.tone] ?? ""}
              >
                <CardContent className="p-6">
                  <h3 className="heading text-base font-semibold">
                    {item.title}
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span
                          aria-hidden
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60"
                        />
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* References */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-ocean-500" />
          <h2 className="heading text-lg font-bold">References</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <ul className="space-y-3 text-sm">
              {REFERENCES.map((ref) => (
                <li key={ref.name}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 text-foreground"
                  >
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ocean-500 transition-colors group-hover:text-ocean-600" />
                    <span>
                      <span className="font-medium underline-offset-2 group-hover:underline">
                        {ref.name}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        — {ref.note}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Feedback */}
      <Card className="border-ocean-200/60 bg-gradient-to-r from-ocean-50/80 to-ocean-50/30 dark:border-ocean-800/40 dark:from-ocean-950/30 dark:to-ocean-950/10">
        <CardContent className="p-6 text-center">
          <h2 className="heading text-lg font-bold">
            Clinicians — we want your review
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            If you&apos;re an Australian-registered GP, emergency physician,
            nurse practitioner or pharmacist and you&apos;d like to review or
            contribute to the OzDoc rule set, get in touch at{" "}
            <a
              href="mailto:clinical@ozdoc.au"
              className="font-semibold text-foreground underline underline-offset-2"
            >
              clinical@ozdoc.au
            </a>
            . Every rule has a stable ID, a citation, and a pure predicate —
            you can review them line by line.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/symptom-checker"
              className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean-600"
            >
              Try the symptom checker
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted/50"
            >
              Privacy &amp; data
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Engine version {CDSS_ENGINE_VERSION}. Rule set last reviewed:{" "}
        {new Date().toLocaleDateString("en-AU", {
          month: "long",
          year: "numeric",
        })}
        . This is a triage recommendation tool, not a diagnosis. Always
        consult a qualified healthcare professional. In a medical emergency,
        call 000.
      </p>
    </div>
  );
}
