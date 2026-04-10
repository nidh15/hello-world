"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Video,
  AlertCircle,
  Sparkles,
  HeartPulse,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatComposer } from "@/components/chat/chat-composer";
import { generateId } from "@/lib/utils";
import type { ChatMessage as ChatMessageType, HealthProfile } from "@/types";

const SUGGESTIONS = [
  "I've had a headache for 3 days, should I be worried?",
  "My toddler has a fever of 38.5°C — what should I watch for?",
  "I'm feeling anxious and not sleeping well",
  "I was bitten by something on a bushwalk, when do I need help?",
];

interface Props {
  initialMessages?: ChatMessageType[];
  profile?: HealthProfile | null;
}

export function ChatWindow({ initialMessages = [], profile = null }: Props) {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Pick up symptom checker handoff payload from sessionStorage.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = sessionStorage.getItem("medmate:symptom-input");
    if (payload) {
      sessionStorage.removeItem("medmate:symptom-input");
      setInput(payload);
    }
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      setError(null);

      const userMsg: ChatMessageType = {
        id: generateId(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      const assistantMsg: ChatMessageType = {
        id: generateId(),
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      };

      const next = [...messages, userMsg, assistantMsg];
      setMessages(next);
      setInput("");
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            messages: next.slice(0, -1), // exclude the placeholder assistant msg
            profile,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const body = await res.text().catch(() => "");
          throw new Error(
            body || `Chat failed with status ${res.status}`,
          );
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last && last.role === "assistant") {
              copy[copy.length - 1] = { ...last, content: acc };
            }
            return copy;
          });
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong";
        setError(msg);
        setMessages((prev) => prev.slice(0, -1)); // drop the empty assistant msg
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming, profile],
  );

  const handleNew = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setError(null);
  }, []);

  const showTelehealthCTA = useMemo(
    () =>
      !streaming &&
      messages.length >= 4 &&
      messages.some((m) => m.role === "assistant"),
    [streaming, messages],
  );

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        aria-live="polite"
      >
        <div className="container max-w-3xl py-6">
          {isEmpty ? (
            <EmptyState onPick={(s) => send(s)} profile={profile} />
          ) : (
            <div className="flex flex-col gap-5">
              {messages.map((m, i) => (
                <ChatMessage
                  key={m.id}
                  message={m}
                  streaming={
                    streaming && i === messages.length - 1 && m.role === "assistant"
                  }
                />
              ))}
              {showTelehealthCTA && (
                <div className="mt-2 rounded-2xl border border-teal-100 bg-teal-50 p-4 dark:border-teal-900/40 dark:bg-teal-950/30">
                  <div className="flex items-start gap-3">
                    <Video className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        Want to discuss this with a real doctor?
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Book a telehealth consult with an Australian GP.
                        Bulk-billed when eligible, otherwise $39.95 AUD.
                      </p>
                    </div>
                    <Link href="/telehealth">
                      <Button size="sm">Book consult</Button>
                    </Link>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-background">
        <div className="container max-w-3xl py-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNew}
              disabled={isEmpty && !streaming}
            >
              <Plus className="h-4 w-4" />
              New consultation
            </Button>
            <p className="hidden text-xs text-muted-foreground sm:block">
              MedMate is not a doctor. In an emergency, call{" "}
              <a href="tel:000" className="font-semibold underline">
                000
              </a>
              .
            </p>
          </div>
          <ChatComposer
            value={input}
            onChange={setInput}
            onSubmit={() => send(input)}
            disabled={streaming}
            loading={streaming}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  onPick,
  profile,
}: {
  onPick: (s: string) => void;
  profile: HealthProfile | null;
}) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">
        <HeartPulse className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-bold md:text-3xl">
        G&apos;day{profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}.
        How can I help today?
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Describe what&apos;s going on and I&apos;ll ask a few questions, explain
        what might be happening, and suggest a clear next step.
      </p>

      <div className="mt-8 grid w-full max-w-xl gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="group rounded-xl border border-border bg-card p-4 text-left text-sm transition-colors hover:border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
              <span>{s}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
