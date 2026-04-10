"use client";

import { Stethoscope, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types";

interface Props {
  message: ChatMessageType;
  streaming?: boolean;
}

export function ChatMessage({ message, streaming }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isUser
          ? "animate-slide-in-right justify-end"
          : "animate-slide-in-left justify-start",
      )}
    >
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-md shadow-teal-500/20">
          <Stethoscope className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 prose-chat shadow-soft",
          isUser
            ? "rounded-br-md bg-gradient-to-br from-teal-500 to-teal-600 text-white"
            : "rounded-bl-md border border-border/40 bg-card text-foreground",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-[15px]">{message.content}</p>
        ) : (
          <>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || ""}
            </ReactMarkdown>
            {streaming && message.content === "" && <TypingIndicator />}
            {streaming && message.content !== "" && (
              <span className="ml-0.5 inline-block h-4 w-[3px] animate-pulse-soft rounded-full bg-teal-500 align-middle" />
            )}
          </>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700 shadow-sm dark:from-teal-800 dark:to-teal-900 dark:text-teal-100">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="MedMate is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-teal-400"
          style={{
            animation: "typing-dot 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}
