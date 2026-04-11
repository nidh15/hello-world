import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "rounded-xl bg-ocean-500 text-white shadow-md shadow-ocean-500/15 hover:bg-ocean-600 hover:shadow-warm-lg",
        coral:
          "rounded-xl bg-coral-500 text-white shadow-md shadow-coral-500/15 hover:bg-coral-600 hover:shadow-lg hover:shadow-coral-500/20",
        secondary:
          "rounded-xl bg-ocean-50 text-ocean-700 shadow-sm hover:bg-ocean-100 dark:bg-ocean-900/40 dark:text-ocean-200 dark:hover:bg-ocean-800/60",
        outline:
          "rounded-xl border-2 border-border bg-transparent hover:border-ocean-300 hover:bg-ocean-50/50 hover:text-ocean-700 dark:hover:border-ocean-700 dark:hover:bg-ocean-950/30",
        ghost:
          "rounded-xl hover:bg-accent hover:text-accent-foreground",
        destructive:
          "rounded-xl bg-red-500 text-white shadow-sm hover:bg-red-600",
        link:
          "text-ocean-600 underline-offset-4 hover:underline dark:text-ocean-400",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-7 text-base",
        xl: "h-14 rounded-2xl px-8 text-base tracking-wide",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
