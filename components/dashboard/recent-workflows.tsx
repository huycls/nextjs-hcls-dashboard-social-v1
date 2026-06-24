type ActivityItem = {
  title: string;
  subtitle: string;
  meta: string;
  status: "Approved" | "Processing" | "Pending Docs";
  date: string;
};

const activities: ActivityItem[] = [
  {
    title: "CRM Lead Assignment",
    subtitle: "Webhook trigger · Slack notify",
    meta: "3.4s",
    status: "Approved",
    date: "Today",
  },
  {
    title: "Order Confirmation",
    subtitle: "Email sequence · Shopify",
    meta: "1.2s",
    status: "Processing",
    date: "Yesterday",
  },
  {
    title: "Invoice Reconciliation",
    subtitle: "Sheet sync · Google Sheets",
    meta: "—",
    status: "Pending Docs",
    date: "Mar 18",
  },
  {
    title: "Content Post Generator",
    subtitle: "AI pipeline · Gemini",
    meta: "5.8s",
    status: "Approved",
    date: "Mar 17",
  },
];

const statusStyles: Record<ActivityItem["status"], string> = {
  Approved: "bg-[var(--node-green-bg)] text-[var(--node-green)]",
  Processing: "bg-[var(--node-blue-bg)] text-[var(--node-blue)]",
  "Pending Docs": "bg-[var(--node-orange-bg)] text-[var(--node-orange)]",
};

export function RecentWorkflows() {
  return (
    <section className="surface-card rounded-xl bg-surface p-6 lg:col-span-3">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-heading">
          Recent Activity
        </h2>
        <p className="mt-1 text-sm text-[#333333]d">
          Latest workflows processed by AI
        </p>
      </div>

      <ul className="divide-y divide-border">
        {activities.map((item) => (
          <li
            key={item.title}
            className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-heading">{item.title}</p>
              <p className="mt-0.5 text-sm text-[#333333]d">{item.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <span className="text-sm font-medium text-heading">
                {item.meta}
              </span>
              <span
                className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]}`}>
                {item.status}
              </span>
              <span className="text-xs text-[#333333]d">{item.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
