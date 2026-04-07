import { Button } from "@/components/ui/button";
import { ClipboardList, ShieldCheck, UserPlus, Zap } from "lucide-react";

const actions = [
  { label: "Add new doctor", icon: UserPlus },
  { label: "Review approvals", icon: ShieldCheck },
  { label: "Create report", icon: ClipboardList },
  { label: "System audit", icon: Zap },
];

const AdminQuickActions = () => {
  return (
    <section className="border-border/70 bg-card/90 rounded-[2rem] border p-6 shadow-sm shadow-slate-950/10 dark:bg-slate-950/95 dark:shadow-black/10">
      <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
        Quick actions
      </p>
      <div className="mt-6 space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant="outline"
              className="border-border/70 text-foreground w-full justify-start gap-3 bg-white/95 text-left shadow-sm shadow-slate-950/5 dark:bg-slate-950/90 dark:text-slate-200"
            >
              <span className="bg-primary/10 text-primary inline-flex h-9 w-9 items-center justify-center rounded-2xl">
                <Icon className="h-4 w-4" />
              </span>
              <span>{action.label}</span>
            </Button>
          );
        })}
      </div>
    </section>
  );
};

export default AdminQuickActions;
