import React, { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import MatchCard from "./MatchCard";
import LoadingShuttlecock from "@/components/LoadingShuttlecock";
import "../../styles/components/PouleSection.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const PouleSection = ({ poule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  // Zorg ervoor dat we de matches opnieuw ophalen als het openen van de poule verandert
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

  // Deze functie genereert de matches, maar we willen ook de matches daarna herladen
  const handleGenerateMatches = async () => {
    try {
      const res = await fetch("/api/generate-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pouleId: poule.id }),
      });
      if (!res.ok) throw new Error("Failed to generate matches");
      mutate(); // Herlaad de matches na het genereren
    } catch (err) {
      console.error("Error generating matches:", err);
    }
  };

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Sorteer de matches op basis van het feit of setResults leeg is of niet
  const sortedMatches = [...matches].sort((a, b) => {
    const aHasSets = a.setResults && a.setResults.length > 0;
    const bHasSets = b.setResults && b.setResults.length > 0;

    // Als beide matches dezelfde status hebben (beide met of zonder sets)
    if (aHasSets === bHasSets) {
      return 0; // Geen verandering in volgorde
    }

    // Ongepeelde matches (zonder sets) komen bovenaan
    return aHasSets ? 1 : -1;
  });

  // Herlaad de matches telkens als de status verandert (bijvoorbeeld als een score is toegevoegd)
  useEffect(() => {
    if (matches.length > 0) {
      mutate(); // Forceer een herlaad van de data nadat een score is toegevoegd
    }
  }, [matches, mutate]);

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
                onUpdate={mutate} // Zorg ervoor dat de data wordt ververst na het bijwerken van een match
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
