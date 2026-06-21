import { NextResponse } from "next/server";
import { N8N_WEBHOOK } from "@/lib/automations/n8n-server";

export async function GET() {
  return NextResponse.json({
    testUrl: N8N_WEBHOOK.testUrl,
    productionUrl: N8N_WEBHOOK.productionUrl,
    path: N8N_WEBHOOK.path,
    formField: N8N_WEBHOOK.formField,
    method: N8N_WEBHOOK.method,
  });
}
