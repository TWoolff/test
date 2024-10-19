import { useState, useEffect } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { PlayerType, TeamType, MatchType } from '@/types/types'
import { getPlayers } from '@/services/getdata'

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

		const unsubscribeTeams = onSnapshot(teamsQuery, async (snapshot) => {
			const players = await getPlayers();
			const newTeams = snapshot.docs.map(doc => {
				const teamData = doc.data();
				return { 
					id: doc.id, 
					...teamData,
					players: teamData.players.map((playerId: string) => 
						players.find(player => player.id === playerId)?.name || 'Unknown Player'
					),
					points: teamData.points || 0
				} as TeamType;
			});
			setTeams(newTeams);
			
			setMatches(prevMatches => prevMatches.map(match => ({
				...match,
				homeTeam: newTeams.find(team => team.id === match.homeTeam.id) || match.homeTeam,
				awayTeam: newTeams.find(team => team.id === match.awayTeam.id) || match.awayTeam
			})))
		})

		const unsubscribeMatches = onSnapshot(matchesQuery, (snapshot) => {
			setMatches(prevMatches => {
				const updatedMatches = snapshot.docs.map(doc => {
					const matchData = doc.data();
					const existingMatch = prevMatches.find(m => m.id === doc.id);
					return {
						...existingMatch,
						id: doc.id,
						...matchData,
						homeTeam: existingMatch?.homeTeam || { id: matchData.homeTeam, name: 'Unknown Team' },
						awayTeam: existingMatch?.awayTeam || { id: matchData.awayTeam, name: 'Unknown Team' }
					} as MatchType;
				});
				return updatedMatches;
			});
		})

		return () => {
			unsubscribePlayers()
			unsubscribeTeams()
			unsubscribeMatches()
		}
	}, [])

	return { players, teams, matches }
}
