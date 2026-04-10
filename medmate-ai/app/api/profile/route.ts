import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverClient } from "@/lib/supabase";
import type { HealthProfile } from "@/types";

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
    .from("health_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ profile: data });
}

export async function PUT(req: NextRequest) {
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

  const body = (await req.json()) as Partial<HealthProfile>;

  const payload = {
    user_id: user.id,
    full_name: body.fullName ?? null,
    date_of_birth: body.dateOfBirth ?? null,
    sex: body.sex ?? null,
    height_cm: body.heightCm ?? null,
    weight_kg: body.weightKg ?? null,
    blood_type: body.bloodType ?? null,
    chronic_conditions: body.chronicConditions ?? [],
    past_surgeries: body.pastSurgeries ?? [],
    medications: body.medications ?? [],
    allergies: body.allergies ?? [],
    medicare_number: body.medicareNumber ?? null,
    emergency_contacts: body.emergencyContacts ?? [],
    consented_to_terms: body.consentedToTerms ?? false,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from("health_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ profile: data });
}
