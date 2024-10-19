import React, { useState } from 'react'
import { MatchType } from '@/types/types'
import { updateMatch } from '@/services/getdata';

interface MatchProps {
  match: MatchType;
}

const Match: React.FC<MatchProps> = ({ match }) => {
  const [homeScore, setHomeScore] = useState<number | undefined>(match.homeScore);
  const [awayScore, setAwayScore] = useState<number | undefined>(match.awayScore);
  const [completed, setCompleted] = useState<boolean>(match.completed);

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
      setCompleted(true);
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
        disabled={completed}
      />
      <input 
        type="number" 
        value={awayScore ?? ''} 
        onChange={(e) => setAwayScore(e.target.value === '' ? undefined : Number(e.target.value))} 
        placeholder="Away Score" 
        disabled={completed}
      />
      <button onClick={handleComplete} disabled={homeScore === undefined || awayScore === undefined || completed}>
        Complete Match
      </button>
      {completed && <p>Match completed</p>}
    </div>
  );
};

export default Match;
