"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryPillsProps {
  categories: { name: string; count: number }[];
  active: string | null;
  onChange: (category: string | null) => void;
  totalCount: number;
}

export function CategoryPills({ categories, active, onChange, totalCount }: CategoryPillsProps) {
  if (categories.length === 0) return null;

  const items: { label: string; value: string | null; count: number }[] = [
    { label: "All", value: null, count: totalCount },
    ...categories.map((c) => ({ label: c.name, value: c.name, count: c.count })),
  ];

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {items.map((item) => {
        const isActive = active === item.value;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              "relative shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer sm:text-sm",
              isActive
                ? "border-foreground text-background"
                : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="active-category-pill"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-full bg-foreground"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {item.label}
              <span
                className={cn(
                  "text-[11px]",
                  isActive ? "text-background/70" : "text-muted/70"
                )}
              >
                {item.count}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
