"use client";
import { useGetPatientDetailsQuery } from "@/redux/reducers/Common/Patients/PatientsApi";
import { LoaderPinwheel } from "lucide-react";
import { useParams } from "next/navigation";
import { formatChoiceFieldValue } from "../../../../../../../utils/formatters";

const PatientDetails: React.FC = () => {
  const { alias } = useParams() as { alias?: string };
  const { data: patient, isLoading } = useGetPatientDetailsQuery(
    { alias: alias ?? "" },
    { skip: !alias },
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">
            Patient details
          </h1>
          <p className="text-muted-foreground mt-2">
            Review the selected patient’s profile and contact details.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="border-border bg-card rounded-xl border p-6 text-center">
          <div className="mx-auto flex max-w-xs flex-col items-center justify-center gap-3">
            <LoaderPinwheel className="text-primary animate-spin" />
            <p className="text-foreground">Loading patient details...</p>
          </div>
        </div>
      ) : !patient ? (
        <div className="border-border bg-card text-destructive rounded-xl border p-6 text-center">
          Unable to load patient details.
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <p className="text-foreground text-lg font-semibold">
                  {[
                    formatChoiceFieldValue(patient.title),
                    patient.first_name,
                    patient.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ") || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="text-foreground">{patient.email || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Phone</p>
                <p className="text-foreground">{patient.phone || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Gender</p>
                <p className="text-foreground">
                  {formatChoiceFieldValue(patient.gender) || "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Date of birth</p>
                <p className="text-foreground">
                  {patient.date_of_birth || "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Blood group</p>
                <p className="text-foreground">{patient.blood_group || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Suburb</p>
                <p className="text-foreground">{patient.suburb || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Postal code</p>
                <p className="text-foreground">{patient.postal_code || "-"}</p>
              </div>
            </div>
          </div>

          <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
            <h2 className="text-foreground text-base font-semibold">
              Additional details
            </h2>
            <div className="grid gap-4 pt-4 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm">Address</p>
                <p className="text-foreground">{patient.address || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  Emergency contact
                </p>
                <p className="text-foreground">
                  {patient.emergency_contact_name || "-"}
                </p>
                <p className="text-muted-foreground text-sm">
                  {patient.emergency_contact_phone || "-"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-muted-foreground text-sm">Medical history</p>
                <p className="text-foreground">
                  {patient.medical_history || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
