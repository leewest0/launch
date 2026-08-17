import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRedis, favouritesKey } from "@/lib/redis";

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

  const { appId, favourited } = (body ?? {}) as Record<string, unknown>;
  if (typeof appId !== "string" || !appId) {
    return NextResponse.json({ error: "Missing app id." }, { status: 400 });
  }

  const redis = getRedis();
  const key = favouritesKey(user);

  if (favourited) {
    await redis.sadd(key, appId);
  } else {
    await redis.srem(key, appId);
  }

  return NextResponse.json({ ok: true, favourited: Boolean(favourited) });
}
