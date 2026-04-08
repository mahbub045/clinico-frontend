import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import Doctors from "../../Common/Doctors/Doctors";

const DoctorsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/doctor" },
          { label: "Doctors", href: "/dashboard/doctor/doctors" },
        ]}
      />
      <Doctors />
    </div>
  );
};

export default DoctorsContainer;
