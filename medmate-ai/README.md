# OzDoc AI

> Your AI health companion, built for Australia.

OzDoc AI is an Australian-first conversational AI health assistant that takes
you from "I don't feel well" to "medication in hand" without a single waiting
room. Free 24/7 AI triage, AHPRA-registered GPs in under 30 minutes for $59,
eScripts straight to your pharmacy, and monthly AI check-ins for chronic
conditions — all built around Medicare, the PBS, and how Australian healthcare
actually works.

This repo contains the full-stack Next.js application.

> **OzDoc AI is not a doctor and does not provide medical advice.** Always
> consult a qualified healthcare professional. In a medical emergency, call
> **000** immediately.

---

## Features

### For individuals

- **Structured clinical questioning** — OzDoc asks the right clarifying
  questions across 2–4 turns using the SOCRATES framework (site, onset,
  character, radiation, associated symptoms, timing, triggers, severity) —
  the way a good GP actually takes a history.
- **AI triage** — streaming conversations with an Australian-context health
  assistant powered by Claude. Clear triage recommendations every time:
  call 000, ED, see GP, book telehealth, or self-care.
- **Telehealth with AHPRA-registered GPs in <30 minutes** — book an Australian
  GP for $59 AUD (or bulk-billed when eligible).
- **AI consultation notes sent to your GP** — before your telehealth call,
  your GP gets an AI-generated summary of your symptoms, history, and key
  questions so the consult starts at minute one.
- **eScripts to any Australian pharmacy** — if you need medication, your GP
  sends an electronic prescription straight to your chosen pharmacy. PBS
  pricing where eligible.
- **Chronic care plans** — ongoing management for diabetes, asthma,
  hypertension, COPD, cardiovascular, kidney disease, and mental health.
  Monthly AI check-ins track progress and flag changes to your GP.
- **Health profile** — save conditions, medications, allergies once;
  auto-injected into every chat context.
- **Symptom checker** — guided, step-by-step symptom intake that feeds into
  the chat.
- **Consultation history** — searchable past chats with AI-generated
  summaries and plain-text export for sharing with your real GP.
- **My Health Record pathway** — opt-in integration to bring your national
  health record data into the assistant for more personalised guidance.

### Australian-first context

OzDoc understands Medicare, the PBS, and the way Australian care is actually
delivered — not a US product bolted on to our system:

- GP referral pathways to specialists
- Mental Health Care Plans (10 Medicare-subsidised sessions)
- Chronic Disease Management Plans (GPMP + TCA — 5 allied health visits/year)
- Medicare item 715 — Aboriginal and Torres Strait Islander health assessment
- PBS medication names (not US brand names)
- Bulk-billing and out-of-pocket cost guidance
- Healthdirect (1800 022 222), 13HEALTH, NURSE-ON-CALL and RFDS
- PATS (Patient Assistance Transport Scheme) for rural and remote travel
- Aboriginal Community Controlled Health Services (ACCHS)

### Privacy-first

- **Your data stays in Australia.** All data stored on Australian servers,
  encrypted at rest and in transit.
- **Never used to train AI.** Your conversations are never used to improve
  models — yours or anyone else's.
- **Delete anytime.** No 30-day grace period, no hidden backups. You own
  your data.
- **AHPRA-verified GPs only.** All telehealth practitioners are verified
  against the public AHPRA register.
- **Compliance.** Aligned with the Australian Privacy Act 1988, the 13
  Australian Privacy Principles (APPs), and the My Health Records Act 2012.

### For business (OzDoc for Business)

- **API access** — Australian-context clinical triage as a service.
- **White-label** — a fully branded AI health assistant for your members.
- **Chronic care at scale** — population health with monthly AI check-ins.
- **Use cases** — insurers, health systems, employers, pharmacies.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**-style components with a warm editorial
  design system (ocean/coral/sage/cream palette, Fraunces + DM Sans)
- **Anthropic Claude** API (`claude-sonnet-4-20250514`) with streaming
- **Supabase** — Postgres, Auth, Row Level Security
- **Docker** — production Dockerfile + compose

## Getting started

### 1. Install dependencies

```bash
cd medmate-ai
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Then fill in:

- `ANTHROPIC_API_KEY` — get one at <https://console.anthropic.com>
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from your
  Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` — for server-side admin operations (optional)

### 3. Set up the database

Create a Supabase project at <https://supabase.com>, then run the schema in
the SQL editor:

