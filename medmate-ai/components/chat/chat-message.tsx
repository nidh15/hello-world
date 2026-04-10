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
        "flex w-full animate-fade-in gap-3",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white">
          <Stethoscope className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 prose-chat",
          isUser
            ? "rounded-tr-sm bg-teal-500 text-white"
            : "rounded-tl-sm bg-muted text-foreground",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || ""}
            </ReactMarkdown>
            {streaming && (
              <span className="ml-1 inline-block h-3 w-1.5 animate-pulse-soft bg-teal-500 align-middle" />
            )}
          </>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-100">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
