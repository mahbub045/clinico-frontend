import AppointmentList from "./AppointmentList/AppointmentList";
import AppointmentsSummary from "./AppointmentsSummary/AppointmentsSummary";

const Appointments: React.FC = () => {
  return (
    <>
      <AppointmentsSummary />
      <AppointmentList />
    </>
  );
};

export default Appointments;
