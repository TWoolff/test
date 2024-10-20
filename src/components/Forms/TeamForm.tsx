'use client'
import { useState } from 'react'
import { PlayerType } from '@/types/types'
import { useAdminData } from '@/hooks/useAdminData'
import css from './Forms.module.css'

type TeamFormProps = {
	players: PlayerType[]
}

const TeamForm: React.FC<TeamFormProps> = ({ players }) => {
	const [name, setName] = useState('')
	const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
	const { createTeam } = useAdminData()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (name.trim() === '') return

		try {
			await createTeam({
				name,
				players: players.filter(player => selectedPlayers.includes(player.id)),
				points: 0,
			})
			setName('')
			setSelectedPlayers([])
		} catch (error) {
			console.error('Error creating team:', error)
		}
	}

	return (
		<form onSubmit={handleSubmit} className={css.teamForm}>
			<input type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Team Name' required />
			<select multiple value={selectedPlayers} onChange={e => setSelectedPlayers(Array.from(e.target.selectedOptions, option => option.value))}>
				<option value='' disabled>
					Select Players
				</option>
				{players.map((player, index) => (
					<option key={player.id || `player-${index}`} value={player.id || `player-${index}`}>
						{player.name}
					</option>
				))}
			</select>
			<button type='submit'>Create Team</button>
		</form>
	)
}

export default TeamForm
