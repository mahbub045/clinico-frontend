import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import Prescriptions from "../../Common/Prescriptions/Prescriptions";

const PrescriptionsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/admin" },
          { label: "Prescriptions", href: "/dashboard/admin/prescriptions" },
        ]}
      />
      <Prescriptions />
    </div>
  );
};

export default PrescriptionsContainer;
