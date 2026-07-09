import type { WorkflowNodeConfig } from "@/lib/automations/data";
import type { ConfigurableNodeId } from "@/lib/automations/workflow-templates";

export function isWorkflowStepConfigured(
  nodeId: ConfigurableNodeId,
  config: WorkflowNodeConfig,
  requiresTopic: boolean,
): boolean {
  if (nodeId === "webhook") {
    return requiresTopic ? Boolean(config.topic.trim()) : true;
  }

  const creds = config.credentials[nodeId];
  return Boolean(creds?.apiKey && creds?.secretKey);
}
