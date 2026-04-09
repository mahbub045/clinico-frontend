import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import MedicalRecordAnalyticsCondition from "./components/MedicalRecordAnalyticsCondition";
import MedicalRecordAnalyticsMonthlyCost from "./components/MedicalRecordAnalyticsMonthlyCost";
import MedicalRecordAnalyticsMonthlyRecord from "./components/MedicalRecordAnalyticsMonthlyRecord";
import MedicalRecordAnalyticsOutcome from "./components/MedicalRecordAnalyticsOutcome";
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

        <MedicalRecordAnalyticsOutcome />

        <div className="grid gap-6 xl:grid-cols-2">
          <MedicalRecordAnalyticsMonthlyCost />
          <MedicalRecordAnalyticsMonthlyRecord />
        </div>
      </div>
    </>
  );
};

export default AdminHomeContainer;
