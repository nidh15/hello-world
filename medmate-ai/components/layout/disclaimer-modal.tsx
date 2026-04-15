"use client";

// ──────────────────────────────────────────────────────────────
// OzDoc AI — First-visit "not a medical device" consent modal
// ──────────────────────────────────────────────────────────────
//
// Every user who opens OzDoc sees this modal on first load. They
// cannot dismiss it by clicking outside or hitting escape — they
// must press the "I understand" button. The button records a
// versioned consent record in localStorage so we can re-prompt if
// we update the disclaimer copy.
//
// What this modal is for:
//   - Makes it unambiguous that OzDoc is NOT a medical device and
//     NOT a substitute for a registered clinician.
//   - Gives the user a single click that functions as informed
//     consent for data handling (links to /privacy).
//   - Points users with an active emergency straight to 000.
//
// What this modal is NOT:
//   - It is not a Terms of Service modal. ToS is handled in the
//     signup flow. This is the information-only consumer gate.
//   - It is not a substitute for TGA registration — it is the
//     current risk-reduction step while the product is pre-clinical.
//
// Storage: `localStorage["ozdoc:consent:v1"] = ISO timestamp`.
// Bumping the version key forces every user to re-consent.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Phone,
  HeartPulse,
  BookOpenCheck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_STORAGE_KEY = "ozdoc:consent:v1";

export function DisclaimerModal() {
  // Default to `false` so the modal does NOT flash on SSR/hydration.
  // We then flip it to `true` in an effect once we've checked
  // localStorage — which means SSR renders nothing and the client
  // decides whether to show the modal. That's fine because the
  // modal is purely informational, not SEO content.
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const existing = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!existing) {
        setOpen(true);
      }
    } catch {
      // localStorage can throw in private mode on some browsers.
      // If we can't read it, show the modal — safer default.
      setOpen(true);
    }
  }, []);

  // Lock background scroll while the modal is up so mobile users
  // can't swipe past it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted || !open) return null;

  const handleAccept = () => {
    try {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        new Date().toISOString(),
      );
    } catch {
      // If we can't persist, the modal will reappear on next load —
      // which is fine.
    }
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ozdoc-disclaimer-title"
      aria-describedby="ozdoc-disclaimer-body"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop — intentionally not clickable to dismiss */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        aria-hidden
      />

      {/* Panel */}
      <div className="animate-fade-up relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-border/60 bg-gradient-to-r from-coral-50 to-amber-50 px-6 py-4 dark:from-coral-950/30 dark:to-amber-950/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-coral-400 to-coral-600 text-white shadow-md">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="ozdoc-disclaimer-title"
              className="heading text-lg font-bold"
            >
              Before you start
            </h2>
            <p className="text-xs text-muted-foreground">
              OzDoc AI is information only, not medical advice.
            </p>
          </div>
        </div>

        {/* Body */}
        <div id="ozdoc-disclaimer-body" className="space-y-4 px-6 py-5">
          <p className="text-sm leading-relaxed">
            OzDoc AI is{" "}
            <strong className="font-semibold">
              not a registered medical device
            </strong>{" "}
            and is not a substitute for a qualified, AHPRA-registered
            healthcare professional. It is a consumer information tool
            designed to help you understand symptoms and find the right
            care pathway — it cannot diagnose, prescribe, or provide
            individualised treatment on its own.
          </p>

          <div className="flex items-start gap-3 rounded-xl border border-coral-300/60 bg-coral-50/60 p-3 dark:border-coral-900/40 dark:bg-coral-950/20">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-coral-600 dark:text-coral-400" />
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">In a medical emergency,</span>{" "}
              call{" "}
              <a
                href="tel:000"
                className="font-bold underline underline-offset-2"
              >
                000
              </a>{" "}
              immediately. Do not wait for OzDoc to respond.
            </p>
          </div>

          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-ocean-500" />
              <span>
                For anything that feels urgent, call{" "}
                <strong className="text-foreground">000</strong>,
                Healthdirect on{" "}
                <strong className="text-foreground">1800 022 222</strong>, or
                your nearest emergency department.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-ocean-500" />
              <span>
                Every triage recommendation OzDoc shows you comes from an{" "}
                <Link
                  href="/clinical-governance"
                  className="font-medium text-foreground underline underline-offset-2"
                >
                  open, deterministic rule set
                </Link>{" "}
                with Australian clinical citations — you can inspect it.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-ocean-500" />
              <span>
                Your conversation is private. We redact identifiers (phone,
                Medicare, email) before anything is sent to the AI model, and
                we never train third-party models on your health data. See
                the{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-foreground underline underline-offset-2"
                >
                  privacy page
                </Link>
                .
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t border-border/60 bg-muted/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            By continuing, you confirm you understand this and consent to
            how OzDoc handles your information.
          </p>
          <Button
            type="button"
            onClick={handleAccept}
            className="shrink-0"
            autoFocus
          >
            I understand &amp; continue
          </Button>
        </div>
      </div>
    </div>
  );
}
