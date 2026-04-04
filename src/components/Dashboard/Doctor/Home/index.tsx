import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import DiseaseDistribution from "./components/DiseaseDistribution";
import PatientList from "./components/PatientList";
import QuickActions from "./components/QuickActions";
import SummaryCards from "./components/SummaryCards";
import WeeklySummary from "./components/WeeklySummary";

const DoctorHomeContainer = () => {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/dashboard/doctor" }]} />
      <div className="space-y-8 pb-10">
        <div className="rounded-[2rem] border border-border/70 bg-card/90 p-5 shadow-sm shadow-slate-950/10 backdrop-blur-xl dark:bg-slate-950/95 dark:shadow-black/10 sm:p-8">
          <div className="flex flex-col gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  D
                </span>
                Doctor Dashboard
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Clinical overview & patient workflow
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                See your daily schedule, patient priorities, and health insights
                all in one place.
              </p>
            </div>
          </div>
        </div>

        <SummaryCards />

        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
          <WeeklySummary />
          <DiseaseDistribution />
        </div>

        <div className="grid gap-6 md:grid-cols-[1.35fr_0.65fr]">
          <PatientList />
          <QuickActions />
        </div>
      </div>
    </>
  );
};

export default DoctorHomeContainer;
