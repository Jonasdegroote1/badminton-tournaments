import React from "react";
import "../../styles/components/MatchCard.css";

const MatchCard = ({ match, index }) => {
  return (
    <div className="match-card">
      <div className="match-info">
        <h3>Match {index + 1}</h3>
        <p>Status: {match.status}</p>
        <p>Court: {match.courtId}</p>
      </div>
      <div className="teams">
        {match.teams.length === 2 ? (
          <p>
            {match.teams[0].team.player1.firstName} {match.teams[0].team.player1.lastName} & 
            {match.teams[0].team.player2.firstName} {match.teams[0].team.player2.lastName} 
          </p>
          <p> 
            🆚
          </p>
          <p>
            {match.teams[1].team.player1.firstName} {match.teams[1].team.player1.lastName} & 
            {match.teams[1].team.player2.firstName} {match.teams[1].team.player2.lastName}
          </p>
        ) : (
          <p>Teams nog niet beschikbaar</p>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
