'use client'
import React, { useCallback, useMemo } from 'react'
import { PlayerType, TeamType, MatchType } from '@/types/types'
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
	const renderPlayer = useCallback((player: PlayerType, i: number) => <Player key={`player-${i}`} {...player} />, [])

	const sortedTeams = useMemo(() => {
		return [...teams].sort((a, b) => b.points - a.points);
	}, [teams]);

	const sortedMatches = useMemo(() => {
		return [...matches].sort((a, b) => {
			if (a.completed === b.completed) {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			}
			return a.completed ? 1 : -1;
		});
	}, [matches]);

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
							<Team {...team} />
						</div>
					))}
				</div>
				<div>
					<h2>Matches</h2>
					{sortedMatches.map((match: MatchType, i: number) => (
						<Match key={`match-${i}`} match={match} />
					))}
				</div>
			</div>
		</section>
	)
}

export default Admin
