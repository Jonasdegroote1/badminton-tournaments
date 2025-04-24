"use client";

import "@/styles/components/PouleSelector.css";

export default function PouleSelector({ poules, onSelectPouleId }) {
  return (
    <div className="poule-selector">
      <h2>Selecteer een Poule</h2>
      <div className="poule-button-container">
        {poules.map((poule) => (
          <button
            key={poule.id}
            className="poule-button"
            onClick={() => onSelectPouleId(poule.id)}
          >
            {poule.name} ({poule.strength?.name || "-"})
          </button>
        ))}
      </div>
    </div>
  );
}
