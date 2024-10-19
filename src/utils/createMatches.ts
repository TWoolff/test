import { collection, getDocs, addDoc, query, where } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { TeamType } from '@/types/types'

export type Match = {
	id?: string
	homeTeam: string
	awayTeam: string
}

export const getOrCreateMatches = async (teams: TeamType[]): Promise<Match[]> => {
	const matchesRef = collection(db, 'matches')

	// Check if matches already exist for these teams
	const teamIds = teams.map(team => team.id)
	const existingMatchesQuery = query(matchesRef, where('homeTeam', 'in', teamIds), where('awayTeam', 'in', teamIds))
	const existingMatchesSnapshot = await getDocs(existingMatchesQuery)

	if (!existingMatchesSnapshot.empty) {
		// Matches exist, return them with team names
		return existingMatchesSnapshot.docs.map(doc => {
			const data = doc.data()
			return {
				id: doc.id,
				homeTeam: teams.find(team => team.id === data.homeTeam)?.name || 'Unknown Team',
				awayTeam: teams.find(team => team.id === data.awayTeam)?.name || 'Unknown Team',
			}
		}) as Match[]
	}

	// No matches exist, create new ones
	const newMatches = createMatches(teams)

	// Save new matches to Firebase
	const savedMatches = await Promise.all(
		newMatches.map(match =>
			addDoc(matchesRef, {
				homeTeam: teams.find(team => team.name === match.homeTeam)?.id,
				awayTeam: teams.find(team => team.name === match.awayTeam)?.id,
			})
		)
	)

	// Return the newly created matches with their Firebase IDs and team names
	return savedMatches.map((docRef, index) => ({
		id: docRef.id,
		...newMatches[index],
	}))
}

const createMatches = (teams: TeamType[]): Match[] => {
	const n = teams.length
	const matches: Match[] = new Array((n * (n - 1)) / 2)
	let matchIndex = 0

	const teamNames = teams.map(team => team.name)
	const lastTeamName = teamNames[n - 1]

	for (let round = 0; round < n - 1; round++) {
		for (let i = 0; i < n / 2; i++) {
			const homeIndex = (round + i) % (n - 1)
			const awayIndex = (n - 1 - i + round) % (n - 1)

			if (i === 0) {
				matches[matchIndex++] = {
					homeTeam: lastTeamName,
					awayTeam: teamNames[awayIndex],
				}
			} else {
				matches[matchIndex++] = {
					homeTeam: teamNames[homeIndex],
					awayTeam: teamNames[awayIndex],
				}
			}
		}
	}

	return matches
}
