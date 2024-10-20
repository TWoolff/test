'use client'
import { useMemo } from 'react'
import { useAdminData } from '@/hooks/useAdminData'
import { sortTeams } from '@/utils/sortingUtils'
import { IconLeader } from '@/components/Icons/Icons'
import Team from '@/components/Team/Team'

const Leaderboard: React.FC = () => {
	const { teams } = useAdminData()
	const sortedTeams = useMemo(() => sortTeams(teams), [teams])

	return (
		<section className='grid space frontpage'>
			<h1>
				<IconLeader /> Leaderboard
			</h1>
			<div>
				{sortedTeams.map((team, index) => (
					<div key={team.id}>
						<h2>
							{index + 1}. {team.name} - {team.points} points
						</h2>
						<Team {...team} />
					</div>
				))}
			</div>
		</section>
	)
}

export default Leaderboard
