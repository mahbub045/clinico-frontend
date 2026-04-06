import PatientDetailsContainer from "@/components/Dashboard/Doctor/Patients/[Alias]";
import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function PatientsPage() {
  await requireDashboardRole(["DOCTOR"]);
  return <PatientDetailsContainer />;
}
