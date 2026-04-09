export type RawDoctor = {
  alias?: string;
  name?: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  specialty?: string;
  specialization?: string;
  department?: string;
  email?: string;
  phone?: string;
  degree?: string;
  consultation_fee?: number;
  experience_years?: number;
  joined_date?: string;
  address?: string;
  suburb?: string;
  postal_code?: string;
  chamber_room?: string;
  gender?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type AddDoctorPayload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  title: string | null;
  suburb: string;
  postal_code: string;
  address: string;
  profile_image: File | null;
  degree: string;
  specialization: string;
  joined_date: string | null;
  consultation_fee: string | null;
  chamber_room: string;
  experience_years: string | null;
  bio: string;
  gender: string | null;
};

export type DoctorsResponse =
  | RawDoctor[]
  | {
      total_items?: number;
      total_pages?: number;
      current_page?: number;
      next?: string | null;
      previous?: string | null;
      results?: RawDoctor[];
    }
  | RawDoctor;

export type EditDoctorDialogProps = {
  alias: string;
  initialValues: RawDoctor;
  children?: React.ReactNode;
};

export type DeleteDoctorDialogProps = {
  alias: string;
  doctorName?: string;
  children?: React.ReactNode;
};

export type DoctorRow = RawDoctor & {
  name: string;
  specialty: string;
  degree: string;
  experience: string;
};
