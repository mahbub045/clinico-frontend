import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import Prescriptions from "../../Common/Prescriptions/Prescriptions";

const PrescriptionsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/receptionist" },
          { label: "Prescriptions", href: "/dashboard/receptionist/prescriptions" },
        ]}
      />
      <Prescriptions />
    </div>
  );
};

export default PrescriptionsContainer;
