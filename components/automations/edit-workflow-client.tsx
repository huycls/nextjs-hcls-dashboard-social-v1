"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { WorkflowCanvasEditor } from "@/components/automations/workflow-canvas-editor";
import {
  DEFAULT_WORKFLOW_CONFIG,
  WORKFLOW_TYPE_LABELS,
} from "@/lib/automations/data";
import { useIsClient, useWorkflow } from "@/lib/automations/use-workflow-store";

type EditWorkflowClientProps = {
  workflowId: string;
};

export function EditWorkflowClient({ workflowId }: EditWorkflowClientProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const workflow = useWorkflow(workflowId);

  useEffect(() => {
    if (isClient && !workflow) {
      router.replace("/dashboard/automations");
    }
  }, [isClient, workflow, router]);

  if (!isClient || !workflow) {
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
