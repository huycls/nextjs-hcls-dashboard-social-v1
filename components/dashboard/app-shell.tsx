import { RightSidebar } from "@/components/dashboard/right-sidebar";
import { Sidebar } from "@/components/dashboard/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div data-scope="dashboard" className="flex min-h-screen bg-canvas">
      <Sidebar />
      <main className="flex max-h-screen min-w-0 flex-1 flex-col overflow-y-scroll">
        {children}
      </main>
      <RightSidebar />
    </div>
  );
}
