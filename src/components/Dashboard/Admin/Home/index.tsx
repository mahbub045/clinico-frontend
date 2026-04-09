import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import MedicalRecordAnalyticsAgeGroup from "./components/MedicalRecordAnalyticsAgeGroup";
import MedicalRecordAnalyticsCondition from "./components/MedicalRecordAnalyticsCondition";
import MedicalRecordAnalyticsGenderDistribution from "./components/MedicalRecordAnalyticsGenderDistribution";
import MedicalRecordAnalyticsLengthStay from "./components/MedicalRecordAnalyticsLengthStay";
import MedicalRecordAnalyticsMonthlyCost from "./components/MedicalRecordAnalyticsMonthlyCost";
import MedicalRecordAnalyticsMonthlyRecord from "./components/MedicalRecordAnalyticsMonthlyRecord";
import MedicalRecordAnalyticsOutcome from "./components/MedicalRecordAnalyticsOutcome";
import MedicalRecordAnalyticsProcedure from "./components/MedicalRecordAnalyticsProcedure";
import MedicalRecordAnalyticsReadmission from "./components/MedicalRecordAnalyticsReadmission";
import MedicalRecordAnalyticsSatisfaction from "./components/MedicalRecordAnalyticsSatisfaction";
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
        <div className="grid gap-6 xl:grid-cols-2">
          <MedicalRecordAnalyticsSatisfaction />
          <MedicalRecordAnalyticsReadmission />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <MedicalRecordAnalyticsGenderDistribution />
          <MedicalRecordAnalyticsAgeGroup />
        </div>
        <MedicalRecordAnalyticsLengthStay />
      </div>
    </>
  );
};

export default AdminHomeContainer;
