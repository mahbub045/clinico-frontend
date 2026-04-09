"use client";

import {
  CalendarDays,
  CreditCard,
  FileText,
  LoaderPinwheel,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";

import { useGetDoctorDetailsQuery } from "@/redux/reducers/Common/Doctors/DoctorsApi";
import { RawDoctor } from "@/types/Common/Doctors/DoctorsType";

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatCurrency = (value?: number | null) => {
  if (value === undefined || value === null) return "N/A";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(value);
};

const formatGender = (value?: string | null) => {
  if (!value) return "Not specified";
  const normalized = value.toLowerCase();
  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";
  return value;
};

const getFullName = (doctor: RawDoctor) => {
  const names = [doctor.title, doctor.first_name, doctor.last_name].filter(
    Boolean,
  );
  return names.join(" ") || doctor.name || "Unknown doctor";
};

const getInitials = (doctor: RawDoctor) => {
  const first = doctor.first_name?.[0] ?? doctor.name?.[0] ?? "D";
  const last = doctor.last_name?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
};

const DoctorDetails: React.FC = () => {
  const params = useParams();
  const alias = params?.alias as string | undefined;

  const { data: doctorData, isLoading } = useGetDoctorDetailsQuery(
    alias ?? "",
    {
      skip: !alias,
    },
  );

  const doctor = doctorData as RawDoctor | undefined;

  if (isLoading) {
    return (
      <div className="card border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
        <div className="flex items-center justify-center py-20">
          <LoaderPinwheel className="text-primary h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="card border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
        <p className="text-muted-foreground text-center text-sm">
          Doctor details could not be loaded.
        </p>
      </div>
    );
  }

  const fullName = getFullName(doctor);
  const specialization =
    doctor.specialization ||
    doctor.specialty ||
    doctor.department ||
    "General Medicine";

  return (
    <div className="space-y-6">
      <section className="card border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-primary/10 text-primary grid h-20 w-20 place-items-center rounded-[1.75rem] text-2xl font-semibold">
              {getInitials(doctor)}
            </div>
            <div className="space-y-2">
              <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
                Doctor profile
              </p>
              <h1 className="text-foreground text-3xl font-semibold tracking-tight">
                {fullName}
              </h1>
              <p className="text-muted-foreground">{specialization}</p>
            </div>
          </div>

          <div className="grid gap-3 text-sm sm:text-right">
            <span className="text-muted-foreground">
              Joined {formatDate(doctor.joined_date)}
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="card border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border-border/70 rounded-3xl border bg-white/95 p-5 shadow-sm">
                <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
                  <Mail className="text-primary h-4 w-4" />
                  Contact
                </div>
                <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Email
                    </p>
                    <p>{doctor.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Phone
                    </p>
                    <p>{doctor.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="border-border/70 rounded-3xl border bg-white/95 p-5 shadow-sm">
                <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
                  <MapPin className="text-primary h-4 w-4" />
                  Location
                </div>
                <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Address
                    </p>
                    <p>{doctor.address || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Suburb
                    </p>
                    <p>{doctor.suburb || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Postal code
                    </p>
                    <p>{doctor.postal_code || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border-border/70 rounded-3xl border bg-white/95 p-5 shadow-sm">
                <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
                  <Users className="text-primary h-4 w-4" />
                  Professional
                </div>
                <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Degree
                    </p>
                    <p>{doctor.degree || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Specialization
                    </p>
                    <p>{specialization}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Experience
                    </p>
                    <p>{doctor.experience_years ?? "-"} years</p>
                  </div>
                </div>
              </div>

              <div className="border-border/70 rounded-3xl border bg-white/95 p-5 shadow-sm">
                <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
                  <CreditCard className="text-primary h-4 w-4" />
                  Practice
                </div>
                <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Chamber
                    </p>
                    <p>{doctor.chamber_room || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Consultation fee
                    </p>
                    <p>{formatCurrency(doctor.consultation_fee as number)}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Gender
                    </p>
                    <p>{formatGender(doctor.gender)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
              <FileText className="text-primary h-4 w-4" />
              Biography
            </div>
            <p className="text-muted-foreground mt-4 text-sm leading-7">
              {doctor.bio || "No biography available for this doctor."}
            </p>
          </div>

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
                <p>{formatDate(doctor.created_at as string)}</p>
              </div>
              <div className="border-border/70 rounded-3xl border bg-white/95 p-4">
                <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                  Last updated
                </p>
                <p>{formatDate(doctor.updated_at as string)}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DoctorDetails;
