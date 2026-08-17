"use client";

import { AnimatePresence } from "framer-motion";
import { AppCard } from "@/components/dashboard/app-card";
import type { AppEntry } from "@/lib/types";

interface AppGridProps {
  apps: AppEntry[];
  favouriteIds: Set<string>;
  onOpen: (app: AppEntry) => void;
  onToggleFavourite: (app: AppEntry) => void;
  onEdit: (app: AppEntry) => void;
  onDelete: (app: AppEntry) => void;
  showCategory?: boolean;
}

export function AppGrid({
  apps,
  favouriteIds,
  onOpen,
  onToggleFavourite,
  onEdit,
  onDelete,
  showCategory = true,
}: AppGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            favourited={favouriteIds.has(app.id)}
            onOpen={onOpen}
            onToggleFavourite={onToggleFavourite}
            onEdit={onEdit}
            onDelete={onDelete}
            showCategory={showCategory}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
