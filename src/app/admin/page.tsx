'use client'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { PlayerType, TeamType, MatchType, MatchWithScore } from '@/types/types'
import { useAdminData } from '@/hooks/useAdminData'
import Accordion from '@/components/Accordion/Accordion'
import PlayerForm from '@/components/Forms/PlayerForm'
import TeamForm from '@/components/Forms/TeamForm'
import Player from '@/components/Player/Player'
import Team from '@/components/Team/Team'
import Match from '@/components/Match/Match'
import css from './admin.module.css'

const Admin: React.FC = () => {
	const { players, teams, matches } = useAdminData()
	const [completedMatches, setCompletedMatches] = useState<MatchWithScore[]>([]);
	const [teamPoints, setTeamPoints] = useState<Record<string, number>>({});

	const playerLookup = useMemo(
		() =>
			players.reduce((acc, player) => {
				acc[player.id] = player.name
				return acc
			}, {} as Record<string, string>),
		[players]
	)

	const teamsWithPlayerNames = useMemo(
		() =>
			teams.map(team => ({
				...team,
				players: team.players.map(playerId => playerLookup[playerId] || 'Unknown Player'),
			})),
		[teams, playerLookup]
	)

	const matchesWithTeams = useMemo(() => {
		return matches.map(match => ({
			...match,
			homeTeam: teamsWithPlayerNames.find(team => team.id === match.homeTeam) || { id: match.homeTeam as string, name: match.homeTeam as string, players: [] },
			awayTeam: teamsWithPlayerNames.find(team => team.id === match.awayTeam) || { id: match.awayTeam as string, name: match.awayTeam as string, players: [] },
		})) as (MatchType & { homeTeam: TeamType; awayTeam: TeamType })[];
	}, [matches, teamsWithPlayerNames])

	const handleMatchComplete = useCallback((completedMatch: MatchWithScore) => {
		setCompletedMatches(prev => [...prev, completedMatch]);
		setTeamPoints(prev => {
			const newPoints = {
				...prev,
				[completedMatch.winner.id]: (prev[completedMatch.winner.id] || 0) + 3
			};
			console.log('Updated team points:', newPoints);
			return newPoints;
		});
	}, []);

	const sortedTeamsWithPoints = useMemo(() => {
		console.log('Recalculating sortedTeamsWithPoints');
		return teamsWithPlayerNames.map(team => ({
			...team,
			points: teamPoints[team.id] || 0
		})).sort((a, b) => b.points - a.points);
	}, [teamsWithPlayerNames, teamPoints]);

	useEffect(() => {
		console.log('Current team points:', teamPoints);
	}, [teamPoints]);

	useEffect(() => {
		console.log('Sorted teams with points:', sortedTeamsWithPoints);
	}, [sortedTeamsWithPoints]);

	const renderPlayer = useCallback((player: PlayerType) => <Player key={player.id} {...player} />, [])

	const renderTeam = useCallback((team: TeamType & { points: number }) => (
		<div key={team.id}>
			<Team {...team} />
			<p>Points: {team.points}</p>
		</div>
	), []);

	return (
		<section className='grid space'>
			<h1>Admin</h1>
			<Accordion title='Add player' content={<PlayerForm />} />
			<Accordion title='Add team' content={<TeamForm players={players} />} />
			<div className={css.adminInfo}>
				<div>
					<h2>Players</h2>
					{players.map(renderPlayer)}
				</div>
				<div>
					<h2>Teams (Sorted by Points)</h2>
					{sortedTeamsWithPoints.map(team => (
						<div key={team.id}>
							<Team {...team} />
							<p>Points: {team.points}</p>
						</div>
					))}
				</div>
				<div>
					<h2>Matches</h2>
					{matchesWithTeams.map(match => {
						const completedMatch = completedMatches.find(cm => cm.id === match.id);
						if (completedMatch) {
							return (
								<div key={match.id || `completed-${completedMatch.homeTeam.id}-${completedMatch.awayTeam.id}`}>
									{completedMatch.homeTeam.name} vs {completedMatch.awayTeam.name} (Completed)
									<br />
									Score: {completedMatch.score?.home} - {completedMatch.score?.away}
									<br />
									Winner: {completedMatch.winner.name} (3 points)
								</div>
							);
						}
						return <Match key={match.id || `match-${match.homeTeam.id}-${match.awayTeam.id}`} match={match} onMatchComplete={handleMatchComplete} />;
					})}
				</div>
			</div>
		</section>
	)
}

export default Admin
