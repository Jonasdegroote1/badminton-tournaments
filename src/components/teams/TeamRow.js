import "../../styles/components/teamRow.css";

export default function TeamRow({ team }) {

  return (
    <div className="team-grid team-row">
      <div className="team-row_player">
        <p>{team.player1.firstName} {team.player1.lastName}</p>
      </div>
      <div className="team-row_player">
        <p>{team.player2.firstName} {team.player2.lastName}</p>
      </div>

      <div className="team-row_poule">
        <p>{team.poule ? team.poule.name: "geen poule"}</p>
      </div>

      <div className="team-row_strength">
        <p>{team.strength.name}</p>
      </div>

      <div className="team-row_actions">
        <button>Wijzigen</button>
        <button>Verwijderen</button>
      </div>

    </div>
  );

}