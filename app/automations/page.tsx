import { AppShell } from "@/components/dashboard/app-shell";
import { WorkflowList } from "@/components/automations/workflow-list";

export default function AutomationsPage() {
  return (
    <AppShell>
      <WorkflowList />
    </AppShell>
  );
}
