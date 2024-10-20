'use client'
import { TeamType, PlayerType } from "@/types/types";
import css from './Team.module.css';

const Team: React.FC<TeamType> = ({ name, points, players }) => {
  const playerNames = players?.map((player: PlayerType) => player.name).join(', ') || '';

  console.log(players);

  return (
    <div className={css.team}>
      <h3>{name}</h3>
      <p>Points: {points}</p>
      <p>Players: {playerNames}</p>
    </div>
  );
}

export default Team;
