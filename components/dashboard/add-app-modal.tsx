"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NewAppInput {
  name: string;
  url: string;
  category: string;
  description: string;
}

interface AddAppModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: NewAppInput) => Promise<boolean>;
  existingCategories: string[];
  initialName?: string;
}

export function AddAppModal({
  open,
  onClose,
  onSubmit,
  existingCategories,
  initialName,
}: AddAppModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          {/* Keyed so a fresh form (and fresh local state) mounts every time the modal opens. */}
          <AddAppForm
            key={initialName ?? "blank"}
            onClose={onClose}
            onSubmit={onSubmit}
            existingCategories={existingCategories}
            initialName={initialName}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AddAppFormProps {
  onClose: () => void;
  onSubmit: (input: NewAppInput) => Promise<boolean>;
  existingCategories: string[];
  initialName?: string;
}

function AddAppForm({ onClose, onSubmit, existingCategories, initialName }: AddAppFormProps) {
  const [form, setForm] = useState<NewAppInput>({
    name: initialName ?? "",
    url: "",
    category: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const ok = await onSubmit(form);
    setSubmitting(false);
    if (ok) onClose();
  }

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">Add an app</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-surface-hover hover:text-foreground cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Name</span>
          <input
            autoFocus
            required
            maxLength={120}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Planning Center"
            className="rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">URL</span>
          <input
            required
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            placeholder="planningcenteronline.com"
            className="rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Category</span>
          <input
            list="launchpad-categories"
            maxLength={120}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            placeholder="Worship, Finance, Communications…"
            className="rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <datalist id="launchpad-categories">
            {existingCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">
            Description <span className="text-muted">(optional)</span>
          </span>
          <textarea
            maxLength={240}
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="What's this app for?"
            className="resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      </div>

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: submitting ? 1 : 1.01 }}
        whileTap={{ scale: submitting ? 1 : 0.99 }}
        className={cn(
          "mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity cursor-pointer",
          submitting && "opacity-60"
        )}
      >
        {submitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <Plus size={16} />
            Add to LaunchPad
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
