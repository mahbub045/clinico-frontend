import Bills from "../../Common/Bills/Bills";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";

const BillsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/receptionist" },
          { label: "Bills", href: "/dashboard/receptionist/bills" },
        ]}
      />
      <Bills />
    </div>
  );
};

export default BillsContainer;
