import PrescriptionList from "./PrescriptionList/PrescriptionList";
import PrescriptionOverview from "./PrescriptionOverview/PrescriptionOverview";

const Prescriptions: React.FC = () => {
  return (
    <div className="space-y-6">
      <PrescriptionOverview />
      <PrescriptionList />
    </div>
  );
};

export default Prescriptions;
