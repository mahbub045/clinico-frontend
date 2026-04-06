import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stethoscope } from "lucide-react";

const appointmentSummaries = [
  {
    label: "Today's Appointments",
    value: "12",
    description: "Patients scheduled for today",
  },
  {
    label: "New Patients",
    value: "4",
    description: "First-time consultations",
  },
  {
    label: "Completed",
    value: "18",
    description: "Visits finalized this week",
  },
  {
    label: "Cancelled",
    value: "2",
    description: "Appointments that were cancelled",
  },
];

const AppointmentsSummary: React.FC = () => {
  return (
    <div>
      <section className="space-y-4">
        <div className="border-border bg-card flex flex-col gap-4 rounded-3xl border p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
              Appointment Management
            </p>
            <h1 className="text-foreground text-3xl font-semibold tracking-tight">
              Appointments
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm">
              Review today’s bookings, monitor patient status, and keep your
              schedule on track.
            </p>
          </div>

          <div className="grid w-full place-items-end gap-3 sm:max-w-md">
            <Stethoscope className="text-primary/70 h-24 w-24" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {appointmentSummaries.map((summary) => (
            <Card
              key={summary.label}
              className="border-border rounded-3xl border p-4"
            >
              <CardHeader className="px-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-semibold tracking-[0.15em] uppercase">
                  {summary.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pt-2">
                <p className="text-foreground text-3xl font-semibold tracking-tight">
                  {summary.value}
                </p>
                <CardDescription className="text-muted-foreground mt-2 text-sm leading-6">
                  {summary.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AppointmentsSummary;
