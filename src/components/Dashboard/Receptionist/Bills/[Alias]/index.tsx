import BillDetails from "@/components/Dashboard/Common/Bills/BillDetails/BillDetails";
import Breadcrumbs from "@/components/Dashboard/Common/Breadcrumbs/Breadcrumbs";

const BillDetailsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/receptionist" },
          { label: "Bills", href: "/dashboard/receptionist/bills" },
          { label: "Bill Details", href: "#" },
        ]}
      />
      <BillDetails />
    </div>
  );
};

export default BillDetailsContainer;
