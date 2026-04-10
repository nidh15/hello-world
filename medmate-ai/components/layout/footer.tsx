import Link from "next/link";
import { Phone } from "lucide-react";

const helplines = [
  {
    name: "Emergency",
    number: "000",
    tel: "000",
    desc: "Police, fire, ambulance",
  },
  {
    name: "Healthdirect",
    number: "1800 022 222",
    tel: "1800022222",
    desc: "24/7 health advice",
  },
  {
    name: "Lifeline",
    number: "13 11 14",
    tel: "131114",
    desc: "24/7 crisis support",
  },
  {
    name: "Beyond Blue",
    number: "1300 22 4636",
    tel: "1300224636",
    desc: "Mental health support",
  },
  {
    name: "13HEALTH (QLD)",
    number: "13 43 25 84",
    tel: "13432584",
    desc: "Queensland health line",
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold">MedMate AI</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Your personal AI health assistant — built for Australia, around
              Medicare, the PBS, and how healthcare actually works here.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              MedMate AI is not a doctor and does not provide medical advice.
              Always consult a qualified healthcare professional. If you are
              experiencing a medical emergency, call 000 immediately.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">MedMate</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/chat" className="hover:text-foreground">
                  AI Chat
                </Link>
              </li>
              <li>
                <Link
                  href="/symptom-checker"
                  className="hover:text-foreground"
                >
                  Symptom checker
                </Link>
              </li>
              <li>
                <Link href="/telehealth" className="hover:text-foreground">
                  Telehealth
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-foreground">
                  Consultation history
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-foreground">
                  Health profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Australian helplines</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {helplines.map((h) => (
                <li key={h.name}>
                  <a
                    href={`tel:${h.tel}`}
                    className="group flex items-start gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-500" />
                    <span>
                      <span className="block font-medium text-foreground">
                        {h.name} — {h.number}
                      </span>
                      <span className="block text-xs">{h.desc}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} MedMate AI. Made in Australia.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <a
              href="https://www.healthdirect.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Healthdirect
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
