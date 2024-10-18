'use client';
import { useMemo } from "react";
import Player from "@/components/Player/Player";
import Team from "@/components/Team/Team";
import PlayerForm from "@/components/Form/PlayerForm";
import TeamForm from "@/components/Form/TeamForm";
import { useAdminData } from "@/hooks/useAdminData";
import css from "./admin.module.css";

const Admin: React.FC = () => {
  const { players, teams, fetchData } = useAdminData();

  const teamsWithPlayerNames = useMemo(() => teams.map(team => ({
    ...team,
    players: team.players.map(playerId => 
      players.find(player => player.id === playerId)?.name || 'Unknown Player'
    )
  })), [teams, players]);

  return (
    <section className='grid space'>
      <h1>Admin</h1>
      <PlayerForm onPlayerAdded={fetchData} />
      <TeamForm players={players} onTeamAdded={fetchData} />
      <h3>Players</h3>
      {players.map((player) => <Player key={player.id} {...player} />)}
      <h3>Teams</h3>
      {teamsWithPlayerNames.map((team) => <Team key={team.id} {...team} />)}
    </section>
  );
};

export default Admin;
