"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WorkflowCanvasEditor } from "@/components/automations/workflow-canvas-editor";
import {
  DEFAULT_WORKFLOW_CONFIG,
  WORKFLOW_TYPE_LABELS,
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

  if (!isClient || loading || !workflow) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[#333333]d">
        Loading workflow...
      </div>
    );
  }

  return (
    <WorkflowCanvasEditor
      workflowId={workflow.id}
      workflowName={workflow.name}
      workflowType={workflow.type}
      workflowTypeLabel={WORKFLOW_TYPE_LABELS[workflow.type]}
      initialConfig={{ ...DEFAULT_WORKFLOW_CONFIG, ...workflow.config }}
    />
  );
}
