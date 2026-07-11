import {
  normalizeWorkflowCredentials,
  type WorkflowCredentials,
  type WorkflowNodeConfig,
} from "@/lib/automations/data";
import type { ConfigurableNodeId } from "@/lib/automations/workflow-templates";

export function hasOpenRouterCredentials(
  credentials: WorkflowCredentials,
): boolean {
  return Boolean(
    credentials.openRouterApiKey.trim() && credentials.model.trim(),
  );
}

export function hasGoogleSheetReady(credentials: WorkflowCredentials): boolean {
  return Boolean(
    credentials.googleConnected && credentials.spreadsheetId.trim(),
  );
}

export function hasWorkflowCredentials(credentials: WorkflowCredentials): boolean {
  return hasOpenRouterCredentials(credentials) && hasGoogleSheetReady(credentials);
}

export function getNormalizedCredentials(
  config: WorkflowNodeConfig,
): WorkflowCredentials {
  return normalizeWorkflowCredentials(config.credentials);
}

export function isWorkflowStepConfigured(
  nodeId: ConfigurableNodeId,
  config: WorkflowNodeConfig,
  requiresTopic: boolean,
): boolean {
  if (nodeId === "webhook") {
    return requiresTopic ? Boolean(config.topic.trim()) : true;
  }

  const credentials = getNormalizedCredentials(config);

  if (nodeId === "add-to-sheet") {
    return hasGoogleSheetReady(credentials);
  }

  // gemini-model / openrouter-model share OpenRouter settings
  return hasOpenRouterCredentials(credentials);
}
