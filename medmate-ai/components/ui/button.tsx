import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/20 hover:from-teal-400 hover:to-teal-600 hover:shadow-lg hover:shadow-teal-500/30 active:from-teal-600 active:to-teal-700",
        secondary:
          "bg-teal-50 text-teal-700 shadow-sm hover:bg-teal-100 hover:shadow-md dark:bg-teal-900/40 dark:text-teal-100 dark:hover:bg-teal-800/60",
        amber:
          "bg-gradient-to-b from-amber-400 to-amber-500 text-white shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-600 hover:shadow-lg hover:shadow-amber-500/30",
        outline:
          "border-2 border-border bg-background hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-700 dark:hover:border-teal-700 dark:hover:bg-teal-900/20 dark:hover:text-teal-200",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-sm shadow-red-500/20 hover:from-red-400 hover:to-red-600",
        link: "text-teal-600 underline-offset-4 hover:underline dark:text-teal-400",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-7 text-base",
        xl: "h-14 rounded-2xl px-8 text-base",
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
