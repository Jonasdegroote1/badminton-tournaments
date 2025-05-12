import React, { useEffect, useState, useRef } from "react";
import MatchCard from "./MatchCard";
import "../../styles/components/PouleSection.css";

const PouleSection = ({ poule }) => {
  const [matches, setMatches] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  // Functie om de matches op te halen
  const fetchMatches = async () => {
    try {
      const res = await fetch(`/api/matches?pouleId=${poule.id}`);
      if (!res.ok) throw new Error("Failed to fetch matches");
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  // Functie om matches te genereren
  const handleGenerateMatches = async () => {
    try {
      const res = await fetch("/api/generate-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pouleId: poule.id }),
      });
      if (!res.ok) throw new Error("Failed to generate matches");
      await fetchMatches();
    } catch (err) {
      console.error("Error generating matches:", err);
    }
  };

  // Functie om de poule in- of uit te klappen
  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  // UseEffect om matches op te halen wanneer de poule wordt geopend
  useEffect(() => {
    if (isOpen) {
      fetchMatches();
    }
  }, [poule.id, isOpen]);

  // Sorteer de matches op basis van sets (gespeeld of niet gespeeld)
  const sortedMatches = [...matches].sort((a, b) => {
    const aHasSets = a.setResults && a.setResults.length > 0;
    const bHasSets = b.setResults && b.setResults.length > 0;

    // Gespeelde matches eerst, dan te spelen matches
    return aHasSets === bHasSets ? 0 : aHasSets ? -1 : 1;
  });

  return (
    <div className="poule-section">
      <div className="poule-header" onClick={toggleOpen}>
        <h2 className="poule-title">{poule.name}</h2>
        <h3>{poule.strength.name}</h3>
        <button className={`toggle-button ${isOpen ? "open" : ""}`}>
          {isOpen ? "▲ Close" : "▼ Open"}
        </button>
      </div>

      <div
        ref={contentRef}
        className={`poule-content ${isOpen ? "open" : "closed"}`}
      >
        {/* Knop voor het genereren van matches */}
        <button className="create-match-button" onClick={handleGenerateMatches}>
          + create matches
        </button>

        <div className="matches-list">
          {matches.length > 0 ? (
            sortedMatches.map((match, index) => (
              <MatchCard key={match.id} match={match} index={index} />
            ))
          ) : (
            <p>No matches generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PouleSection;
