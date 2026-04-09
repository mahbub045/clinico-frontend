import Breadcrumbs from "@/components/Dashboard/Common/Breadcrumbs/Breadcrumbs";
import ReceptionistDetails from "./ReceptionistDetails/ReceptionistDetails";

const ReceptionistsDetails: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/admin" },
          { label: "Receptionists", href: "/dashboard/admin/receptionists" },
          { label: "Receptionist Details", href: "#" },
        ]}
      />
      <ReceptionistDetails />
    </div>
  );
};

export default ReceptionistsDetails;
