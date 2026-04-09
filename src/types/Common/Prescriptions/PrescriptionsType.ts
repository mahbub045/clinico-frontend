export type PrescriptionItem = {
  id: number;
  alias: string;
  slug?: string;
  prescription_number?: string;
  appointment_details?: {
    patient_first_name?: string;
    patient_last_name?: string;
    doctor_first_name?: string;
    doctor_last_name?: string;
    status?: string;
  };
  diagnosis?: string;
  medicines?: string;
  created_at?: string;
};
