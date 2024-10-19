'use client'
import { useCallback } from 'react'
import { PlayerType, TeamType, MatchType } from '@/types/types'
import { useAdminData } from '@/hooks/useAdminData'
import { sortMatches, sortTeams } from '@/utils/sortingUtils'
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
					<h2>Teams</h2>
					{sortedTeams.map((team: TeamType, i: number) => (
						<div key={`team-${i}`}>
							<Team name={team.name} points={team.points} players={team.players} id={team.id} />
						</div>
					))}
				</div>
				<div>
					<h2>Matches</h2>
					{matches.map((match: MatchType, i: number) => (
						<Match key={`match-${i}`} match={match} isAdmin={true} />
					))}
				</div>
			</div>
		</section>
	)
}

export default Admin
