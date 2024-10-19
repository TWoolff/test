'use client'
import React, { useMemo, useCallback } from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import Team from '@/components/Team/Team';
import { TeamType } from '@/types/types';

const Leaderboard: React.FC = () => {
  const { teams } = useAdminData();

  const sortTeams = useCallback((a: TeamType, b: TeamType) => b.points - a.points, []);

  const sortedTeams = useMemo(() => {
    return [...teams].sort(sortTeams);
  }, [teams, sortTeams]);

  console.log('sortedTeams', sortedTeams)

  return (
    <section className='grid space frontpage'>
      <h1>Leaderboard</h1>
      <div>
        {sortedTeams.map((team, index) => (
          <div key={team.id}>
            <h2>{index + 1}. {team.name} - {team.points} points</h2>
            <Team {...team} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Leaderboard;
