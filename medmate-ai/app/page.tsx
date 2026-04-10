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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: MessageSquareHeart,
    title: "AI Chat with an Australian GP mindset",
    body: "Describe your symptoms in plain language. MedMate asks the right clarifying questions and explains things the way a good Aussie GP would.",
  },
  {
    icon: ClipboardList,
    title: "Guided symptom checker",
    body: "Step through body area, symptoms, duration and severity. Get a clear triage recommendation in minutes.",
  },
  {
    icon: User,
    title: "Health profile",
    body: "Save your conditions, medications and allergies once. MedMate personalises every response without asking again.",
  },
  {
    icon: Video,
    title: "Book a real telehealth consult",
    body: "If you need a doctor, book a telehealth appointment with an Australian GP. Bulk-billed when eligible.",
  },
  {
    icon: Shield,
    title: "Private by design",
    body: "Your conversations are yours. Encrypted in transit, stored securely, and never sold or used to train models.",
  },
  {
    icon: HeartPulse,
    title: "Built for Australia",
    body: "Knows Medicare, the PBS, Mental Health Care Plans, Chronic Disease Management, Healthdirect, 13HEALTH and more.",
  },
];

const pathways = [
  { label: "Call 000 now", tone: "bg-red-50 text-red-700 border-red-200" },
  {
    label: "Emergency Department",
    tone: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    label: "See your GP in 24–48h",
    tone: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    label: "Book telehealth",
    tone: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    label: "Manage at home",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

const testimonials = [
  {
    quote:
      "I was worried about a headache that wouldn't shift. MedMate asked good questions, flagged red flags to watch for, and told me to book a GP that week. Felt like a triage nurse on my phone.",
    name: "Steph",
    location: "Brunswick, VIC",
  },
  {
    quote:
      "Living four hours from the nearest town, I use it to figure out whether something can wait for the next clinic day or if I need to call the RFDS. It actually understands remote care.",
    name: "Dan",
    location: "Birdsville, QLD",
  },
  {
    quote:
      "Love that it knew to talk about Mental Health Care Plans and the 10 Medicare sessions. Most apps pretend Australia doesn't exist.",
    name: "Priya",
    location: "Parramatta, NSW",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-50 via-background to-background dark:from-teal-950/30" />
        <div className="container py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-5">
              <Sparkles className="mr-1.5 h-3 w-3" />
              Free &middot; Private &middot; 24/7
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Your Personal AI Doctor,{" "}
              <span className="text-teal-500">Built for Australia</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Free, private, 24/7 health guidance — designed around Medicare,
              the PBS, and how healthcare actually works here.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/chat">
                <Button size="xl" className="w-full sm:w-auto">
                  Start a consultation
                  <ArrowRight className="h-4 w-4" />
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
            <p className="mt-6 text-xs text-muted-foreground">
              No signup required to start chatting. Sign up to save your
              health profile and consultation history.
            </p>
          </div>

          {/* Triage pathways strip */}
          <div className="mt-16">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Clear next-step recommendations, every time
            </p>
            <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2">
              {pathways.map((p) => (
                <span
                  key={p.label}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${p.tone}`}
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need, without the clinical coldness
          </h2>
          <p className="mt-4 text-muted-foreground">
            MedMate feels like a good conversation with a thoughtful Australian
            GP — not a chatbot, not a symptom lookup, not a US product bolted
            onto Medicare.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Australia-focused section */}
      <section className="bg-teal-500 py-20 text-white">
        <div className="container">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">
                Australia&apos;s healthcare system is world-class. MedMate
                helps you navigate it.
              </h2>
              <p className="mt-4 text-teal-50">
                Knowing when to see a GP, when to go to ED, and when you need
                a specialist referral is the hard part. MedMate is built
                around the way care actually works here.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                "GP referral pathways to specialists",
                "Mental Health Care Plans — 10 Medicare-subsidised sessions",
                "Chronic Disease Management Plans",
                "PBS medication names (not US brand names)",
                "Bulk billing and out-of-pocket cost guidance",
                "Healthdirect, 13HEALTH and RFDS for remote access",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                  <span className="text-teal-50">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Trusted by Australians, everywhere
          </h2>
          <p className="mt-4 text-muted-foreground">
            From inner-city apartments to remote stations — MedMate meets
            people where they are.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name}>
              <CardContent className="p-6">
                <p className="text-sm italic text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <Card className="overflow-hidden border-teal-100 bg-gradient-to-br from-teal-50 via-background to-background dark:from-teal-950/40">
          <CardContent className="p-10 text-center md:p-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Got a health question right now?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Start a free consultation with MedMate. No signup, no payment,
              no waiting room.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/chat">
                <Button size="xl">
                  Start chatting
                  <ArrowRight className="h-4 w-4" />
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
