import Link from "next/link";
import { Phone, Stethoscope, Heart } from "lucide-react";

const helplines = [
  {
    name: "Emergency",
    number: "000",
    tel: "000",
    desc: "Police, fire, ambulance",
    urgent: true,
  },
  {
    name: "Healthdirect",
    number: "1800 022 222",
    tel: "1800022222",
    desc: "24/7 health advice",
    urgent: false,
  },
  {
    name: "Lifeline",
    number: "13 11 14",
    tel: "131114",
    desc: "24/7 crisis support",
    urgent: false,
  },
  {
    name: "Beyond Blue",
    number: "1300 22 4636",
    tel: "1300224636",
    desc: "Mental health support",
    urgent: false,
  },
  {
    name: "13HEALTH (QLD)",
    number: "13 43 25 84",
    tel: "13432584",
    desc: "Queensland health line",
    urgent: false,
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/50 bg-gradient-to-b from-muted/20 to-muted/50">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-md shadow-ocean-500/20">
                <Stethoscope className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold font-display tracking-tight">
                OzDoc{" "}
                <span className="bg-gradient-to-r from-ocean-500 to-ocean-400 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Your personal AI health assistant — built for Australia, around
              Medicare, the PBS, and how healthcare actually works here.
            </p>
            <div className="mt-5 rounded-xl border border-border/60 bg-card/50 p-3">
              <p className="text-xs leading-relaxed text-muted-foreground">
                OzDoc AI is not a doctor and does not provide medical advice.
                Always consult a qualified healthcare professional. If you are
                experiencing a medical emergency, call{" "}
                <a href="tel:000" className="font-semibold text-foreground underline underline-offset-2">
                  000
                </a>{" "}
                immediately.
              </p>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold font-display">Product</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {[
                { href: "/chat", label: "AI Chat" },
                { href: "/symptom-checker", label: "Symptom checker" },
                { href: "/telehealth", label: "Telehealth ($59)" },
                { href: "/escripts", label: "eScripts" },
                { href: "/chronic-care", label: "Chronic care plans" },
                { href: "/my-health-record", label: "My Health Record" },
                { href: "/history", label: "Consultation history" },
                { href: "/profile", label: "Health profile" },
                { href: "/enterprise", label: "For business" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-ocean-600 dark:hover:text-ocean-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Helplines */}
          <div>
            <h4 className="text-sm font-semibold font-display">Australian helplines</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {helplines.map((h) => (
                <li key={h.name}>
                  <a
                    href={`tel:${h.tel}`}
                    className="group flex items-start gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                        h.urgent
                          ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                          : "bg-ocean-50 text-ocean-500 dark:bg-ocean-900/40 dark:text-ocean-400"
                      }`}
                    >
                      <Phone className="h-3 w-3" />
                    </div>
                    <span>
                      <span className="block font-medium text-foreground">
                        {h.name} — {h.number}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {h.desc}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p className="flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} OzDoc AI. Made with{" "}
            <Heart className="h-3 w-3 text-coral-400" /> in Australia.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/clinical-governance"
              className="transition-colors hover:text-foreground"
            >
              Clinical governance
            </Link>
            <a
              href="https://www.healthdirect.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Healthdirect
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
