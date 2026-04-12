"use client";

import { useState } from "react";
import {
  Database,
  Link2,
  Link2Off,
  Pill,
  AlertTriangle,
  Syringe,
  ClipboardList,
  FlaskConical,
  Shield,
  ExternalLink,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DATA_ACCESS_ITEMS = [
  {
    icon: Pill,
    label: "Medications",
    description: "Current and past prescriptions from the PBS and private scripts.",
  },
  {
    icon: AlertTriangle,
    label: "Allergies",
    description: "Recorded allergies and adverse reactions to medications.",
  },
  {
    icon: Syringe,
    label: "Immunisations",
    description: "Your vaccination history from the Australian Immunisation Register.",
  },
  {
    icon: ClipboardList,
    label: "Past conditions",
    description: "Diagnoses, hospital discharge summaries, and specialist letters.",
  },
  {
    icon: FlaskConical,
    label: "Pathology results",
    description: "Blood tests, imaging reports, and other diagnostic results.",
  },
];

export default function MyHealthRecordPage() {
  const [connected] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  function handleConnect() {
    setShowAlert(true);
  }

  return (
    <div className="container max-w-3xl py-10">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-500/25">
          <Database className="h-6 w-6" />
        </div>
        <div>
          <h1 className="heading text-2xl font-bold">My Health Record</h1>
          <p className="text-sm text-muted-foreground">
            Connect your My Health Record for better, more personalised care.
          </p>
        </div>
      </div>

      {/* What is My Health Record */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What is My Health Record?</CardTitle>
          <CardDescription>
            Australia&apos;s national digital health record system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            My Health Record is a secure online summary of your health
            information, managed by the Australian Digital Health Agency. It
            brings together health information from you, your healthcare
            providers, and Medicare.
          </p>
          <p>
            When connected to OzDoc, your My Health Record data helps our AI
            provide more accurate, personalised health guidance — taking into
            account your full medical history, current medications, and known
            allergies.
          </p>
        </CardContent>
      </Card>

      {/* Connection status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-3">
              {connected ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 text-white shadow-md">
                  <Link2 className="h-5 w-5" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
                  <Link2Off className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold">
                  {connected ? "Connected" : "Not connected"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {connected
                    ? "OzDoc is reading your My Health Record for personalised guidance."
                    : "Connect your record to get more accurate health guidance."}
                </p>
              </div>
            </div>
            <Badge variant={connected ? "secondary" : "outline"}>
              {connected ? (
                <>
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Active
                </>
              ) : (
                "Inactive"
              )}
            </Badge>
          </div>

          <div className="mt-4 flex justify-center">
            <Button onClick={handleConnect} disabled={connected}>
              {connected ? "Connected" : "Connect My Health Record"}
            </Button>
          </div>

          {/* Coming soon alert */}
          {showAlert && (
            <div className="mt-4 rounded-xl border border-ocean-200/60 bg-gradient-to-r from-ocean-50/80 to-ocean-50/30 p-4 dark:border-ocean-800/40 dark:from-ocean-950/30 dark:to-ocean-950/10">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-ocean-500" />
                <div>
                  <p className="text-sm font-semibold text-ocean-700 dark:text-ocean-300">
                    Coming soon
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    My Health Record integration is coming soon. This will allow
                    OzDoc AI to access your medical history for more accurate
                    guidance. You&apos;ll be able to connect securely via myGov
                    authentication.
                  </p>
                  <button
                    onClick={() => setShowAlert(false)}
                    className="mt-2 text-xs font-semibold text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 dark:hover:text-ocean-300"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* What data OzDoc would access */}
      <div className="mb-6">
        <h2 className="heading mb-4 text-lg font-bold">
          What OzDoc would access
        </h2>
        <div className="space-y-3">
          {DATA_ACCESS_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-warm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ocean-50 text-ocean-600 dark:bg-ocean-900/40 dark:text-ocean-400">
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy reassurance */}
      <Card className="mb-6 border-sage-200/60 bg-gradient-to-r from-sage-50/80 to-sage-50/30 dark:border-sage-800/40 dark:from-sage-900/20 dark:to-sage-900/10">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 text-white shadow-md shadow-sage-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="heading text-sm font-semibold">
              Your privacy is protected
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              OzDoc only reads your record — we never write to it. You control
              access at any time via myGov. You can revoke OzDoc&apos;s access
              instantly, and we will never share your My Health Record data with
              third parties.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Link to official My Health Record */}
      <div className="flex justify-center">
        <a
          href="https://www.myhealthrecord.gov.au"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ocean-600 transition-colors hover:text-ocean-700 dark:text-ocean-400 dark:hover:text-ocean-300"
        >
          Visit the official My Health Record website
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
