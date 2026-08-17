import { DEFAULT_CATEGORY, isSafeUrl, normalizeUrl } from "@/lib/utils";

export const MAX_FIELD_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 240;

export interface ParsedAppInput {
  name: string;
  url: string;
  category: string;
  description: string;
}

export type ParseAppInputResult =
  | { ok: true; value: ParsedAppInput }
  | { ok: false; error: string };

export function parseAppInput(body: unknown): ParseAppInputResult {
  const { name, url, category, description } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return { ok: false, error: "Give the app a name." };
  }
  if (typeof url !== "string" || !url.trim()) {
    return { ok: false, error: "Add a URL for the app." };
  }

  const normalizedUrl = normalizeUrl(url);
  if (!isSafeUrl(normalizedUrl)) {
    return { ok: false, error: "That URL doesn't look valid." };
  }

  return {
    ok: true,
    value: {
      name: name.trim().slice(0, MAX_FIELD_LENGTH),
      url: normalizedUrl,
      category:
        typeof category === "string" && category.trim()
          ? category.trim().slice(0, MAX_FIELD_LENGTH)
          : DEFAULT_CATEGORY,
      description:
        typeof description === "string" ? description.trim().slice(0, MAX_DESCRIPTION_LENGTH) : "",
    },
  };
}
