import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { PlayerType } from '@/types/types';

export const getPlayers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'players'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as PlayerType[];
  } catch (e) {
    console.error('Error getting players:', e);
    throw e;
  }
};