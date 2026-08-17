import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRedis, APPS_KEY } from "@/lib/redis";
import { parseAppInput } from "@/lib/app-input";
import type { AppEntry } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing app id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseAppInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const redis = getRedis();
  const existing = await redis.hget<AppEntry>(APPS_KEY, id);
  if (!existing) {
    return NextResponse.json({ error: "That app no longer exists." }, { status: 404 });
  }

  const updated: AppEntry = { ...existing, ...parsed.value };
  await redis.hset(APPS_KEY, { [id]: updated });

  return NextResponse.json({ app: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing app id." }, { status: 400 });
  }

  const redis = getRedis();
  await redis.hdel(APPS_KEY, id);

  return NextResponse.json({ ok: true });
}
