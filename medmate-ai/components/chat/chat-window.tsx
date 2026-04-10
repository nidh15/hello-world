"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Video,
  AlertCircle,
  Sparkles,
  HeartPulse,
  MessageSquareHeart,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatComposer } from "@/components/chat/chat-composer";
import { generateId } from "@/lib/utils";
import type { ChatMessage as ChatMessageType, HealthProfile } from "@/types";

const SUGGESTIONS = [
  {
    text: "I\u2019ve had a headache for 3 days, should I be worried?",
    icon: "headache",
  },
  {
    text: "My toddler has a fever of 38.5\u00B0C \u2014 what should I watch for?",
    icon: "fever",
  },
  {
    text: "I\u2019m feeling anxious and not sleeping well",
    icon: "mental",
  },
  {
    text: "I was bitten by something on a bushwalk, when do I need help?",
    icon: "bite",
  },
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
            messages: next.slice(0, -1),
            profile,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const body = await res.text().catch(() => "");
          throw new Error(body || `Chat failed with status ${res.status}`);
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
        setMessages((prev) => prev.slice(0, -1));
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
        className="flex-1 overflow-y-auto scroll-smooth"
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
                    streaming &&
                    i === messages.length - 1 &&
                    m.role === "assistant"
                  }
                />
              ))}

              {showTelehealthCTA && (
                <div className="mt-2 animate-fade-in rounded-2xl border border-teal-200/60 bg-gradient-to-r from-teal-50 to-teal-50/50 p-4 shadow-soft dark:border-teal-900/40 dark:from-teal-950/30 dark:to-teal-950/10">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-sm">
                      <Video className="h-4 w-4" />
                    </div>
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
                      <Button size="sm" className="group shrink-0">
                        Book consult
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {error && (
                <div className="animate-fade-in flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container max-w-3xl py-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNew}
              disabled={isEmpty && !streaming}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              New consultation
            </Button>
            <p className="hidden text-xs text-muted-foreground sm:block">
              MedMate is not a doctor. In an emergency, call{" "}
              <a
                href="tel:000"
                className="font-semibold text-foreground underline underline-offset-2"
              >
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
    <div className="flex flex-col items-center py-16 text-center">
      <div className="relative mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-500/25 animate-float-gentle">
          <HeartPulse className="h-8 w-8" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400 shadow-md">
          <MessageSquareHeart className="h-3.5 w-3.5 text-white" />
        </div>
      </div>

      <h1 className="text-2xl font-bold md:text-3xl">
        G&apos;day
        {profile?.fullName
          ? `, ${profile.fullName.split(" ")[0]}`
          : ""}
        . How can I help today?
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Describe what&apos;s going on and I&apos;ll ask a few questions, explain
        what might be happening, and suggest a clear next step.
      </p>

      <div className="stagger-children mt-10 grid w-full max-w-xl gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            onClick={() => onPick(s.text)}
            className="group animate-fade-in-up rounded-2xl border border-border/60 bg-card p-4 text-left text-sm shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-glow dark:hover:border-teal-700"
          >
            <div className="flex items-start gap-2.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-teal-500" />
              <span className="leading-relaxed">{s.text}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
