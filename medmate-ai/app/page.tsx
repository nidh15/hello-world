import Link from "next/link";
import {
  MessageSquareHeart,
  Shield,
  Video,
  Sparkles,
  HeartPulse,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Pill,
  FileText,
  Building2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: MessageSquareHeart,
    title: "Structured clinical questioning",
    body: "OzDoc asks the right clarifying questions across multiple turns — site, onset, severity, triggers — the way a good GP actually takes a history.",
    accent: "from-ocean-400 to-ocean-600",
  },
  {
    icon: Video,
    title: "AHPRA-registered GPs in under 30 minutes",
    body: "Need a real doctor? Book a telehealth consult with an Australian GP for $59 (or bulk-billed when eligible). No waiting room.",
    accent: "from-coral-400 to-coral-600",
    href: "/telehealth",
  },
  {
    icon: FileText,
    title: "AI consultation notes sent to your GP",
    body: "Before your telehealth call, your GP gets an AI-generated summary of your symptoms, history and questions — so the consult starts at minute one.",
    accent: "from-ocean-300 to-ocean-500",
  },
  {
    icon: Pill,
    title: "eScripts to your nearest pharmacy",
    body: "If you need medication, your GP sends an electronic prescription straight to any pharmacy in Australia. PBS pricing where eligible.",
    accent: "from-sage-400 to-sage-600",
    href: "/escripts",
  },
  {
    icon: HeartPulse,
    title: "Chronic care, month after month",
    body: "Diabetes, asthma, blood pressure, COPD, mental health — OzDoc checks in monthly, tracks changes, and flags anything that needs your GP.",
    accent: "from-coral-500 to-coral-700",
    href: "/chronic-care",
  },
  {
    icon: Shield,
    title: "Private by design. Australian-hosted.",
    body: "Your data stays in Australia. Encrypted end-to-end. Never sold. Never used to train AI. Delete it all at any time.",
    accent: "from-sage-500 to-sage-700",
    href: "/privacy",
  },
];

const howItWorks = [
  {
    num: 1,
    icon: MessageSquareHeart,
    title: "Chat with OzDoc",
    body: "Describe what's going on. OzDoc asks structured clinical questions and gives you a clear triage recommendation.",
  },
  {
    num: 2,
    icon: FileText,
    title: "Get a summary",
    body: "OzDoc writes up your symptoms, history, and key questions — ready to share with your GP.",
  },
  {
    num: 3,
    icon: Video,
    title: "See a GP in <30 minutes",
    body: "If you need a doctor, book a telehealth consult for $59. The GP reviews your OzDoc summary before the call.",
  },
  {
    num: 4,
    icon: Pill,
    title: "eScript to your pharmacy",
    body: "If you need medication, the GP sends an eScript straight to your chosen pharmacy. Pick it up and go.",
  },
];

const pathways = [
  {
    label: "Call 000 now",
    tone: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/40",
  },
  {
    label: "Emergency Department",
    tone: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900/40",
  },
  {
    label: "See your GP in 24\u201348h",
    tone: "bg-coral-50 text-coral-800 border-coral-200 dark:bg-coral-900/30 dark:text-coral-300 dark:border-coral-900/40",
  },
  {
    label: "Book telehealth",
    tone: "bg-ocean-50 text-ocean-700 border-ocean-200 dark:bg-ocean-950/30 dark:text-ocean-300 dark:border-ocean-900/40",
  },
  {
    label: "Manage at home",
    tone: "bg-sage-50 text-sage-700 border-sage-200 dark:bg-sage-900/30 dark:text-sage-300 dark:border-sage-900/40",
  },
];

const testimonials = [
  {
    quote:
      "I was worried about a headache that wouldn\u2019t shift. OzDoc asked good questions, flagged red flags to watch for, and told me to book a GP that week. Felt like a triage nurse on my phone.",
    name: "Steph",
    location: "Brunswick, VIC",
    stars: 5,
  },
  {
    quote:
      "Living four hours from the nearest town, I use it to figure out whether something can wait for the next clinic day or if I need to call the RFDS. It actually understands remote care.",
    name: "Dan",
    location: "Birdsville, QLD",
    stars: 5,
  },
  {
    quote:
      "Love that it knew to talk about Mental Health Care Plans and the 10 Medicare sessions. Most apps pretend Australia doesn\u2019t exist.",
    name: "Priya",
    location: "Parramatta, NSW",
    stars: 5,
  },
];

const stats = [
  { value: "24/7", label: "AI triage around the clock" },
  { value: "<30 min", label: "To a real AHPRA GP" },
  { value: "$59", label: "Telehealth (or bulk-billed)" },
  { value: "AU", label: "Data stays in Australia" },
];

