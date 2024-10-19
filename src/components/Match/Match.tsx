import React, { useState } from 'react'
import { TeamType, MatchType } from '@/types/types'
import { updateMatch } from '@/services/getdata';

interface MatchProps {
  match: MatchType;
}

const Match: React.FC<MatchProps> = ({ match }) => {
  const [homeScore, setHomeScore] = useState<number | undefined>(match.homeScore);
  const [awayScore, setAwayScore] = useState<number | undefined>(match.awayScore);

  const handleComplete = async () => {
    if (homeScore === undefined || awayScore === undefined) {
      console.error("Both scores must be set before completing the match");
      return;
    }

    const winner = homeScore > awayScore ? match.homeTeam.id : match.awayTeam.id;
    try {
      await updateMatch(match.id, {
        homeScore,
        awayScore,
        completed: true,
        winner
      });
      console.log("Match completed successfully");
    } catch (error) {
      console.error("Error completing match: ", error);
    }
  };

  return (
    <div>
      <h3>{match.homeTeam.name} vs {match.awayTeam.name}</h3>
      <input 
        type="number" 
        value={homeScore ?? ''} 
        onChange={(e) => setHomeScore(e.target.value === '' ? undefined : Number(e.target.value))} 
        placeholder="Home Score" 
      />
      <input 
        type="number" 
        value={awayScore ?? ''} 
        onChange={(e) => setAwayScore(e.target.value === '' ? undefined : Number(e.target.value))} 
        placeholder="Away Score" 
      />
      <button onClick={handleComplete} disabled={homeScore === undefined || awayScore === undefined}>
        Complete Match
      </button>
    </div>
  );
};

export default Match;
