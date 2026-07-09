import { NextResponse } from "next/server";
import { getJobsListUrl } from "@/lib/automations/jobs-server";
import { parseApiError } from "@/lib/automations/automations-api";
import { getAuthHeaders } from "@/lib/auth/auth-server";

export async function GET() {
  const url = getJobsListUrl();
  const authHeaders = await getAuthHeaders();

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: authHeaders,
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

    return NextResponse.json(await response.json());
  } catch (error) {
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
