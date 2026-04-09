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
import { useGetMedicalRecordAnalyticsMonthlySatisfactionQuery } from "@/redux/reducers/Admin/Home/MedicalRecordAnalyticsApi";
import { MonthlySatisfactionAnalyticsPoint } from "@/types/Admin/Home/DashboardDataTypes";
import { Smile, TrendingUp, Users } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = ["#2563eb", "#f97316", "#10b981", "#8b5cf6"];

const formatRecordCount = (value: number) => value.toLocaleString("en-US");

const getMostFrequent = (data: MonthlySatisfactionAnalyticsPoint[]) =>
  data.reduce(
    (best, current) =>
      current.total_records > best.total_records ? current : best,
    data[0],
  );

const computeWeightedSatisfaction = (
  data: MonthlySatisfactionAnalyticsPoint[],
) => {
  const totalRecords = data.reduce((sum, item) => sum + item.total_records, 0);
  if (totalRecords === 0) return 0;
  return (
    data.reduce(
      (sum, item) => sum + item.satisfaction * item.total_records,
      0,
    ) / totalRecords
  ).toFixed(2);
};

const MedicalRecordAnalyticsSatisfaction: React.FC = () => {
  const { data, isLoading, isError } =
    useGetMedicalRecordAnalyticsMonthlySatisfactionQuery(undefined);
  const chartData: MonthlySatisfactionAnalyticsPoint[] = data ?? [];
  const hasData = chartData.length > 0;
  const mostFrequent = hasData ? getMostFrequent(chartData) : null;
  const totalRecords = chartData.reduce(
    (sum, item) => sum + item.total_records,
    0,
  );
  const averageSatisfaction = hasData
    ? computeWeightedSatisfaction(chartData)
    : "0.00";

  return (
    <section className="border-border/70 bg-card/90 space-y-6 rounded-[2rem] border p-4 shadow-sm shadow-slate-950/10 backdrop-blur-xl sm:p-6 dark:bg-slate-950/90 dark:shadow-black/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Satisfaction distribution
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Patient satisfaction spread
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
            See how satisfaction scores distribute across recent medical
            records.
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
                label: "Top satisfaction",
                value: mostFrequent
                  ? `${mostFrequent.satisfaction} stars`
                  : "-",
                detail: mostFrequent
                  ? `${formatRecordCount(mostFrequent.total_records)} records`
                  : "",
                icon: Smile,
              },
              {
                label: "Total records",
                value: formatRecordCount(totalRecords),
                detail: "Satisfaction responses",
                icon: Users,
              },
              {
                label: "Weighted average",
                value: `${averageSatisfaction} / 5`,
                detail: "Total satisfaction score",
                icon: TrendingUp,
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
                Satisfaction volume
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
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="total_records"
                        nameKey="satisfaction"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        label={({ name, percent }) =>
                          `${name} ${(percent ?? 0) * 100}%`
                        }
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.satisfaction}`}
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
            </CardContent>
          </Card>
        </>
      ) : isError ? (
        <div className="border-destructive/10 bg-destructive/5 text-destructive rounded-[1.75rem] border p-6 text-sm">
          Unable to load satisfaction analytics. Please refresh to try again.
        </div>
      ) : (
        <div className="border-border/70 bg-muted/80 text-muted-foreground rounded-[1.75rem] border p-6 text-sm dark:border-slate-800 dark:bg-slate-950/80">
          No satisfaction analytics data available. Please check your filters or
          try again later.
        </div>
      )}
    </section>
  );
};

export default MedicalRecordAnalyticsSatisfaction;
