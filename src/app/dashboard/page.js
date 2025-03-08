"use client"; // Zorg ervoor dat deze pagina een Client Component is

import { useSession, signOut } from "next-auth/react";
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
    return <p className="text-center mt-10">Bezig met laden...</p>;
  }

  if (!session) {
    return null; // Zorgt ervoor dat de pagina niet kort flikkert
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Welkom, <strong>{session.user.firstName}</strong>! 🎉</p>
      <p className="mt-1">Rol: <span className="font-semibold">{session.user.roleId === 1 ? "Admin" : "Gebruiker"}</span></p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Acties</h2>
        
        <button 
          onClick={() => router.push("/app/dashboard")} 
          className="bg-blue-500 text-white px-4 py-2 rounded mt-3 block"
        >
          Ga naar Dashboard
        </button>

        <div className="mt-4">
          <CourtUpdateForm />
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: "/auth/login" })} 
          className="bg-red-500 text-white px-4 py-2 rounded mt-4 block"
        >
          Uitloggen
        </button>
      </div>
    </div>
  );
}
