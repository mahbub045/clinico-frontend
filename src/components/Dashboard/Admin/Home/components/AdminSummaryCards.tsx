import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, ShieldCheck, UserPlus, Users } from "lucide-react";

const metrics = [
  {
    title: "Total doctors",
    value: "74",
    icon: Users,
    description: "Active physicians currently registered.",
  },
  {
    title: "Receptionists",
    value: "12",
    icon: UserPlus,
    description: "Staff managing patient check-ins.",
  },
  {
    title: "Patients",
    value: "1,342",
    icon: ClipboardList,
    description: "Active patient records in the system.",
  },
  {
    title: "Pending approvals",
    value: "8",
    icon: ShieldCheck,
    description: "New staff or doctor requests awaiting review.",
  },
];

const AdminSummaryCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.title}
            className="border-border/70 rounded-[2rem] border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:bg-slate-950/95 dark:shadow-black/5"
          >
            <CardHeader className="gap-4 px-0 pb-4">
              <div className="bg-primary/10 text-primary inline-flex h-12 w-12 items-center justify-center rounded-3xl">
                <Icon className="size-5" />
              </div>
              <div>
                <CardTitle className="text-foreground text-base font-semibold">
                  {metric.title}
                </CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">
                  {metric.description}
                </p>
              </div>
            </CardHeader>
            <CardContent className="px-0 pt-2">
              <p className="text-foreground text-4xl font-semibold tracking-tight">
                {metric.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminSummaryCards;
