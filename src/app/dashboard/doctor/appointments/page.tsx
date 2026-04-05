import AppointmentsContainer from "@/components/Dashboard/Doctor/Appointments";
import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function AppointmentsPage() {
  await requireDashboardRole(["DOCTOR"]);

  return <AppointmentsContainer />;
}
