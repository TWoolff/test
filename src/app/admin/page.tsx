'use client'
import { useCallback, useMemo } from 'react'
import { PlayerType, TeamType, MatchType } from '@/types/types'
import { useAdminData } from '@/hooks/useAdminData'
import { sortTeams } from '@/utils/sortingUtils'
import Accordion from '@/components/Accordion/Accordion'
import PlayerForm from '@/components/Forms/PlayerForm'
import TeamForm from '@/components/Forms/TeamForm'
import Player from '@/components/Player/Player'
import Team from '@/components/Team/Team'
import Match from '@/components/Match/Match'
import css from './admin.module.css'

const Admin: React.FC = () => {
	const { players, teams, matches } = useAdminData()
	const renderPlayer = useCallback((player: PlayerType, i: number) => <Player key={`player-${i}`} {...player} />, [])
	const sortedTeams = sortTeams(teams)

	const { activeMatches, completedMatches } = useMemo(() => {
		const active: MatchType[] = []
		const completed: MatchType[] = []

		matches.forEach(match => {
			if (match.completed) {
				completed.push(match)
			} else {
				active.push(match)
			}
		})

		return {
			activeMatches: active.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
			completedMatches: completed.sort((a, b) => new Date(b.completedDate || b.date).getTime() - new Date(a.completedDate || a.date).getTime()),
		}
	}, [matches])

	const activeMatchesContent = (
		<div className={css.activeMatches}>
			{activeMatches.map((match: MatchType, i: number) => (
				<Match key={`active-match-${i}`} match={match} isAdmin={true} />
			))}
		</div>
	)

	return (
		<section className='grid space'>
			<h1 className={css.adminTitle}>Admin</h1>
			<div className={css.accordionsColumn}>
				<Accordion title='Add player' content={<PlayerForm />} />
				<Accordion title='Add team' content={<TeamForm players={players} />} />
				<Accordion title='Add score' content={activeMatchesContent} />
			</div>
			<div className={css.infoColumn}>
				<h2>Players</h2>
				<div className={css.players}>{players.map(renderPlayer)}</div>
				<h2>Teams</h2>
				<div className={css.teams}>
					{sortedTeams.map((team: TeamType, i: number) => (
						<div key={`team-${i}`}>
							<Team name={team.name} points={team.points} players={team.players} id={team.id} />
						</div>
					))}
				</div>
				<h2>Completed Matches</h2>
				<div className={css.completedMatches}>
					{completedMatches.map((match: MatchType, i: number) => (
						<Match key={`completed-match-${i}`} match={match} isAdmin={false} />
					))}
				</div>
			</div>
		</section>
	)
}

export default Admin
