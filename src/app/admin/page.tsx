'use client'
import { useMemo } from 'react'
import { useAdminData } from '@/hooks/useAdminData'
import Accordion from '@/components/Accordion/Accordion'
import PlayerForm from '@/components/Forms/PlayerForm'
import TeamForm from '@/components/Forms/TeamForm'
import Player from '@/components/Player/Player'
import Team from '@/components/Team/Team'
import css from './admin.module.css'

const Admin: React.FC = () => {
	const { players, teams } = useAdminData();

  const teamsWithPlayerNames = useMemo(() => teams.map(team => ({
    ...team,
    players: team.players.map(playerId => 
      players.find(player => player.id === playerId)?.name || 'Unknown Player'
    )
  })), [teams, players]);

  return (
    <section className='grid space'>
      <h1>Admin</h1>
      <Accordion title='Add player' content={<PlayerForm />} />
      <Accordion title='Add team' content={<TeamForm players={players} />} />
			<div className={css.adminInfo}>
        <div>
          <h2>Players</h2>
          {players.map((player, i) => (
            <Player key={i} {...player} />
          ))}
        </div>
        <div>
          <h2>Teams</h2>
          {teamsWithPlayerNames.map(team => (
            <Team key={team.id} {...team} />
          ))}
        </div>
			</div>
		</section>
	)
}

export default Admin
