import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export function getRedis(): Redis {
  if (client) return client;

  // UPSTASH_REDIS_REST_* is the name Upstash itself uses. KV_REST_API_* is what
  // Vercel's Marketplace "Upstash"/KV integration injects when you connect an
  // existing store from the Vercel dashboard instead of setting vars by hand.
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing Redis credentials. Set UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN " +
        "(or connect a Vercel KV/Upstash store, which sets KV_REST_API_URL / KV_REST_API_TOKEN)."
    );
  }

  client = new Redis({ url, token, enableAutoPipelining: false });
  return client;
}

export const APPS_KEY = "launchpad:apps";
export const favouritesKey = (user: string) => `launchpad:favourites:${user}`;
export const recentsKey = (user: string) => `launchpad:recents:${user}`;

export const MAX_RECENTS = 10;
