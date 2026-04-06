import PatientsContainer from "@/components/Dashboard/Receptionist/Patients";
import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function PatientsPage() {
  await requireDashboardRole(["RECEPTIONIST"]);
  return <PatientsContainer />;
}
