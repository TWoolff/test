import React from 'react'
import { MatchType, TeamReference } from '@/types/types'
import { useAdminData } from '@/hooks/useAdminData'

interface MatchProps {
	match: MatchType
	isAdmin?: boolean
	onScoreUpdate?: (match: MatchType, team: 'home' | 'away', newScore: number) => void
}

const Match: React.FC<MatchProps> = ({ match, isAdmin = false, onScoreUpdate }) => {
	const { useMatchData } = useAdminData()
	const { homeScore, awayScore, completed, handleScoreChange, handleComplete } = useMatchData(match)

	const handleScoreUpdate = (team: 'home' | 'away', newScore: number) => {
		handleScoreChange(team, newScore)
		if (onScoreUpdate) {
			onScoreUpdate(match, team, newScore)
		}
	}

	const getTeamName = (team: TeamReference): string => {
		return team.name || 'Unknown Team'
	}

	const homeTeamName = getTeamName(match.homeTeam)
	const awayTeamName = getTeamName(match.awayTeam)

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString('en-GB', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		})
	}

	return (
		<div className='match'>
			<h2>
				{homeTeamName} vs {awayTeamName}
			</h2>
			<p>
				{completed ? 'Completed' : 'Created'} on: {formatDate(completed ? match.completedDate || match.date : match.date)}
			</p>
			{isAdmin && !completed ? (
				<>
					<input type='number' value={homeScore} onChange={e => handleScoreUpdate('home', Number(e.target.value))} />
					<input type='number' value={awayScore} onChange={e => handleScoreUpdate('away', Number(e.target.value))} />
					<button onClick={handleComplete}>Complete Match</button>
				</>
			) : (
				<p>
					{completed ? 'Final' : 'Current'} Score: {homeScore} - {awayScore}
				</p>
			)}
		</div>
	)
}

export default Match
