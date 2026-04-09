import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import MedicalRecordList from "../../Common/MedicalRecords/MedicalRecordList";

const MedicalRecordsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/receptionist" },
          {
            label: "Medical Records",
            href: "/dashboard/receptionist/medical-records",
          },
        ]}
      />
      <MedicalRecordList />
    </div>
  );
};

export default MedicalRecordsContainer;
