import ReceptionistHomeContainer from "@/components/Dashboard/Receptionist/Home";
import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function ReceptionistDashboardPage() {
  await requireDashboardRole(["RECEPTIONIST"]);

  return <ReceptionistHomeContainer />;
}
