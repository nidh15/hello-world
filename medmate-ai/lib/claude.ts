// ──────────────────────────────────────────────────────────────
// OzDoc AI — Anthropic Claude API client
// ──────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";
import { OZDOC_SYSTEM_PROMPT, buildProfileContext } from "@/lib/prompts";
import type { ChatMessage, HealthProfile } from "@/types";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

let _client: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Add it to .env.local before running the chat.",
      );
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

function toApiMessages(messages: ChatMessage[]): Anthropic.MessageParam[] {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
}

export function buildSystemPrompt(profile: HealthProfile | null): string {
  const profileBlock = buildProfileContext(profile);
  if (!profileBlock) return OZDOC_SYSTEM_PROMPT;
  return `${OZDOC_SYSTEM_PROMPT}\n\n${profileBlock}`;
}

/**
 * Stream a chat completion from Claude. Yields text deltas as they arrive.
 */
export async function* streamChat(
  messages: ChatMessage[],
  profile: HealthProfile | null = null,
): AsyncGenerator<string, void, unknown> {
  const client = getClaudeClient();
  const system = buildSystemPrompt(profile);

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 2048,
    system,
    messages: toApiMessages(messages),
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}

/**
 * Non-streaming completion — used for generating consultation summaries.
 */
export async function completeOnce(
  messages: ChatMessage[],
  systemOverride?: string,
): Promise<string> {
  const client = getClaudeClient();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: systemOverride ?? OZDOC_SYSTEM_PROMPT,
    messages: toApiMessages(messages),
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  return text;
}
