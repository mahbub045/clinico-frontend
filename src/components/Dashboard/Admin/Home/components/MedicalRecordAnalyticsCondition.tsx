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
import { useGetMedicalRecordAnalyticsConditionQuery } from "@/redux/reducers/Admin/Home/MedicalRecordAnalyticsApi";
import { ConditionAnalyticsPoint } from "@/types/Admin/Home/DashboardDataTypes";
import { ArrowUpRight, DollarSign, Star, Users } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const getExtreme = (
  data: ConditionAnalyticsPoint[],
  key: keyof ConditionAnalyticsPoint,
  compare: (a: number, b: number) => boolean,
) =>
  data.reduce(
    (best, current) =>
      compare(Number(current[key]), Number(best[key])) ? current : best,
    data[0],
  );

const MedicalRecordAnalyticsCondition: React.FC = () => {
  const { data, isLoading, isError } =
    useGetMedicalRecordAnalyticsConditionQuery(undefined);
  const chartData: ConditionAnalyticsPoint[] = data ?? [];
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

  const highestStay = hasData
    ? chartData.reduce(
        (prev, current) =>
          current.average_stay > prev.average_stay ? current : prev,
        chartData[0],
      )
    : null;

  const maxAverageCost = hasData
    ? Math.max(...chartData.map((item) => item.average_cost))
    : 0;

  return (
    <section className="border-border/70 bg-card/90 space-y-6 rounded-[2rem] border p-4 shadow-sm shadow-slate-950/10 backdrop-blur-xl sm:p-6 dark:bg-slate-950/90 dark:shadow-black/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Condition analytics
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Condition-level performance
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
            Compare case volume, cost, and satisfaction for each medical
            condition.
          </p>
        </div>
      </div>

      {isLoading ? (
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
      ) : hasData ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Most common",
              value: topByRecords!.condition,
              detail: `${topByRecords!.total_records} records`,
              icon: Users,
            },
            {
              label: "Highest average cost",
              value: topByCost!.condition,
              detail: formatCurrency(topByCost!.average_cost),
              icon: DollarSign,
            },
            {
              label: "Best satisfaction",
              value: topBySatisfaction!.condition,
              detail: `${topBySatisfaction!.average_satisfaction.toFixed(1)} / 5`,
              icon: Star,
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
      ) : null}

      <Card className="border-border/70 bg-white/90 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/10">
        <CardHeader className="px-6 pb-0">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Condition comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pt-4 pb-6 sm:px-6">
          {isError ? (
            <div className="border-destructive/10 bg-destructive/5 text-destructive rounded-[1.75rem] border p-6 text-sm">
              Unable to load analytics. Please refresh to try again.
            </div>
          ) : isLoading ? (
            <div className="space-y-5">
              <div className="border-border/70 bg-muted/80 rounded-[1.75rem] border p-4 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/80">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            </div>
          ) : !hasData ? (
            <div className="border-border/70 bg-muted/80 text-muted-foreground rounded-[1.75rem] border p-6 text-sm dark:border-slate-800 dark:bg-slate-950/80">
              No analytics data available. Please check your filters or try
              again later.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="border-border/70 bg-muted/80 rounded-[1.75rem] border p-4 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/80">
                <ChartContainer
                  className="h-72 w-full"
                  config={{
                    total_records: {
                      label: "Total records",
                      color: "#2563eb",
                    },
                    average_satisfaction: {
                      label: "Avg satisfaction",
                      color: "#ef4444",
                    },
                  }}
                  initialDimension={{ width: 680, height: 288 }}
                >
                  <ComposedChart
                    data={chartData}
                    margin={{ left: 4, right: 4, top: 8, bottom: 48 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="condition"
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={72}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                    />
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
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="average_satisfaction"
                      stroke="var(--color-average_satisfaction)"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#f97316" }}
                    />
                  </ComposedChart>
                </ChartContainer>
              </div>

              <div className="grid gap-4 xl:grid-cols-[0.9fr_0.85fr]">
                <div className="border-border/70 bg-muted/80 rounded-[1.75rem] border p-5 dark:border-slate-800 dark:bg-slate-950/80">
                  <p className="text-muted-foreground text-sm font-medium">
                    Highest average stay
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-foreground text-2xl font-semibold">
                        {highestStay?.condition ?? "-"}
                      </p>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {highestStay
                          ? `${highestStay.average_stay.toFixed(1)} days average stay`
                          : "-"}
                      </p>
                    </div>
                    <ArrowUpRight className="text-primary size-6" />
                  </div>
                </div>

                <div className="border-border/70 bg-muted/80 rounded-[1.75rem] border p-5 dark:border-slate-800 dark:bg-slate-950/80">
                  <p className="text-muted-foreground text-sm font-medium">
                    Cost range overview
                  </p>
                  <p className="text-foreground mt-4 text-2xl font-semibold">
                    {formatCurrency(maxAverageCost)}
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Highest average condition cost
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default MedicalRecordAnalyticsCondition;
