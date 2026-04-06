import type { ReactNode } from "react";

import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function DoctorLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireDashboardRole(["DOCTOR"]);
  return <>{children}</>;
}
