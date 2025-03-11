import Link from "next/link";
import "../../styles/components/navItem.css";

export default function NavItem({ icon, label, href = "/" , active }) {
  return (
    <Link href={href} className={`nav-item ${active ? "active" : ""}`}>
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </Link>
  );
}
