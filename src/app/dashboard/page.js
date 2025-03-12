"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CourtUpdateForm from "@/components/CourtUpdateForm";
import useTournamentStore from "../../lib/tournamentStore"; // Zustand-store

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { selectedTournament } = useTournamentStore(); // Haal geselecteerd toernooi op

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Bezig met laden...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welkom, <strong>{session.user.firstName}</strong>! 🎉</p>
      <p>Rol: <span>{session.user.roleId === 1 ? "Admin" : "Gebruiker"}</span></p>

      {selectedTournament ? (
        <div>
          <h2>Geselecteerd Toernooi</h2>
          <p><strong>Name:</strong> {selectedTournament.name}</p>
          <p><strong>Date:</strong> {selectedTournament.date}</p>
          <p><strong>Session:</strong> {selectedTournament.session || "No session data"}</p>
        </div>
      ) : (
        <p>Geen toernooi geselecteerd...</p>
      )}

      <div>
        <button onClick={() => router.push("/app/dashboard")}>Ga naar Dashboard</button>

        <div>
          <CourtUpdateForm />
        </div>
      </div>
    </div>
  );
}
