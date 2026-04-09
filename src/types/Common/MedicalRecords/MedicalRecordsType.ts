export interface MedicalRecordPatientDetails {
  id: number;
  alias: string;
  slug: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
}

export interface MedicalRecordAppointmentDetails {
  id: number;
  alias: string;
  slug: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  notes: string;
  doctor_id: number;
  doctor_alias: string;
  doctor_slug: string;
  doctor_first_name: string;
  doctor_last_name: string;
  doctor_email: string;
  doctor_specialization: string;
  patient_id: number;
  patient_alias: string;
  patient_slug: string;
  patient_first_name: string;
  patient_last_name: string;
}

export interface CreateMedicalRecordPayload {
  patient?: number | null;
  appointment?: number | null;
  patient_record_id?: number | null;
  age?: number | null;
  gender?: string;
  condition?: string;
  procedure?: string;
  cost?: number | null;
  length_of_stay?: number | null;
  readmission?: string;
  outcome?: string;
  satisfaction?: number | null;
}

export interface MedicalRecordItem {
  id: number;
  alias: string;
  slug: string;
  patient: number;
  appointment: number;
  patient_details: MedicalRecordPatientDetails;
  appointment_details: MedicalRecordAppointmentDetails;
  patient_record_id: number;
  age: number;
  gender: string;
  condition: string;
  procedure: string;
  cost: number;
  length_of_stay: number;
  readmission: string;
  outcome: string;
  satisfaction: number;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecordsResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: MedicalRecordItem[];
}
