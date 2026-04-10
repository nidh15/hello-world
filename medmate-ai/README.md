# MedMate AI

> Your personal AI doctor, built for Australia.

MedMate AI is a free, private, conversational AI health assistant for
Australians. It's built around Medicare, the PBS, and how Australian healthcare
actually works — so when you ask about symptoms, you get clear guidance in the
form of real Australian care pathways (see your GP in 24–48 hours, book a
telehealth consult, call 000, etc.).

This repo contains the full-stack Next.js application.

> **MedMate AI is not a doctor and does not provide medical advice.** Always
> consult a qualified healthcare professional. In a medical emergency, call
> **000** immediately.

---

## Features

- **AI Chat** — streaming conversations with an Australian-aware health
  assistant powered by Claude.
- **Symptom Checker** — guided, step-by-step symptom intake that feeds into
  the chat.
- **Health Profile** — save conditions, medications, allergies once;
  auto-injected into every chat context.
- **Telehealth Booking** — placeholder flow to book a telehealth consult with
  an Australian GP.
- **Consultation History** — searchable past chats, with AI-generated
  summaries and plain-text export for sharing with your real GP.
- **Auth** — Supabase email + Google OAuth.
- **Privacy-first** — encrypted in transit, stored in your own Supabase
  instance, never used to train models.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**-style components
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

- `health_profiles` — one row per user
- `consultations` — saved chat sessions with AI-generated summaries
- `telehealth_bookings` — placeholder booking records
- Row Level Security policies for owner-only access

### 4. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

> The chat page works without Supabase (no login required to chat). Profile
> and history require Supabase to be configured.

## Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `npm run dev`      | Start the dev server (3000)  |
| `npm run build`    | Production build             |
| `npm run start`    | Run the production build     |
| `npm run lint`     | ESLint                       |
| `npm run type-check` | TypeScript check           |

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
│   ├── telehealth/              # Telehealth booking (placeholder)
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
│   ├── prompts.ts               # System prompts
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

## AI system prompt

The system prompt that defines MedMate's behaviour lives in
[`lib/prompts.ts`](./lib/prompts.ts). It encodes Australian context, triage
pathways, conversation style, and safety rules (always recommend calling 000
for emergencies, always point mental health crises to Lifeline / Beyond Blue /
000, and never diagnose).

When a user has a saved health profile, it's injected into the system prompt
so responses are personalised without the user having to repeat their history.

## Safety & disclaimers

MedMate AI is **not** a substitute for a real doctor. It shows persistent
disclaimers:

- A banner at the top of every page with the **000** emergency number.
- A disclaimer in the footer of every page.
- A checkbox on signup requiring acceptance of Terms of Service.
- Clear guidance from the AI to see a real clinician for any concerning
  symptoms.

## Australian resources

- **Emergency:** 000
- **Healthdirect:** 1800 022 222 (24/7 national health advice)
- **Lifeline:** 13 11 14 (24/7 crisis support)
- **Beyond Blue:** 1300 22 4636 (mental health support)
- **13HEALTH (QLD):** 13 43 25 84
- **RFDS:** <https://www.flyingdoctor.org.au>

## License

Copyright &copy; MedMate AI. All rights reserved.
