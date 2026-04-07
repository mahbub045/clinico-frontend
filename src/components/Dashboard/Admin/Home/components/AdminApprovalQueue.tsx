const queues = [
  {
    title: "Doctor onboarding",
    subtitle: "Review new provider applications before approval.",
    value: "5 pending",
  },
  {
    title: "Staff credentials",
    subtitle: "Upcoming credential renewals need your attention.",
    value: "3 expiring",
  },
];

const AdminApprovalQueue = () => {
  return (
    <section className="border-border/70 bg-card/90 rounded-[2rem] border p-6 shadow-sm shadow-slate-950/10 dark:bg-slate-950/95 dark:shadow-black/10">
      <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
        Approval queue
      </p>
      <div className="mt-6 grid gap-4">
        {queues.map((item) => (
          <div
            key={item.title}
            className="border-border/70 rounded-3xl border bg-white/90 p-5 shadow-sm shadow-slate-950/5 dark:bg-slate-950/95 dark:shadow-black/5"
          >
            <p className="text-foreground text-sm font-semibold">
              {item.title}
            </p>
            <p className="text-foreground mt-4 text-3xl font-semibold">
              {item.value}
            </p>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminApprovalQueue;