export default function HomePage() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 -z-10 mesh-gradient" />

        {/* Organic blob shapes */}
        <div className="absolute -right-40 -top-40 -z-10 h-80 w-80 blob bg-ocean-200/30 blur-3xl dark:bg-ocean-800/20" />
        <div className="absolute -left-32 top-1/2 -z-10 h-64 w-64 blob bg-coral-200/20 blur-3xl dark:bg-coral-800/10" aria-hidden />
        <div className="absolute bottom-0 right-1/4 -z-10 h-48 w-48 blob bg-sage-200/20 blur-3xl dark:bg-sage-800/10" aria-hidden />

        <div className="container py-24 md:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 animate-fade-in px-4 py-1.5 text-xs"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-coral-500" />
              AI triage &middot; Real GPs &middot; eScripts
            </Badge>

            <h1 className="heading animate-fade-up text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
              Your AI Health Companion,{" "}
              <span className="bg-gradient-to-r from-ocean-500 via-ocean-400 to-sage-500 bg-clip-text text-transparent">
                Built&nbsp;for&nbsp;Australia
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-muted-foreground [animation-delay:100ms]">
              Free AI triage around the clock. AHPRA-registered GPs in under 30
              minutes for $59. eScripts to your pharmacy. Chronic care that
              checks in every month. All designed around Medicare and the PBS.
            </p>

            <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:200ms] sm:flex-row">
              <Link href="/chat">
                <Button size="xl" className="group w-full sm:w-auto">
                  Start a consultation
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/symptom-checker">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Try the symptom checker
                </Button>
              </Link>
            </div>

            <p className="mt-6 animate-fade-in text-xs text-muted-foreground [animation-delay:300ms]">
              No signup required to start chatting. Sign up to save your health
              profile and consultation history.
            </p>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.value}
                className="flex flex-col items-center rounded-2xl border border-border/50 bg-card/60 px-4 py-5 text-center shadow-warm backdrop-blur-sm"
              >
                <span className="heading text-2xl font-bold text-ocean-600 dark:text-ocean-400">
                  {s.value}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Triage pathways */}
          <div className="mt-14">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Clear next-step recommendations, every time
            </p>
            <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2">
              {pathways.map((p) => (
                <span
                  key={p.label}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-sm ${p.tone}`}
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="container py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="mr-1.5 h-3 w-3 text-coral-500" />
            Everything you need
          </Badge>
          <h2 className="heading text-3xl font-bold md:text-4xl">
            Health guidance that actually{" "}
            <span className="bg-gradient-to-r from-ocean-500 to-sage-500 bg-clip-text text-transparent">
              understands Australia
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            OzDoc feels like a good conversation with a thoughtful Australian
            GP — not a chatbot, not a symptom lookup, not a US product bolted
            onto Medicare.
          </p>
        </div>

        <div className="stagger grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const card = (
              <Card className="group lift h-full animate-fade-up cursor-default">
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                  >
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="heading mb-2 text-base font-semibold">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                  {f.href && (
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-ocean-600 dark:text-ocean-400">
                      Learn more
                      <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  )}
                </CardContent>
              </Card>
            );
            return f.href ? (
              <Link key={f.title} href={f.href} className="block">
                {card}
              </Link>
            ) : (
              <div key={f.title}>{card}</div>
            );
          })}
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute -right-40 top-0 -z-10 h-80 w-80 blob bg-ocean-200/30 blur-3xl dark:bg-ocean-800/15" />
        <div className="absolute -left-32 bottom-0 -z-10 h-64 w-64 blob bg-sage-200/20 blur-3xl dark:bg-sage-800/10" />

        <div className="container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Clock className="mr-1.5 h-3 w-3 text-coral-500" />
              From symptom to script
            </Badge>
            <h2 className="heading text-3xl font-bold md:text-4xl">
              End-to-end care, not just{" "}
              <span className="bg-gradient-to-r from-ocean-500 to-sage-500 bg-clip-text text-transparent">
                a chatbot
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              OzDoc takes you from &ldquo;I don&apos;t feel well&rdquo; to
              &ldquo;medication in hand&rdquo; without a single waiting room.
              Here&apos;s how it works.
            </p>
          </div>

          <div className="stagger grid gap-4 md:grid-cols-4">
            {howItWorks.map((step) => (
              <div
                key={step.num}
                className="relative animate-fade-up rounded-2xl border border-border/60 bg-card p-6 shadow-warm"
              >
                <div className="absolute -top-3 left-6 flex h-7 items-center justify-center rounded-full bg-gradient-to-r from-ocean-500 to-ocean-600 px-3 text-xs font-bold text-white shadow-md shadow-ocean-500/25">
                  Step {step.num}
                </div>
                <div className="mb-4 mt-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-md shadow-ocean-500/20">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="heading mb-2 text-sm font-semibold">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/chat">
              <Button size="lg" className="group">
                Start a consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/telehealth">
              <Button size="lg" variant="outline">
                Book telehealth
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Australia-focused section ─── */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ocean-600 via-ocean-500 to-ocean-700" />
        <div className="absolute -right-20 -top-20 -z-10 h-72 w-72 blob bg-ocean-300/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 -z-10 h-72 w-72 blob bg-coral-300/10 blur-3xl" />

        <div className="container">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <Badge className="mb-5 border-ocean-300/30 bg-white/15 text-white backdrop-blur-sm">
                <HeartPulse className="mr-1.5 h-3 w-3" />
                Australian-first
              </Badge>
              <h2 className="heading text-3xl font-bold text-white md:text-4xl">
                Australia&apos;s healthcare system is world-class. OzDoc helps
                you navigate it.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ocean-50/90">
                Knowing when to see a GP, when to go to ED, and when you need a
                specialist referral is the hard part. OzDoc is built around the
                way care actually works here.
              </p>
            </div>
            <ul className="space-y-3.5">
              {[
                "GP referral pathways to specialists",
                "Mental Health Care Plans \u2014 10 Medicare-subsidised sessions",
                "Chronic Disease Management (GPMP & TCA) Plans",
                "Medicare item 715 \u2014 Aboriginal and Torres Strait Islander health assessment",
                "PBS medication names (not US brand names)",
                "Bulk billing and out-of-pocket cost guidance",
                "Healthdirect, 13HEALTH, NURSE-ON-CALL and RFDS",
                "PATS support for rural and remote travel",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-coral-300" />
                  <span className="text-sm font-medium text-ocean-50">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="container py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Star className="mr-1.5 h-3 w-3 text-coral-500" />
            What people say
          </Badge>
          <h2 className="heading text-3xl font-bold tracking-tight md:text-4xl">
            Trusted by Australians, everywhere
          </h2>
          <p className="mt-4 text-muted-foreground">
            From inner-city apartments to remote stations — OzDoc meets people
            where they are.
          </p>
        </div>

        <div className="stagger grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="group lift animate-fade-up cursor-default"
            >
              <CardContent className="flex h-full flex-col p-6">
                {/* Stars */}
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-coral-400 text-coral-400"
                    />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-border/40 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 text-xs font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Enterprise strip ─── */}
      <section className="container py-16">
        <Card className="relative overflow-hidden border-ocean-200/50 dark:border-ocean-800/40">
          <div className="absolute inset-0 bg-gradient-to-br from-sage-50/60 via-background to-ocean-50/40 dark:from-sage-950/20 dark:via-background dark:to-ocean-950/20" />
          <div className="absolute -right-20 -top-20 h-48 w-48 blob bg-sage-200/30 blur-3xl dark:bg-sage-800/10" />

          <CardContent className="relative grid items-center gap-8 p-10 md:grid-cols-[1fr_auto] md:p-14">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Building2 className="mr-1.5 h-3 w-3 text-ocean-500" />
                For business
              </Badge>
              <h2 className="heading text-2xl font-bold md:text-3xl">
                Bring OzDoc to your members, patients, or team
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                White-label the OzDoc clinical engine. API access, chronic care
                at scale, and Australian-context triage for insurers, health
                systems, employers, and pharmacies.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/enterprise">
                <Button size="lg" variant="outline" className="group">
                  OzDoc for Business
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── CTA ─── */}
      <section className="container pb-24">
        <Card className="relative overflow-hidden border-ocean-200/50 dark:border-ocean-800/40">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-50 via-background to-coral-50/30 dark:from-ocean-950/30 dark:via-background dark:to-coral-950/10" />
          <div className="absolute -right-32 -top-32 h-64 w-64 blob bg-ocean-200/30 blur-3xl dark:bg-ocean-800/15" />
          <div className="absolute -bottom-32 -left-32 h-64 w-64 blob bg-coral-200/20 blur-3xl dark:bg-coral-800/10" />

          <CardContent className="relative p-10 text-center md:p-16">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-500/25 animate-float">
              <MessageSquareHeart className="h-7 w-7" />
            </div>
            <h2 className="heading text-3xl font-bold tracking-tight md:text-4xl">
              Got a health question right now?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Start a free consultation with OzDoc. No signup, no payment, no
              waiting room.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/chat">
                <Button size="xl" className="group">
                  Start chatting
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="xl" variant="outline">
                  Create a free account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
