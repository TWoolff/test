import { TeamType } from '@/types/types'

export const sortTeams = (teams: TeamType[]): TeamType[] => {
	return [...teams].sort((a, b) => b.points - a.points)
}
