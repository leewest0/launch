"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Plus, Rocket } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopNavProps {
  user: string;
  onAddClick: () => void;
}

export function TopNav({ user, onAddClick }: TopNavProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent-a to-accent-b text-white">
            <Rocket size={16} strokeWidth={2.25} />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-foreground">
            LaunchPad
          </span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={onAddClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-2 text-xs font-semibold text-background cursor-pointer sm:px-4 sm:text-sm"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add app</span>
          </motion.button>

          <ThemeToggle />

          <div className="ml-1 hidden items-center gap-2 rounded-full border border-border bg-surface py-1 pr-1 pl-3 sm:flex">
            <span className="max-w-[8rem] truncate text-xs font-medium text-foreground">
              {user}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer disabled:opacity-60"
              disabled={loggingOut}
            >
              <LogOut size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-foreground sm:hidden cursor-pointer disabled:opacity-60"
            disabled={loggingOut}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
