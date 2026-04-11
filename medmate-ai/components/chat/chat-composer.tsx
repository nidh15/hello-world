"use client";

import { useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  disabled,
  loading,
  placeholder,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim() && !disabled) onSubmit();
      }}
      className="flex items-end gap-2 rounded-2xl border border-border/60 bg-card p-2.5 shadow-warm transition-all duration-200 focus-within:border-ocean-300 focus-within:shadow-glow dark:focus-within:border-ocean-700"
    >
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !disabled) onSubmit();
          }
        }}
        disabled={disabled}
        rows={1}
        placeholder={placeholder ?? "Describe your symptoms\u2026"}
        className={cn(
          "flex-1 resize-none bg-transparent px-2 py-2 font-body text-[15px] outline-none placeholder:text-muted-foreground/50",
          "max-h-[200px]",
        )}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
          value.trim() && !disabled
            ? "bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-md shadow-ocean-500/25 hover:shadow-lg active:scale-95"
            : "bg-muted text-muted-foreground",
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </button>
    </form>
  );
}
