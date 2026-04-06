import AppointmentsContainer from "@/components/Dashboard/Receptionist/Appointments";
import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function AppointmentsPage() {
  await requireDashboardRole(["RECEPTIONIST"]);

  return <AppointmentsContainer />;
}
