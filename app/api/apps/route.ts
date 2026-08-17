import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRedis, APPS_KEY } from "@/lib/redis";
import { parseAppInput } from "@/lib/app-input";
import type { AppEntry } from "@/lib/types";

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

  const parsed = parseAppInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const app: AppEntry = {
    id: randomUUID(),
    ...parsed.value,
    addedBy: user,
    createdAt: Date.now(),
  };

  const redis = getRedis();
  await redis.hset(APPS_KEY, { [app.id]: app });

  return NextResponse.json({ app }, { status: 201 });
}
