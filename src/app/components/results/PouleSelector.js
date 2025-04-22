"use client";

import { useEffect, useState } from "react";
import "@/styles/components/PouleSelector.css";


export default function PouleSelector({ tournamentId, onSelectPoule }) {
  const [poules, setPoules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPoules() {
      if (!tournamentId) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/poules?tournamentId=${tournamentId}`);
        if (!res.ok) throw new Error("Fout bij ophalen van poules");
        const data = await res.json();
        setPoules(data);
      } catch (err) {
        console.error("Fout bij laden van poules:", err);
        setPoules([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPoules();
  }, [tournamentId]);

  if (loading) return <p>Bezig met laden...</p>;
  if (poules.length === 0) return <p>Geen poules gevonden.</p>;

  return (
    <div className="poule-selector">
      <h2>Selecteer een Poule</h2>
      <div className="poule-button-container">
        {poules.map((poule) => (
          <button
            key={poule.id}
            className="poule-button"
            onClick={() => onSelectPoule(poule)}
          >
            {poule.name} ({poule.strength?.name || "-"})
          </button>
        ))}
      </div>
    </div>
  );
}
