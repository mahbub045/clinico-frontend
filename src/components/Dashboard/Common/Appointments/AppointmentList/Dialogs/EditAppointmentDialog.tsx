import { Dialog } from "@/components/ui/dialog";
import { useUpdateAppointmentMutation } from "@/redux/reducers/Common/Appointments/AppointmentsApi";
import { useGetDoctorsQuery } from "@/redux/reducers/Common/Doctors/DoctorsApi";
import { useGetPatientsQuery } from "@/redux/reducers/Common/Patients/PatientsApi";

const EditAppointmentDialog: React.FC = () => {
  const { data: doctors, isLoading: doctorsLoading } =
    useGetDoctorsQuery(undefined);
  const { data: patients, isLoading: patientsLoading } =
    useGetPatientsQuery(undefined);
  const [editAppointment, { isLoading: editingAppointment }] =
    useUpdateAppointmentMutation();

  return <Dialog>{/* JSX here */}</Dialog>;
};

export default EditAppointmentDialog;
