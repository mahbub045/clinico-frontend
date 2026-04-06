const PatientsSummary: React.FC = () => {
  return (
    <section className="border-border/70 bg-card/90 rounded-[2rem] border p-6 shadow-sm shadow-slate-950/10 sm:p-8 dark:bg-slate-950/95 dark:shadow-black/10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Patient Management
          </p>
          <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Patient records
          </h1>
          <p className="text-muted-foreground text-sm leading-6">
            Search your patient roster, review recent visits, and manage care
            plans all from one place.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border-border/70 rounded-3xl border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:bg-slate-950/95 dark:shadow-black/5">
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.22em] uppercase">
            Total patients
          </p>
          <p className="text-foreground mt-4 text-3xl font-semibold">1,248</p>
          <p className="text-muted-foreground mt-2 text-sm">
            All active and archived patient profiles.
          </p>
        </div>

        <div className="border-border/70 rounded-3xl border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:bg-slate-950/95 dark:shadow-black/5">
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.22em] uppercase">
            Active care
          </p>
          <p className="text-foreground mt-4 text-3xl font-semibold">312</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Patients with current treatment plans.
          </p>
        </div>

        <div className="border-border/70 rounded-3xl border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:bg-slate-950/95 dark:shadow-black/5">
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.22em] uppercase">
            Upcoming visits
          </p>
          <p className="text-foreground mt-4 text-3xl font-semibold">28</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Scheduled patient appointments this week.
          </p>
        </div>

        <div className="border-border/70 rounded-3xl border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:bg-slate-950/95 dark:shadow-black/5">
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.22em] uppercase">
            Referrals
          </p>
          <p className="text-foreground mt-4 text-3xl font-semibold">14</p>
          <p className="text-muted-foreground mt-2 text-sm">
            New referrals awaiting review.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PatientsSummary;
