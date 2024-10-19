import { useState, useEffect } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { PlayerType, TeamType, MatchType } from '@/types/types'
import { getOrCreateMatches } from '@/utils/createMatches'

export const useAdminData = () => {
	const [players, setPlayers] = useState<PlayerType[]>([])
	const [teams, setTeams] = useState<TeamType[]>([])
	const [matches, setMatches] = useState<MatchType[]>([])

	useEffect(() => {
		const playersQuery = query(collection(db, 'players'))
		const teamsQuery = query(collection(db, 'teams'))
		const matchesQuery = query(collection(db, 'matches'))

		const unsubscribePlayers = onSnapshot(playersQuery, (snapshot) => {
			setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlayerType)))
		})

		const unsubscribeTeams = onSnapshot(teamsQuery, (snapshot) => {
			const newTeams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamType))
			setTeams(newTeams)
			
			// Create or update matches when teams change
			getOrCreateMatches(newTeams).then(updatedMatches => {
				setMatches(updatedMatches.map(match => ({
					...match,
					homeTeam: teams.find(team => team.id === match.homeTeam) || match.homeTeam,
					awayTeam: teams.find(team => team.id === match.awayTeam) || match.awayTeam
				} as MatchType)))
			})
		})

		const unsubscribeMatches = onSnapshot(matchesQuery, (snapshot) => {
			setMatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchType)))
		})

		return () => {
			unsubscribePlayers()
			unsubscribeTeams()
			unsubscribeMatches()
		}
	}, [])

	return { players, teams, matches }
}
