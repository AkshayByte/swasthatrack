import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary">
      <div className="flex relative">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
          <Navbar onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <main className="flex-1 p-6 overflow-auto bg-muted/20 relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] pointer-events-none" />
            <div className="relative z-0">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;