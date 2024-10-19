import React from 'react'
import { MatchType } from '@/types/types'
import { useAdminData } from '@/hooks/useAdminData'

interface MatchProps {
	match: MatchType
}

const Match: React.FC<MatchProps> = ({ match }) => {
	const { useMatchData } = useAdminData()
	const { homeScore, awayScore, completed, handleScoreChange, handleComplete } = useMatchData(match)

	return (
		<div>
			<h3>
				{match.homeTeam.name} vs {match.awayTeam.name}
			</h3>
			<input 
				type='number' 
				value={homeScore} 
				onChange={e => handleScoreChange('home', Number(e.target.value))} 
				disabled={completed} 
			/>
			<input 
				type='number' 
				value={awayScore} 
				onChange={e => handleScoreChange('away', Number(e.target.value))} 
				disabled={completed} 
			/>
			<button onClick={handleComplete} disabled={completed}>
				Complete Match
			</button>
			{completed ? <p>Match completed</p> : <p>Match in progress</p>}
		</div>
	)
}

export default Match
