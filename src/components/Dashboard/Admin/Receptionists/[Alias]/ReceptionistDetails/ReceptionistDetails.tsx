"use client";

import {
  CalendarDays,
  LoaderPinwheel,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";

import {
  formatChoiceFieldValue,
  formatDate,
} from "../../../../../../../utils/formatters";
import { useGetReceptionistDetailsQuery } from "../../../../../../redux/reducers/Admin/Receptionists/ReceptionistsApi";
import { ReceptionistApiItem } from "../../../../../../types/Admin/Receptionists/ReceptionistsType";

const getFullName = (receptionist: ReceptionistApiItem) => {
  const names = [
    formatChoiceFieldValue(receptionist.title),
    receptionist.first_name,
    receptionist.last_name,
  ].filter(Boolean);
  return names.join(" ") || receptionist.email || "Unknown receptionist";
};

const getInitials = (receptionist: ReceptionistApiItem) => {
  const first = receptionist.first_name?.[0] ?? receptionist.email?.[0] ?? "R";
  const last = receptionist.last_name?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
};

const ReceptionistDetails: React.FC = () => {
  const params = useParams();
  const alias = params?.alias as string | undefined;

  const { data: receptionist, isLoading } = useGetReceptionistDetailsQuery(
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

  if (!receptionist) {
    return (
      <div className="card border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
        <p className="text-muted-foreground text-center text-sm">
          Receptionist details could not be loaded.
        </p>
      </div>
    );
  }

  const fullName = getFullName(receptionist);

  return (
    <div className="space-y-6">
      <section className="card border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-primary/10 text-primary grid h-20 w-20 place-items-center rounded-[1.75rem] text-2xl font-semibold">
              {getInitials(receptionist)}
            </div>
            <div className="space-y-2">
              <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
                Receptionist profile
              </p>
              <h1 className="text-foreground text-3xl font-semibold tracking-tight">
                {fullName}
              </h1>
              <p className="text-muted-foreground">
                {receptionist.employee_id
                  ? `Employee ID ${receptionist.employee_id}`
                  : "Employee record"}
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-sm sm:text-right">
            <span className="text-muted-foreground">
              Joined{" "}
              {receptionist.joining_date
                ? formatDate(receptionist.joining_date)
                : "Not available"}
            </span>
            <span className="text-muted-foreground">
              Updated {formatDate(receptionist.updated_at)}
            </span>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        <section className="card border-border/70 bg-card w-full rounded-3xl border p-6 shadow-sm">
          <div className="grid w-full gap-6">
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
                    <p>{receptionist.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Phone
                    </p>
                    <p>{receptionist.phone || "Not provided"}</p>
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
                    <p>{receptionist.address || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Suburb
                    </p>
                    <p>{receptionist.suburb || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Postal code
                    </p>
                    <p>{receptionist.postal_code || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border-border/70 rounded-3xl border bg-white/95 p-5 shadow-sm">
                <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
                  <Users className="text-primary h-4 w-4" />
                  Employment
                </div>
                <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Shift
                    </p>
                    <p>{receptionist.shift || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Desk number
                    </p>
                    <p>{receptionist.desk_number || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Experience
                    </p>
                    <p>{receptionist.experience_years ?? "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="border-border/70 rounded-3xl border bg-white/95 p-5 shadow-sm">
                <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
                  <CalendarDays className="text-primary h-4 w-4" />
                  Basic info
                </div>
                <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Title
                    </p>
                    <p>
                      {formatChoiceFieldValue(receptionist.title) ||
                        "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Employee ID
                    </p>
                    <p>{receptionist.employee_id || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                      Joining date
                    </p>
                    <p>
                      {receptionist.joining_date
                        ? formatDate(receptionist.joining_date)
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-border/70 bg-card w-full rounded-3xl border p-6 shadow-sm">
          <div className="text-foreground flex items-center gap-3 text-sm font-semibold">
            <CalendarDays className="text-primary h-4 w-4" />
            Record details
          </div>
          <div className="text-muted-foreground mt-4 grid gap-4 text-sm">
            <div className="border-border/70 rounded-3xl border bg-white/95 p-4">
              <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                Created
              </p>
              <p>{formatDate(receptionist.created_at)}</p>
            </div>
            <div className="border-border/70 rounded-3xl border bg-white/95 p-4">
              <p className="text-foreground text-xs tracking-[0.2em] uppercase">
                Updated
              </p>
              <p>{formatDate(receptionist.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDetails;
