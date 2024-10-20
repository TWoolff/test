import { useState, useEffect, useCallback } from 'react'
import { collection, onSnapshot, query, addDoc, getDocs } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { createMatchesForNewTeam, updateMatch, updateTeamPoints } from '@/services/getdata'
import { getGifForTeam } from '@/services/giphy'
import { PlayerType, TeamType, MatchType, CleanTeamData } from '@/types/types'

export const useAdminData = () => {
	const [players, setPlayers] = useState<PlayerType[]>([])
	const [teams, setTeams] = useState<TeamType[]>([])
	const [matches, setMatches] = useState<MatchType[]>([])

	useEffect(() => {
		// Set up real-time listeners for players, teams, and matches collections
		const unsubscribers = ['players', 'teams', 'matches'].map(collectionName => {
			const collectionQuery = query(collection(db, collectionName))
			return onSnapshot(collectionQuery, snapshot => {
				const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
				// Update the corresponding state based on the collection name
				switch (collectionName) {
					case 'players':
						setPlayers(data as PlayerType[])
						break
					case 'teams':
						setTeams(data as TeamType[])
						break
					case 'matches':
						setMatches(data as MatchType[])
						break
				}
			})
		})

		// Clean up listeners on component unmount
		return () => unsubscribers.forEach(unsubscribe => unsubscribe())
	}, [])

	const createTeam = useCallback(async (teamData: Omit<TeamType, 'id'>) => {
		try {
			// Check if a team with the same name already exists
			const teamsSnapshot = await getDocs(collection(db, 'teams'))
			const teamExists = teamsSnapshot.docs.some(doc => doc.data().name.toLowerCase() === teamData.name.toLowerCase())

			if (teamExists) {
				throw new Error('A team with this name already exists')
			}

			const gifUrl = await getGifForTeam(teamData.name)
			
			// Prepare clean team data for Firestore
			const cleanTeamData: CleanTeamData = {
				name: teamData.name,
				points: 0,
				players: teamData.players,
				gifUrl: gifUrl ?? undefined,
			}

			// Add the new team to Firestore
			const newTeamRef = await addDoc(collection(db, 'teams'), cleanTeamData)
			
			// Create matches for the new team against existing teams
			const existingTeamIds = teamsSnapshot.docs.map(doc => doc.id).filter(id => id !== newTeamRef.id)
			await createMatchesForNewTeam(newTeamRef.id, cleanTeamData.name, existingTeamIds)
			
			return newTeamRef.id
		} catch (error) {
			console.error('Error creating team: ', error)
			throw error
		}
	}, [])

	// Return the state and functions for use in components
	return { players, teams, matches, createTeam }
}

export const useMatchData = (match: MatchType) => {
	const [homeScore, setHomeScore] = useState<number>(match.homeScore)
	const [awayScore, setAwayScore] = useState<number>(match.awayScore)
	const [completed, setCompleted] = useState<boolean>(match.completed)

	const handleScoreChange = useCallback(
		async (team: 'home' | 'away', score: number) => {
			if (completed) return

			const newScore = Math.max(0, score)
			const scoreState = team === 'home' ? setHomeScore : setAwayScore
			scoreState(newScore)

			await updateMatch(match.id, { [`${team}Score`]: newScore })
		},
		[completed, match.id]
	)

	const handleComplete = useCallback(async () => {
		if (completed) return

		setCompleted(true)
		await updateMatch(match.id, {
			completed: true,
			homeScore,
			awayScore,
			completedDate: new Date().toISOString(),
		})
		await updateTeamPoints()
	}, [completed, match.id, homeScore, awayScore])

	return { homeScore, awayScore, completed, handleScoreChange, handleComplete }
}
