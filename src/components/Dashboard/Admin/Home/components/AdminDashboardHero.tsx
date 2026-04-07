const AdminDashboardHero = () => {
  return (
    <div className="border-border/70 bg-card/90 rounded-[2rem] border p-5 shadow-sm shadow-slate-950/10 backdrop-blur-xl sm:p-8 dark:bg-slate-950/95 dark:shadow-black/10">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-[0.24em] uppercase">
            <span className="bg-primary/10 text-primary inline-flex h-8 w-8 items-center justify-center rounded-full">
              A
            </span>
            Admin Dashboard
          </p>
          <h1 className="text-foreground mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Clinic administration overview
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6 sm:text-base">
            Monitor staffing, approvals, and system health from a single
            administrator workspace.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHero;
