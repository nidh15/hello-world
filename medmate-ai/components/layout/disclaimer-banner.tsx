import { AlertTriangle, Phone } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div
      role="alert"
      className="w-full border-b border-coral-200/60 bg-gradient-to-r from-coral-50 via-coral-50/80 to-coral-50 px-4 py-2 text-center text-xs text-coral-900 dark:border-coral-900/30 dark:from-coral-950/50 dark:via-coral-950/30 dark:to-coral-950/50 dark:text-coral-200"
    >
      <div className="container flex items-center justify-center gap-2">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-coral-500" aria-hidden />
        <p>
          <strong>Medical emergency?</strong> Call{" "}
          <a
            href="tel:000"
            className="inline-flex items-center gap-0.5 font-bold underline decoration-coral-400 underline-offset-2 transition-colors hover:text-coral-700 dark:decoration-coral-600 dark:hover:text-coral-100"
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
