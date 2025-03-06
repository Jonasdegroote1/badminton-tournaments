// app/dashboard/page.js

"use client"; // Zorg ervoor dat deze pagina een Client Component is

import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    // Als de gebruiker niet is ingelogd, kan je ze doorverwijzen naar de loginpagina
    window.location.href = "/auth/login";
    return null;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welkom, {session.user.firstName}! Je bent ingelogd.</p>
      <p>Rol: {session.user.roleId === 1 ? "Admin" : "Gebruiker"}</p>
      
      <button onClick={() => signOut({ callbackUrl: "/auth/login" })}>Uitloggen</button>
    </div>
  );
}
