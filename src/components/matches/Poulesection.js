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
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 5000, // Poll elke 5 sec. voor updates
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
      await fetchMatches();
    } catch (err) {
      console.error("Error generating matches:", err);
    }
  };


  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  const sortedMatches = [...matches].sort((a, b) => {
    const aPlayed = a.setResults?.length > 0;
    const bPlayed = b.setResults?.length > 0;
    if (aPlayed === bPlayed) return 0;
    return aPlayed ? 1 : -1; // Gespeelde wedstrijden onderaan
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
        <button className="create-match-button" onClick={handleGenerateMatches}>
          + create matches
        </button>
      <div
        ref={contentRef}
        className={`poule-content ${isOpen ? "open" : "closed"}`}
      >
        <div className="matches-list">
          {isLoading ? (
            <LoadingShuttlecock />
          ) : sortedMatches.length > 0 ? (
            sortedMatches.map((match, index) => (
              <MatchCard
                key={match.id}
                match={match}
                index={index}
                onUpdate={mutate}
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
