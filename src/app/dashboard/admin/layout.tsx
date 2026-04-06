import type { ReactNode } from "react";

import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireDashboardRole(["ADMIN"]);
  return <>{children}</>;
}
