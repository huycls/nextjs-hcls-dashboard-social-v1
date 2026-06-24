import { Sidebar } from "@/components/dashboard/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <main className="flex max-h-screen flex-1 flex-col overflow-y-scroll">
        {children}
      </main>
    </div>
  );
}
