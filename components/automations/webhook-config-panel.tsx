"use client";

import { useEffect, useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { triggerN8nWebhook } from "@/lib/automations/trigger-webhook";
import type { WorkflowNodeConfig } from "@/lib/automations/data";
import { incrementWorkflowTriggers } from "@/lib/automations/workflow-store";

type WebhookEndpoints = {
  testUrl: string;
  productionUrl: string;
  path: string;
  formField: string;
};

type WebhookConfigPanelProps = {
  workflowId: string;
  config: WorkflowNodeConfig;
  onChange: (config: WorkflowNodeConfig) => void;
  onClose: () => void;
};

export function WebhookConfigPanel({
  workflowId,
  config,
  onChange,
  onClose,
}: WebhookConfigPanelProps) {
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [endpoints, setEndpoints] = useState<WebhookEndpoints | null>(null);

  useEffect(() => {
    fetch("/api/n8n/webhook/config")
      .then((res) => res.json())
      .then((data: WebhookEndpoints) => setEndpoints(data))
      .catch(() => null);
  }, []);

  const activeUrl = config.useProductionWebhook
    ? (config.webhookProductionUrl ?? "").trim() || endpoints?.productionUrl
    : (config.webhookTestUrl ?? "").trim() || endpoints?.testUrl;

  const webhookUrl = activeUrl ?? "Loading...";

  async function handleTrigger() {
    if (!config.topic.trim()) return;

    setTriggering(true);
    setTriggerResult(null);

    const result = await triggerN8nWebhook(
      config.topic.trim(),
      config.useProductionWebhook,
      {
        testUrl: config.webhookTestUrl,
        productionUrl: config.webhookProductionUrl,
      },
    );

    if (result.ok) {
      incrementWorkflowTriggers(workflowId);
    }

    setTriggerResult({ ok: result.ok, message: result.message });
    setTriggering(false);
  }

  return (
    <aside className="flex w-[380px] shrink-0 flex-col border-l border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex gap-4 text-sm">
          <span className="font-medium text-gray-900">Parameters</span>
          <span className="text-gray-400">Settings</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <h2 className="text-lg font-semibold text-gray-900">Webhook</h2>
        <p className="mt-1 text-sm text-gray-500">
          Gửi POST với field <strong>Topic</strong> tới n8n webhook
        </p>

        <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs leading-5 text-sky-800">
          URL thực tế do server gọi (cấu hình trong <code>.env.local</code>).
          Cần có port <strong>:5678</strong> nếu không dùng reverse proxy.
        </div>

        <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs leading-5 text-red-800">
          <strong>Quan trọng:</strong> Copy chính xác Test URL từ n8n Webhook node
          (path UUID phải khớp 100%). URL mặc định trong app có thể khác workflow
          của bạn.
        </div>

        <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
          <strong>Test URL — thứ tự bắt buộc:</strong>
          <ol className="mt-1 list-decimal space-y-0.5 pl-4">
            <li>Trên n8n: mở Webhook node → bấm <em>Listen for test event</em></li>
            <li>Copy Test URL từ n8n → dán vào ô bên dưới</li>
            <li>Bấm <em>Kích hoạt workflow</em> ở đây (chỉ 1 lần / lần Listen)</li>
          </ol>
          <br />
          <strong>Production URL:</strong> workflow phải đang <em>Active</em> trên n8n.
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              Webhook URLs
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onChange({ ...config, useProductionWebhook: false })
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  !config.useProductionWebhook
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Test URL
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({ ...config, useProductionWebhook: true })
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  config.useProductionWebhook
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Production URL
              </button>
            </div>
            <div className="mt-2 flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <span className="shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-700">
                POST
              </span>
              <p className="break-all text-xs text-gray-600">{webhookUrl}</p>
            </div>
          </div>

          <div>
            <label
              htmlFor="webhook-custom-url"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              {config.useProductionWebhook
                ? "Production URL (từ n8n)"
                : "Test URL (copy từ n8n)"}
            </label>
            <input
              id="webhook-custom-url"
              type="url"
              value={
                config.useProductionWebhook
                  ? (config.webhookProductionUrl ?? "")
                  : (config.webhookTestUrl ?? "")
              }
              onChange={(event) =>
                onChange(
                  config.useProductionWebhook
                    ? {
                        ...config,
                        webhookProductionUrl: event.target.value,
                      }
                    : { ...config, webhookTestUrl: event.target.value },
                )
              }
              placeholder={
                config.useProductionWebhook
                  ? endpoints?.productionUrl
                  : endpoints?.testUrl
              }
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Dán URL từ tab Test URL / Production URL trên n8n Webhook node.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              HTTP Method
            </label>
            <div className="h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm leading-10 text-gray-700">
              POST
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Path
            </label>
            <div className="h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm leading-10 text-gray-700">
              {endpoints?.path ?? "—"}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-3 text-sm font-medium text-gray-900">
              Form Elements
            </p>
            <label
              htmlFor="webhook-topic"
              className="mb-2 block text-xs font-medium text-gray-500"
            >
              Field Name
            </label>
            <div className="mb-3 h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm leading-9 text-gray-700">
              {endpoints?.formField ?? "Topic"}
            </div>
            <label
              htmlFor="webhook-topic"
              className="mb-2 block text-xs font-medium text-gray-500"
            >
              Element Type
            </label>
            <div className="mb-3 h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm leading-9 text-gray-700">
              Text Input
            </div>
            <label
              htmlFor="webhook-topic"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Topic value
            </label>
            <input
              id="webhook-topic"
              type="text"
              value={config.topic}
              onChange={(event) =>
                onChange({ ...config, topic: event.target.value })
              }
              placeholder="What topics should be generated?"
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          {triggerResult && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                triggerResult.ok
                  ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                  : "border-red-100 bg-red-50 text-red-600"
              }`}
            >
              {triggerResult.message}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Close
        </button>
        <button
          type="button"
          disabled={!config.topic.trim() || triggering}
          onClick={handleTrigger}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {triggering ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          Kích hoạt workflow
        </button>
      </div>
    </aside>
  );
}
