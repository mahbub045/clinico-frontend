import BillDetails from "@/components/Dashboard/Common/Bills/BillDetails/BillDetails";
import Breadcrumbs from "@/components/Dashboard/Common/Breadcrumbs/Breadcrumbs";

const BillDetailsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/admin" },
          { label: "Bills", href: "/dashboard/admin/bills" },
          { label: "Bill Details", href: "#" },
        ]}
      />
      <BillDetails />
    </div>
  );
};

export default BillDetailsContainer;
