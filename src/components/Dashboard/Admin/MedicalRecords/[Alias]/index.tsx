import Breadcrumbs from "@/components/Dashboard/Common/Breadcrumbs/Breadcrumbs";
import MedicalRecordDetails from "@/components/Dashboard/Common/MedicalRecords/MedicalRecordDetails/MedicalRecordDetails";

const MedicalRecordDetailsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/admin" },
          {
            label: "Medical Records",
            href: "/dashboard/admin/medical-records",
          },
          { label: "Medical Record Details", href: "#" },
        ]}
      />
      <MedicalRecordDetails />
    </div>
  );
};

export default MedicalRecordDetailsContainer;
