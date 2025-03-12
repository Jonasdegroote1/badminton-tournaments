"use client";
import { useState, useEffect } from "react";
import AddPouleModal from "@/components/poules/AddPouleModal";
import PouleManagement from "@/components/poules/PouleManagement";
import useTournamentStore from "@/lib/tournamentStore";

export default function Poules() {
  const { selectedTournament } = useTournamentStore();
  const [showModal, setShowModal] = useState(false);
  const [poules, setPoules] = useState([]);

  const handleAddPoule = (newPoule) => {
    // Voeg de nieuwe poule toe aan de lijst
    setPoules((prevPoules) => [...prevPoules, newPoule]);
  };

  // Zorg ervoor dat selectedTournament bestaat voordat je ermee werkt
  useEffect(() => {
    if (!selectedTournament) return;

    // Haal de poules op bij het laden van de component
    fetch(`/api/poules?tournamentId=${selectedTournament.id}`)
      .then((res) => res.json())
      .then((data) => setPoules(data))
      .catch((error) => console.error("Fout bij ophalen poules:", error));
  }, [selectedTournament]); // Deze useEffect wordt uitgevoerd wanneer selectedTournament verandert

  if (!selectedTournament) {
    return <p>Gelieve een toernooi te selecteren.</p>;
  }

  return (
    <div>
      <h1>Poules</h1>
      <button onClick={() => setShowModal(true)}>+ Voeg Poule toe</button>

      <AddPouleModal
        showModal={showModal}
        setShowModal={setShowModal}
        tournamentId={selectedTournament.id}
        onAddPoule={handleAddPoule} // Call-back om de nieuwe poule toe te voegen
      />
      <PouleManagement poules={poules} setPoules={setPoules} />
    </div>
  );
}
