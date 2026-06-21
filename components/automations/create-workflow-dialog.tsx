"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Lightbulb, X } from "lucide-react";
import {
  WORKFLOW_TYPES,
  WORKFLOW_TYPE_LABELS,
  type WorkflowType,
} from "@/lib/automations/data";
import { createWorkflow } from "@/lib/automations/workflow-store";
import { notifyWorkflowStoreUpdated } from "@/lib/automations/use-workflow-store";

const typeIcons: Record<WorkflowType, typeof Lightbulb> = {
  "generate-idea-posts": Lightbulb,
  "generate-content-post": FileText,
};

type CreateWorkflowDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function CreateWorkflowDialog({
  open,
  onClose,
  onCreated,
}: CreateWorkflowDialogProps) {
  const router = useRouter();
  const [step, setStep] = useState<"type" | "name">("type");
  const [selectedType, setSelectedType] = useState<WorkflowType | null>(null);
  const [workflowName, setWorkflowName] = useState("");

  if (!open) return null;

  function handleClose() {
    setStep("type");
    setSelectedType(null);
    setWorkflowName("");
    onClose();
  }

  function handleSelectType(type: WorkflowType) {
    setSelectedType(type);
    setStep("name");
  }

  function handleBack() {
    setStep("type");
    setSelectedType(null);
    setWorkflowName("");
  }

  function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedType || !workflowName.trim()) return;

    const workflow = createWorkflow(workflowName, selectedType);
    notifyWorkflowStoreUpdated();
    onCreated();
    handleClose();
    router.push(`/automations/${workflow.id}/edit`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-workflow-title"
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2
            id="create-workflow-title"
            className="text-lg font-semibold text-gray-900"
          >
            {step === "type" ? "Choose workflow type" : "Name your workflow"}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={handleClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === "type" ? (
          <div className="space-y-3 p-6">
            {WORKFLOW_TYPES.map((workflowType) => {
              const Icon = typeIcons[workflowType.id];

              return (
                <button
                  key={workflowType.id}
                  type="button"
                  onClick={() => handleSelectType(workflowType.id)}
                  className="flex w-full items-start gap-4 rounded-xl border border-gray-200 p-4 text-left transition hover:border-gray-300 hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {workflowType.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {workflowType.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleCreate} className="p-6">
            {selectedType && (
              <p className="mb-4 text-sm text-gray-500">
                Type:{" "}
                <span className="font-medium text-gray-900">
                  {WORKFLOW_TYPE_LABELS[selectedType]}
                </span>
              </p>
            )}

            <label
              htmlFor="workflow-name"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Workflow name
            </label>
            <input
              id="workflow-name"
              type="text"
              value={workflowName}
              onChange={(event) => setWorkflowName(event.target.value)}
              placeholder="Enter workflow name"
              autoFocus
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!workflowName.trim()}
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create workflow
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
