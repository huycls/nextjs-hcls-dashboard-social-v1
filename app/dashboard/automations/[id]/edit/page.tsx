import { EditWorkflowClient } from "@/components/templates/automations/edit-workflow-client";

type EditAutomationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditAutomationPage({
  params,
}: EditAutomationPageProps) {
  const { id } = await params;

  return <EditWorkflowClient workflowId={id} />;
}
