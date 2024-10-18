'use client'
import { TeamType } from "@/types/types";
import css from './Team.module.css';

interface TeamProps extends Omit<TeamType, 'players'> {
  players: string[];
}

const Team: React.FC<TeamProps> = ({ name, players, id }) => {
  return (
    <div className={css.team}>
      <h3>{name}</h3>
      <ul>
        {players.map((playerName, index) => <li key={`${id}-${index}`}>{playerName}</li>)}
      </ul>
    </div>
  );
}

export default Team;
