import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverClient } from "@/lib/supabase";
import { completeOnce } from "@/lib/claude";
import { SUMMARY_PROMPT } from "@/lib/prompts";
import type { ChatMessage, TriageLevel } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClient() {
  const cookieStore = cookies();
  return serverClient({
    get: (name) => {
      const c = cookieStore.get(name);
      return c ? { value: c.value } : undefined;
    },
    set: (name, value, options) => cookieStore.set(name, value, options),
    remove: (name, options) =>
      cookieStore.set(name, "", { ...options, maxAge: 0 }),
  });
}

function inferTriage(messages: ChatMessage[]): TriageLevel | null {
  const last = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.content?.toLowerCase();
  if (!last) return null;
  if (last.includes("call 000") || last.includes("000 immediately"))
    return "emergency";
  if (last.includes("emergency department")) return "urgent";
  if (last.includes("24") && last.includes("48")) return "see-gp-soon";
  if (last.includes("telehealth")) return "telehealth";
  if (last.includes("at home") || last.includes("self-care"))
    return "self-care";
  return null;
}

export async function GET() {
  const client = getClient();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 501 },
    );
  }
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await client
    .from("consultations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ consultations: data });
}

export async function POST(req: NextRequest) {
  const client = getClient();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 501 },
    );
  }
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await req.json()) as {
    title?: string;
    messages: ChatMessage[];
  };

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: "messages[] is required" },
      { status: 400 },
    );
  }

  // Generate a one-paragraph summary via Claude (best-effort).
  let summary: string | null = null;
  try {
    summary = await completeOnce(body.messages, SUMMARY_PROMPT);
  } catch {
    summary = null;
  }

  const triage = inferTriage(body.messages);

  const payload = {
    user_id: user.id,
    title:
      body.title ||
      body.messages.find((m) => m.role === "user")?.content.slice(0, 80) ||
      "New consultation",
    summary,
    triage,
    messages: body.messages,
  };

  const { data, error } = await client
    .from("consultations")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ consultation: data });
}

export async function DELETE(req: NextRequest) {
  const client = getClient();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 501 },
    );
  }
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await client
    .from("consultations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
