import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "launchpad_session";
const MAX_NAME_LENGTH = 40;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing SESSION_SECRET environment variable.");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function normalizeName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").slice(0, MAX_NAME_LENGTH);
}

export function createSessionToken(username: string): string {
  const encoded = Buffer.from(username, "utf-8").toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, signature] = parts;

  let expected: string;
  try {
    expected = sign(encoded);
  } catch {
    return null;
  }

  const signatureBuf = Buffer.from(signature, "hex");
  const expectedBuf = Buffer.from(expected, "hex");
  if (signatureBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(signatureBuf, expectedBuf)) return null;

  try {
    const decoded = Buffer.from(encoded, "base64url").toString("utf-8");
    return decoded || null;
  } catch {
    return null;
  }
}
