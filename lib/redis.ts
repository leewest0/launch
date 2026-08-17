import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export function getRedis(): Redis {
  if (client) return client;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN environment variables."
    );
  }

  client = new Redis({ url, token, enableAutoPipelining: false });
  return client;
}

export const APPS_KEY = "launchpad:apps";
export const favouritesKey = (user: string) => `launchpad:favourites:${user}`;
export const recentsKey = (user: string) => `launchpad:recents:${user}`;

export const MAX_RECENTS = 10;
