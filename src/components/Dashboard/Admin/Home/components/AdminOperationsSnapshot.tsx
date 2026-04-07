import { Sparkles } from "lucide-react";

const AdminOperationsSnapshot = () => {
  return (
    <section className="border-border/70 bg-card/90 rounded-[2rem] border p-6 shadow-sm shadow-slate-950/10 dark:bg-slate-950/95 dark:shadow-black/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Operations snapshot
          </p>
          <h2 className="text-foreground mt-3 text-2xl font-semibold tracking-tight">
            Clinic activity and approvals
          </h2>
        </div>
        <div className="border-border/70 text-foreground inline-flex items-center gap-2 rounded-full border bg-white/90 px-4 py-2 text-sm shadow-sm shadow-slate-950/5 dark:bg-slate-950/90 dark:text-slate-200">
          <Sparkles className="text-primary h-4 w-4" />
          Stable performance
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="border-border/70 rounded-3xl border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:bg-slate-950/95 dark:shadow-black/5">
          <p className="text-primary text-sm font-semibold tracking-[0.22em] uppercase">
            System uptime
          </p>
          <p className="text-foreground mt-4 text-3xl font-semibold">99.98%</p>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            High availability with no critical incidents reported today.
          </p>
        </div>
        <div className="border-border/70 rounded-3xl border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:bg-slate-950/95 dark:shadow-black/5">
          <p className="text-primary text-sm font-semibold tracking-[0.22em] uppercase">
            Active sessions
          </p>
          <p className="text-foreground mt-4 text-3xl font-semibold">128</p>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Staff members currently signed into the clinic portal.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminOperationsSnapshot;
