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
import { useGetMedicalRecordAnalyticsOutcomeQuery } from "@/redux/reducers/Admin/Home/MedicalRecordAnalyticsApi";
import { OutcomeAnalyticsPoint } from "@/types/Admin/Home/DashboardDataTypes";
import { DollarSign, HeartPulse, Users } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = ["#2563eb", "#ef4444", "#f97316", "#10b981", "#8b5cf6"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const getExtreme = (
  data: OutcomeAnalyticsPoint[],
  key: keyof OutcomeAnalyticsPoint,
  compare: (a: number, b: number) => boolean,
) =>
  data.reduce(
    (best, current) =>
      compare(Number(current[key]), Number(best[key])) ? current : best,
    data[0],
  );

const MedicalRecordAnalyticsOutcome: React.FC = () => {
  const { data, isLoading, isError } =
    useGetMedicalRecordAnalyticsOutcomeQuery(undefined);
  const chartData: OutcomeAnalyticsPoint[] = data ?? [];
  const hasData = chartData.length > 0;
  const topByRecords = hasData
    ? getExtreme(chartData, "total_records", (a, b) => a > b)
    : null;
  const topByCost = hasData
    ? getExtreme(chartData, "average_cost", (a, b) => a > b)
    : null;
  const topBySatisfaction = hasData
    ? getExtreme(chartData, "average_satisfaction", (a, b) => a > b)
    : null;
  const totalRecords = chartData.reduce(
    (sum, item) => sum + item.total_records,
    0,
  );

  return (
    <section className="border-border/70 bg-card/90 space-y-6 rounded-[2rem] border p-4 shadow-sm shadow-slate-950/10 backdrop-blur-xl sm:p-6 dark:bg-slate-950/90 dark:shadow-black/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Outcome analytics
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Patient outcome distribution
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
            Visualize recovery outcomes and the impact on cost and satisfaction.
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
            <Skeleton className="mt-4 h-64 w-full" />
          </div>
        </div>
      ) : hasData ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Largest outcome",
                value: topByRecords!.outcome,
                detail: `${topByRecords!.total_records} records`,
                icon: Users,
              },
              {
                label: "Highest average cost",
                value: topByCost!.outcome,
                detail: formatCurrency(topByCost!.average_cost),
                icon: DollarSign,
              },
              {
                label: "Best satisfaction",
                value: topBySatisfaction!.outcome,
                detail: `${topBySatisfaction!.average_satisfaction.toFixed(1)} / 5`,
                icon: HeartPulse,
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
                Outcome split
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-4 pb-6 sm:px-6">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_0.75fr]">
                <div className="border-border/70 bg-muted/80 rounded-[1.75rem] border p-4 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/80">
                  <ChartContainer
                    className="h-72 w-full"
                    config={{
                      total_records: {
                        label: "Total records",
                        color: "#2563eb",
                      },
                    }}
                    initialDimension={{ width: 520, height: 288 }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="total_records"
                          nameKey="outcome"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={4}
                          label={({ percent, name }) =>
                            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                          }
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={entry.outcome}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <div className="space-y-4">
                  <div className="border-border/70 bg-muted/80 rounded-[1.75rem] border p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/80">
                    <p className="text-muted-foreground text-sm font-medium">
                      Total outcome records
                    </p>
                    <p className="text-foreground mt-4 text-3xl font-semibold">
                      {totalRecords.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Total records across all outcomes.
                    </p>
                  </div>

                  <div className="border-border/70 bg-muted/80 rounded-[1.75rem] border p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/80">
                    <p className="text-muted-foreground text-sm font-medium">
                      Outcome legend
                    </p>
                    <div className="mt-4 space-y-3">
                      {chartData.map((entry, index) => (
                        <div
                          key={entry.outcome}
                          className="flex items-center gap-3"
                        >
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <div>
                            <p className="text-foreground text-sm font-semibold">
                              {entry.outcome}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {entry.total_records.toLocaleString()} records ·{" "}
                              {formatCurrency(entry.average_cost)} avg cost
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="border-border/70 bg-muted/80 text-muted-foreground rounded-[1.75rem] border p-6 text-sm dark:border-slate-800 dark:bg-slate-950/80">
          No outcome analytics data available. Please check your filters or try
          again later.
        </div>
      )}
    </section>
  );
};

export default MedicalRecordAnalyticsOutcome;
