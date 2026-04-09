import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import MedicalRecordAnalyticsCondition from "./components/MedicalRecordAnalyticsCondition";
import MedicalRecordAnalyticsProcedure from "./components/MedicalRecordAnalyticsProcedure";
import MedicalRecordSummary from "./components/MedicalRecordSummary";

const AdminHomeContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/dashboard/admin" }]} />
      <div className="space-y-8 pb-10">
        <MedicalRecordSummary />

        <div className="grid gap-6 lg:grid-cols-2">
          <MedicalRecordAnalyticsCondition />
          <MedicalRecordAnalyticsProcedure />
        </div>

        <div className="grid gap-6 xl:grid-cols-2"></div>
      </div>
    </>
  );
};

export default AdminHomeContainer;
