import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Rocket } from "lucide-react";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="ambient-glow" />

      <div className="absolute top-5 right-5 z-10">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-a to-accent-b text-white shadow-lg shadow-accent-b/20">
            <Rocket size={22} strokeWidth={2.25} />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            LaunchPad Dashboard
          </h1>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Every team app, one search away. Enter your team PIN and name to
            get in.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
