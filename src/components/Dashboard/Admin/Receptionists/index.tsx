import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import ReceptionistList from "./ReceptionistList/ReceptionistList";
import ReceptionistOverview from "./ReceptionistOverview/ReceptionistOverview";

const ReceptionistsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/admin" },
          { label: "Receptionists", href: "/dashboard/admin/receptionists" },
        ]}
      />
      <div className="space-y-6">
        <ReceptionistOverview />
        <ReceptionistList />
      </div>
    </div>
  );
};

export default ReceptionistsContainer;
