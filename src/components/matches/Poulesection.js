import React, { useState, useRef } from "react";
import useSWR from "swr";
import MatchCard from "./MatchCard";
import LoadingShuttlecock from "@components/LoadingShuttlecock";
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
      mutate(); // Herlaad de matches direct
    } catch (err) {
      console.error("Error generating matches:", err);
    }
  };

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  const sortedMatches = [...matches].sort((a, b) => {
    const aHasSets = a.sets && a.sets.length > 0;
    const bHasSets = b.sets && b.sets.length > 0;
    return aHasSets - bHasSets;
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
              <MatchCard key={match.id} match={match} index={index} onUpdate={mutate} />
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
