import "../../styles/components/teamRow.css";

export default function TeamRow({ team }) {

  const onDeleteTeam = () => {
  if (confirm(`Weet je zeker dat je team van ${team.player1.firstName} & ${team.player2.firstName} wilt verwijderen?`)) {
    // Gebruik de queryparameter teamId in de URL
    fetch(`/api/team?teamId=${team.id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error("Verwijderen mislukt");
        alert("Team succesvol verwijderd");
      })
      .catch((err) => {
        console.error("Fout bij verwijderen team:", err);
        alert("Fout bij het verwijderen van het team.");
      });
  }
};


  return (
    <div className="team-grid team-row">
      <div className="team-row_player">
        <p>{team.player1.firstName} {team.player1.lastName}</p>
      </div>
      <div className="team-row_player">
        <p>{team.player2.firstName} {team.player2.lastName}</p>
      </div>

      <div className="team-row_poule">
        <p>{team.poule ? team.poule.name : "geen poule"}</p>
      </div>

      <div className="team-row_strength">
        <p>{team.strength.name}</p>
      </div>

      <div className="team-row_actions">
        <button>Wijzigen</button>
        <button onClick={onDeleteTeam}>Verwijderen</button>
      </div>
    </div>
  );
}
