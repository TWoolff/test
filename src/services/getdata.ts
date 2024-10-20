import { db } from './firebase'
import { collection, getDocs, doc, updateDoc, setDoc, getDoc, writeBatch } from 'firebase/firestore'
import { PlayerType, TeamType, MatchType } from '@/types/types'

// Fetch all players from the 'players' collection
export const getPlayers = async (): Promise<PlayerType[]> => {
	try {
		const querySnapshot = await getDocs(collection(db, 'players'))
		return querySnapshot.docs.map(
			doc =>
				({
					id: doc.id,
					...doc.data(),
				} as PlayerType)
		)
	} catch (e) {
		console.error('Error getting players:', e)
		throw e
	}
}

// Fetch all teams from the 'teams' collection
export const getTeams = async (): Promise<TeamType[]> => {
	try {
		const querySnapshot = await getDocs(collection(db, 'teams'))
		return querySnapshot.docs.map(doc => {
			const teamData = doc.data()
			return {
				id: doc.id,
				name: teamData.name,
				points: teamData.points || 0,
				players: teamData.players || [],
				gifUrl: teamData.gifUrl,
			} as TeamType
		})
	} catch (e) {
		console.error('Error getting teams:', e)
		throw e
	}
}

// Fetch all matches from the 'matches' collection and populate with team data
export const getMatches = async (): Promise<MatchType[]> => {
	try {
		const querySnapshot = await getDocs(collection(db, 'matches'))
		const teams = await getTeams()
		return querySnapshot.docs.map(doc => {
			const matchData = doc.data()
			return {
				id: doc.id,
				...matchData,
				homeTeam: teams.find(team => team.id === matchData.homeTeam.id) || matchData.homeTeam,
				awayTeam: teams.find(team => team.id === matchData.awayTeam.id) || matchData.awayTeam,
			} as MatchType
		})
	} catch (e) {
		console.error('Error getting matches:', e)
		throw e
	}
}

// Update a specific match in the 'matches' collection
export const updateMatch = async (matchId: string, updateData: Partial<MatchType>) => {
	try {
		const matchRef = doc(db, 'matches', matchId)
		await updateDoc(matchRef, updateData)
	} catch (error) {
		console.error('Error updating match: ', error)
		throw error
	}
}

// Create new matches for a newly added team against all existing teams
export const createMatchesForNewTeam = async (newTeamId: string, newTeamName: string, existingTeamIds: string[]) => {
	try {
		const matchesCollection = collection(db, 'matches')

		for (const existingTeamId of existingTeamIds) {
			const existingTeamDoc = await getDoc(doc(db, 'teams', existingTeamId))
			const existingTeamName = existingTeamDoc.exists() ? existingTeamDoc.data().name : 'Unknown Team'

			const newMatch = {
				homeTeam: { id: newTeamId, name: newTeamName },
				awayTeam: { id: existingTeamId, name: existingTeamName },
				homeScore: 0,
				awayScore: 0,
				completed: false,
				date: new Date().toISOString(),
			}

			const newMatchRef = doc(matchesCollection)
			await setDoc(newMatchRef, newMatch)
		}
	} catch (error) {
		console.error('Error creating matches for new team: ', error)
		throw error
	}
}

// Fetch all existing teams (used when creating matches for a new team)
export const getExistingTeams = async (): Promise<TeamType[]> => {
	try {
		const querySnapshot = await getDocs(collection(db, 'teams'))
		return querySnapshot.docs.map(
			doc =>
				({
					id: doc.id,
					name: doc.data().name,
					points: doc.data().points || 0,
				} as TeamType)
		)
	} catch (e) {
		console.error('Error getting existing teams:', e)
		throw e
	}
}

// Update points for all teams based on completed matches
export const updateTeamPoints = async () => {
	try {
		const teamsCollection = collection(db, 'teams')
		const matchesCollection = collection(db, 'matches')

		// Fetch all matches
		const matchesSnapshot = await getDocs(matchesCollection)
		const teamPoints = new Map()

		// Calculate points for each team based on match results
		matchesSnapshot.forEach(doc => {
			const match = doc.data() as MatchType
			if (match.completed) {
				const homeTeamId = match.homeTeam.id
				const awayTeamId = match.awayTeam.id

				if (match.homeScore > match.awayScore) {
					teamPoints.set(homeTeamId, (teamPoints.get(homeTeamId) || 0) + 3)
				} else if (match.homeScore < match.awayScore) {
					teamPoints.set(awayTeamId, (teamPoints.get(awayTeamId) || 0) + 3)
				} else {
					teamPoints.set(homeTeamId, (teamPoints.get(homeTeamId) || 0) + 1)
					teamPoints.set(awayTeamId, (teamPoints.get(awayTeamId) || 0) + 1)
				}
			}
		})

		// Update team points in Firestore using a batch write
		const batch = writeBatch(db)
		teamPoints.forEach((points, teamId) => {
			const teamRef = doc(teamsCollection, teamId)
			batch.update(teamRef, { points })
		})
		await batch.commit()
	} catch (error) {
		console.error('Error updating team points: ', error)
		throw error
	}
}
