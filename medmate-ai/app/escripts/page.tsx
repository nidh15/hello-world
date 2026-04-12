"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Pill,
  FileText,
  MapPin,
  Truck,
  Video,
  ClipboardList,
  Package,
  Search,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EScript } from "@/types";

const PHARMACIES = [
  {
    name: "Chemist Warehouse",
    address: "123 Bourke St, Melbourne VIC 3000",
  },
  {
    name: "Priceline Pharmacy",
    address: "456 George St, Sydney NSW 2000",
  },
  {
    name: "Terry White Chemmart",
    address: "89 Queen St, Brisbane QLD 4000",
  },
];

const STEPS = [
  {
    num: 1,
    icon: Video,
    title: "Complete a telehealth consult",
    description:
      "Chat with an AHPRA-registered GP via video or phone about your health concern.",
  },
  {
    num: 2,
    icon: ClipboardList,
    title: "GP issues an eScript",
    description:
      "If appropriate, your GP sends an electronic prescription directly through OzDoc.",
  },
  {
    num: 3,
    icon: MapPin,
    title: "Pick your pharmacy",
    description:
      "Choose any pharmacy in Australia — we'll send your eScript straight to them.",
  },
  {
    num: 4,
    icon: Package,
    title: "Collect your medication",
    description:
      "Head to your chosen pharmacy and pick up your medication. PBS pricing applies where eligible.",
  },
];

export default function EScriptsPage() {
  const [escripts] = useState<EScript[]>([]);
  const [pharmacyQuery, setPharmacyQuery] = useState("");

  const filteredPharmacies = PHARMACIES.filter(
    (p) =>
      p.name.toLowerCase().includes(pharmacyQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(pharmacyQuery.toLowerCase()),
  );

  return (
    <div className="container max-w-3xl py-10">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-500/25">
          <Pill className="h-6 w-6" />
        </div>
        <div>
          <h1 className="heading text-2xl font-bold">eScripts</h1>
          <p className="text-sm text-muted-foreground">
            Electronic prescriptions delivered to your nearest pharmacy.
          </p>
        </div>
      </div>

      {/* Info tiles */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <InfoTile
          icon={<FileText className="h-4 w-4" />}
          title="Digital prescriptions"
          body="No paper scripts. Your GP sends eScripts electronically."
        />
        <InfoTile
          icon={<MapPin className="h-4 w-4" />}
          title="Any pharmacy"
          body="Choose any pharmacy in Australia to collect your medication."
        />
        <InfoTile
          icon={<Truck className="h-4 w-4" />}
          title="Fast delivery"
          body="eScripts arrive at your pharmacy within minutes."
        />
      </div>

      {/* eScripts list / empty state */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your eScripts</CardTitle>
          <CardDescription>
            View and manage your electronic prescriptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {escripts.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-500/20 animate-float">
                <Pill className="h-7 w-7" />
              </div>
              <h2 className="heading text-lg font-bold">No eScripts yet</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                After a telehealth consult, your GP can send electronic
                prescriptions here. They&apos;ll appear in this list for you to
                manage.
              </p>
              <Link href="/telehealth">
                <Button className="group">
                  <Video className="h-4 w-4" />
                  Book a telehealth consult
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {escripts.map((script) => (
                <div
                  key={script.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {script.medicationName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {script.dosage} — {script.quantity} units,{" "}
                      {script.repeats} repeats
                    </p>
                  </div>
                  <Badge
                    variant={
                      script.status === "dispensed" ? "secondary" : "outline"
                    }
                  >
                    {script.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How eScripts work */}
      <div className="mb-8">
        <h2 className="heading mb-6 text-xl font-bold">How eScripts work</h2>
        <div className="space-y-4">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="flex items-start gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-warm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-md shadow-ocean-500/20">
                <step.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ocean-500">
                    Step {step.num}
                  </span>
                </div>
                <h3 className="heading text-sm font-semibold">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pharmacy selection */}
      <Card>
        <CardHeader>
          <CardTitle>Find your pharmacy</CardTitle>
          <CardDescription>
            Search for a pharmacy to send your eScript to.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              className="pl-10"
              placeholder="Search by pharmacy name or suburb…"
              value={pharmacyQuery}
              onChange={(e) => setPharmacyQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {filteredPharmacies.map((pharmacy) => (
              <button
                key={pharmacy.name}
                className="flex w-full items-center gap-3 rounded-xl border border-border/60 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-ocean-300 hover:shadow-warm dark:hover:border-ocean-700"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ocean-50 text-ocean-600 dark:bg-ocean-900/40 dark:text-ocean-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{pharmacy.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {pharmacy.address}
                  </p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </button>
            ))}
            {filteredPharmacies.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No pharmacies found. Try a different search term.
              </p>
            )}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            This is a demo. In the full version, pharmacy search will use real
            location data from the Australian Pharmacy Guild directory.
          </p>
        </CardContent>
      </Card>
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
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}
