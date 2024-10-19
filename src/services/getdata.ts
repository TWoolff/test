import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, increment, addDoc, getDoc } from 'firebase/firestore';
import { PlayerType, TeamType, MatchType } from '@/types/types';

export const getPlayers = async (): Promise<PlayerType[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'players'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PlayerType));
  } catch (e) {
    console.error('Error getting players:', e);
    throw e;
  }
};

export const getTeams = async (): Promise<TeamType[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'teams'));
    const players = await getPlayers();
    return querySnapshot.docs.map(doc => {
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
  } catch (e) {
    console.error('Error getting teams:', e);
    throw e;
  }
};

export const getMatches = async (): Promise<MatchType[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'matches'));
    const teams = await getTeams();
    return querySnapshot.docs.map(doc => {
      const matchData = doc.data();
      return {
        id: doc.id,
        ...matchData,
        homeTeam: teams.find(team => team.id === matchData.homeTeam.id) || matchData.homeTeam,
        awayTeam: teams.find(team => team.id === matchData.awayTeam.id) || matchData.awayTeam
      } as MatchType;
    });
  } catch (e) {
    console.error('Error getting matches:', e);
    throw e;
  }
};

export const updateMatch = async (matchId: string, updateData: Partial<MatchType>) => {
  const matchRef = doc(db, 'matches', matchId);

  try {
    // Update the match
    await updateDoc(matchRef, updateData);

    // If the match is being completed, update team points
    if (updateData.completed) {
      const matchDoc = await getDoc(matchRef);
      const matchData = matchDoc.data() as MatchType;

      if (matchData.homeScore !== undefined && matchData.awayScore !== undefined) {
        const homeTeamRef = doc(db, 'teams', matchData.homeTeam.id);
        const awayTeamRef = doc(db, 'teams', matchData.awayTeam.id);

        if (matchData.homeScore > matchData.awayScore) {
          await updateDoc(homeTeamRef, { points: increment(3) });
        } else if (matchData.homeScore < matchData.awayScore) {
          await updateDoc(awayTeamRef, { points: increment(3) });
        } else {
          await updateDoc(homeTeamRef, { points: increment(1) });
          await updateDoc(awayTeamRef, { points: increment(1) });
        }
      }
    }

    console.log("Match updated successfully");
  } catch (error) {
    console.error("Error updating match: ", error);
    throw error;
  }
};

export const createMatchesForNewTeam = async (newTeamId: string, existingTeams: TeamType[]) => {
  try {
    const matchesCollection = collection(db, 'matches');
    const newTeamDoc = await getDoc(doc(db, 'teams', newTeamId));
    const newTeamData = newTeamDoc.data() as TeamType;
    const newTeamName = newTeamData.name;

    const newMatches = existingTeams
      .filter(team => team.id !== newTeamId)
      .map(existingTeam => ({
        homeTeam: {
          id: newTeamId,
          name: newTeamName,
        },
        awayTeam: {
          id: existingTeam.id,
          name: existingTeam.name,
        },
        homeScore: 0,
        awayScore: 0,
        completed: false,
        winner: null,
        date: new Date().toISOString()
      }));

    const addMatchPromises = newMatches.map(match => addDoc(matchesCollection, match));
    await Promise.all(addMatchPromises);

    console.log(`Created ${newMatches.length} new matches for team ${newTeamId}`);
  } catch (error) {
    console.error("Error creating matches for new team: ", error);
    throw error;
  }
};

export const getExistingTeams = async (): Promise<TeamType[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'teams'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      points: doc.data().points || 0
    } as TeamType));
  } catch (e) {
    console.error('Error getting existing teams:', e);
    throw e;
  }
};
