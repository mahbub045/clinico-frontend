import { Button } from "@/components/ui/button";

const activity = [
  {
    actor: "Nusrat Jahan",
    action: "Approved doctor profile",
    time: "2m ago",
  },
  {
    actor: "Fahim Chowdhury",
    action: "Created new patient record",
    time: "15m ago",
  },
  {
    actor: "Sara Khan",
    action: "Updated clinic schedule",
    time: "40m ago",
  },
  {
    actor: "Admin team",
    action: "Generated monthly summary",
    time: "1h ago",
  },
];

const AdminActivityFeed = () => {
  return (
    <section className="border-border/70 bg-card/90 rounded-[2rem] border p-6 shadow-sm shadow-slate-950/10 dark:bg-slate-950/95 dark:shadow-black/10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Recent activity
          </p>
          <h2 className="text-foreground mt-3 text-2xl font-semibold tracking-tight">
            Admin task feed
          </h2>
        </div>
        <Button variant="secondary" size="sm">
          View all
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {activity.map((item) => (
          <div
            key={`${item.actor}-${item.time}`}
            className="border-border/70 rounded-3xl border bg-white/90 p-4 shadow-sm shadow-slate-950/5 dark:bg-slate-950/95 dark:shadow-black/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-foreground text-sm font-semibold">
                  {item.actor}
                </p>
                <p className="text-muted-foreground mt-1 text-sm leading-6">
                  {item.action}
                </p>
              </div>
              <span className="border-border/70 bg-muted text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminActivityFeed;
