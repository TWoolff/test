'use client'
import { useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAdminData } from '@/hooks/useAdminData'
import { sortTeams } from '@/utils/sorting'
import { getRandomColor } from '@/utils/randomColor'
import { IconLeader, IconProfile } from '@/components/Icons/Icons'
import { TeamColors } from '@/types/types'
import css from './Leaderboard.module.css'

const Leaderboard: React.FC = () => {
	const { teams } = useAdminData()
	const sortedTeams = useMemo(() => sortTeams(teams), [teams])
	const maxScore = useMemo(() => Math.max(...sortedTeams.map(team => team.points)), [sortedTeams])
	const teamColors = useMemo<TeamColors>(() => sortedTeams.reduce((acc, team) => ({ ...acc, [team.id]: getRandomColor() }), {}), [sortedTeams])

	return (
		<section className={`${css.leaderboard} grid space`}>
			{teams.length === 0 && <p style={{ gridColumn: '1 / -1' }}>Add teams to start</p>}
			<h1>
				<IconLeader /> Leaderboard
			</h1>
			<div className={css.chartContainer}>
				{sortedTeams.map((team, index) => (
					<div key={team.id} className={css.barContainer} style={{ borderBottom: `2px solid ${teamColors[team.id]}` }}>
						<span className={css.score}>{team.points}</span>
						<motion.div
							className={css.bar}
							initial={{ height: 0 }}
							animate={{ height: `${(team.points / maxScore) * 100}%` }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							style={{ backgroundColor: teamColors[team.id] }}
						/>
						<div className={css.teamInfo}>
							<span className={css.teamName}>{team.name}</span>
						</div>
						<div className={css.playerImages}>
							{team.players.map((player, i) =>
								player.profileImage ? <Image key={i} src={player.profileImage} width={30} height={30} alt={`${player.name}'s profile image`} className={css.profileImage} /> : <IconProfile key={i} />
							)}
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default Leaderboard
