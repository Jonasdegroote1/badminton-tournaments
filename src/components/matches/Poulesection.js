import React, { useState, useRef } from "react";
import useSWR from "swr";
import MatchCard from "./MatchCard";
import LoadingShuttlecock from "@/components/LoadingShuttlecock";
import "../../styles/components/PouleSection.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const PouleSection = ({ poule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const {
    data: matches = [],
    error,
    isLoading,
    mutate,
  } = useSWR(
    isOpen ? `/api/matches?pouleId=${poule.id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  const handleGenerateMatches = async () => {
    try {
      const res = await fetch("/api/generate-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pouleId: poule.id }),
      });
      if (!res.ok) throw new Error("Failed to generate matches");
      mutate(); // Herlaad de matches na genereren
    } catch (err) {
      console.error("Error generating matches:", err);
    }
  };

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Sorteer de matches: Eerst ongespeeld (zonder setResults), daarna gespeeld (met setResults)
  const sortedMatches = [...matches].sort((a, b) => {
    const aHasSets = a.setResults && a.setResults.length > 0;
    const bHasSets = b.setResults && b.setResults.length > 0;

    if (aHasSets === bHasSets) {
      return 0; // Geen verandering in volgorde als beide dezelfde setstatus hebben
    }

    // Ongepeelde matches bovenaan
    return aHasSets ? 1 : -1; 
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
        <button className="create-match-button" onClick={handleGenerateMatches}>
          + create matches
        </button>

        <div className="matches-list">
          {isLoading ? (
            <LoadingShuttlecock />
          ) : sortedMatches.length > 0 ? (
            sortedMatches.map((match, index) => (
              <MatchCard
                key={match.id}
                match={match}
                index={index}
                onUpdate={mutate} // Update de matches na wijzigingen
              />
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
