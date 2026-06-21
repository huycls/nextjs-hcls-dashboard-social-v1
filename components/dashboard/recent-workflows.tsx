import { Check } from "lucide-react";

type WorkflowRow = {
  name: string;
  triggeredAt: string;
  status: "Success" | "Queued";
  duration: string;
  selected?: boolean;
};

const workflows: WorkflowRow[] = [
  {
    name: "CRM Lead Assignment",
    triggeredAt: "January 15, 2025",
    status: "Success",
    duration: "5 days ago",
  },
  {
    name: "Order Confirmation",
    triggeredAt: "March 22, 2025",
    status: "Success",
    duration: "2 weeks ago",
    selected: true,
  },
  {
    name: "Order Rejection Notice",
    triggeredAt: "February 10, 2025",
    status: "Queued",
    duration: "1 month ago",
  },
];

const statusStyles = {
  Success: "bg-emerald-50 text-emerald-700",
  Queued: "bg-amber-50 text-amber-700",
};

export function RecentWorkflows() {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
      <h2 className="mb-5 text-base font-semibold text-gray-900">
        Recent Workflows
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Triggered at</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((row) => (
              <tr
                key={row.name}
                className={`border-b border-gray-50 last:border-0 ${
                  row.selected ? "bg-gray-50/80" : ""
                }`}
              >
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-2">
                    {row.selected && (
                      <Check className="h-4 w-4 shrink-0 text-gray-900" />
                    )}
                    <span className="max-w-[180px] truncate font-medium text-gray-900">
                      {row.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-gray-500">{row.triggeredAt}</td>
                <td className="py-4 pr-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-4 text-gray-500">{row.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
