import Breadcrumbs from "@/components/Dashboard/Common/Breadcrumbs/Breadcrumbs";
import DoctorDetails from "@/components/Dashboard/Common/Doctors/DoctorDetails/DoctorDetails";

const DoctorDetailsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/admin" },
          { label: "Doctors", href: "/dashboard/admin/doctors" },
          { label: "Doctor Details", href: "#" },
        ]}
      />
      <DoctorDetails />
    </div>
  );
};

export default DoctorDetailsContainer;
