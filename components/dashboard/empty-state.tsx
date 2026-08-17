"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Plus, SearchX } from "lucide-react";

interface EmptyStateProps {
  variant: "no-apps" | "no-results";
  query?: string;
  onAddClick: () => void;
}

export function EmptyState({ variant, query, onAddClick }: EmptyStateProps) {
  const isNoApps = variant === "no-apps";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-hover text-muted">
        {isNoApps ? <LayoutGrid size={20} /> : <SearchX size={20} />}
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-foreground">
          {isNoApps ? "No apps here yet" : `Nothing matches "${query}"`}
        </p>
        <p className="mt-1 max-w-xs text-xs text-muted">
          {isNoApps
            ? "Add the first tool your team reaches for every day."
            : "Add it now so the next person doesn't have to search either."}
        </p>
      </div>
      <button
        type="button"
        onClick={onAddClick}
        className="mt-1 flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background cursor-pointer"
      >
        <Plus size={14} />
        {isNoApps ? "Add your first app" : `Add "${query}"`}
      </button>
    </motion.div>
  );
}
