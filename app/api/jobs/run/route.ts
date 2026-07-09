import { NextResponse } from "next/server";
import {
  DEFAULT_WORKFLOW_ID,
  getJobsRunUrl,
  JOBS_API,
} from "@/lib/automations/jobs-server";
import { getAuthHeaders } from "@/lib/auth/auth-server";

type RunJobBody = {
  workflowId?: string;
  topic?: string;
};

type BackendErrorPayload = {
  message?: string;
  job?: unknown;
  workflow?: unknown;
};

function parseErrorMessage(text: string) {
  try {
    const parsed = JSON.parse(text) as { message?: string; error?: string };
    return parsed.message ?? parsed.error ?? text;
  } catch {
    return text;
  }
}

export async function POST(request: Request) {
  let body: RunJobBody;

  try {
    body = (await request.json()) as RunJobBody;
  } catch {
    return NextResponse.json(
      { ok: false, status: 400, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const topic = body.topic?.trim();
  const workflowId = body.workflowId?.trim() || DEFAULT_WORKFLOW_ID;

  if (!workflowId) {
    return NextResponse.json(
      { ok: false, status: 400, message: "workflowId is required." },
      { status: 400 },
    );
  }

  const payload: { workflowId: string; topic?: string } = { workflowId };
  if (topic) {
    payload.topic = topic;
  }

  const url = getJobsRunUrl();
  const authHeaders = await getAuthHeaders();

  try {
    const response = await fetch(url, {
      method: JOBS_API.method,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (response.ok) {
      const data = (await response.json().catch(() => null)) as {
        job?: unknown;
        workflow?: unknown;
      } | null;

      return NextResponse.json({
        ok: true,
        status: response.status,
        message: "Workflow job started successfully.",
        job: data?.job ?? data,
        workflow: data?.workflow ?? null,
      });
    }

    const errorText = await response.text().catch(() => "");
    let errorPayload: BackendErrorPayload | null = null;

    try {
      errorPayload = JSON.parse(errorText) as BackendErrorPayload;
    } catch {
      // not JSON
    }

    return NextResponse.json({
      ok: false,
      status: response.status,
      message: errorText
        ? `Backend returned ${response.status}: ${parseErrorMessage(errorText).slice(0, 200)}`
        : `Request failed with status ${response.status} at ${url}`,
      job: errorPayload?.job ?? null,
      workflow: errorPayload?.workflow ?? null,
    });
  } catch (error) {
    const hint =
      error instanceof Error ? error.message : "Unknown connection error";

    return NextResponse.json({
      ok: false,
      status: 0,
      message: `Could not reach backend at ${url}. ${hint}`,
    });
  }
}
