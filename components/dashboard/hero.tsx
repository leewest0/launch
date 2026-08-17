"use client";

import { type RefObject } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface HeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  resultCount: number | null;
  appCount: number;
}

export function Hero({ query, onQueryChange, inputRef, resultCount, appCount }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden px-4 pt-14 pb-10 text-center sm:pt-20 sm:pb-14">
      <div className="ambient-glow opacity-70" />

      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted"
      >
        {appCount > 0 ? `${appCount} app${appCount === 1 ? "" : "s"} launch-ready` : "Your team's apps, in one place"}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="relative z-10 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
      >
        Find any app in seconds
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="relative z-10 mx-auto mt-7 w-full max-w-xl"
      >
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-muted"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            type="text"
            placeholder="Search apps, categories, or links…"
            className="w-full rounded-full border border-border bg-surface py-4 pr-14 pl-13 text-sm text-foreground shadow-lg shadow-black/5 outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring sm:text-base"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-4 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-surface-hover hover:text-foreground cursor-pointer"
            >
              <X size={15} />
            </button>
          ) : (
            <kbd className="absolute top-1/2 right-4 -translate-y-1/2 hidden rounded-md border border-border bg-surface-hover px-1.5 py-0.5 font-mono text-[11px] text-muted sm:block">
              /
            </kbd>
          )}
        </div>
        {query && resultCount !== null && (
          <p className="mt-2.5 text-xs text-muted">
            {resultCount === 0
              ? `No apps match "${query}"`
              : `${resultCount} result${resultCount === 1 ? "" : "s"} for "${query}"`}
          </p>
        )}
      </motion.div>
    </section>
  );
}
