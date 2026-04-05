import { NextRequest, NextResponse } from "next/server";

function decodeBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(normalized + padding);
}

function getUserTypeFromToken(token?: string) {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(decodeBase64Url(parts[1])) as Record<
      string,
      unknown
    >;
    const role = payload.user_type ?? payload.role ?? payload.userType;
    return typeof role === "string" ? role : null;
  } catch {
    return null;
  }
}

function getRedirectPathByUserType(userType?: string | null) {
  switch ((userType ?? "").toUpperCase()) {
    case "ADMIN":
      return "/dashboard/admin";
    case "RECEPTIONIST":
      return "/dashboard/receptionist";
    case "DOCTOR":
      return "/dashboard/doctor";
    default:
      return "/dashboard/doctor";
  }
}

function getFullPath(req: NextRequest) {
  return req.nextUrl.pathname + req.nextUrl.search;
}

function applySafeNextRedirect(url: URL, req: NextRequest, next: string) {
  // Prevent open redirects by only allowing same-origin absolute paths.
  if (!next.startsWith("/")) return false;

  const nextUrl = new URL(next, req.url);
  url.pathname = nextUrl.pathname;
  url.search = nextUrl.search;
  return true;
}

function getAllowedPrefixByUserType(userType?: string | null) {
  const normalized = (userType ?? "").toUpperCase();

  if (normalized === "ADMIN") return "/dashboard/admin";
  if (normalized === "RECEPTIONIST") return "/dashboard/receptionist";
  if (normalized === "DOCTOR") return "/dashboard/doctor";
  return null;
}

function isAllowedDashboardPath(
  pathname: string,
  allowedPrefix: string | null,
) {
  if (!allowedPrefix) return false;
  return pathname === allowedPrefix || pathname.startsWith(`${allowedPrefix}/`);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  const userTypeCookie = req.cookies.get("user_type")?.value;
  const userTypeFromToken = getUserTypeFromToken(token);
  const effectiveUserType = userTypeFromToken ?? userTypeCookie;

  const allowedPrefix = getAllowedPrefixByUserType(effectiveUserType);
  const normalized = (effectiveUserType ?? "").toUpperCase();
  const roleHome = getRedirectPathByUserType(effectiveUserType);
  const nextPath = getFullPath(req);

  // Do not block auth routes; optionally bounce logged-in users away.
  if (pathname.startsWith("/auth")) {
    if (token) {
      const next = req.nextUrl.searchParams.get("next");
      const url = req.nextUrl.clone();
      if (next) {
        const candidate = new URL(next, req.url);
        const candidatePath = candidate.pathname;

        // When next points to dashboard, keep users inside their role area.
        if (
          candidatePath.startsWith("/dashboard") &&
          !isAllowedDashboardPath(candidatePath, allowedPrefix)
        ) {
          url.pathname = roleHome;
          url.search = "";
        } else if (applySafeNextRedirect(url, req, next)) {
          // keep nextUrl.search as set by applySafeNextRedirect
        } else {
          url.pathname = roleHome;
          url.search = "";
        }
      } else {
        url.pathname = roleHome;
        url.search = "";
      }
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect dashboard routes.
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/signin";
      url.searchParams.set("error", "unauthorized");
      url.searchParams.set("next", nextPath);
      return NextResponse.redirect(url);
    }

    if (!normalized) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/signin";
      url.searchParams.set("error", "unauthorized");
      url.searchParams.set("next", nextPath);
      return NextResponse.redirect(url);
    }

    // Visiting /dashboard should always land on the role home.
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      const url = req.nextUrl.clone();
      url.pathname = allowedPrefix ?? "/unauthorized";
      url.search = "";
      return NextResponse.redirect(url);
    }

    // If role is unknown or path doesn't match role area, deny.
    if (!isAllowedDashboardPath(pathname, allowedPrefix)) {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      url.searchParams.set("error", "access_denied");
      url.searchParams.set("next", nextPath);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/auth/:path*"],
};
