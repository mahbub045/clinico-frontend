import { LogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function UnauthorizedPage() {
  return (
    <main className="bg-background relative min-h-screen overflow-hidden px-6 py-16 sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_28%)]" />
      <div className="bg-primary/15 pointer-events-none absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl" />
      <div className="bg-secondary/15 pointer-events-none absolute top-1/4 right-0 h-72 w-72 rounded-full blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col items-center justify-center text-center">
        <div className="border-primary/20 bg-primary/5 text-primary shadow-primary/5 mb-8 inline-flex rounded-full border px-4 py-1 text-sm font-semibold tracking-[0.3em] uppercase shadow-sm">
          Access denied
        </div>

        <div className="border-border/80 rounded-[2rem] border bg-white/90 px-8 py-12 shadow-[0_32px_120px_-40px_rgba(59,130,246,0.45)] backdrop-blur-xl sm:px-12 dark:bg-slate-950/85 dark:shadow-[0_32px_120px_-40px_rgba(79,70,229,0.25)]">
          <p className="text-primary text-5xl font-extrabold tracking-tight sm:text-6xl">
            401
          </p>
          <h1 className="text-foreground mt-4 text-3xl font-semibold sm:text-4xl">
            You don’t have permission to view this page.
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-8 sm:text-lg">
            This area is restricted to specific roles. If you believe this is a
            mistake, contact your administrator.
          </p>

          <div className="mt-10 flex items-center justify-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </main>
  );
}
