import React from "react";
import "../../styles/components/MatchCard.css";

const MatchCard = ({ match, index }) => {
  const formatTeam = (team) => {
    const { player1, player2 } = team;
    return `${player1.firstName} ${player1.lastName} & ${player2.firstName} ${player2.lastName}`;
  };

  return (
    <div className="match-card">
      <div className="match-info">
        <h3>Match {index + 1}</h3>
        <p>Status: {match.status}</p>
        <p>Court: {match.courtId}</p>
      </div>
      <div className="teams">
        {match.teams.length === 2 ? (
          <>
            <p>{formatTeam(match.teams[0].team)}</p>
            <p>🆚</p>
            <p>{formatTeam(match.teams[1].team)}</p>
          </>
        ) : (
          <p>Teams nog niet beschikbaar</p>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
