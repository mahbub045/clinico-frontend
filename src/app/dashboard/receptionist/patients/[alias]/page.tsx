import PatientDetailsContainer from "@/components/Dashboard/Receptionist/Patients/[Alias]";
import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function PatientsPage() {
  await requireDashboardRole(["RECEPTIONIST"]);
  return <PatientDetailsContainer />;
}
