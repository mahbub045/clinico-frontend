import Breadcrumbs from "@/components/Dashboard/Common/Breadcrumbs/Breadcrumbs";
import PatientDetails from "@/components/Dashboard/Common/Patients/PatientList/PatientDetails/PatientDetails";

const PatientDetailsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/receptionist" },
          { label: "Patients", href: "/dashboard/receptionist/patients" },
          { label: "Details", href: "#" },
        ]}
      />
      <PatientDetails />
    </div>
  );
};

export default PatientDetailsContainer;
