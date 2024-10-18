import { useState, useCallback, useEffect } from 'react';
import { getPlayers, getTeams } from "@/services/getdata";
import { PlayerType, TeamType } from "@/types/types";

export const useAdminData = () => {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [teams, setTeams] = useState<TeamType[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [fetchedPlayers, fetchedTeams] = await Promise.all([
        getPlayers(),
        getTeams()
      ]);
      setPlayers(fetchedPlayers);
      setTeams(fetchedTeams);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { players, teams, fetchData };
};