```bash
# Or paste the contents into the Supabase SQL editor
cat supabase/schema.sql
```

This creates:

- `health_profiles` — one row per user (with location, Indigenous, and
  rural/remote fields)
- `consultations` — saved chat sessions with AI-generated summaries
- `telehealth_bookings` — GP booking records with consultation summary
  handoff
- `escripts` — electronic prescriptions
- `chronic_care_plans` — ongoing chronic condition management
- Row Level Security policies for owner-only access on every table

### 4. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

> The chat page works without Supabase (no login required to chat). Profile,
> history, eScripts, and chronic care require Supabase to be configured.

## Scripts

| Command              | Description                 |
| -------------------- | --------------------------- |
| `npm run dev`        | Start the dev server (3000) |
| `npm run build`      | Production build            |
| `npm run start`      | Run the production build    |
| `npm run lint`       | ESLint                      |
| `npm run type-check` | TypeScript check            |

## Docker

```bash
docker compose up --build
```

The app will be available at <http://localhost:3000>. Make sure `.env.local`
exists and contains at least `ANTHROPIC_API_KEY`.

## Project structure

```
medmate-ai/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout (nav, footer, disclaimer)
│   ├── chat/                    # AI chat interface
│   ├── symptom-checker/         # Guided symptom flow
│   ├── profile/                 # Health profile
│   ├── history/                 # Consultation history
│   ├── telehealth/              # Telehealth booking ($59, <30 min)
│   ├── escripts/                # eScripts and pharmacy selection
│   ├── chronic-care/            # Chronic care plans
│   ├── my-health-record/        # My Health Record integration
│   ├── privacy/                 # Privacy & data security
│   ├── enterprise/              # OzDoc for Business
│   ├── auth/                    # Login / signup
│   └── api/
│       ├── chat/route.ts        # Claude streaming endpoint
│       ├── consultations/route.ts
│       └── profile/route.ts
├── components/
│   ├── chat/                    # Chat UI
│   ├── layout/                  # Nav, footer, disclaimer banner
│   └── ui/                      # shadcn-style primitives
├── lib/
│   ├── claude.ts                # Claude client + streaming
│   ├── prompts.ts               # System prompts (SOCRATES, summary, chronic)
│   ├── supabase.ts              # Supabase clients (browser/server/admin)
│   └── utils.ts                 # cn, formatDate, helpers
├── supabase/
│   └── schema.sql               # Database schema + RLS policies
├── types/
│   └── index.ts                 # Shared TS types
├── Dockerfile
├── docker-compose.yml
└── .env.local.example
```

## AI system prompts

The system prompts that define OzDoc's behaviour live in
[`lib/prompts.ts`](./lib/prompts.ts):

- `OZDOC_SYSTEM_PROMPT` — structured clinical questioning (SOCRATES),
  Australian context, Indigenous and rural/remote awareness, triage
  pathways, safety rules.
- `SUMMARY_PROMPT` — structured handoff summary generated before a
  telehealth GP call (presenting complaint, history, meds, allergies,
  assessment, next step).
- `SYMPTOM_CHECKER_PROMPT` — follow-up to the guided symptom intake.
- `CHRONIC_CHECKIN_PROMPT` — monthly check-in for chronic care plans.

When a user has a saved health profile, it's injected into the system prompt
so responses are personalised without the user having to repeat their history.

## Safety & disclaimers

OzDoc AI is **not** a substitute for a real doctor. It shows persistent
disclaimers:

- A banner at the top of every page with the **000** emergency number.
- A disclaimer in the footer of every page.
- A checkbox on signup requiring acceptance of Terms of Service.
- Clear guidance from the AI to see a real clinician for any concerning
  symptoms.
- Mental health crises always routed to Lifeline (13 11 14), Beyond Blue
  (1300 22 4636) and 000.

## Australian resources

- **Emergency:** 000
- **Healthdirect:** 1800 022 222 (24/7 national health advice)
- **Lifeline:** 13 11 14 (24/7 crisis support)
- **Beyond Blue:** 1300 22 4636 (mental health support)
- **13HEALTH (QLD):** 13 43 25 84
- **NURSE-ON-CALL (VIC):** 1300 60 60 24
- **Poisons Information Centre:** 13 11 26
- **RFDS:** <https://www.flyingdoctor.org.au>
- **My Health Record:** <https://www.myhealthrecord.gov.au>

## License

Copyright &copy; OzDoc AI. All rights reserved.
