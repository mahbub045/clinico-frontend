import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    return typeof role === "string" ? role.toUpperCase() : null;
  } catch {
    return null;
  }
}

function getCurrentUserType(token?: string, cookieUserType?: string) {
  const fromToken = getUserTypeFromToken(token);
  if (fromToken) return fromToken;
  return (cookieUserType ?? "").toUpperCase() || null;
}

export async function requireDashboardRole(allowedRoles: string[]) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/signin?error=unauthorized");
  }

  const userTypeCookie = cookieStore.get("user_type")?.value;
  const userType = getCurrentUserType(token, userTypeCookie);
  const allowed = allowedRoles.map((r) => r.toUpperCase());

  if (!userType || !allowed.includes(userType)) {
    redirect("/unauthorized?error=access_denied");
  }
}
