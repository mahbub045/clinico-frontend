import type { ReactNode } from "react";

import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function ReceptionistLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireDashboardRole(["RECEPTIONIST"]);
  return <>{children}</>;
}
