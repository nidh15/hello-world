import Link from "next/link";
import {
  MessageSquareHeart,
  ClipboardList,
  Shield,
  Video,
  User,
  Sparkles,
  HeartPulse,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: MessageSquareHeart,
    title: "AI Chat with an Australian GP mindset",
    body: "Describe your symptoms in plain language. MedMate asks the right clarifying questions and explains things the way a good Aussie GP would.",
    accent: "from-ocean-400 to-ocean-600",
  },
  {
    icon: ClipboardList,
    title: "Guided symptom checker",
    body: "Step through body area, symptoms, duration and severity. Get a clear triage recommendation in minutes.",
    accent: "from-ocean-300 to-ocean-500",
  },
  {
    icon: User,
    title: "Health profile",
    body: "Save your conditions, medications and allergies once. MedMate personalises every response without asking again.",
    accent: "from-sage-400 to-sage-600",
  },
  {
    icon: Video,
    title: "Book a real telehealth consult",
    body: "If you need a doctor, book a telehealth appointment with an Australian GP. Bulk-billed when eligible.",
    accent: "from-coral-400 to-coral-600",
  },
  {
    icon: Shield,
    title: "Private by design",
    body: "Your conversations are yours. Encrypted in transit, stored securely, and never sold or used to train models.",
    accent: "from-sage-500 to-sage-700",
  },
  {
    icon: HeartPulse,
    title: "Built for Australia",
    body: "Knows Medicare, the PBS, Mental Health Care Plans, Chronic Disease Management, Healthdirect, 13HEALTH and more.",
    accent: "from-coral-500 to-coral-700",
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
      "I was worried about a headache that wouldn\u2019t shift. MedMate asked good questions, flagged red flags to watch for, and told me to book a GP that week. Felt like a triage nurse on my phone.",
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
  { value: "24/7", label: "Available around the clock" },
  { value: "Free", label: "No cost, no hidden fees" },
  { value: "Private", label: "Your data stays yours" },
  { value: "AU", label: "Built for Australia" },
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
              Free &middot; Private &middot; 24/7
            </Badge>

            <h1 className="heading animate-fade-up text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
              Your Personal AI Doctor,{" "}
              <span className="bg-gradient-to-r from-ocean-500 via-ocean-400 to-sage-500 bg-clip-text text-transparent">
                Built&nbsp;for&nbsp;Australia
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-muted-foreground [animation-delay:100ms]">
              Free, private, 24/7 health guidance — designed around Medicare,
              the PBS, and how healthcare actually works here.
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
            MedMate feels like a good conversation with a thoughtful Australian
            GP — not a chatbot, not a symptom lookup, not a US product bolted
            onto Medicare.
          </p>
        </div>

        <div className="stagger grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group lift animate-fade-up cursor-default"
            >
              <CardContent className="p-6">
                <div
                  className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="heading mb-2 text-base font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </CardContent>
            </Card>
          ))}
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
                Australia&apos;s healthcare system is world-class. MedMate helps
                you navigate it.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ocean-50/90">
                Knowing when to see a GP, when to go to ED, and when you need a
                specialist referral is the hard part. MedMate is built around the
                way care actually works here.
              </p>
            </div>
            <ul className="space-y-3.5">
              {[
                "GP referral pathways to specialists",
                "Mental Health Care Plans \u2014 10 Medicare-subsidised sessions",
                "Chronic Disease Management Plans",
                "PBS medication names (not US brand names)",
                "Bulk billing and out-of-pocket cost guidance",
                "Healthdirect, 13HEALTH and RFDS for remote access",
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
            From inner-city apartments to remote stations — MedMate meets people
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
              Start a free consultation with MedMate. No signup, no payment, no
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
