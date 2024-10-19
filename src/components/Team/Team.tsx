'use client'
import { TeamType } from "@/types/types";
import css from './Team.module.css';

interface TeamProps extends Omit<TeamType, 'players'> {
  players: string[];
}

const Team: React.FC<TeamProps> = ({ name, players, points }) => {
  return (
    <div className={css.team}>
      <h3>{name}</h3>
      <p>Points: {points}</p>
      <p>Players: {players.join(', ')}</p>
    </div>
  );
}

export default Team;
