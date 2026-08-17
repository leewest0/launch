import { redirect } from "next/navigation";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { ThemeToggle } from "@/components/theme-toggle";

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
          <div className="mb-5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-black/10">
            <Image src="/church-logo.png" alt="" width={56} height={56} className="h-full w-full object-cover" />
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
