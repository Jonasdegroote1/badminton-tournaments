// app/dashboard/page.js

"use client"; // Zorg ervoor dat deze pagina een Client Component is

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      // Als de gebruiker niet is ingelogd, kan je ze doorverwijzen naar de loginpagina
      router.push("/auth/login");
    }
  }, [session, router]);

  if (!session) {
    // Teruggeven van null zodat de pagina niet renderen terwijl we wachten op de sessie
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
