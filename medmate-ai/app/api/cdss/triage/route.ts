// ──────────────────────────────────────────────────────────────
// OzDoc CDSS — API route: POST /api/cdss/triage
// ──────────────────────────────────────────────────────────────
//
// Pure deterministic triage. No LLM, no database, no auth. The route
// takes a symptom checker input and returns a CDSSOutcome.
//
// This is intentionally separate from /api/chat so that the triage
// decision can be audited, tested, and run on the edge independent of
// any generative model.

import { NextRequest } from "next/server";
import { evaluate, mapSymptomsToCodes, extractSymptomCodes } from "@/lib/cdss";
import type { CDSSInput } from "@/lib/cdss";
import type { Sex } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface TriageRequestBody {
  symptoms?: string[];
  freeText?: string;
  durationDays?: number;
  severity?: number;
  bodyArea?: string;
  demographics?: {
    age?: number;
    sex?: Sex;
    isPregnant?: boolean;
  };
  chronicConditions?: string[];
  currentMedications?: string[];
  allergies?: string[];
}

export async function POST(req: NextRequest) {
  let body: TriageRequestBody;
  try {
    body = (await req.json()) as TriageRequestBody;
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  // Map free-text symptoms + free-text narrative → canonical codes
  const symptomCodes = new Set(mapSymptomsToCodes(body.symptoms ?? []));
  if (body.freeText) {
    for (const code of extractSymptomCodes(body.freeText)) {
      symptomCodes.add(code);
    }
  }

  const input: CDSSInput = {
    symptoms: Array.from(symptomCodes),
    freeText: body.freeText,
    durationDays: body.durationDays,
    severity: body.severity,
    bodyArea: body.bodyArea,
    demographics: body.demographics ?? {},
    chronicConditions: body.chronicConditions,
    currentMedications: body.currentMedications,
    allergies: body.allergies,
  };

  const outcome = evaluate(input);

  return new Response(
    JSON.stringify({
      outcome,
      debug: {
        canonicalSymptoms: input.symptoms,
      },
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    },
  );
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}
