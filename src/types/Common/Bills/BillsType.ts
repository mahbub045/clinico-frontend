export type BillItem = {
  id: number;
  alias: string;
  slug: string;
  bill_number: string;
  appointment: number;
  appointment_details?: {
    patient_first_name?: string | null;
    patient_last_name?: string | null;
    doctor_first_name?: string | null;
    doctor_last_name?: string | null;
  };
  total_amount?: number | null;
  payment_status?: string | null;
  payment_method?: string | null;
  created_at?: string | null;
};
