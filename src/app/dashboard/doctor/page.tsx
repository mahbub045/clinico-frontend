import DoctorHomeContainer from "@/components/Dashboard/Doctor/Home";
import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function DoctorDashboardPage() {
  await requireDashboardRole(["DOCTOR"]);

  return <DoctorHomeContainer />;
}
