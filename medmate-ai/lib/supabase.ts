// ──────────────────────────────────────────────────────────────
// MedMate AI — Supabase client helpers
// ──────────────────────────────────────────────────────────────
//
// We expose three factories:
//   - browserClient(): for use in client components
//   - serverClient():  for use in server components / route handlers
//   - adminClient():   service-role, server-only, bypasses RLS
//
// If env vars are missing, helpers return null so the app can still
// run in "demo mode" without Supabase configured.
// ──────────────────────────────────────────────────────────────

import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { CookieOptions } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

export function browserClient() {
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}

/**
 * Server-side Supabase client. Pass a cookie adapter from next/headers.
 */
export function serverClient(cookies: {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
}) {
  if (!url || !anonKey) return null;

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookies.set(name, value, options);
        } catch {
          // Called from a Server Component — safe to ignore.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookies.remove(name, options);
        } catch {
          // Called from a Server Component — safe to ignore.
        }
      },
    },
  });
}

/**
 * Service-role client. SERVER-ONLY. Bypasses RLS; never expose to the browser.
 */
export function adminClient() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
