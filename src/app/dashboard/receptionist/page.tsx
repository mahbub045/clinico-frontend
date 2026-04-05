import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function ReceptionistDashboardPage() {
  await requireDashboardRole(["RECEPTIONIST"]);

  return (
    <section className="space-y-2 p-6">
      <h1 className="text-2xl font-semibold">Receptionist Dashboard</h1>
      <p className="text-muted-foreground">
        This area is ready for receptionist features.
      </p>
    </section>
  );
}
