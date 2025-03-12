"use client";
import { useState, useEffect } from "react";
import AddPouleModal from "@/components/poules/AddPouleModal";
import PouleManagement from "@/components/poules/PouleManagement";
import useTournamentStore from "@/lib/tournamentStore";

export default function Poules() {
  const { selectedTournament } = useTournamentStore(); // Gebruik Zustand store voor geselecteerd toernooi
  const [showModal, setShowModal] = useState(false);

  const handleAddPoule = () => {
    // Haal de nieuwe gegevens op of werk de pagina bij na het toevoegen van een poule
  };

  return (
    <div>
      <h1>Poules</h1>
      {selectedTournament ? (
        <>
          <button onClick={() => setShowModal(true)}>+ Voeg Poule toe</button>

          <AddPouleModal
            showModal={showModal}
            setShowModal={setShowModal}
            tournamentId={selectedTournament.id} // Gebruik het juiste toernooi-ID
            onAddPoule={handleAddPoule}
          />
          <PouleManagement />
        </>
      ) : (
        <p>Gelieve een toernooi te selecteren.</p>
      )}
    </div>
  );
}
