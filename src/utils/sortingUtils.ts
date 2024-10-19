import { MatchType, TeamType } from '@/types/types'

export const sortMatches = (matches: MatchType[]): MatchType[] => {
	return [...matches].sort((a, b) => {
		if (a.completed === b.completed) {
			return new Date(b.date).getTime() - new Date(a.date).getTime()
		}
		return a.completed ? 1 : -1
	})
}

export const sortTeams = (teams: TeamType[]): TeamType[] => {
	return [...teams].sort((a, b) => b.points - a.points)
}
