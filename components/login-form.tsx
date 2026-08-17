"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound, Loader2, User } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function LoginForm() {
  const router = useRouter();
  const { push } = useToast();
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        push(data.error ?? "Something went wrong.", "error");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      push("Couldn't reach the server. Try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-3xl border border-border bg-surface/80 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8"
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Your name</span>
        <div className="relative">
          <User size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <input
            autoFocus
            required
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grace Owusu"
            className="w-full rounded-xl border border-border bg-background py-3 pr-4 pl-10 text-foreground outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring"
          />
        </div>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Team PIN</span>
        <div className="relative">
          <KeyRound size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <input
            required
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            className="w-full rounded-xl border border-border bg-background py-3 pr-4 pl-10 text-foreground outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring"
          />
        </div>
      </label>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.015 }}
        whileTap={{ scale: loading ? 1 : 0.985 }}
        className="mt-2 flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            Enter Dashboard
            <ArrowRight size={16} />
          </>
        )}
      </motion.button>

      <p className="text-center text-xs text-muted">
        Ask your apps manager for the team PIN if you don&apos;t have it.
      </p>
    </motion.form>
  );
}
