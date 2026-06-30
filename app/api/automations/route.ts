import { NextResponse } from "next/server";
import {
  AUTOMATIONS_API,
  getAutomationsListUrl,
} from "@/lib/automations/automations-server";
import { parseApiError } from "@/lib/automations/automations-api";
import { readAutomationsSnapshot } from "@/lib/automations/automations-snapshot";
import type { WorkflowType } from "@/lib/automations/data";
import { WORKFLOW_TYPES } from "@/lib/automations/data";

const VALID_TYPES = new Set(WORKFLOW_TYPES.map((item) => item.id));

type CreateWorkflowBody = {
  name?: string;
  type?: WorkflowType;
};

function getSnapshotFallback() {
  const workflows = readAutomationsSnapshot();

  if (workflows.length === 0) {
    return null;
  }

  console.warn(
    "[api/automations] Using automations.json snapshot fallback for GET",
  );
  return workflows;
}

export async function GET() {
  const url = getAutomationsListUrl();

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      const snapshot = getSnapshotFallback();
      if (snapshot) {
        return NextResponse.json(snapshot);
      }

      return NextResponse.json(
        {
          ok: false,
          message: await parseApiError(response),
        },
        { status: response.status },
      );
    }

    const workflows = await response.json();
    return NextResponse.json(workflows);
  } catch (error) {
    const snapshot = getSnapshotFallback();
    if (snapshot) {
      return NextResponse.json(snapshot);
    }

    const hint =
      error instanceof Error ? error.message : "Unknown connection error";

    return NextResponse.json(
      {
        ok: false,
        message: `Could not reach backend at ${url}. ${hint}`,
      },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  let body: CreateWorkflowBody;

  try {
    body = (await request.json()) as CreateWorkflowBody;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = body.name?.trim();
  const type = body.type;

  if (!name) {
    return NextResponse.json(
      { ok: false, message: "name is required." },
      { status: 400 },
    );
  }

  if (!type || !VALID_TYPES.has(type)) {
    return NextResponse.json(
      { ok: false, message: "type must be a valid workflow type." },
      { status: 400 },
    );
  }

  const url = getAutomationsListUrl();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: await parseApiError(response),
        },
        { status: response.status },
      );
    }

    const workflow = await response.json();
    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    const hint =
      error instanceof Error ? error.message : "Unknown connection error";

    return NextResponse.json(
      {
        ok: false,
        message: `Could not reach backend at ${AUTOMATIONS_API.baseUrl}. ${hint}`,
      },
      { status: 502 },
    );
  }
}
