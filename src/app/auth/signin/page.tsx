"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/reducers/Auth/SignInApi";
import { useLazyGetUserInfoQuery } from "@/redux/reducers/Common/UserInfo/UserInfoApi";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type JwtLoginResponse = {
  access?: string;
  refresh?: string;
  token?: string;
};

type UserInfoResponse = {
  user_type?: string;
};

const SignIn: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
};

function getRedirectPathByUserType(userType?: string | null) {
  switch ((userType ?? "").toUpperCase()) {
    case "ADMIN":
      return "/dashboard/admin";
    case "RECEPTIONIST":
      return "/dashboard/receptionist";
    case "DOCTOR":
      return "/dashboard/doctor";
    default:
      return "/unauthorized";
  }
}

function setAuthCookie(
  name: string,
  value: string,
  maxAgeSeconds = 60 * 60 * 24 * 7,
) {
  if (typeof document === "undefined") return;
  const encoded = encodeURIComponent(value);
  document.cookie = `${name}=${encoded}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

const SignInContent: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = useMemo(() => searchParams.get("next"), [searchParams]);

  // RTK
  const [signIn, { isLoading, error }] = useLoginMutation();
  const [triggerUserInfo, { isLoading: isUserInfoLoading }] =
    useLazyGetUserInfoQuery();

  useEffect(() => {
    // If already authenticated, redirect away from sign-in.
    const existingToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!existingToken) return;

    (async () => {
      try {
        const user = (await triggerUserInfo(
          undefined,
        ).unwrap()) as UserInfoResponse;
        const redirectTo =
          nextParam || getRedirectPathByUserType(user?.user_type);
        if (user?.user_type) {
          localStorage.setItem("user_type", user.user_type);
          setAuthCookie("user_type", user.user_type);
        }
        setAuthCookie("token", existingToken);
        router.replace(redirectTo);
      } catch {
        // Token might be stale; let the user sign in.
      }
    })();
  }, [nextParam, router, triggerUserInfo]);

  const isSubmitting = isLoading || isUserInfoLoading;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError("Email and password are required.");
      return;
    }

    try {
      const result = (await signIn({
        email,
        password,
      }).unwrap()) as JwtLoginResponse;
      const token = result.access ?? result.token;
      const refresh = result.refresh;

      if (!token) {
        setFormError("Login succeeded but no access token was returned.");
        return;
      }

      localStorage.setItem("token", token);
      setAuthCookie("token", token);
      if (refresh) {
        localStorage.setItem("refresh", refresh);
      }

      const user = (await triggerUserInfo(
        undefined,
      ).unwrap()) as UserInfoResponse;
      const userType = user?.user_type;
      if (userType) {
        localStorage.setItem("user_type", userType);
        setAuthCookie("user_type", userType);
      }

      router.push(nextParam || getRedirectPathByUserType(userType));
    } catch (err) {
      // RTK Query provides `error` but it's not always the latest in this scope.
      console.error("Sign in failed", err);
    }
  }

  return (
    <main className="text-foreground relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/10 absolute top-12 left-0 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-secondary/15 absolute top-24 right-10 h-56 w-56 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute bottom-12 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="border-border/70 w-full max-w-6xl overflow-hidden rounded-[2rem] border bg-white/95 shadow-[0_48px_120px_-48px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/90">
          <div className="grid gap-0 sm:grid-cols-[1.45fr_1fr]">
            <section className="border-border/70 relative overflow-hidden rounded-[2rem] border-b bg-slate-50/90 px-8 py-12 sm:border-r sm:border-b-0 sm:px-14 sm:py-16 dark:bg-slate-900/95">
              <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-white/60 to-transparent" />
              <div className="relative z-10">
                <span className="border-primary/20 bg-primary/5 text-primary shadow-primary/5 inline-flex rounded-full border px-4 py-1 text-xs font-semibold tracking-[0.5em] uppercase shadow-sm">
                  Clinico sign in
                </span>
                <h1 className="mt-8 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl dark:text-white">
                  Welcome back.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                  Access your clinic dashboard securely with your account.
                  Manage appointments, patient records, and daily operations in
                  one place.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="border-primary/15 bg-primary/5 shadow-primary/5 dark:border-primary/20 dark:bg-primary/10 rounded-[1.5rem] border px-5 py-4 text-sm text-slate-700 shadow-sm dark:text-slate-200">
                    <div className="text-primary flex items-center gap-2">
                      <Mail className="size-4" />
                      <p className="font-semibold">Fast access</p>
                    </div>
                    Secure login for your entire team.
                  </div>
                  <div className="border-primary/15 bg-primary/5 shadow-primary/5 dark:border-primary/20 dark:bg-primary/10 rounded-[1.5rem] border px-5 py-4 text-sm text-slate-700 shadow-sm dark:text-slate-200">
                    <div className="text-primary flex items-center gap-2">
                      <ShieldCheck className="size-4" />
                      <p className="font-semibold">Trusted security</p>
                    </div>
                    Encrypted sessions and safe authentication.
                  </div>
                  <div className="border-primary/15 bg-primary/5 shadow-primary/5 dark:border-primary/20 dark:bg-primary/10 rounded-[1.5rem] border px-5 py-4 text-sm text-slate-700 shadow-sm dark:text-slate-200">
                    <div className="text-primary flex items-center gap-2">
                      <Users className="size-4" />
                      <p className="font-semibold">Team-ready</p>
                    </div>
                    Login for doctors, receptionists, and admins.
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6 bg-white px-8 py-10 sm:px-10 sm:py-14 dark:bg-slate-950">
              <div className="border-border/70 rounded-[2rem] border bg-slate-50/80 p-6 shadow-sm shadow-slate-900/5 dark:border-slate-800/80 dark:bg-slate-900/95">
                <p className="text-foreground text-sm font-semibold">
                  Sign in to your account
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Enter your credentials below to continue.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@clinico.com"
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot"
                      className="text-primary hover:text-primary/80 text-sm font-medium"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
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

                <div className="space-y-3 sm:flex sm:items-center sm:justify-end sm:gap-3">
                  <Button
                    variant="default"
                    type="submit"
                    className="w-full sm:w-auto"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <ArrowRight className="size-4" />
                    {isSubmitting ? "Signing in…" : "Sign In"}
                  </Button>
                </div>

                {(formError || error) && (
                  <p className="text-destructive text-sm leading-6">
                    {formError ??
                      "Sign in failed. Please check your credentials."}
                  </p>
                )}

                <p className="text-muted-foreground text-center text-sm leading-6">
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
