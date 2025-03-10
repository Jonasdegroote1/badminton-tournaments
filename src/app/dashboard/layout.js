import Sidebar from "@/components/Sidebar";
import "../../styles/reset.css";
import "../../styles/layouts/dashboard.css";
import "../../styles/components/btn.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <Sidebar />
      </aside>
      <main className="dashboard-content">
        {children} {/* Hier wordt de inhoud van page.js geplaatst */}
      </main>
    </div>
  );
}
