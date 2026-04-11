import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-body text-sm shadow-sm transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-ocean-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500/30 focus-visible:border-ocean-400 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:border-ocean-700",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
