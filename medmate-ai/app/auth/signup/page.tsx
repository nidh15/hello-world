"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Stethoscope, UserPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { browserClient, isSupabaseConfigured } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!accepted) {
      setError("Please accept the Terms of Service to continue.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
      );
      return;
    }

    setLoading(true);
    const client = browserClient();
    if (!client) {
      setError("Supabase client unavailable.");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/chat`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/chat"), 1200);
  }

  return (
    <div className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-dot-grid opacity-30 dark:opacity-10" />
      <div className="absolute -right-40 -top-40 -z-10 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-800/20" />
      <div className="absolute -bottom-40 -left-40 -z-10 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl dark:bg-amber-800/10" />

      <Card className="w-full max-w-md animate-fade-in-up">
        <CardContent className="p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-500/25">
                <Stethoscope className="h-7 w-7" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400 shadow-md">
                <UserPlus className="h-3 w-3 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Create your MedMate account</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Free forever. Save your health profile and consultation history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border text-teal-500 focus:ring-teal-500"
              />
              <span className="leading-relaxed">
                I understand that MedMate AI is not a doctor and does not provide
                medical advice. I accept the{" "}
                <Link
                  href="/terms"
                  className="text-teal-600 underline underline-offset-2 hover:text-teal-700 dark:text-teal-400"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-teal-600 underline underline-offset-2 hover:text-teal-700 dark:text-teal-400"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-700 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-teal-200">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Account created. Check your email to verify, then log in.
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-teal-600 underline underline-offset-2 hover:text-teal-700 dark:text-teal-400"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
