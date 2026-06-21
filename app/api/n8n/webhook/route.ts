import { NextResponse } from "next/server";
import {
  N8N_WEBHOOK,
  resolveTriggerWebhookUrl,
} from "@/lib/automations/n8n-server";

type TriggerBody = {
  topic?: string;
  useProduction?: boolean;
  webhookTestUrl?: string;
  webhookProductionUrl?: string;
};

function parseN8nError(text: string) {
  try {
    const parsed = JSON.parse(text) as {
      message?: string;
      hint?: string;
    };

    if (parsed.message || parsed.hint) {
      return parsed;
    }
  } catch {
    // not JSON
  }

  return null;
}

async function postToN8n(url: string, topic: string) {
  const payloads: Array<{ headers: Record<string, string>; body: string }> = [
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [N8N_WEBHOOK.formField]: topic }),
    },
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: { [N8N_WEBHOOK.formField]: topic } }),
    },
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ [N8N_WEBHOOK.formField]: topic }).toString(),
    },
  ];

  let lastResponse: Response | null = null;
  let lastErrorText = "";

  for (const attempt of payloads) {
    const response = await fetch(url, {
      method: N8N_WEBHOOK.method,
      headers: attempt.headers,
      body: attempt.body,
      cache: "no-store",
    });

    lastResponse = response;

    if (response.ok) {
      return { response, format: attempt.headers["Content-Type"] };
    }

    lastErrorText = await response.text().catch(() => "");

    if (response.status === 404) {
      break;
    }
  }

  return { response: lastResponse, errorText: lastErrorText };
}

export async function POST(request: Request) {
  let body: TriggerBody;

  try {
    body = (await request.json()) as TriggerBody;
  } catch {
    return NextResponse.json(
      { ok: false, status: 400, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const topic = body.topic?.trim();

  if (!topic) {
    return NextResponse.json(
      { ok: false, status: 400, message: "Topic is required." },
      { status: 400 },
    );
  }

  const url = resolveTriggerWebhookUrl(Boolean(body.useProduction), {
    testUrl: body.webhookTestUrl,
    productionUrl: body.webhookProductionUrl,
  });

  try {
    const result = await postToN8n(url, topic);

    if (!result.response) {
      return NextResponse.json({
        ok: false,
        status: 0,
        message: `Could not reach n8n at ${url}`,
      });
    }

    if (result.response.ok) {
      return NextResponse.json({
        ok: true,
        status: result.response.status,
        message: "Workflow triggered successfully.",
      });
    }

    const errorText = result.errorText ?? "";
    const status = result.response.status;
    const n8nError = parseN8nError(errorText);

    if (status === 404) {
      const hint = n8nError?.hint
        ? ` ${n8nError.hint}`
        : body.useProduction
          ? " Hãy Active workflow trên n8n."
          : ' Trên n8n: bấm "Listen for test event" trên Webhook node TRƯỚC khi kích hoạt. Test URL chỉ nhận 1 request — sau đó phải Listen lại.';

      return NextResponse.json({
        ok: false,
        status,
        message: `Webhook 404 tại ${url}.${hint}${
          n8nError?.message ? ` (${n8nError.message})` : ""
        } Kiểm tra URL copy từ n8n có khớp path không.`,
      });
    }

    return NextResponse.json({
      ok: false,
      status,
      message: errorText
        ? `n8n returned ${status}: ${errorText.slice(0, 160)}`
        : `Request failed with status ${status} at ${url}`,
    });
  } catch (error) {
    const hint =
      error instanceof Error ? error.message : "Unknown connection error";

    return NextResponse.json({
      ok: false,
      status: 0,
      message: `Could not reach n8n at ${url}. ${hint}`,
    });
  }
}
