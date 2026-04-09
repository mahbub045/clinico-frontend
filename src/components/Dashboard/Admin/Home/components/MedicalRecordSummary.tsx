"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMedicalRecordSummaryQuery } from "@/redux/reducers/Admin/Home/MedicalRecordSummaryApi";
import { MedicalRecordSummaryData } from "@/types/Admin/Home/DashboardDataTypes";
import {
  CalendarDays,
  CreditCard,
  FileText,
  HeartPulse,
  Star,
  TrendingUp,
} from "lucide-react";
import type { ReactElement } from "react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value: number, digits = 1) =>
  Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(value);

const metricCards = (
  summary: MedicalRecordSummaryData,
): Array<{
  title: string;
  value: string | number;
  description: string;
  icon: (props: React.ComponentProps<typeof FileText>) => ReactElement;
}> => [
  {
    title: "Total records",
    value: summary.total_records.toLocaleString(),
    description: "Medical records processed",
    icon: (props) => <FileText className={props.className} />,
  },
  {
    title: "Total cost",
    value: formatCurrency(summary.total_cost),
    description: "All procedures combined",
    icon: (props) => <CreditCard className={props.className} />,
  },
  {
    title: "Avg length of stay",
    value: `${formatNumber(summary.average_length_of_stay)} days`,
    description: "Patient stay duration",
    icon: (props) => <CalendarDays className={props.className} />,
  },
  {
    title: "Avg satisfaction",
    value: summary.average_satisfaction.toFixed(1),
    description: "Patient feedback score",
    icon: (props) => <Star className={props.className} />,
  },
];

const detailCards = (
  summary: MedicalRecordSummaryData,
): Array<{
  title: string;
  value: string;
  description: string;
  icon: (props: React.ComponentProps<typeof FileText>) => ReactElement;
}> => [
  {
    title: "Average age",
    value: `${formatNumber(summary.average_age)} years`,
    description: "Patient population average",
    icon: (props) => <TrendingUp className={props.className} />,
  },
  {
    title: "Average cost per record",
    value: formatCurrency(summary.average_cost),
    description: "Typical spending per case",
    icon: (props) => <HeartPulse className={props.className} />,
  },
];

const MedicalRecordSummary: React.FC = () => {
  const { data, isLoading, isError } =
    useGetMedicalRecordSummaryQuery(undefined);
  const summary = data as MedicalRecordSummaryData | undefined;
  const hasSummary = Boolean(summary);
  const totalReadmissions = summary
    ? summary.readmission_yes_count + summary.readmission_no_count
    : 0;
  const readmissionRate = totalReadmissions
    ? Math.round(
        ((summary?.readmission_yes_count ?? 0) / totalReadmissions) * 100,
      )
    : 0;
  const noReadmissionRate = 100 - readmissionRate;

  return (
    <div className="grid gap-6">
      <Card className="border-border/70 rounded-[2rem] bg-white/90 p-6 shadow-sm shadow-slate-950/10 dark:bg-slate-950/90 dark:shadow-black/10">
        <CardHeader className="gap-4 px-0 pb-4 sm:flex sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-foreground text-2xl font-semibold sm:text-3xl">
              Medical Record Summary
            </CardTitle>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
              A polished overview of patient outcomes, cost drivers, and
              readmission risk across your records.
            </p>
          </div>
          <Badge variant="secondary">Performance dashboard</Badge>
        </CardHeader>

        {isError ? (
          <CardContent className="px-0 pt-6">
            <div className="border-destructive/10 bg-destructive/5 text-destructive rounded-[2rem] border p-6 text-sm">
              There was an issue loading the medical record summary. Please try
              again.
            </div>
          </CardContent>
        ) : isLoading ? (
          <CardContent className="px-0 pt-6">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="border-border/70 bg-muted/80 rounded-[1.75rem] border p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/80"
                  >
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="mt-4 h-12 w-full" />
                  </div>
                ))}
              </div>
              <div className="bg-primary/5 dark:bg-primary/10 rounded-[2rem] p-6">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="mt-4 h-10 w-48" />
                <Skeleton className="mt-4 h-4 w-64" />
              </div>
            </div>
          </CardContent>
        ) : !hasSummary ? (
          <CardContent className="px-0 pt-6">
            <div className="border-border/70 bg-muted/80 text-muted-foreground rounded-[2rem] border p-6 text-sm dark:border-slate-800 dark:bg-slate-950/80">
              No medical record summary data is available.
            </div>
          </CardContent>
        ) : (
          <CardContent className="px-0 pt-6">
            <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                  {metricCards(summary!).map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div
                        key={metric.title}
                        className="border-border/70 bg-muted/80 rounded-[1.75rem] border p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/80"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-muted-foreground text-sm font-medium">
                              {metric.title}
                            </p>
                            <p className="text-foreground mt-3 text-3xl font-semibold">
                              {metric.value}
                            </p>
                          </div>
                          <div className="bg-primary/10 text-primary inline-flex h-12 w-12 items-center justify-center rounded-3xl">
                            <Icon className="size-5" />
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-4 text-sm leading-6">
                          {metric.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-primary/5 dark:bg-primary/10 rounded-[2rem] p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-primary text-sm font-medium tracking-[0.24em] uppercase">
                        Readmission outlook
                      </p>
                      <h3 className="text-foreground mt-3 text-2xl font-semibold">
                        {`${readmissionRate}% readmitted`}
                      </h3>
                      <p className="text-muted-foreground mt-2 max-w-xl text-sm">
                        {`Based on ${summary!.readmission_yes_count.toLocaleString()} readmissions out of ${totalReadmissions.toLocaleString()} records.`}
                      </p>
                    </div>
                    <Badge
                      variant={
                        readmissionRate >= 40
                          ? "danger"
                          : readmissionRate >= 25
                            ? "warning"
                            : "success"
                      }
                    >
                      {`${readmissionRate}% risk`}
                    </Badge>
                  </div>

                  <div className="mt-6 space-y-4">
                    {[
                      {
                        label: "Readmitted",
                        value: summary!.readmission_yes_count,
                        percent: readmissionRate,
                        color: "bg-destructive",
                      },
                      {
                        label: "No readmission",
                        value: summary!.readmission_no_count,
                        percent: noReadmissionRate,
                        color: "bg-emerald-500",
                      },
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="text-muted-foreground flex items-center justify-between text-sm">
                          <span>{item.label}</span>
                          <span>{item.value.toLocaleString()}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className={`${item.color} h-full rounded-full transition-all duration-300`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {detailCards(summary!).map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div
                      key={detail.title}
                      className="border-border/70 rounded-[1.75rem] border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/80"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-muted-foreground text-sm font-medium">
                            {detail.title}
                          </p>
                          <p className="text-foreground mt-3 text-2xl font-semibold">
                            {detail.value}
                          </p>
                        </div>
                        <div className="text-primary inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-800">
                          <Icon className="size-5" />
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-4 text-sm leading-6">
                        {detail.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default MedicalRecordSummary;
