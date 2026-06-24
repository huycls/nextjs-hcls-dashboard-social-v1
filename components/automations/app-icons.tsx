import type { AppId } from "@/lib/automations/data";

const appStyles: Record<AppId, { bg: string; label: string }> = {
  notion: { bg: "bg-background ring-1 ring-border", label: "N" },
  trello: { bg: "bg-blue-600", label: "T" },
  google: { bg: "bg-surface-elevated ring-1 ring-border", label: "G" },
  discord: { bg: "bg-indigo-500", label: "D" },
  slack: { bg: "bg-fuchsia-500", label: "S" },
  dropbox: { bg: "bg-sky-500", label: "Db" },
  stripe: { bg: "bg-violet-600", label: "St" },
  hubspot: { bg: "bg-orange-500", label: "H" },
  mailchimp: { bg: "bg-yellow-400", label: "M" },
  zendesk: { bg: "bg-emerald-600", label: "Z" },
};

type AppIconsProps = {
  apps: AppId[];
};

export function AppIcons({ apps }: AppIconsProps) {
  return (
    <div className="flex items-center -space-x-1.5">
      {apps.map((app) => {
        const style = appStyles[app];

        return (
          <span
            key={app}
            title={app}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-semibold text-white shadow-sm ring-2 ring-surface ${style.bg} ${
              app === "google" ? "text-secondary" : ""
            }`}
          >
            {style.label}
          </span>
        );
      })}
    </div>
  );
}
