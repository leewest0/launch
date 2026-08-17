import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRedis, APPS_KEY } from "@/lib/redis";

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
