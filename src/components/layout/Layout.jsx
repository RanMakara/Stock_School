import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useApp } from "../../context/AppContext";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { appData } = useApp();

  const systemName = appData?.system?.systemName || "School Stock";
  const schoolName = appData?.system?.schoolName || "School";
  const logo = appData?.system?.logo || appData?.settings?.logo;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        logo={logo}
        systemName={systemName}
        schoolName={schoolName}
      />

      <div className="lg:pl-72">
        <Navbar onMenuClick={() => setSidebarOpen((value) => !value)} logo={logo} systemName={systemName} />
        <main className="min-h-[calc(100vh-9rem)] p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
