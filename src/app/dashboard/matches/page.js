"use client";

import PouleSection from "@/components/matches/Poulesection";
import React, { useEffect, useState } from "react";
import useTournamentStore from "@/lib/tournamentStore";

export default function Matches() {
  const { selectedTournament } = useTournamentStore();
  const [poules, setPoules] = useState([]);

  useEffect(() => {
    if (!selectedTournament) return;

    const fetchPoules = async () => {
      try {
        const response = await fetch(`/api/poules?tournamentId=${selectedTournament.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch poules");
        }
        const data = await response.json();
        setPoules(data);
      } catch (error) {
        console.error("Error fetching poules:", error);
      }
    };

    fetchPoules();
  }, [selectedTournament]); // ✅ Nu refresht hij correct bij wijziging!

  if (!selectedTournament) {
    return <p>Gelieve een toernooi te selecteren.</p>;
  }

  return (
    <div>
      <h1>Tournament Matches</h1>
      {poules.length > 0 ? (
        poules.map((poule) => (
          <PouleSection key={poule.id} poule={poule} />
        ))
      ) : (
        <p>Geen poules gevonden of aan het laden...</p>
      )}
    </div>
  );
}
