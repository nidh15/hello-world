// ──────────────────────────────────────────────────────────────
// OzDoc AI — In-memory rate limiter & abuse protection
// ──────────────────────────────────────────────────────────────
//
// Simple sliding-window rate limiter for API routes. In-memory only
// so it does NOT survive a server restart and does NOT share state
// across Next.js serverless instances. For production you would
// swap this out for Upstash Redis / Vercel KV / Cloudflare Durable
// Objects. For a prototype, in-memory is the right amount of
// protection: it stops a single abusive tab hammering the chat
// endpoint without adding any infrastructure.
//
// This module is pure except for the in-memory Map. No network,
// no env access.

export interface RateLimitConfig {
  /** Max requests in the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  /** True if the request is allowed through */
  allowed: boolean;
  /** How many requests remain in the current window */
  remaining: number;
  /** Milliseconds until the window resets */
  retryAfterMs: number;
  /** Limit that was applied (for response headers) */
  limit: number;
}

// Timestamps of recent requests, keyed by client identifier.
// We store the full list rather than a counter so we can implement
// a true sliding window (not a fixed 60-second bucket).
const HITS = new Map<string, number[]>();

// Sensible defaults for the chat endpoint: 20 messages / minute is
// generous for a real user, instantly throttles a bot.
export const CHAT_RATE_LIMIT: RateLimitConfig = {
  limit: 20,
  windowMs: 60_000,
};

// Max body size we will accept per message (bytes).
export const MAX_MESSAGE_BYTES = 10_000;

// Max total conversation size (bytes). Prevents a client from
// re-sending 100MB of prior messages on every request.
export const MAX_CONVERSATION_BYTES = 200_000;

/**
 * Record a hit and return whether the request is allowed under the
 * sliding window limit. O(limit) per call, bounded.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = CHAT_RATE_LIMIT,
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Load & prune old hits for this key.
  const existing = HITS.get(key) ?? [];
  const recent = existing.filter((t) => t > windowStart);

  if (recent.length >= config.limit) {
    // Oldest hit in the window determines when the window rolls off.
    const oldest = recent[0] ?? now;
    const retryAfterMs = Math.max(0, oldest + config.windowMs - now);
    // Save pruned list even on reject so the window genuinely slides.
    HITS.set(key, recent);
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs,
      limit: config.limit,
    };
  }

  recent.push(now);
  HITS.set(key, recent);

  return {
    allowed: true,
    remaining: Math.max(0, config.limit - recent.length),
    retryAfterMs: 0,
    limit: config.limit,
  };
}

/**
 * Extract a stable client identifier from a Next.js Request. Falls
 * back through forwarded-for headers (Vercel, Cloudflare) and ends
 * at a "unknown" string — never throws.
 */
export function getClientKey(req: Request): string {
  const headers = req.headers;
  const candidates = [
    headers.get("x-forwarded-for"),
    headers.get("x-real-ip"),
    headers.get("cf-connecting-ip"),
    headers.get("true-client-ip"),
  ];
  for (const raw of candidates) {
    if (!raw) continue;
    // x-forwarded-for can be a comma-separated list; first entry is
    // the original client IP.
    const first = raw.split(",")[0]?.trim();
    if (first) return first;
  }
  return "unknown";
}

/**
 * Cheap abuse heuristic: reject messages that are obviously trying
 * to exhaust the model. Not a replacement for a real WAF.
 */
export function checkMessageSize(text: string): {
  ok: boolean;
  reason?: string;
} {
  if (!text) return { ok: true };
  // Byte length, not character length — a UTF-8 astral char is 4B.
  const bytes = new TextEncoder().encode(text).length;
  if (bytes > MAX_MESSAGE_BYTES) {
    return {
      ok: false,
      reason: `Message exceeds ${MAX_MESSAGE_BYTES} byte limit`,
    };
  }
  return { ok: true };
}

/**
 * Check total conversation size so a client cannot keep re-sending
 * an ever-growing message history.
 */
export function checkConversationSize(messages: { content: string }[]): {
  ok: boolean;
  reason?: string;
} {
  let total = 0;
  for (const m of messages) {
    total += new TextEncoder().encode(m.content).length;
    if (total > MAX_CONVERSATION_BYTES) {
      return {
        ok: false,
        reason: `Conversation exceeds ${MAX_CONVERSATION_BYTES} byte limit`,
      };
    }
  }
  return { ok: true };
}

/**
 * Test-only helper so unit tests can start from a clean slate.
 */
export function __resetRateLimitForTests(): void {
  HITS.clear();
}
