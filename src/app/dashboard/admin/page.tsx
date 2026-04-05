import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function AdminDashboardPage() {
  await requireDashboardRole(["ADMIN"]);

  return (
    <section className="space-y-2 p-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        This area is ready for admin features.
      </p>
    </section>
  );
}
