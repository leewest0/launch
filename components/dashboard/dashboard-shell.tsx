"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3, Star } from "lucide-react";
import { TopNav } from "@/components/dashboard/top-nav";
import { Hero } from "@/components/dashboard/hero";
import { CategoryPills } from "@/components/dashboard/category-pills";
import { AppGrid } from "@/components/dashboard/app-grid";
import { SectionHeader } from "@/components/dashboard/section-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { AddAppModal, type NewAppInput } from "@/components/dashboard/add-app-modal";
import { useToast } from "@/components/ui/toast";
import type { AppEntry } from "@/lib/types";

interface DashboardShellProps {
  user: string;
  initialApps: AppEntry[];
  initialFavourites: string[];
  initialRecents: string[];
}

export function DashboardShell({
  user,
  initialApps,
  initialFavourites,
  initialRecents,
}: DashboardShellProps) {
  const { push } = useToast();
  const [apps, setApps] = useState(initialApps);
  const [favouriteIds, setFavouriteIds] = useState(new Set(initialFavourites));
  const [recentIds, setRecentIds] = useState(initialRecents);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && !modalOpen && document.activeElement === searchRef.current) {
        setQuery("");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const app of apps) {
      counts.set(app.category, (counts.get(app.category) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [apps]);

  const normalizedQuery = query.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return null;
    return apps.filter((app) => {
      const haystack = `${app.name} ${app.category} ${app.description} ${app.url}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [apps, normalizedQuery]);

  const categoryFilteredApps = useMemo(() => {
    if (!activeCategory) return apps;
    return apps.filter((app) => app.category === activeCategory);
  }, [apps, activeCategory]);

  const favouriteApps = useMemo(
    () => apps.filter((app) => favouriteIds.has(app.id)),
    [apps, favouriteIds]
  );

  const recentApps = useMemo(() => {
    const byId = new Map(apps.map((app) => [app.id, app]));
    return recentIds.map((id) => byId.get(id)).filter((app): app is AppEntry => Boolean(app));
  }, [apps, recentIds]);

  const groupedByCategory = useMemo(() => {
    const groups = new Map<string, AppEntry[]>();
    for (const app of categoryFilteredApps) {
      const list = groups.get(app.category) ?? [];
      list.push(app);
      groups.set(app.category, list);
    }
    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [categoryFilteredApps]);

  function handleOpen(app: AppEntry) {
    window.open(app.url, "_blank", "noopener,noreferrer");

    setRecentIds((prev) => [app.id, ...prev.filter((id) => id !== app.id)].slice(0, 10));

    fetch("/api/recents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId: app.id }),
    }).catch(() => {});
  }

  async function handleToggleFavourite(app: AppEntry) {
    const nextFavourited = !favouriteIds.has(app.id);

    setFavouriteIds((prev) => {
      const next = new Set(prev);
      if (nextFavourited) next.add(app.id);
      else next.delete(app.id);
      return next;
    });

    try {
      const res = await fetch("/api/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId: app.id, favourited: nextFavourited }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setFavouriteIds((prev) => {
        const next = new Set(prev);
        if (nextFavourited) next.delete(app.id);
        else next.add(app.id);
        return next;
      });
      push("Couldn't save that favourite. Try again.", "error");
    }
  }

  async function handleDelete(app: AppEntry) {
    if (!window.confirm(`Remove "${app.name}" from LaunchPad for everyone?`)) return;

    const previous = apps;
    setApps((prev) => prev.filter((a) => a.id !== app.id));

    try {
      const res = await fetch(`/api/apps/${app.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      push(`Removed "${app.name}".`, "success");
    } catch {
      setApps(previous);
      push("Couldn't remove that app. Try again.", "error");
    }
  }

  async function handleAddApp(input: NewAppInput): Promise<boolean> {
    try {
      const res = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        push(data.error ?? "Couldn't add that app.", "error");
        return false;
      }
      setApps((prev) => [...prev, data.app as AppEntry].sort((a, b) => a.name.localeCompare(b.name)));
      push(`Added "${(data.app as AppEntry).name}" to LaunchPad.`, "success");
      return true;
    } catch {
      push("Couldn't reach the server. Try again.", "error");
      return false;
    }
  }

  const isSearching = normalizedQuery.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav user={user} onAddClick={() => setModalOpen(true)} />

      <Hero
        query={query}
        onQueryChange={setQuery}
        inputRef={searchRef}
        resultCount={searchResults ? searchResults.length : null}
        appCount={apps.length}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 sm:px-6 lg:px-8">
        {apps.length === 0 ? (
          <EmptyState variant="no-apps" onAddClick={() => setModalOpen(true)} />
        ) : isSearching ? (
          searchResults && searchResults.length > 0 ? (
            <AppGrid
              apps={searchResults}
              favouriteIds={favouriteIds}
              onOpen={handleOpen}
              onToggleFavourite={handleToggleFavourite}
              onDelete={handleDelete}
            />
          ) : (
            <EmptyState
              variant="no-results"
              query={query.trim()}
              onAddClick={() => setModalOpen(true)}
            />
          )
        ) : (
          <div className="flex flex-col gap-10">
            <CategoryPills
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
              totalCount={apps.length}
            />

            {!activeCategory && favouriteApps.length > 0 && (
              <section>
                <SectionHeader icon={Star} title="Favourites" count={favouriteApps.length} />
                <AppGrid
                  apps={favouriteApps}
                  favouriteIds={favouriteIds}
                  onOpen={handleOpen}
                  onToggleFavourite={handleToggleFavourite}
                  onDelete={handleDelete}
                />
              </section>
            )}

            {!activeCategory && recentApps.length > 0 && (
              <section>
                <SectionHeader icon={Clock3} title="Recently opened" count={recentApps.length} />
                <AppGrid
                  apps={recentApps}
                  favouriteIds={favouriteIds}
                  onOpen={handleOpen}
                  onToggleFavourite={handleToggleFavourite}
                  onDelete={handleDelete}
                />
              </section>
            )}

            {activeCategory ? (
              <section>
                <SectionHeader title={activeCategory} count={categoryFilteredApps.length} />
                <AppGrid
                  apps={categoryFilteredApps}
                  favouriteIds={favouriteIds}
                  onOpen={handleOpen}
                  onToggleFavourite={handleToggleFavourite}
                  onDelete={handleDelete}
                  showCategory={false}
                />
              </section>
            ) : (
              groupedByCategory.map(([category, categoryApps]) => (
                <section key={category}>
                  <SectionHeader title={category} count={categoryApps.length} />
                  <AppGrid
                    apps={categoryApps}
                    favouriteIds={favouriteIds}
                    onOpen={handleOpen}
                    onToggleFavourite={handleToggleFavourite}
                    onDelete={handleDelete}
                    showCategory={false}
                  />
                </section>
              ))
            )}
          </div>
        )}
      </main>

      <AddAppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddApp}
        existingCategories={categories.map((c) => c.name)}
        initialName={isSearching ? query.trim() : undefined}
      />
    </div>
  );
}
