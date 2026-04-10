"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  FileText,
  Loader2,
  Download,
  Trash2,
  Stethoscope,
  MessageSquareHeart,
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
import { formatDate } from "@/lib/utils";
import type { Consultation, TriageLevel } from "@/types";

const triageLabels: Record<TriageLevel, { label: string; cls: string }> = {
  emergency: { label: "Call 000", cls: "bg-red-100 text-red-800" },
  urgent: { label: "Emergency Dept", cls: "bg-orange-100 text-orange-800" },
  "see-gp-soon": { label: "See GP soon", cls: "bg-amber-100 text-amber-900" },
  telehealth: { label: "Telehealth", cls: "bg-teal-100 text-teal-800" },
  "self-care": { label: "Self-care", cls: "bg-emerald-100 text-emerald-800" },
};

export default function HistoryPage() {
  const [items, setItems] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/consultations");
        if (res.status === 401) {
          setError("Please log in to view your consultation history.");
          return;
        }
        if (res.status === 501) {
          setError(
            "Supabase is not configured. History persistence is disabled.",
          );
          return;
        }
        const json = await res.json();
        const raw = json.consultations ?? [];
        setItems(
          raw.map((c: Record<string, unknown>) => ({
            id: c.id as string,
            userId: c.user_id as string,
            title: c.title as string,
            summary: (c.summary as string) ?? null,
            triage: (c.triage as TriageLevel) ?? null,
            messages: (c.messages as Consultation["messages"]) ?? [],
            createdAt: c.created_at as string,
            updatedAt: c.updated_at as string,
          })),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load history",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary?.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q)),
    );
  }, [items, query]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this consultation? This cannot be undone.")) return;
    const res = await fetch(`/api/consultations?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((c) => c.id !== id));
    }
  }

  function handleExport(c: Consultation) {
    const lines: string[] = [
      `MedMate AI — Consultation export`,
      `Date: ${formatDate(c.createdAt)}`,
      `Title: ${c.title}`,
      c.triage ? `Triage: ${triageLabels[c.triage].label}` : "",
      "",
      `Summary:`,
      c.summary || "(no summary)",
      "",
      `Full transcript:`,
      ...c.messages.map(
        (m) => `[${m.role.toUpperCase()}]\n${m.content}\n`,
      ),
      "",
      `—`,
      `This is informational only. MedMate AI is not a doctor.`,
    ].filter(Boolean);

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medmate-${c.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-white">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Consultation history</h1>
          <p className="text-sm text-muted-foreground">
            Your past chats, summarised and searchable.
          </p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by keyword, symptom, or summary…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {!loading && !error && filtered.length === 0 && (
        <EmptyHistory />
      )}

      <div className="space-y-4">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="truncate">{c.title}</CardTitle>
                  {c.triage && (
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ${triageLabels[c.triage].cls}`}
                    >
                      {triageLabels[c.triage].label}
                    </span>
                  )}
                </div>
                <CardDescription>{formatDate(c.createdAt)}</CardDescription>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleExport(c)}
                  aria-label="Export"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(c.id)}
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {c.summary || "(no summary available)"}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {c.messages.length} messages
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EmptyHistory() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">
          <Stethoscope className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold">No consultations yet</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your saved consultations will appear here. Start a chat with MedMate
          to get going.
        </p>
        <Link href="/chat">
          <Button>
            <MessageSquareHeart className="h-4 w-4" />
            Start a consultation
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
