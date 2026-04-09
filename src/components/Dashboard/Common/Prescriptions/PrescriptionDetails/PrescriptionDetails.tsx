"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, LoaderPinwheel } from "lucide-react";
import { useParams } from "next/navigation";

import {
  useDownloadPrescriptionMutation,
  useGetPrescriptionDetailsQuery,
} from "@/redux/reducers/Common/Prescriptions/PrescriptionsApi";
import {
  formatChoiceFieldValue,
  formatDateAndTime,
} from "../../../../../../utils/formatters";

const statusVariant = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    case "CONFIRMED":
      return "default";
    default:
      return "default";
  }
};

const getFullName = (first?: string, last?: string) => {
  const name = [first, last].filter(Boolean).join(" ");
  return name || "Unknown";
};

const PrescriptionDetails: React.FC = () => {
  const { alias } = useParams() as { alias?: string };
  const {
    data: prescription,
    isLoading,
    error,
  } = useGetPrescriptionDetailsQuery(alias ?? "", {
    skip: !alias,
  });

  const [downloadPrescription, { isLoading: isDownloading }] =
    useDownloadPrescriptionMutation();

  const handleDownload = async () => {
    if (!alias) return;

    try {
      const blob = await downloadPrescription(alias).unwrap();
      if (!(blob instanceof Blob)) return;

      const filename = prescription?.prescription_number
        ? `${prescription.prescription_number}.pdf`
        : `${alias}.pdf`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error("Download failed", downloadError);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">
            Prescription details
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Review the prescription, appointment, patient and doctor details in
            a single view.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleDownload}
          disabled={!alias || isDownloading}
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? "Downloading..." : "Download PDF"}
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-border rounded-xl border p-6 text-center">
          <div className="mx-auto flex max-w-xs flex-col items-center justify-center gap-3">
            <LoaderPinwheel className="text-primary animate-spin" />
            <p className="text-foreground">Loading prescription details...</p>
          </div>
        </Card>
      ) : !prescription || error ? (
        <Card className="border-destructive/50 bg-destructive/5 text-destructive rounded-xl border p-6 text-center">
          <p className="text-foreground">
            Unable to load prescription details.
          </p>
          <p className="text-muted-foreground mt-2">
            Please refresh the page or try again later.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card className="border-border rounded-xl border p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-sm">Prescription</p>
                  <p className="text-foreground text-lg font-semibold">
                    {prescription.prescription_number ||
                      prescription.slug ||
                      prescription.alias}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-sm">Status</p>
                    <Badge
                      variant={statusVariant(
                        prescription.appointment_details?.status,
                      )}
                    >
                      {formatChoiceFieldValue(
                        prescription.appointment_details?.status,
                      ) || "Unknown"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Created</p>
                    <p className="text-foreground">
                      {formatDateAndTime(prescription.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Updated</p>
                    <p className="text-foreground">
                      {formatDateAndTime(prescription.updated_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Appointment</p>
                    <p className="text-foreground">
                      {prescription.appointment_details?.appointment_date ||
                        "-"}
                      {prescription.appointment_details?.appointment_time
                        ? ` · ${prescription.appointment_details.appointment_time}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-border rounded-xl border p-6 shadow-sm">
              <h2 className="text-foreground text-lg font-semibold">
                Prescription summary
              </h2>
              <div className="grid gap-4 pt-4">
                <div>
                  <p className="text-muted-foreground text-sm">Diagnosis</p>
                  <p className="text-foreground">
                    {prescription.diagnosis || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Medicines</p>
                  <p className="text-foreground whitespace-pre-line">
                    {prescription.medicines || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Advice</p>
                  <p className="text-foreground whitespace-pre-line">
                    {prescription.advice || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Notes</p>
                  <p className="text-foreground">{prescription.notes || "-"}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border rounded-xl border p-6 shadow-sm">
              <h2 className="text-foreground text-lg font-semibold">Patient</h2>
              <div className="grid gap-4 pt-4">
                <div>
                  <p className="text-muted-foreground text-sm">Name</p>
                  <p className="text-foreground">
                    {getFullName(
                      prescription.appointment_details?.patient_first_name,
                      prescription.appointment_details?.patient_last_name,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="text-foreground">
                    {prescription.appointment_details?.patient_email || "-"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border rounded-xl border p-6 shadow-sm">
              <h2 className="text-foreground text-lg font-semibold">Doctor</h2>
              <div className="grid gap-4 pt-4">
                <div>
                  <p className="text-muted-foreground text-sm">Name</p>
                  <p className="text-foreground">
                    {getFullName(
                      prescription.appointment_details?.doctor_first_name,
                      prescription.appointment_details?.doctor_last_name,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Specialization
                  </p>
                  <p className="text-foreground">
                    {prescription.appointment_details?.doctor_specialization ||
                      "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="text-foreground">
                    {prescription.appointment_details?.doctor_email || "-"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border rounded-xl border p-6 shadow-sm">
              <h2 className="text-foreground text-lg font-semibold">
                Appointment
              </h2>
              <div className="grid gap-4 pt-4">
                <div>
                  <p className="text-muted-foreground text-sm">Slug</p>
                  <p className="text-foreground">
                    {prescription.appointment_details?.slug || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <p className="text-foreground">
                    {formatChoiceFieldValue(
                      prescription.appointment_details?.status,
                    ) || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Appointment ID
                  </p>
                  <p className="text-foreground">
                    {prescription.appointment_details?.id ?? "-"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionDetails;
