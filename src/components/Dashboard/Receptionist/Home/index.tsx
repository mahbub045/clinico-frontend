import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";

const ReceptionistHomeContainer = () => {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/dashboard/receptionist" }]}
      />
      <div className="space-y-8 pb-10">
        <div className="border-border/70 bg-card/90 rounded-[2rem] border p-5 shadow-sm shadow-slate-950/10 backdrop-blur-xl sm:p-8 dark:bg-slate-950/95 dark:shadow-black/10">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-[0.24em] uppercase">
                <span className="bg-primary/10 text-primary inline-flex h-8 w-8 items-center justify-center rounded-full">
                  R
                </span>
                Receptionist Dashboard
              </p>
              <h1 className="text-foreground mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Clinical overview & patient workflow
              </h1>
              <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6 sm:text-base">
                See your daily schedule, patient priorities, and health insights
                all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceptionistHomeContainer;
