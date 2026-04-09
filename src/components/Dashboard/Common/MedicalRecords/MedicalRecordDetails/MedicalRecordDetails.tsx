"use client";

import {
  CalendarDays,
  FileText,
  LoaderPinwheel,
  Mail,
  MapPin,
  Stethoscope,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";

import { useGetMedicalRecordDetailsQuery } from "@/redux/reducers/Common/MedicalRecords/MedicalRecordsApi";
import { MedicalRecordItem } from "@/types/Common/MedicalRecords/MedicalRecordsType";
import { formatDate } from "../../../../../../utils/formatters";

const formatGender = (value?: string | null) => {
  if (!value) return "Not specified";
  const normalized = value.toLowerCase();
  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";
  return value;
};

const formatCurrency = (value?: number | null) => {
  if (value === undefined || value === null) return "-";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(value);
};

const getFullName = (record: MedicalRecordItem) => {
  const first = record.patient_details.first_name || "";
  const last = record.patient_details.last_name || "";
  return `${first} ${last}`.trim() || "Unknown patient";
};

const getDoctorName = (record: MedicalRecordItem) => {
  const first = record.appointment_details.doctor_first_name || "";
  const last = record.appointment_details.doctor_last_name || "";
  return `${first} ${last}`.trim() || "Unknown doctor";
};

const getInitials = (record: MedicalRecordItem) => {
  const first = record.patient_details.first_name?.[0] ?? "P";
  const last = record.patient_details.last_name?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
};

const MedicalRecordDetails: React.FC = () => {
  const params = useParams();
  const alias = params?.alias as string | undefined;

  const { data: record, isLoading } = useGetMedicalRecordDetailsQuery(
    alias ?? "",
    {
      skip: !alias,
    },
  );

  if (isLoading) {
    return (
      <div className="card border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
        <div className="flex items-center justify-center py-20">
          <LoaderPinwheel className="text-primary h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="card border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
        <p className="text-muted-foreground text-center text-sm">
          Medical record details could not be loaded.
        </p>
      </div>
    );
  }

  const patientName = getFullName(record);
  const doctorName = getDoctorName(record);

  return (
    <div className="space-y-6">
      <section className="card border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-primary/10 text-primary grid h-20 w-20 place-items-center rounded-[1.75rem] text-2xl font-semibold">
              {getInitials(record)}
            </div>
            <div className="space-y-2">
              <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
                Medical record
              </p>
              <h1 className="text-foreground text-3xl font-semibold tracking-tight">
                {record.condition}
              </h1>
              <p className="text-muted-foreground">
                {patientName} · {record.gender} · {record.age} years
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-sm sm:text-right">
            <span className="text-muted-foreground">
              Appointment {record.appointment_details.appointment_date}
            </span>
            <span className="text-muted-foreground">
              Updated {formatDate(record.updated_at)}
            </span>
          </div>
        </div>
      </section>

      <section className="card border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-border/70 rounded-3xl border bg-white/95 p-5 shadow-sm">
              <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
                <User className="text-primary h-4 w-4" />
                Patient
              </div>
              <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Name
                  </p>
                  <p>{patientName}</p>
                </div>
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Email
                  </p>
                  <p>{record.patient_details.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Phone
                  </p>
                  <p>{record.patient_details.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Date of birth
                  </p>
                  <p>{formatDate(record.patient_details.date_of_birth)}</p>
                </div>
              </div>
            </div>

            <div className="border-border/70 rounded-3xl border bg-white/95 p-5 shadow-sm">
              <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
                <Stethoscope className="text-primary h-4 w-4" />
                Record
              </div>
              <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Procedure
                  </p>
                  <p>{record.procedure}</p>
                </div>
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Outcome
                  </p>
                  <p>{record.outcome}</p>
                </div>
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Satisfaction
                  </p>
                  <p>{record.satisfaction}/5</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-border/70 rounded-3xl border bg-white/95 p-5 shadow-sm">
              <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
                <Mail className="text-primary h-4 w-4" />
                Contact
              </div>
              <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Doctor
                  </p>
                  <p>{doctorName}</p>
                </div>
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Doctor email
                  </p>
                  <p>
                    {record.appointment_details.doctor_email || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Status
                  </p>
                  <p>{record.appointment_details.status}</p>
                </div>
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Appointment time
                  </p>
                  <p>
                    {record.appointment_details.appointment_date} ·{" "}
                    {record.appointment_details.appointment_time}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-border/70 rounded-3xl border bg-white/95 p-5 shadow-sm">
              <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
                <MapPin className="text-primary h-4 w-4" />
                Metrics
              </div>
              <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Length of stay
                  </p>
                  <p>{record.length_of_stay} hours</p>
                </div>
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Readmission
                  </p>
                  <p>{record.readmission}</p>
                </div>
                <div>
                  <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                    Cost
                  </p>
                  <p>{formatCurrency(record.cost)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-border/70 rounded-3xl border bg-white/95 p-5 shadow-sm">
            <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
              <FileText className="text-primary h-4 w-4" />
              Appointment notes
            </div>
            <p className="text-muted-foreground mt-4 text-sm leading-7">
              {record.appointment_details.notes || "No notes available."}
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        <div className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
          <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
            <CalendarDays className="text-primary h-4 w-4" />
            Record details
          </div>
          <div className="text-muted-foreground mt-4 grid gap-4 text-sm">
            <div className="border-border/70 rounded-3xl border bg-white/95 p-4">
              <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                Created
              </p>
              <p>{formatDate(record.created_at)}</p>
            </div>
            <div className="border-border/70 rounded-3xl border bg-white/95 p-4">
              <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                Updated
              </p>
              <p>{formatDate(record.updated_at)}</p>
            </div>
            <div className="border-border/70 rounded-3xl border bg-white/95 p-4">
              <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                Patient record ID
              </p>
              <p>{record.patient_record_id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordDetails;
