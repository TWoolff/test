'use client'
import React, { useState } from 'react'
import { PlayerType, TeamType } from '@/types/types'
import { useAdminData } from '@/hooks/useAdminData'
import css from './Forms.module.css'

interface TeamFormProps {
	players: PlayerType[]
}

const TeamForm: React.FC<TeamFormProps> = ({ players }) => {
	const [teamName, setTeamName] = useState('')
	const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
	const { createTeam } = useAdminData()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const teamData: Omit<TeamType, 'id'> = {
				name: teamName,
				players: selectedPlayers,
				points: 0
			}
			await createTeam(teamData)
			setTeamName('')
			setSelectedPlayers([])
		} catch (error) {
			console.error('Error creating team:', error)
		}
	}

	return (
		<form onSubmit={handleSubmit} className={css.teamForm}>
			<fieldset>
				<label htmlFor='teamName'>Team Name</label>
				<input
					type="text"
					value={teamName}
					onChange={(e) => setTeamName(e.target.value)}
					placeholder="Team Name"
					required
				/>
			</fieldset>
			<fieldset>
				<label htmlFor='players'>Select Players</label>
				{players.map((player, i) => (
					<label key={i}>
						<input
							type="checkbox"
							value={player.id}
							checked={selectedPlayers.includes(player.id)}
							onChange={(e) => {
								if (e.target.checked) {
									setSelectedPlayers([...selectedPlayers, player.id])
								} else {
									setSelectedPlayers(selectedPlayers.filter(id => id !== player.id))
								}
							}}
						/>
						{player.name}
					</label>
				))}
			</fieldset>
			<button type="submit">Create Team</button>
		</form>
	)
}

export default TeamForm
