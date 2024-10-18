'use client';
import { useState } from "react";
import { submitForm } from "@/services/submit";
import Form from "@/components/Form/Form";
import { PlayerType, TeamType } from "@/types/types";
import css from './Form.module.css';

const initialTeamFormData = {
  name: '',
  players: [] as string[],
};

interface TeamFormProps {
  players: PlayerType[];
  onTeamAdded: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ players, onTeamAdded }) => {
  const [teamFormData, setTeamFormData] = useState<typeof initialTeamFormData>(initialTeamFormData);

  const handleTeamInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'players') {
      const selectedOptions = (e.target as HTMLSelectElement).selectedOptions;
      const selectedPlayers = Array.from(selectedOptions).map(option => option.value);
      setTeamFormData(prev => ({ ...prev, [name]: selectedPlayers }));
    } else {
      setTeamFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await submitForm(teamFormData, 'teams');
      setTeamFormData(initialTeamFormData);
      onTeamAdded();
    } catch (error) {
      console.error('Error submitting team:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}  className={css.teamForm}>
        <h2>Add Team</h2>
        <div>
          <label htmlFor="teamName">Team Name</label>
          <input
            type="text"
            id="teamName"
            name="name"
            value={teamFormData.name}
            onChange={handleTeamInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="players">Select Players</label>
          <select
            multiple
            id="players"
            name="players"
            value={teamFormData.players}
            onChange={handleTeamInputChange}
            required
          >
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.nickname})
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Team</button>
      </Form>
  );
};

export default TeamForm;