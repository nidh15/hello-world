import { NextRequest } from "next/server";
import { streamChat } from "@/lib/claude";
import type { ChatMessage, HealthProfile } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequestBody {
  messages: ChatMessage[];
  profile?: HealthProfile | null;
}

export async function POST(req: NextRequest) {
  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages[] is required" }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "ANTHROPIC_API_KEY is not configured. Add it to .env.local and restart the dev server.",
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of streamChat(
          body.messages,
          body.profile ?? null,
        )) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown streaming error";
        controller.enqueue(
          encoder.encode(`\n\n[MedMate error: ${message}]`),
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
    },
  });
}
