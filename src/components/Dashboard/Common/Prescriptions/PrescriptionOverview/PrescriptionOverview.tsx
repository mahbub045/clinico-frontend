"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetPrescriptionOverviewQuery } from "@/redux/reducers/Common/Prescriptions/PrescriptionsApi";
import {
  CalendarDays,
  ClipboardList,
  LoaderPinwheel,
  Stethoscope,
  Users,
} from "lucide-react";

const PrescriptionOverview: React.FC = () => {
  const { data: overview, isLoading } =
    useGetPrescriptionOverviewQuery(undefined);

  const stats = [
    {
      label: "Prescriptions",
      value: overview?.total_prescriptions ?? "—",
      description: "Total prescriptions issued across the clinic.",
      icon: ClipboardList,
    },
    {
      label: "Doctors",
      value: overview?.total_doctors ?? "—",
      description: "Doctors assigned to prescriptions and appointments.",
      icon: Stethoscope,
    },
    {
      label: "Patients",
      value: overview?.total_patients ?? "—",
      description: "Patients with active prescription history.",
      icon: Users,
    },
    {
      label: "Appointments",
      value: overview?.total_appointments ?? "—",
      description: "Appointments linked to prescriptions.",
      icon: CalendarDays,
    },
  ];

  return (
    <section className="border-border/70 bg-card/90 rounded-[2rem] border p-6 shadow-sm shadow-slate-950/10 sm:p-8 dark:bg-slate-950/95 dark:shadow-black/10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Prescription analytics
          </p>
          <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Prescription overview
          </h1>
          <p className="text-muted-foreground text-sm leading-6">
            Monitor prescription volume, patient coverage, doctor activity, and
            appointment relationships in one place.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <Card
                key={index}
                className="border-border rounded-3xl border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:bg-slate-950/95 dark:shadow-black/5"
              >
                <CardContent className="flex items-center justify-center py-12">
                  <LoaderPinwheel className="text-primary h-6 w-6 animate-spin" />
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="border-border rounded-3xl border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:bg-slate-950/95 dark:shadow-black/5"
                >
                  <CardHeader className="px-0 pb-2">
                    <CardTitle className="text-muted-foreground text-sm font-semibold tracking-[0.22em] uppercase">
                      {stat.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pt-2">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-3xl">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-foreground text-3xl font-semibold tracking-tight">
                          {stat.value}
                        </p>
                        <CardDescription className="text-muted-foreground mt-2 text-sm leading-6">
                          {stat.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </section>
  );
};

export default PrescriptionOverview;
