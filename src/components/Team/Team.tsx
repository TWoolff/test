'use client'
import React from 'react';
import { TeamType } from "@/types/types";
import css from './Team.module.css';

const Team: React.FC<TeamType> = ({ name, points, players }) => {
  const playerNames = players?.map(player => player.name).join(', ') || '';

  return (
    <div className={css.team}>
      <h3>{name}</h3>
      <p>Points: {points}</p>
      <p>Players: {playerNames}</p>
    </div>
  );
}

export default Team;
