import Breadcrumbs from "@/components/Dashboard/Common/Breadcrumbs/Breadcrumbs";
import PrescriptionDetails from "@/components/Dashboard/Common/Prescriptions/PrescriptionDetails/PrescriptionDetails";

const PrescriptionDetailsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/doctor" },
          { label: "Prescriptions", href: "/dashboard/doctor/prescriptions" },
          { label: "Prescription Details", href: "#" },
        ]}
      />
      <PrescriptionDetails />
    </div>
  );
};

export default PrescriptionDetailsContainer;
