'use client'
import { useState } from 'react'
import { submitForm } from '@/services/submit'
import { PlayerType } from '@/types/types'
import css from './Forms.module.css'

const initialTeamFormData = {
	name: '',
	players: [] as string[],
}

type TeamFormProps = {
	players: PlayerType[]
}

const TeamForm: React.FC<TeamFormProps> = ({ players }) => {
	const [teamFormData, setTeamFormData] = useState<typeof initialTeamFormData>(initialTeamFormData)

	const handleTeamInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		if (name === 'players') {
			const selectedOptions = (e.target as HTMLSelectElement).selectedOptions
			const selectedPlayers = Array.from(selectedOptions).map(option => option.value)
			setTeamFormData(prev => ({ ...prev, [name]: selectedPlayers }))
		} else {
			setTeamFormData(prev => ({ ...prev, [name]: value }))
		}
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		try {
			await submitForm(teamFormData, 'teams')
			setTeamFormData(initialTeamFormData)
		} catch (error) {
			console.error('Error submitting team:', error)
		}
	}

	return (
		<form onSubmit={handleSubmit} className={css.teamForm}>
			<fieldset>
				<label htmlFor='teamName'>Team Name</label>
				<input type='text' id='teamName' name='name' value={teamFormData.name} onChange={handleTeamInputChange} required />
			</fieldset>
			<fieldset>
				<label htmlFor='players'>Select Players</label>
				<select multiple id='players' name='players' value={teamFormData.players} onChange={handleTeamInputChange} required>
					{players.map((player, i) => (
						<option key={i} value={player.id}>
							{player.name} ({player.nickname})
						</option>
					))}
				</select>
			</fieldset>
			<button type='submit'>Add Team</button>
		</form>
	)
}

export default TeamForm
