import { NextResponse } from "next/server";
import {
  DEFAULT_WORKFLOW_ID,
  getJobsRunUrl,
  JOBS_API,
} from "@/lib/automations/jobs-server";

export async function GET() {
  return NextResponse.json({
    runUrl: getJobsRunUrl(),
    method: JOBS_API.method,
    defaultWorkflowId: DEFAULT_WORKFLOW_ID,
  });
}
