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
