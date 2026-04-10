"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Video,
  Clock,
  CheckCircle2,
  Shield,
  Stethoscope,
  ArrowRight,
  Loader2,
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
  const slots = useMemo(generateSlots, []);
  const [selected, setSelected] = useState<string | null>(null);
  const [bulkBilled, setBulkBilled] = useState(false);
  const [step, setStep] = useState<"select" | "details" | "confirmed">(
    "select",
  );
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [reason, setReason] = useState("");

  async function confirm() {
    setLoading(true);
    // Placeholder delay — no real booking
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("confirmed");
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-white">
          <Video className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Book a telehealth consult</h1>
          <p className="text-sm text-muted-foreground">
            Video or phone consult with an Australian-registered GP.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <InfoTile
          icon={<Clock className="h-4 w-4" />}
          title="15 min consult"
          body="Average wait under 10 minutes."
        />
        <InfoTile
          icon={<Stethoscope className="h-4 w-4" />}
          title="AHPRA-registered GPs"
          body="Australian trained and registered."
        />
        <InfoTile
          icon={<Shield className="h-4 w-4" />}
          title="Bulk-billed if eligible"
          body="Otherwise $39.95 AUD."
        />
      </div>

      {step === "select" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Pick a time</CardTitle>
              <CardDescription>Times shown in your local timezone.</CardDescription>
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
                        "rounded-xl border p-3 text-left text-sm transition-colors",
                        active
                          ? "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200"
                          : "border-border hover:bg-accent",
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
                  className="h-4 w-4 rounded border-border text-teal-500"
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
                <span className="font-semibold">$39.95 AUD</span>
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
              {bulkBilled ? "Bulk-billed" : "$39.95 AUD"}
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
        <Card className="border-teal-100 bg-teal-50 dark:border-teal-900/40 dark:bg-teal-950/30">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-teal-600" />
            <h2 className="text-xl font-bold">Booking confirmed</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your telehealth consult is booked for{" "}
              <strong>{formatSlot(selected).date}</strong> at{" "}
              <strong>{formatSlot(selected).time}</strong>.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {bulkBilled ? "Bulk-billed with Medicare." : "$39.95 AUD"}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/chat">
                <Button>Back to chat</Button>
              </Link>
              <Link href="/history">
                <Button variant="outline">View history</Button>
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
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-2 text-teal-600">
        {icon}
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
