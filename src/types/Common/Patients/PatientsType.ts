export type RawPatient = {
  alias?: string;
  slug?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  date_of_birth?: string | null;
  gender?: string;
  last_visit?: string;
  phone?: string;
  id?: string;
} & Record<string, unknown>;

export type AddPatientPayload = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  title: string | null;
  suburb: string;
  postal_code: string;
  address: string;
  profile_image: File | null;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_history: string;
};

export interface EditPatietDialogProps {
  alias: string;
  initialValues: Partial<AddPatientPayload>;
  children?: React.ReactNode;
}

export interface DeletePatientDialogProps {
  alias: string;
  patientName?: string;
  children?: React.ReactNode;
}
