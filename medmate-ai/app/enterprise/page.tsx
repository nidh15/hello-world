import {
  Code2,
  Palette,
  HeartPulse,
  BarChart3,
  ShieldCheck,
  Building2,
  Briefcase,
  Hospital,
  Pill,
  ArrowRight,
  Send,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Code2,
    title: "API Access",
    description:
      "Integrate OzDoc's clinical AI into your platform with a RESTful API. Australian-context triage, symptom assessment, and health guidance as a service.",
  },
  {
    icon: Palette,
    title: "White-Label",
    description:
      "A fully branded AI health assistant for your members. Your logo, your colours, your domain — powered by OzDoc's clinical engine.",
  },
  {
    icon: HeartPulse,
    title: "Chronic Care at Scale",
    description:
      "Population health management with monthly AI check-ins. Track outcomes across your member base with de-identified analytics.",
  },
  {
    icon: BarChart3,
    title: "Data & Analytics",
    description:
      "De-identified health insights for your organisation. Understand symptom trends, triage patterns, and engagement across your population.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance",
    description:
      "Built for Australian healthcare regulations. Aligned with the Privacy Act 1988, APPs, My Health Records Act, and TGA requirements.",
  },
];

const USE_CASES = [
  {
    icon: Building2,
    title: "Health Insurers",
    description:
      "Reduce claims with proactive health guidance. Offer members 24/7 AI triage before they present to ED, and chronic care management that improves outcomes.",
  },
  {
    icon: Briefcase,
    title: "Employers",
    description:
      "Workplace wellness and triage for your team. Reduce absenteeism, support mental health, and give employees instant access to health guidance.",
  },
  {
    icon: Hospital,
    title: "Health Systems",
    description:
      "Extend capacity with AI-assisted triage. Reduce unnecessary ED presentations and help patients navigate the right care pathway first time.",
  },
  {
    icon: Pill,
    title: "Pharmacies",
    description:
      "Integrated eScript and medication management. Offer your customers AI-powered health guidance with seamless prescription delivery to your stores.",
  },
];

const SAMPLE_CURL = `curl -X POST https://api.ozdoc.au/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "I have a persistent cough for 3 weeks with mild fever"
      }
    ],
    "triage": true,
    "context": {
      "age": 34,
      "sex": "female",
      "location": "Melbourne, VIC"
    }
  }'`;

export default function EnterprisePage() {
  return (
    <div className="container max-w-4xl py-10">
      {/* Page header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-500/25">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="heading text-2xl font-bold">OzDoc for Business</h1>
          <p className="text-sm text-muted-foreground">
            White-label AI health for insurers, health systems, and employers.
          </p>
        </div>
      </div>

      <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
        Bring OzDoc&apos;s Australian-context clinical AI to your platform.
        Whether you&apos;re an insurer looking to reduce claims, a hospital
        extending triage capacity, or an employer investing in wellness —
        OzDoc&apos;s enterprise API and white-label solution are built for you.
      </p>

      {/* Feature grid */}
      <div className="mb-12">
        <h2 className="heading mb-6 text-xl font-bold">Platform features</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="group lift cursor-default">
              <CardContent className="p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="heading mb-1.5 text-sm font-semibold">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Use cases */}
      <div className="mb-12">
        <h2 className="heading mb-6 text-xl font-bold">Use cases</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {USE_CASES.map((useCase) => (
            <div
              key={useCase.title}
              className="flex items-start gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-warm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600 dark:bg-ocean-900/40 dark:text-ocean-400">
                <useCase.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="heading text-sm font-semibold">
                  {useCase.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API documentation teaser */}
      <div className="mb-12">
        <h2 className="heading mb-4 text-xl font-bold">API preview</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-ocean-500" />
              <CardTitle className="text-sm">POST /v1/chat</CardTitle>
            </div>
            <CardDescription>
              Send a health query and receive a triage recommendation with
              Australian-context clinical guidance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-border/60 bg-zinc-950 p-4">
              <pre className="text-xs leading-relaxed text-zinc-300">
                <code>{SAMPLE_CURL}</code>
              </pre>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Full API documentation, SDKs (Python, Node.js, Go), and sandbox
              environment available to enterprise partners.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pricing section */}
      <div className="mb-12">
        <h2 className="heading mb-2 text-xl font-bold">Enterprise pricing</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Contact us for enterprise pricing tailored to your organisation&apos;s
          needs. Volume discounts, SLAs, and dedicated support available.
        </p>

        {/* Contact form */}
        <Card>
          <CardHeader>
            <CardTitle>Get in touch</CardTitle>
            <CardDescription>
              Tell us about your organisation and we&apos;ll get back to you
              within 1 business day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full name</Label>
                  <Input placeholder="Jane Smith" />
                </div>
                <div className="space-y-2">
                  <Label>Work email</Label>
                  <Input type="email" placeholder="jane@company.com.au" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input placeholder="Acme Health Insurance" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  rows={4}
                  placeholder="Tell us about your use case, expected volume, and any specific requirements…"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  This is a demo form. No data is submitted.
                </p>
                <Button type="submit">
                  <Send className="h-4 w-4" />
                  Send enquiry
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge variant="secondary">
          <ShieldCheck className="mr-1.5 h-3 w-3" />
          Privacy Act 1988 compliant
        </Badge>
        <Badge variant="secondary">
          <ShieldCheck className="mr-1.5 h-3 w-3" />
          Australian-hosted infrastructure
        </Badge>
        <Badge variant="secondary">
          <ShieldCheck className="mr-1.5 h-3 w-3" />
          SOC 2 Type II (in progress)
        </Badge>
      </div>
    </div>
  );
}
