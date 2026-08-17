import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Normalizes user-entered URLs, defaulting to https:// when no protocol is given. */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Only http/https URLs are allowed to prevent javascript: / data: link injection. */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function faviconUrl(url: string, size = 64): string {
  const host = getHostname(url);
  return `https://www.google.com/s2/favicons?sz=${size}&domain=${encodeURIComponent(host)}`;
}

const CATEGORY_PALETTE = [
  { bg: "bg-teal-500/15", text: "text-teal-600 dark:text-teal-300", ring: "ring-teal-500/30" },
  { bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-300", ring: "ring-blue-500/30" },
  { bg: "bg-violet-500/15", text: "text-violet-600 dark:text-violet-300", ring: "ring-violet-500/30" },
  { bg: "bg-amber-500/15", text: "text-amber-600 dark:text-amber-300", ring: "ring-amber-500/30" },
  { bg: "bg-rose-500/15", text: "text-rose-600 dark:text-rose-300", ring: "ring-rose-500/30" },
  { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-300", ring: "ring-emerald-500/30" },
  { bg: "bg-indigo-500/15", text: "text-indigo-600 dark:text-indigo-300", ring: "ring-indigo-500/30" },
  { bg: "bg-orange-500/15", text: "text-orange-600 dark:text-orange-300", ring: "ring-orange-500/30" },
] as const;

export function categoryStyle(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash << 5) - hash + category.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % CATEGORY_PALETTE.length;
  return CATEGORY_PALETTE[index];
}

export const DEFAULT_CATEGORY = "General";
