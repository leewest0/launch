"use client";

import { motion } from "framer-motion";
import { Star, Trash2, Pencil, ArrowUpRight } from "lucide-react";
import { categoryStyle, cn, faviconUrl, getHostname } from "@/lib/utils";
import type { AppEntry } from "@/lib/types";

interface AppCardProps {
  app: AppEntry;
  favourited: boolean;
  onOpen: (app: AppEntry) => void;
  onToggleFavourite: (app: AppEntry) => void;
  onEdit: (app: AppEntry) => void;
  onDelete: (app: AppEntry) => void;
  showCategory?: boolean;
}

export function AppCard({
  app,
  favourited,
  onOpen,
  onToggleFavourite,
  onEdit,
  onDelete,
  showCategory = true,
}: AppCardProps) {
  const style = categoryStyle(app.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-lg hover:shadow-black/5"
    >
      <button
        type="button"
        onClick={() => onOpen(app)}
        className="flex flex-1 items-start gap-3 text-left cursor-pointer"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-hover">
          {/* eslint-disable-next-line @next/next/no-img-element -- external favicon service, dimensions unknown ahead of time */}
          <img
            src={faviconUrl(app.url)}
            alt=""
            width={24}
            height={24}
            loading="lazy"
            className="h-6 w-6"
          />
        </span>
        <span className="min-w-0 flex-1">
          {/*
            pr-8 always reserves just enough room for the always-visible favourite
            star; it grows to pr-20 on hover to also clear the edit/delete icons,
            which only render then. Keeps the name at near-full card width at rest
            instead of a permanent, worst-case padding reservation squeezing every
            card's title down to a couple of characters per line.
          */}
          <span className="flex items-start gap-1 pr-8 font-display text-sm font-semibold text-foreground transition-[padding] duration-150 group-hover:pr-20">
            <span title={app.name} className="break-words">
              {app.name}
            </span>
            <ArrowUpRight
              size={13}
              className="mt-0.5 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
            />
          </span>
          <span
            title={getHostname(app.url)}
            className="mt-0.5 block break-words text-xs text-muted"
          >
            {getHostname(app.url)}
          </span>
          {app.description && (
            <span className="mt-1.5 line-clamp-2 block text-xs text-muted/90">
              {app.description}
            </span>
          )}
          {showCategory && (
            <span
              className={cn(
                "mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium",
                style.bg,
                style.text
              )}
            >
              {app.category}
            </span>
          )}
        </span>
      </button>

      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onToggleFavourite(app)}
          aria-label={favourited ? `Unfavourite ${app.name}` : `Favourite ${app.name}`}
          aria-pressed={favourited}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full transition-all cursor-pointer",
            favourited
              ? "text-amber-400 opacity-100"
              : "text-muted opacity-0 hover:bg-surface-hover group-hover:opacity-100 focus-visible:opacity-100"
          )}
        >
          <Star size={15} fill={favourited ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={() => onEdit(app)}
          aria-label={`Edit ${app.name}`}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted opacity-0 transition-colors hover:bg-surface-hover hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(app)}
          aria-label={`Remove ${app.name}`}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted opacity-0 transition-colors hover:bg-rose-500/10 hover:text-rose-500 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
