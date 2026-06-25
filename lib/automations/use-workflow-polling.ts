"use client";

import { useEffect } from "react";
import {
  fetchWorkflowById,
  fetchWorkflows,
} from "@/lib/automations/workflow-store";
import {
  notifyWorkflowStoreUpdated,
  useWorkflow,
  useWorkflows,
} from "@/lib/automations/use-workflow-store";

const POLL_INTERVAL_MS = 3000;

/** Poll danh sách khi có workflow đang Running */
export function useRunningWorkflowsPolling() {
  const workflows = useWorkflows();
  const hasRunning = workflows.some((workflow) => workflow.status === "Running");

  useEffect(() => {
    if (!hasRunning) return;

    let cancelled = false;

    async function poll() {
      try {
        await fetchWorkflows();
        if (!cancelled) notifyWorkflowStoreUpdated();
      } catch {
        // Bỏ qua lỗi tạm thời — giữ trạng thái cache
      }
    }

    const intervalId = window.setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [hasRunning]);
}

/** Poll 1 workflow trên trang edit khi đang Running */
export function useWorkflowPolling(workflowId: string) {
  const workflow = useWorkflow(workflowId);
  const isRunning = workflow?.status === "Running";

  useEffect(() => {
    if (!isRunning) return;

    let cancelled = false;

    async function poll() {
      try {
        await fetchWorkflowById(workflowId);
        if (!cancelled) notifyWorkflowStoreUpdated();
      } catch {
        // ignore
      }
    }

    const intervalId = window.setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [workflowId, isRunning]);
}
