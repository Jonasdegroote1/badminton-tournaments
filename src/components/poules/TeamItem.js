export default function TeamItem({ data, onRemove }) {
  if (!data || data.length === 0) {
    return <div>No teams available</div>;
  }

  return (
    <ul className="team-list">
      {data.map((team) => (
        <li key={team.id} className="team-item">
          <span>
            {team.player1.firstName} {team.player1.lastName} & {team.player2.firstName} {team.player2.lastName}
          </span>
          <button onClick={() => onRemove(team.id)} className="delete-btn">X</button>
        </li>
      ))}
    </ul>
  );
}
