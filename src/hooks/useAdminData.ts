import { useState, useEffect, useCallback } from 'react'
import { collection, onSnapshot, query, addDoc } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { getPlayers, createMatchesForNewTeam, getExistingTeams, updateMatch } from '@/services/getdata'
import { PlayerType, TeamType, MatchType } from '@/types/types'


export const useAdminData = () => {
	const [players, setPlayers] = useState<PlayerType[]>([])
	const [teams, setTeams] = useState<TeamType[]>([])
	const [matches, setMatches] = useState<MatchType[]>([])

	useEffect(() => {
		const playersQuery = query(collection(db, 'players'))
		const unsubscribePlayers = onSnapshot(playersQuery, (snapshot) => {
			const playersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlayerType))
			setPlayers(playersData)
		})

		const teamsQuery = query(collection(db, 'teams'))
		const unsubscribeTeams = onSnapshot(teamsQuery, async (snapshot) => {
			const players = await getPlayers();
			const teamsData = snapshot.docs.map(doc => {
				const teamData = doc.data();
				return {
					id: doc.id,
					name: teamData.name,
					points: teamData.points || 0,
					players: teamData.players?.map((playerId: string) => 
						players.find(player => player.id === playerId) || { id: playerId, name: 'Unknown Player' }
					) || []
				} as TeamType;
			});
			setTeams(teamsData);
		})

		const matchesQuery = query(collection(db, 'matches'))
		const unsubscribeMatches = onSnapshot(matchesQuery, (snapshot) => {
			const matchesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchType))
			setMatches(matchesData)
		})

		return () => {
			unsubscribePlayers()
			unsubscribeTeams()
			unsubscribeMatches()
		}
	}, [])

	const createTeam = async (teamData: Omit<TeamType, 'id'>) => {
		try {
			const teamsCollection = collection(db, 'teams');
			const newTeamRef = await addDoc(teamsCollection, {
				...teamData,
				points: 0,
				players: teamData.players.map(player => player.id) // Store only player IDs
			});
			const existingTeams = await getExistingTeams();
			await createMatchesForNewTeam(newTeamRef.id, existingTeams);
			return newTeamRef.id;
		} catch (error) {
			console.error("Error creating team: ", error);
			throw error;
		}
	};

	const useMatchData = (match: MatchType) => {
		const [homeScore, setHomeScore] = useState<number>(match.homeScore);
		const [awayScore, setAwayScore] = useState<number>(match.awayScore);
		const [completed, setCompleted] = useState<boolean>(match.completed);

		const handleScoreChange = useCallback(async (team: 'home' | 'away', score: number) => {
			if (completed) return;

			const newScore = score >= 0 ? score : 0;
			if (team === 'home') {
				setHomeScore(newScore);
			} else {
				setAwayScore(newScore);
			}

			await updateMatch(match.id, { [`${team}Score`]: newScore });
		}, [completed, match.id]);

		const handleComplete = useCallback(async () => {
			if (completed) return;

			setCompleted(true);
			await updateMatch(match.id, {
				completed: true,
				homeScore,
				awayScore
			});
		}, [completed, match.id, homeScore, awayScore]);

		return { homeScore, awayScore, completed, handleScoreChange, handleComplete };
	};

	return { players, teams, matches, createTeam, useMatchData }
}
