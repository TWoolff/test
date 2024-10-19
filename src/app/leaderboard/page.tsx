'use client'
import { useMemo } from 'react'
import { useAdminData } from '@/hooks/useAdminData'
import Team from '@/components/Team/Team'
import { sortTeams } from '@/utils/sortingUtils'

const Leaderboard: React.FC = () => {
	const { teams } = useAdminData()

	const sortedTeams = useMemo(() => sortTeams(teams), [teams])

	return (
		<section className='grid space frontpage'>
			<h1>Leaderboard</h1>
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
