import {
  Shield,
  Lock,
  Server,
  Trash2,
  UserCheck,
  Scale,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SECTIONS = [
  {
    icon: Server,
    title: "Your data stays in Australia",
    body: "All data is stored on Australian servers. Encrypted at rest with AES-256 and in transit with TLS 1.3. Your health information never leaves the country.",
  },
  {
    icon: Shield,
    title: "Never used for AI training",
    body: "Your conversations are never used to train AI models. Period. Your health data exists to serve you — not to improve a product.",
  },
  {
    icon: Lock,
    title: "You own your data",
    body: "Delete your account and all data is permanently removed — no 30-day grace period, no hidden backups. You can also export your full consultation history at any time from the history page.",
  },
  {
    icon: Lock,
    title: "Encrypted health records",
    body: "Medicare numbers and sensitive health data are encrypted with separate encryption keys, isolated from application data. Even in the unlikely event of a breach, your most sensitive information remains protected.",
  },
  {
    icon: UserCheck,
    title: "AHPRA-registered doctors only",
    body: "All telehealth GPs available through OzDoc are verified AHPRA-registered medical practitioners. We check registration status regularly against the public AHPRA register.",
  },
  {
    icon: Scale,
    title: "Compliance",
    body: "OzDoc is aligned with the Australian Privacy Act 1988, the 13 Australian Privacy Principles (APPs), and the My Health Records Act 2012. We conduct regular privacy impact assessments and maintain a data breach response plan as required under the Notifiable Data Breaches scheme.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-10">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-500/25">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="heading text-2xl font-bold">
            Privacy &amp; Data Security
          </h1>
          <p className="text-sm text-muted-foreground">
            How OzDoc AI protects your health information.
          </p>
        </div>
      </div>

      <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
        Your health data is some of the most sensitive information you have. We
        built OzDoc with privacy as a foundation — not an afterthought. Here is
        exactly how we protect it.
      </p>

      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <Card key={section.title}>
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-md shadow-ocean-500/20">
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="heading text-base font-semibold">
                  {section.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary banner */}
      <Card className="mt-8 border-ocean-200/60 bg-gradient-to-r from-ocean-50/80 to-ocean-50/30 dark:border-ocean-800/40 dark:from-ocean-950/30 dark:to-ocean-950/10">
        <CardContent className="p-6 text-center">
          <h2 className="heading text-lg font-bold">In short</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Your health data is encrypted, stored in Australia, never shared with
            third parties, and never used for AI training. You can delete
            everything at any time. OzDoc exists to help you — not to monetise
            your information.
          </p>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Last updated: April 2026. If you have questions about our privacy
        practices, contact us at privacy@ozdoc.au.
      </p>
    </div>
  );
}
