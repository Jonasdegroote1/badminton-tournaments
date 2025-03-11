"use client";
import "../../styles/components/sidebar.css";
import NavItem from "./NavItem";
import OtherTournaments from "./OtherTournaments";
import TournamentSelector from "./TournamentSelector";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Tournament Admin</h2>

      <TournamentSelector />

      <nav className="sidebar-nav">
        <NavItem icon="🏠" label="Dashboard" active href="/dashboard" />
        <NavItem icon="⚽" label="Poules" href="/dashboard/poules" />
        <NavItem icon="👥" label="Teams" href="/dashboard/teams" />
        <NavItem icon="🏆" label="Matches" href="/dashboard/matches" />
        <NavItem icon="📅" label="Schedule" href="/dashboard/schedule" />
      </nav>

      <OtherTournaments 
        tournaments={[
          { name: "Afternoon Championship", time: "14:00 - 18:00" },
        ]}
      />
      <button 
          onClick={() => signOut({ callbackUrl: "/auth/login" })} 
          className="btn btn-log-out"
        >uitloggen</button>
    </aside>
  );
}
