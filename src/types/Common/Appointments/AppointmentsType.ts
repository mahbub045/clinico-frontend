export type Appointment = {
  id: number;
  alias?: string | null;
  slug?: string | null;
  patient?: {
    alias?: string | null;
    slug?: string | null;
    full_name?: string | null;
    gender?: string | null;
  } | null;
  doctor?: {
    alias?: string | null;
    slug?: string | null;
    full_name?: string | null;
    specialization?: string | null;
  } | null;
  created_by_details?: {
    alias?: string | null;
    full_name?: string | null;
    email?: string | null;
    user_type?: string | null;
  } | null;
  appointment_date?: string | null;
  appointment_time?: string | null;
  status?: string | null;
  notes?: string | null;
  reason?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type OptionRecord = {
  id: number;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
};

export interface AddAppointmentPayload {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  notes: string;
}
