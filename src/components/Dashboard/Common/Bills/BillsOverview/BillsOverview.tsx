"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetBillOverviewQuery } from "@/redux/reducers/Common/Bills/BillsApi";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  LoaderPinwheel,
  Percent,
  Receipt,
  RefreshCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { getCurrencySign } from "../../../../../../utils/formatters";

const BillsOverview: React.FC = () => {
  const {
    data: overview,
    isLoading,
    isError,
  } = useGetBillOverviewQuery(undefined);

  const stats = [
    {
      label: "Total bills",
      value: overview?.total_bills ?? "—",
      description: "Total number of bills created.",
      icon: "ClipboardList" as const,
    },
    {
      label: "Total amount",
      value:
        overview?.total_amount != null
          ? `${getCurrencySign()}${overview.total_amount.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}`
          : "—",
      description: "Sum of billed amounts before discounts and tax.",
      icon: "DollarSign" as const,
    },
    {
      label: "Total discount",
      value:
        overview?.total_discount != null
          ? `${getCurrencySign()}${overview.total_discount.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}`
          : "—",
      description: "Total discount applied to all bills.",
      icon: "Percent" as const,
    },
    {
      label: "Total tax",
      value:
        overview?.total_tax != null
          ? `${getCurrencySign()}${overview.total_tax.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}`
          : "—",
      description: "Total tax collected across bills.",
      icon: "Receipt" as const,
    },
    {
      label: "Final amount",
      value:
        overview?.total_final_amount != null
          ? `${getCurrencySign()}${overview.total_final_amount.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}`
          : "—",
      description: "Amount after discount and tax.",
      icon: "CreditCard" as const,
    },
    {
      label: "Average bill",
      value:
        overview?.average_bill_amount != null
          ? `${getCurrencySign()}${overview.average_bill_amount.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}`
          : "—",
      description: "Average billed amount per bill.",
      icon: "Sparkles" as const,
    },
  ];

  const statusStats = [
    {
      label: "Paid bills",
      value: overview?.paid_bills ?? "—",
      description: "Bills fully paid.",
      icon: "CheckCircle" as const,
    },
    {
      label: "Pending bills",
      value: overview?.pending_bills ?? "—",
      description: "Bills awaiting payment.",
      icon: "Clock" as const,
    },
    {
      label: "Partial bills",
      value: overview?.partial_bills ?? "—",
      description: "Bills partially paid.",
      icon: "RefreshCcw" as const,
    },
    {
      label: "Cancelled bills",
      value: overview?.cancelled_bills ?? "—",
      description: "Bills that were cancelled.",
      icon: "XCircle" as const,
    },
  ];

  const iconMap = {
    ClipboardList,
    DollarSign,
    Percent,
    Receipt,
    CreditCard,
    Sparkles,
    CheckCircle,
    Clock,
    RefreshCcw,
    XCircle,
  } as const;

  return (
    <section className="border-border/70 bg-card/90 rounded-[2rem] border p-6 shadow-sm shadow-slate-950/10 sm:p-8 dark:bg-slate-950/95 dark:shadow-black/10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Billing analytics
          </p>
          <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Bills overview
          </h1>
          <p className="text-muted-foreground text-sm leading-6">
            See a quick snapshot of billing volume, revenue, tax, discounts, and
            payment status.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="border-border rounded-3xl border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:bg-slate-950/95 dark:shadow-black/5"
            >
              <CardContent className="flex items-center justify-center py-12">
                <LoaderPinwheel className="text-primary h-6 w-6 animate-spin" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="border-destructive/10 bg-destructive/5 text-destructive mt-8 rounded-[2rem] border p-6 text-sm">
          Unable to load bill overview.
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => {
              const Icon = iconMap[stat.icon as keyof typeof iconMap];
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

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statusStats.map((stat) => {
              const Icon = iconMap[stat.icon as keyof typeof iconMap];
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
        </>
      )}
    </section>
  );
};

export default BillsOverview;
