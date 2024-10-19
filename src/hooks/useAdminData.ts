import { useState, useEffect } from 'react';
import { db } from '@/services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { PlayerType, TeamType } from "@/types/types";

export const useAdminData = () => {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [teams, setTeams] = useState<TeamType[]>([]);

  useEffect(() => {
    const playersUnsubscribe = onSnapshot(collection(db, 'players'), (snapshot) => {
      const updatedPlayers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PlayerType[];
      setPlayers(updatedPlayers);
    });

    const teamsUnsubscribe = onSnapshot(collection(db, 'teams'), (snapshot) => {
      const updatedTeams = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamType[];
      setTeams(updatedTeams);
    });

    return () => {
      playersUnsubscribe();
      teamsUnsubscribe();
    };
  }, []);

  return { players, teams };
};
