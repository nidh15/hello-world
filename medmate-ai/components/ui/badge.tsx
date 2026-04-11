import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold font-body transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-ocean-500 to-ocean-600 text-white shadow-sm",
        secondary:
          "border-ocean-200/60 bg-ocean-50 text-ocean-700 dark:border-ocean-800/60 dark:bg-ocean-900/40 dark:text-ocean-200",
        coral:
          "border-coral-200/60 bg-coral-50 text-coral-800 dark:border-coral-800/60 dark:bg-coral-900/40 dark:text-coral-200",
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
