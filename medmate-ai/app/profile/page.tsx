"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Plus, X, User } from "lucide-react";
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
import type { HealthProfile, Sex, BloodType } from "@/types";

const emptyProfile: HealthProfile = {
  userId: "",
  fullName: "",
  dateOfBirth: "",
  sex: null,
  heightCm: null,
  weightKg: null,
  bloodType: "unknown",
  chronicConditions: [],
  pastSurgeries: [],
  medications: [],
  allergies: [],
  medicareNumber: "",
  emergencyContacts: [],
  consentedToTerms: false,
  updatedAt: new Date().toISOString(),
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<HealthProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.status === 401) {
          setError("Please log in to manage your health profile.");
          return;
        }
        if (res.status === 501) {
          setError(
            "Supabase is not configured. Health profile persistence is disabled.",
          );
          return;
        }
        const json = await res.json();
        if (json.profile) {
          setProfile({
            userId: json.profile.user_id,
            fullName: json.profile.full_name ?? "",
            dateOfBirth: json.profile.date_of_birth ?? "",
            sex: json.profile.sex,
            heightCm: json.profile.height_cm,
            weightKg: json.profile.weight_kg,
            bloodType: json.profile.blood_type ?? "unknown",
            chronicConditions: json.profile.chronic_conditions ?? [],
            pastSurgeries: json.profile.past_surgeries ?? [],
            medications: json.profile.medications ?? [],
            allergies: json.profile.allergies ?? [],
            medicareNumber: json.profile.medicare_number ?? "",
            emergencyContacts: json.profile.emergency_contacts ?? [],
            consentedToTerms: json.profile.consented_to_terms ?? false,
            updatedAt: json.profile.updated_at,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      setMessage("Profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-500/25">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Your health profile</h1>
          <p className="text-sm text-muted-foreground">
            MedMate uses this to personalise every consultation.
          </p>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal details</CardTitle>
            <CardDescription>The basics.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Full name">
              <Input
                value={profile.fullName ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
              />
            </Field>
            <Field label="Date of birth">
              <Input
                type="date"
                value={profile.dateOfBirth ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, dateOfBirth: e.target.value })
                }
              />
            </Field>
            <Field label="Sex assigned at birth">
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                value={profile.sex ?? ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    sex: (e.target.value || null) as Sex | null,
                  })
                }
              >
                <option value="">Select…</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="intersex">Intersex</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </Field>
            <Field label="Blood type">
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                value={profile.bloodType ?? "unknown"}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bloodType: e.target.value as BloodType,
                  })
                }
              >
                {[
                  "unknown",
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "AB+",
                  "AB-",
                  "O+",
                  "O-",
                ].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Height (cm)">
              <Input
                type="number"
                value={profile.heightCm ?? ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    heightCm: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </Field>
            <Field label="Weight (kg)">
              <Input
                type="number"
                value={profile.weightKg ?? ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    weightKg: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </Field>
          </CardContent>
        </Card>

        <ListCard
          title="Chronic conditions"
          description="E.g. asthma, type 2 diabetes, hypertension."
          items={profile.chronicConditions}
          onChange={(items) =>
            setProfile({ ...profile, chronicConditions: items })
          }
          placeholder="Add a condition…"
        />

        <ListCard
          title="Current medications"
          description="Use PBS or generic names (e.g. paracetamol, not Panadol)."
          items={profile.medications}
          onChange={(items) => setProfile({ ...profile, medications: items })}
          placeholder="Add a medication…"
        />

        <ListCard
          title="Allergies"
          description="Include severity if known (e.g. penicillin — anaphylaxis)."
          items={profile.allergies}
          onChange={(items) => setProfile({ ...profile, allergies: items })}
          placeholder="Add an allergy…"
        />

        <ListCard
          title="Past surgeries"
          description="Include approximate year if possible."
          items={profile.pastSurgeries}
          onChange={(items) =>
            setProfile({ ...profile, pastSurgeries: items })
          }
          placeholder="Add a past surgery…"
        />

        <Card>
          <CardHeader>
            <CardTitle>Medicare &amp; emergency</CardTitle>
            <CardDescription>
              Used only for telehealth bookings. Encrypted at rest.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Medicare number (optional)">
              <Input
                value={profile.medicareNumber ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, medicareNumber: e.target.value })
                }
                placeholder="10 digits"
                maxLength={11}
              />
            </Field>
            <Field label="Emergency contact (name, phone)">
              <Textarea
                placeholder="Jane Smith — 0412 345 678"
                value={profile.emergencyContacts
                  .map((c) => `${c.name} — ${c.phone}`)
                  .join("\n")}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    emergencyContacts: e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [name, phone] = line
                          .split("—")
                          .map((s) => s.trim());
                        return {
                          name: name || "",
                          phone: phone || "",
                          relationship: "",
                        };
                      }),
                  })
                }
              />
            </Field>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {message && (
            <span className="text-sm text-teal-600">{message}</span>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save profile
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ListCard({
  title,
  description,
  items,
  onChange,
  placeholder,
}: {
  title: string;
  description: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");

  function add() {
    const v = value.trim();
    if (!v) return;
    onChange([...items, v]);
    setValue("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/60 bg-gradient-to-r from-teal-50 to-teal-50/50 px-3 py-1.5 text-sm font-medium text-teal-700 shadow-sm dark:border-teal-800/60 dark:from-teal-900/40 dark:to-teal-900/20 dark:text-teal-200"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="rounded-full hover:bg-teal-100 dark:hover:bg-teal-800"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {items.length === 0 && (
            <span className="text-sm text-muted-foreground">None added.</span>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={add}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
