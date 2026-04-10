import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div
      role="alert"
      className="w-full border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200"
    >
      <div className="container flex items-center justify-center gap-2">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <p>
          <strong>Medical emergency?</strong> Call{" "}
          <a href="tel:000" className="underline font-semibold">
            000
          </a>{" "}
          immediately. MedMate AI is not a doctor and does not provide medical
          advice.
        </p>
      </div>
    </div>
  );
}
