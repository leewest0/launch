import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getRedis, APPS_KEY, favouritesKey, recentsKey } from "@/lib/redis";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ConfigNotice } from "@/components/dashboard/config-notice";
import type { AppEntry } from "@/lib/types";

async function loadDashboardData(user: string) {
  const redis = getRedis();

  const [appsMap, favourites, recents] = await Promise.all([
    redis.hgetall<Record<string, AppEntry>>(APPS_KEY),
    redis.smembers(favouritesKey(user)),
    redis.lrange<string>(recentsKey(user), 0, -1),
  ]);

  const apps = Object.values(appsMap ?? {}).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return { apps, favourites, recents };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  let data: Awaited<ReturnType<typeof loadDashboardData>> | null = null;
  let errorMessage: string | null = null;
  try {
    data = await loadDashboardData(user);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  if (!data) {
    return <ConfigNotice error={errorMessage ?? "Unknown error"} />;
  }

  return (
    <DashboardShell
      user={user}
      initialApps={data.apps}
      initialFavourites={data.favourites}
      initialRecents={data.recents}
    />
  );
}
