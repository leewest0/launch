import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRedis, recentsKey, MAX_RECENTS } from "@/lib/redis";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { appId } = (body ?? {}) as Record<string, unknown>;
  if (typeof appId !== "string" || !appId) {
    return NextResponse.json({ error: "Missing app id." }, { status: 400 });
  }

  const redis = getRedis();
  const key = recentsKey(user);

  await redis.lrem(key, 0, appId);
  await redis.lpush(key, appId);
  await redis.ltrim(key, 0, MAX_RECENTS - 1);

  return NextResponse.json({ ok: true });
}
