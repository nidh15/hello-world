"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Video,
  Clock,
  CheckCircle2,
  Shield,
  Stethoscope,
  ArrowRight,
  Loader2,
  FileText,
  Pill,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function generateSlots(): string[] {
  const slots: string[] = [];
  const now = new Date();
  for (let day = 0; day < 3; day++) {
    for (let hour = 9; hour <= 17; hour += 2) {
      const d = new Date(now);
      d.setDate(now.getDate() + day);
      d.setHours(hour, 0, 0, 0);
      if (d.getTime() > now.getTime() + 30 * 60 * 1000) {
        slots.push(d.toISOString());
      }
    }
  }
  return slots;
}

function formatSlot(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
    time: d.toLocaleTimeString("en-AU", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export default function TelehealthPage() {
  const searchParams = useSearchParams();
  const fromSymptomChecker = searchParams.get("from") === "symptom-checker";

  const slots = useMemo(generateSlots, []);
  const [selected, setSelected] = useState<string | null>(null);
  const [bulkBilled, setBulkBilled] = useState(false);
  const [step, setStep] = useState<"select" | "details" | "confirmed">(
    "select",
  );
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [reason, setReason] = useState("");
  const [cdssContextLoaded, setCdssContextLoaded] = useState(false);

  // When the user arrives here from the symptom checker, the CDSS result
  // and a short consult-reason summary are stashed in sessionStorage.
  // Pre-fill the reason textarea so the GP gets full triage context and
  // the patient doesn't have to retype anything.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem("medmate:telehealth-reason");
    if (stored) {
      setReason(stored);
      setCdssContextLoaded(true);
      sessionStorage.removeItem("medmate:telehealth-reason");
    }
  }, []);

  async function confirm() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("confirmed");
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-500/25">
          <Video className="h-6 w-6" />
        </div>
        <div>
          <h1 className="heading text-2xl font-bold">Book a telehealth consult</h1>
          <p className="text-sm text-muted-foreground">
            AHPRA-registered GP in under 30 minutes. $59 AUD or bulk-billed.
          </p>
        </div>
      </div>

      {(cdssContextLoaded || fromSymptomChecker) && (
        <Card className="mb-6 border-sage-300/60 bg-sage-50/60 dark:border-sage-900/40 dark:bg-sage-950/20">
          <CardContent className="flex items-start gap-3 p-4">
            <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-sage-600 dark:text-sage-400" />
            <div>
              <p className="text-sm font-semibold">
                CDSS triage context attached
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your symptom checker result — including the matched CDSS rules,
                urgency, and confidence — will be shared with the GP before
                your consult. You can edit or add to the &ldquo;reason for
                consult&rdquo; below.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <InfoTile
          icon={<Clock className="h-4 w-4" />}
          title="Under 30 minutes"
          body="See an available GP in under 30 minutes, 7 days a week."
        />
        <InfoTile
          icon={<Stethoscope className="h-4 w-4" />}
          title="AHPRA-registered GPs"
          body="All doctors are verified Australian-registered practitioners."
        />
        <InfoTile
          icon={<Shield className="h-4 w-4" />}
          title="$59 AUD or bulk-billed"
          body="Bulk-billed with a valid Medicare card where eligible."
        />
      </div>

      {/* How it works */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <p className="mb-3 text-sm font-semibold">How OzDoc telehealth works</p>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { num: "1", label: "Chat with OzDoc AI", desc: "Describe your symptoms — AI generates a clinical summary" },
              { num: "2", label: "Book a GP", desc: "Pick a time slot — available in under 30 minutes" },
              { num: "3", label: "GP reviews summary", desc: "Your AI consultation summary is shared before the call" },
              { num: "4", label: "Consult + eScript", desc: "Video call with GP, eScript sent to your pharmacy" },
            ].map((s) => (
              <div key={s.num} className="flex gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ocean-50 text-xs font-bold text-ocean-600 dark:bg-ocean-900/40 dark:text-ocean-400">
                  {s.num}
                </div>
                <div>
                  <p className="text-xs font-semibold">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What the GP receives */}
      <Card className="mb-6 border-ocean-200/50 bg-ocean-50/30 dark:border-ocean-800/40 dark:bg-ocean-950/20">
        <CardContent className="flex items-start gap-3 p-5">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-ocean-600" />
          <div>
            <p className="text-sm font-semibold">AI consultation summary shared with your GP</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Before your call, the GP receives a structured summary of your OzDoc
              conversation — presenting complaint, history, medications, and
              provisional assessment. This means less time repeating yourself and
              more time on what matters.
            </p>
          </div>
        </CardContent>
      </Card>

      {step === "select" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Pick a time</CardTitle>
              <CardDescription>Times shown in your local timezone. Most slots available within 30 minutes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-3">
                {slots.map((iso) => {
                  const { date, time } = formatSlot(iso);
                  const active = selected === iso;
                  return (
                    <button
                      key={iso}
                      onClick={() => setSelected(iso)}
                      className={cn(
                        "rounded-xl border p-3.5 text-left text-sm transition-all duration-200",
                        active
                          ? "border-ocean-400 bg-gradient-to-r from-ocean-50 to-ocean-50/50 text-ocean-700 shadow-glow dark:from-ocean-900/30 dark:to-ocean-900/10 dark:text-ocean-200"
                          : "border-border/60 hover:-translate-y-0.5 hover:border-ocean-300 hover:shadow-warm dark:hover:border-ocean-700",
                      )}
                    >
                      <div className="text-xs text-muted-foreground">
                        {date}
                      </div>
                      <div className="text-base font-semibold">{time}</div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">
                  Do you have a valid Medicare card?
                </p>
                <p className="text-xs text-muted-foreground">
                  Medicare-eligible consultations are bulk-billed at no cost.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={bulkBilled}
                  onChange={(e) => setBulkBilled(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-ocean-500"
                />
                Yes
              </label>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm">
              {bulkBilled ? (
                <Badge variant="secondary">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Bulk-billed with Medicare
                </Badge>
              ) : (
                <span className="font-semibold">$59.00 AUD</span>
              )}
            </p>
            <Button
              onClick={() => setStep("details")}
              disabled={!selected}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {step === "details" && selected && (
        <Card>
          <CardHeader>
            <CardTitle>Your details</CardTitle>
            <CardDescription>
              {formatSlot(selected).date} at {formatSlot(selected).time} —{" "}
              {bulkBilled ? "Bulk-billed" : "$59.00 AUD"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full name (as on Medicare card)</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label>Reason for consult</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief description of what you'd like to discuss"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" onClick={() => setStep("select")}>
                Back
              </Button>
              <Button
                onClick={confirm}
                disabled={!fullName.trim() || loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm booking
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This is a demo. No real booking is created, no payment is taken,
              and no data is sent to a real GP.
            </p>
          </CardContent>
        </Card>
      )}

      {step === "confirmed" && selected && (
        <Card className="border-ocean-100 bg-ocean-50 dark:border-ocean-900/40 dark:bg-ocean-950/30">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-ocean-600" />
            <h2 className="heading text-xl font-bold">Booking confirmed</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your telehealth consult is booked for{" "}
              <strong>{formatSlot(selected).date}</strong> at{" "}
              <strong>{formatSlot(selected).time}</strong>.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {bulkBilled ? "Bulk-billed with Medicare." : "$59.00 AUD"}
            </p>
            <div className="mt-4 rounded-xl border border-ocean-200/60 bg-white/50 p-3 text-left dark:border-ocean-800/40 dark:bg-ocean-900/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-ocean-700 dark:text-ocean-300">
                <FileText className="h-3.5 w-3.5" />
                Your AI consultation summary will be shared with the GP
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                The GP will review your OzDoc conversation summary before the call so they&apos;re prepared.
              </p>
            </div>
            <div className="mt-4 rounded-xl border border-ocean-200/60 bg-white/50 p-3 text-left dark:border-ocean-800/40 dark:bg-ocean-900/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-ocean-700 dark:text-ocean-300">
                <Pill className="h-3.5 w-3.5" />
                eScript delivery available
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                If medication is prescribed, an eScript will be sent directly to your nominated pharmacy.
              </p>
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/chat">
                <Button>Back to chat</Button>
              </Link>
              <Link href="/escripts">
                <Button variant="outline">View eScripts</Button>
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Placeholder flow — this is a demo booking.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoTile({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 shadow-warm">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean-50 text-ocean-600 dark:bg-ocean-900/40 dark:text-ocean-400">
          {icon}
        </div>
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
