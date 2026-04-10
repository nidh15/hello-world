import { AlertTriangle, Phone } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div
      role="alert"
      className="w-full border-b border-amber-200/60 bg-gradient-to-r from-amber-50 via-amber-50/80 to-amber-50 px-4 py-2 text-center text-xs text-amber-900 dark:border-amber-900/30 dark:from-amber-950/50 dark:via-amber-950/30 dark:to-amber-950/50 dark:text-amber-200"
    >
      <div className="container flex items-center justify-center gap-2">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden />
        <p>
          <strong>Medical emergency?</strong> Call{" "}
          <a
            href="tel:000"
            className="inline-flex items-center gap-0.5 font-bold underline decoration-amber-400 underline-offset-2 transition-colors hover:text-amber-700 dark:decoration-amber-600 dark:hover:text-amber-100"
          >
            <Phone className="h-3 w-3" />
            000
          </a>{" "}
          immediately. MedMate AI is not a doctor and does not provide medical
          advice.
        </p>
      </div>
    </div>
  );
}
