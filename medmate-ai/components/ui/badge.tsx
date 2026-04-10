import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm",
        secondary:
          "border-teal-200/60 bg-teal-50 text-teal-700 dark:border-teal-800/60 dark:bg-teal-900/40 dark:text-teal-200",
        amber:
          "border-amber-200/60 bg-amber-50 text-amber-800 dark:border-amber-800/60 dark:bg-amber-900/40 dark:text-amber-200",
        outline:
          "border-border text-foreground",
        destructive:
          "border-transparent bg-red-500 text-white shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
