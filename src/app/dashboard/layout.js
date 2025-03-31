// app/dashboard/layout.js

import Sidebar from "@/components/sidebar/Sidebar";
import "../../styles/reset.css";
import "../../styles/layouts/dashboard.css";
import "../../styles/components/btn.css";

export const metadata = {
  title: "Dashboard",
  description: "Admin Dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <Sidebar />
      </aside>
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}
