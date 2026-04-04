"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

function BackButton() {
  const router = useRouter();

  return (
    <Button
      className="min-w-48 cursor-pointer"
      variant="default"
      size="lg"
      onClick={() => router.back()}
    >
      Back to previous page
    </Button>
  );
}

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-6 py-16 sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col items-center justify-center text-center">
        <div className="mb-8 inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-primary shadow-sm shadow-primary/5">
          Page not found
        </div>

        <div className="rounded-[2rem] border border-border/80 bg-white/90 px-8 py-12 shadow-[0_32px_120px_-40px_rgba(59,130,246,0.45)] backdrop-blur-xl dark:bg-slate-950/85 dark:shadow-[0_32px_120px_-40px_rgba(79,70,229,0.25)] sm:px-12">
          <p className="text-7xl font-extrabold tracking-tight text-primary sm:text-8xl">
            404
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
            Oops — we can’t find that page.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            The page you are looking for may have been moved, renamed, or does
            not exist. Try returning to the dashboard or use the menu to explore
            other clinic tools.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <BackButton />
            <Link href="/" passHref>
              <Button
                className="min-w-48 cursor-pointer"
                variant="secondary"
                size="lg"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
