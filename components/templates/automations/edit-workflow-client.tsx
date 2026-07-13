"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/components/atoms/Loading";
import { WorkflowCanvasEditor } from "@/components/templates/automations/workflow-canvas-editor";
import {
  DEFAULT_WORKFLOW_CONFIG,
  WORKFLOW_TYPE_LABELS,
  normalizeWorkflowCredentials,
} from "@/lib/automations/data";
import { fetchWorkflowById } from "@/lib/automations/workflow-store";
import {
  notifyWorkflowStoreUpdated,
  useIsClient,
  useWorkflow,
} from "@/lib/automations/use-workflow-store";

type EditWorkflowClientProps = {
  workflowId: string;
};

export function EditWorkflowClient({ workflowId }: EditWorkflowClientProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const workflow = useWorkflow(workflowId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;

    fetchWorkflowById(workflowId)
      .then(() => {
        if (!cancelled) notifyWorkflowStoreUpdated();
      })
      .catch(() => {
        if (!cancelled) router.replace("/dashboard/automations");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isClient, workflowId, router]);

  useEffect(() => {
    if (isClient && !loading && !workflow) {
      router.replace("/dashboard/automations");
    }
  }, [isClient, loading, workflow, router]);

  if (!isClient) {
    return (
      <Loading
        label="Loading workflow"
        message="Loading workflow..."
      />
    );
  }

  if (loading || !workflow) {
    return (
      <Loading
        label="Loading workflow"
        message="Loading workflow..."
      />
    );
  }

  return (
    <WorkflowCanvasEditor
      key={workflow.id}
      workflowId={workflow.id}
      workflowName={workflow.name}
      workflowType={workflow.type}
      workflowTypeLabel={WORKFLOW_TYPE_LABELS[workflow.type]}
      initialConfig={{
        ...DEFAULT_WORKFLOW_CONFIG,
        ...workflow.config,
        credentials: normalizeWorkflowCredentials(
          workflow.config?.credentials,
        ),
      }}
    />
  );
}
