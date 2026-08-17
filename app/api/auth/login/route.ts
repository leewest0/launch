import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, createSessionToken, normalizeName } from "@/lib/session";

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { pin, name } = (body ?? {}) as { pin?: unknown; name?: unknown };

  const teamPin = process.env.TEAM_PIN;
  if (!teamPin) {
    return NextResponse.json(
      { error: "The server is missing its TEAM_PIN configuration." },
      { status: 500 }
    );
  }

  if (typeof pin !== "string" || pin !== teamPin) {
    return NextResponse.json({ error: "That PIN doesn't match." }, { status: 401 });
  }

  const cleanName = typeof name === "string" ? normalizeName(name) : "";
  if (!cleanName) {
    return NextResponse.json({ error: "Enter your name to continue." }, { status: 400 });
  }

  const token = createSessionToken(cleanName);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });

  return NextResponse.json({ name: cleanName });
}
