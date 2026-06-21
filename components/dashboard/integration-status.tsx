const integrations = [
  {
    name: "Slack",
    status: "Connected",
    tone: "success" as const,
    logo: "💬",
  },
  {
    name: "Notion",
    status: "Syncing",
    tone: "warning" as const,
    logo: "📝",
  },
  {
    name: "Google Drive",
    status: "Error",
    tone: "error" as const,
    logo: "📁",
  },
];

const toneStyles = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
};

export function IntegrationStatus() {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-base font-semibold text-gray-900">
        Integration Status
      </h2>

      <ul className="space-y-4">
        {integrations.map(({ name, status, tone, logo }) => (
          <li
            key={name}
            className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-lg">
                {logo}
              </div>
              <span className="text-sm font-medium text-gray-900">{name}</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${toneStyles[tone]}`}
              />
              <span className="text-sm text-gray-500">{status}</span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
