import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import AdminActivityFeed from "./components/AdminActivityFeed";
import AdminApprovalQueue from "./components/AdminApprovalQueue";
import AdminDashboardHero from "./components/AdminDashboardHero";
import AdminOperationsSnapshot from "./components/AdminOperationsSnapshot";
import AdminQuickActions from "./components/AdminQuickActions";
import AdminSummaryCards from "./components/AdminSummaryCards";

const AdminHomeContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/dashboard/admin" }]} />
      <div className="space-y-8 pb-10">
        <AdminDashboardHero />

        <AdminSummaryCards />

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <AdminOperationsSnapshot />
          <AdminQuickActions />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <AdminActivityFeed />
          <AdminApprovalQueue />
        </div>
      </div>
    </>
  );
};

export default AdminHomeContainer;
