export type TriggerJobResult = {
  ok: boolean;
  status: number;
  message: string;
};

/**
 * Gọi qua Next.js API route (same-origin) → backend /api/jobs/run.
 */
export async function triggerWorkflowJob(
  workflowId: string,
  topic: string,
): Promise<TriggerJobResult> {
  try {
    const response = await fetch("/api/jobs/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflowId, topic }),
    });

    return (await response.json()) as TriggerJobResult;
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Failed to send job request. Please try again.",
    };
  }
}
