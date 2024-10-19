import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, increment, runTransaction } from 'firebase/firestore';
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
          players.find(player => player.id === playerId)?.name || playerId
        )
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
    await runTransaction(db, async (transaction) => {
      const matchDoc = await transaction.get(matchRef);
      if (!matchDoc.exists()) {
        throw new Error("Match does not exist!");
      }

      // Filter out undefined values
      const filteredUpdateData = Object.entries(updateData).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<MatchType>);

      // Update the match only if there are valid fields to update
      if (Object.keys(filteredUpdateData).length > 0) {
        transaction.update(matchRef, filteredUpdateData);
      }

      // If the match is completed and has a winner, update the winner's points
      if (filteredUpdateData.completed && filteredUpdateData.winner) {
        const winnerRef = doc(db, 'teams', filteredUpdateData.winner);
        transaction.update(winnerRef, {
          points: increment(3) // Assuming a win is worth 3 points
        });
      }
    });

    console.log("Match updated successfully");
  } catch (error) {
    console.error("Error updating match: ", error);
    throw error;
  }
};
