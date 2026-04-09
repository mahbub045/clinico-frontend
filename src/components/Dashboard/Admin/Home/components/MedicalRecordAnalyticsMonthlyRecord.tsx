"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMedicalRecordAnalyticsMonthlyRecordQuery } from "@/redux/reducers/Admin/Home/MedicalRecordAnalyticsApi";
import { MonthlyRecordAnalyticsPoint } from "@/types/Admin/Home/DashboardDataTypes";
import { CalendarDays, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatMonthLabel = (year: number, month: number) =>
  `${monthNames[month - 1] ?? ""} ${year}`;

const getExtreme = (
  data: MonthlyRecordAnalyticsPoint[],
  compare: (a: number, b: number) => boolean,
) =>
  data.reduce(
    (best, current) =>
      compare(current.total_records, best.total_records) ? current : best,
    data[0],
  );

const MedicalRecordAnalyticsMonthlyRecord: React.FC = () => {
  const { data, isLoading, isError } =
    useGetMedicalRecordAnalyticsMonthlyRecordQuery(undefined);
  const chartData: MonthlyRecordAnalyticsPoint[] = data ?? [];
  const preparedData = chartData.map((item) => ({
    ...item,
    month_label: formatMonthLabel(item.year, item.month),
  }));
  const hasData = preparedData.length > 0;
  const busiestMonth = hasData
    ? getExtreme(chartData, (a, b) => a > b)
    : null;

  return (
    <section className="border-border/70 bg-card/90 space-y-6 rounded-[2rem] border p-4 shadow-sm shadow-slate-950/10 backdrop-blur-xl sm:p-6 dark:bg-slate-950/90 dark:shadow-black/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Monthly record trend
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Monthly record volume
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
            Monitor monthly case volume and identify seasonal or operational changes.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="border-border/70 rounded-[1.75rem] border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/10"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-4 h-8 w-48" />
                <Skeleton className="mt-3 h-4 w-24" />
              </div>
            ))}
          </div>

          <div className="border-border/70 bg-muted/80 rounded-[1.75rem] border p-4 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/80">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="mt-4 h-72 w-full" />
          </div>
        </div>
      ) : hasData ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Busiest month",
                value: busiestMonth?.total_records
                  ? `${busiestMonth.total_records} records`
                  : "-",
                detail: busiestMonth
                  ? formatMonthLabel(busiestMonth.year, busiestMonth.month)
                  : "",
                icon: Users,
              },
              {
                label: "Monthly average",
                value: `${(
                  chartData.reduce((sum, item) => sum + item.total_records, 0) /
                  chartData.length
                ).toFixed(0)} records`,
                detail: "Average by month",
                icon: TrendingUp,
              },
              {
                label: "Time range",
                value: `${formatMonthLabel(
                  chartData[0].year,
                  chartData[0].month,
                )} – ${formatMonthLabel(
                  chartData[chartData.length - 1].year,
                  chartData[chartData.length - 1].month,
                )}`,
                detail: "Trend window",
                icon: CalendarDays,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.label}
                  className="border-border/70 bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary inline-flex h-11 w-11 items-center justify-center rounded-3xl">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-medium tracking-[0.24em] uppercase">
                        {item.label}
                      </p>
                      <p className="text-foreground mt-2 text-lg font-semibold">
                        {item.value}
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="border-border/70 bg-white/90 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/10">
            <CardHeader className="px-6 pb-0">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Monthly volume trend
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-4 pb-6 sm:px-6">
              <div className="border-border/70 bg-muted/80 rounded-[1.75rem] border p-4 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/80">
                <ChartContainer
                  className="h-72 w-full"
                  config={{
                    total_records: {
                      label: "Total records",
                      color: "#2563eb",
                    },
                  }}
                  initialDimension={{ width: 680, height: 288 }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={preparedData}
                      margin={{ left: 4, right: 4, top: 8, bottom: 48 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="month_label"
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        angle={-30}
                        textAnchor="end"
                        height={72}
                      />
                      <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <ChartLegend
                        verticalAlign="top"
                        content={<ChartLegendContent />}
                      />
                      <Bar
                        dataKey="total_records"
                        fill="var(--color-total_records)"
                        radius={[10, 10, 0, 0]}
                        barSize={24}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </>
      ) : isError ? (
        <div className="border-destructive/10 bg-destructive/5 text-destructive rounded-[1.75rem] border p-6 text-sm">
          Unable to load monthly record analytics. Please refresh to try again.
        </div>
      ) : (
        <div className="border-border/70 bg-muted/80 text-muted-foreground rounded-[1.75rem] border p-6 text-sm dark:border-slate-800 dark:bg-slate-950/80">
          No monthly record analytics data available. Please check your filters or try again later.
        </div>
      )}
    </section>
  );
};

export default MedicalRecordAnalyticsMonthlyRecord;
