import { NextResponse } from "next/server";
import { getAutomationUrl } from "@/lib/automations/automations-server";
import { parseApiError } from "@/lib/automations/automations-api";
import { getAutomationFromSnapshot } from "@/lib/automations/automations-snapshot";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const url = getAutomationUrl(id);

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      const snapshot = getAutomationFromSnapshot(id);
      if (snapshot) {
        console.warn(
          `[api/automations/${id}] Using automations.json snapshot fallback for GET`,
        );
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

    return NextResponse.json(await response.json());
  } catch (error) {
    const snapshot = getAutomationFromSnapshot(id);
    if (snapshot) {
      console.warn(
        `[api/automations/${id}] Using automations.json snapshot fallback for GET`,
      );
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
