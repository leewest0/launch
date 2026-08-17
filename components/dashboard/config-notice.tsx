import { AlertTriangle } from "lucide-react";

export function ConfigNotice({ error }: { error: string }) {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-background px-4">
      <div className="max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
          <AlertTriangle size={20} />
        </div>
        <h1 className="font-display text-lg font-semibold text-foreground">
          LaunchPad isn&apos;t connected to Redis yet
        </h1>
        <p className="mt-2 text-sm text-muted">
          Set <code className="rounded bg-surface-hover px-1.5 py-0.5">UPSTASH_REDIS_REST_URL</code>{" "}
          and{" "}
          <code className="rounded bg-surface-hover px-1.5 py-0.5">UPSTASH_REDIS_REST_TOKEN</code>{" "}
          in your environment, then reload.
        </p>
        <p className="mt-4 text-xs text-muted/80 break-words">{error}</p>
      </div>
    </main>
  );
}
