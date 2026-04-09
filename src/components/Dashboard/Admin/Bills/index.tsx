import Bills from "../../Common/Bills/Bills";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";

const BillsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/admin" },
          { label: "Bills", href: "/dashboard/admin/bills" },
        ]}
      />
      <Bills />
    </div>
  );
};

export default BillsContainer;
