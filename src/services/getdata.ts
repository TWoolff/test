import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
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
        ...teamData,
        players: teamData.players.map((playerId: string) => 
          players.find(player => player.id === playerId)?.name || 'Unknown Player'
        ),
        points: teamData.points || 0
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
        homeTeam: teams.find(team => team.id === matchData.homeTeam) || { id: matchData.homeTeam, name: 'Unknown Team' },
        awayTeam: teams.find(team => team.id === matchData.awayTeam) || { id: matchData.awayTeam, name: 'Unknown Team' }
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
    const filteredUpdateData = Object.entries(updateData).reduce<Record<string, any>>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    await updateDoc(matchRef, filteredUpdateData);

    if (filteredUpdateData.completed && filteredUpdateData.winner) {
      const winnerRef = doc(db, 'teams', filteredUpdateData.winner);
      await updateDoc(winnerRef, {
        points: increment(3)
      });
      console.log(`Updated points for team ${filteredUpdateData.winner}`);
    }

    console.log("Match updated successfully");
  } catch (error) {
    console.error("Error updating match: ", error);
    throw error;
  }
};
