"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-10 top-24 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute left-1/2 bottom-12 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border/70 bg-white/95 shadow-[0_48px_120px_-48px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/90">
          <div className="grid gap-0 sm:grid-cols-[1.45fr_1fr]">
            <section className="relative overflow-hidden rounded-[2rem] border-b border-border/70 bg-slate-50/90 px-8 py-12 sm:px-14 sm:py-16 sm:border-r sm:border-b-0 dark:bg-slate-900/95">
              <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-white/60 to-transparent" />
              <div className="relative z-10">
                <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.5em] text-primary shadow-sm shadow-primary/5">
                  Clinico sign in
                </span>
                <h1 className="mt-8 text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
                  Welcome back.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                  Access your clinic dashboard securely with your account.
                  Manage appointments, patient records, and daily operations in
                  one place.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-primary/15 bg-primary/5 px-5 py-4 text-sm text-slate-700 shadow-sm shadow-primary/5 dark:border-primary/20 dark:bg-primary/10 dark:text-slate-200">
                    <div className="flex items-center gap-2 text-primary">
                      <Mail className="size-4" />
                      <p className="font-semibold">Fast access</p>
                    </div>
                    Secure login for your entire team.
                  </div>
                  <div className="rounded-[1.5rem] border border-primary/15 bg-primary/5 px-5 py-4 text-sm text-slate-700 shadow-sm shadow-primary/5 dark:border-primary/20 dark:bg-primary/10 dark:text-slate-200">
                    <div className="flex items-center gap-2 text-primary">
                      <ShieldCheck className="size-4" />
                      <p className="font-semibold">Trusted security</p>
                    </div>
                    Encrypted sessions and safe authentication.
                  </div>
                  <div className="rounded-[1.5rem] border border-primary/15 bg-primary/5 px-5 py-4 text-sm text-slate-700 shadow-sm shadow-primary/5 dark:border-primary/20 dark:bg-primary/10 dark:text-slate-200">
                    <div className="flex items-center gap-2 text-primary">
                      <Users className="size-4" />
                      <p className="font-semibold">Team-ready</p>
                    </div>
                    Login for doctors, receptionists, and admins.
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6 bg-white px-8 py-10 dark:bg-slate-950 sm:px-10 sm:py-14">
              <div className="rounded-[2rem] border border-border/70 bg-slate-50/80 p-6 shadow-sm shadow-slate-900/5 dark:border-slate-800/80 dark:bg-slate-900/95">
                <p className="text-sm font-semibold text-foreground">
                  Sign in to your account
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your credentials below to continue.
                </p>
              </div>

              <form className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@clinico.com"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot"
                      className="text-sm font-medium text-primary hover:text-primary/80"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 sm:flex sm:items-center sm:justify-between sm:gap-3">
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Link href="/auth/signup" className="w-full text-center">
                      <Lock className="inline size-4" />
                      Create account
                    </Link>
                  </Button>
                  <Button variant="default" type="submit" className="w-full sm:w-auto" size="lg">
                    <ArrowRight className="size-4" />
                    Sign In
                  </Button>
                </div>

                <p className="text-center text-sm leading-6 text-muted-foreground">
                  By signing in, you agree to Clinico’s terms and privacy
                  policy.
                </p>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
