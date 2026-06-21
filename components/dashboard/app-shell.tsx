import { Sidebar } from "@/components/dashboard/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <Sidebar />
      <main className="flex max-h-screen flex-1 flex-col overflow-y-scroll">
        {children}
      </main>
    </div>
  );
}
