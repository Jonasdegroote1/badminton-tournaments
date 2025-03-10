import "../styles/components/navItem.css";

export default function NavItem({ icon, label, active }) {
  return (
    <div className={`nav-item ${active ? "active" : ""}`}>
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </div>
  );
}
