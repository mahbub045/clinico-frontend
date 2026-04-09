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
import { useGetMedicalRecordAnalyticsMonthlyCostQuery } from "@/redux/reducers/Admin/Home/MedicalRecordAnalyticsApi";
import { MonthlyCostAnalyticsPoint } from "@/types/Admin/Home/DashboardDataTypes";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

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
  data: MonthlyCostAnalyticsPoint[],
  key: keyof MonthlyCostAnalyticsPoint,
  compare: (a: number, b: number) => boolean,
) =>
  data.reduce(
    (best, current) =>
      compare(Number(current[key]), Number(best[key])) ? current : best,
    data[0],
  );

const MedicalRecordAnalyticsMonthlyCost: React.FC = () => {
  const { data, isLoading, isError } =
    useGetMedicalRecordAnalyticsMonthlyCostQuery(undefined);
  const chartData: MonthlyCostAnalyticsPoint[] = data ?? [];
  const preparedData = chartData.map((item) => ({
    ...item,
    month_label: formatMonthLabel(item.year, item.month),
  }));
  const hasData = preparedData.length > 0;
  const highestSpendMonth = hasData
    ? getExtreme(chartData, "total_cost", (a, b) => a > b)
    : null;
  const highestAverageCostMonth = hasData
    ? getExtreme(chartData, "average_cost", (a, b) => a > b)
    : null;
  const busiestMonth = hasData
    ? getExtreme(chartData, "total_records", (a, b) => a > b)
    : null;

  return (
    <section className="border-border/70 bg-card/90 space-y-6 rounded-[2rem] border p-4 shadow-sm shadow-slate-950/10 backdrop-blur-xl sm:p-6 dark:bg-slate-950/90 dark:shadow-black/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Monthly cost trend
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Monthly medical cost overview
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
            Track monthly cost, volume, and average spend to spot emerging
            trends.
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
                label: "Highest spend",
                value: highestSpendMonth?.total_cost
                  ? formatCurrency(highestSpendMonth.total_cost)
                  : "-",
                detail: highestSpendMonth
                  ? formatMonthLabel(
                      highestSpendMonth.year,
                      highestSpendMonth.month,
                    )
                  : "",
                icon: DollarSign,
              },
              {
                label: "Highest average cost",
                value: highestAverageCostMonth?.average_cost
                  ? formatCurrency(highestAverageCostMonth.average_cost)
                  : "-",
                detail: highestAverageCostMonth
                  ? formatMonthLabel(
                      highestAverageCostMonth.year,
                      highestAverageCostMonth.month,
                    )
                  : "",
                icon: TrendingUp,
              },
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
                Monthly cost trend
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-4 pb-6 sm:px-6">
              <div className="border-border/70 bg-muted/80 rounded-[1.75rem] border p-4 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/80">
                <ChartContainer
                  className="h-72 w-full"
                  config={{
                    total_cost: {
                      label: "Total cost",
                      color: "#2563eb",
                    },
                    average_cost: {
                      label: "Avg cost",
                      color: "#ef4444",
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
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) =>
                          formatCurrency(Number(value)).replace("$", "$ ")
                        }
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) =>
                          formatCurrency(Number(value)).replace("$", "$ ")
                        }
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
                        dataKey="total_cost"
                        fill="var(--color-total_cost)"
                        radius={[10, 10, 0, 0]}
                        barSize={24}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="average_cost"
                        stroke="var(--color-average_cost)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#f97316" }}
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
          Unable to load monthly cost analytics. Please refresh to try again.
        </div>
      ) : (
        <div className="border-border/70 bg-muted/80 text-muted-foreground rounded-[1.75rem] border p-6 text-sm dark:border-slate-800 dark:bg-slate-950/80">
          No monthly cost analytics data available. Please check your filters or
          try again later.
        </div>
      )}
    </section>
  );
};

export default MedicalRecordAnalyticsMonthlyCost;
