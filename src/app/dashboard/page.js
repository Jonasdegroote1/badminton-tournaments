"use client"; // Zorg ervoor dat deze pagina een Client Component is

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CourtUpdateForm from "@/components/CourtUpdateForm";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Wacht op session-status en redirect als er geen sessie is
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login"); // Gebruik replace() om de geschiedenis niet op te slaan
    }
  }, [status, router]);

  // Voorkom renderen als de sessie nog laadt
  if (status === "loading") {
    return <p>Bezig met laden...</p>;
  }

  if (!session) {
    return null; // Zorgt ervoor dat de pagina niet kort flikkert
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welkom, <strong>{session.user.firstName}</strong>! 🎉</p>
      <p>Rol: <span>{session.user.roleId === 1 ? "Admin" : "Gebruiker"}</span></p>

      <div>
        <button 
          onClick={() => router.push("/app/dashboard")}
        >
          Ga naar Dashboard
        </button>

        <div>
          <CourtUpdateForm />
        </div>
      </div>
    </div>
  );
}
