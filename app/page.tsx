import { AppShell } from "@/components/dashboard/app-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { WorkflowActivityChart } from "@/components/dashboard/workflow-activity-chart";
import { ExecutionHealthChart } from "@/components/dashboard/execution-health-chart";
import { IntegrationStatus } from "@/components/dashboard/integration-status";
import { RecentWorkflows } from "@/components/dashboard/recent-workflows";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="overflow-y-auto">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 p-6 lg:p-8">
          <DashboardHeader />
          <KpiCards />

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <WorkflowActivityChart />
            <ExecutionHealthChart />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <IntegrationStatus />
            <RecentWorkflows />
          </section>
        </div>
      </div>
    </AppShell>
  );
}
