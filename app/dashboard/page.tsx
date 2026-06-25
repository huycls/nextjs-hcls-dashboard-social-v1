import { AiProcessingMetrics } from "@/components/templates/dashboard/ai-processing-metrics";
import { DashboardHeader } from "@/components/templates/dashboard/dashboard-header";
import { IntegrationStatus } from "@/components/templates/dashboard/integration-status";
import { KpiCards } from "@/components/templates/dashboard/kpi-cards";
import { RecentWorkflows } from "@/components/templates/dashboard/recent-workflows";

export default function DashboardPage() {
  return (
    <div className="min-h-screen overflow-y-auto bg-background">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 px-5 py-6 sm:px-8 lg:gap-8 lg:px-10 lg:py-8">
        <DashboardHeader />
        <KpiCards />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <RecentWorkflows />
          </div>
          <IntegrationStatus />
        </section>

        <AiProcessingMetrics />
      </div>
    </div>
  );
}
