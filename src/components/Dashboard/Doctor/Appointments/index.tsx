import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";

const AppointmentsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/dashboard/doctor" },
          { label: "Appointments", href: "/dashboard/doctor/appointments" },
        ]}
      />
    </>
  );
};

export default AppointmentsContainer;
