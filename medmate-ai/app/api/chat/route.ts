import { NextRequest } from "next/server";
import { streamChat } from "@/lib/claude";
import { redactMessages } from "@/lib/privacy/redact";
import {
  checkConversationSize,
  checkMessageSize,
  checkRateLimit,
  getClientKey,
} from "@/lib/security/rate-limit";
import type { ChatMessage, HealthProfile } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequestBody {
  messages: ChatMessage[];
  profile?: HealthProfile | null;
}

function jsonError(
  status: number,
  error: string,
  extraHeaders: Record<string, string> = {},
) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}

export async function POST(req: NextRequest) {
  // ─── 1. Rate limit first, before parsing a potentially huge body ───
  const clientKey = getClientKey(req);
  const rate = checkRateLimit(clientKey);
  if (!rate.allowed) {
    const retryAfterSec = Math.ceil(rate.retryAfterMs / 1000);
    return jsonError(
      429,
      `Too many requests — please wait ${retryAfterSec}s before sending another message.`,
      {
        "retry-after": String(retryAfterSec),
        "x-ratelimit-limit": String(rate.limit),
        "x-ratelimit-remaining": "0",
      },
    );
  }

  // ─── 2. Parse the body ───
  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonError(400, "messages[] is required");
  }

  // ─── 3. Size limits ───
  const convoSize = checkConversationSize(body.messages);
  if (!convoSize.ok) {
    return jsonError(413, convoSize.reason ?? "Conversation too large");
  }
  const lastUser = body.messages[body.messages.length - 1];
  if (lastUser) {
    const msgSize = checkMessageSize(lastUser.content);
    if (!msgSize.ok) {
      return jsonError(413, msgSize.reason ?? "Message too large");
    }
  }

  // ─── 4. Environment ───
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError(
      500,
      "ANTHROPIC_API_KEY is not configured. Add it to .env.local and restart the dev server.",
    );
  }

  // ─── 5. Redact PII before sending to the model ───
  //
  // We never want a Medicare number, TFN, or raw phone to cross the
  // network boundary into the LLM. Conversations are not used for
  // training under OzDoc's Anthropic terms, but the defence-in-depth
  // position is: don't send it in the first place. See
  // lib/privacy/redact.ts for the full scope.
  const { messages: redactedMessages, counts, redacted } = redactMessages(
    body.messages,
  );

  // Log redaction counts to the server log (never the user-facing
  // stream) so we have an audit trail. No PII is logged.
  if (redacted) {
    console.info(
      "[ozdoc-chat] redacted outbound PII",
      JSON.stringify({ clientKey: hashKey(clientKey), counts }),
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of streamChat(
          redactedMessages,
          body.profile ?? null,
        )) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown streaming error";
        controller.enqueue(
          encoder.encode(`\n\n[OzDoc error: ${message}]`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-content-type-options": "nosniff",
      "x-ratelimit-limit": String(rate.limit),
      "x-ratelimit-remaining": String(rate.remaining),
    },
  });
}

/**
 * Short, non-cryptographic hash of an IP so it can appear in server
 * logs without being a raw identifier. Good enough for dedup; not a
 * substitute for real log hygiene.
 */
function hashKey(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) | 0;
  }
  return `h_${(h >>> 0).toString(16)}`;
}
