import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRedis, APPS_KEY } from "@/lib/redis";
import { DEFAULT_CATEGORY, isSafeUrl, normalizeUrl } from "@/lib/utils";
import type { AppEntry } from "@/lib/types";

const MAX_FIELD_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 240;

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

  const { name, url, category, description } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Give the app a name." }, { status: 400 });
  }
  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "Add a URL for the app." }, { status: 400 });
  }

  const normalizedUrl = normalizeUrl(url);
  if (!isSafeUrl(normalizedUrl)) {
    return NextResponse.json({ error: "That URL doesn't look valid." }, { status: 400 });
  }

  const app: AppEntry = {
    id: randomUUID(),
    name: name.trim().slice(0, MAX_FIELD_LENGTH),
    url: normalizedUrl,
    category:
      typeof category === "string" && category.trim()
        ? category.trim().slice(0, MAX_FIELD_LENGTH)
        : DEFAULT_CATEGORY,
    description:
      typeof description === "string" ? description.trim().slice(0, MAX_DESCRIPTION_LENGTH) : "",
    addedBy: user,
    createdAt: Date.now(),
  };

  const redis = getRedis();
  await redis.hset(APPS_KEY, { [app.id]: app });

  return NextResponse.json({ app }, { status: 201 });
}
