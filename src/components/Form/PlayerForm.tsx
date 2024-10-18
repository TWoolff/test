'use client';
import { useState } from "react";
import { submitForm } from "@/services/submit";
import { uploadImage } from "@/services/uploadimage";
import Form from "@/components/Form/Form";
import { PlayerType } from "@/types/types";
import css from './Form.module.css';

const initialPlayerFormData = {
  id: '',
  name: '',
  nickname: '',
  profileImage: '',
};

interface PlayerFormProps {
  onPlayerAdded: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onPlayerAdded }) => {
  const [playerFormData, setPlayerFormData] = useState<Omit<PlayerType, 'id'>>(initialPlayerFormData);
  const [file, setFile] = useState<File | null>(null);


  const handlePlayerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFile(files?.[0] || null);
    } else {
      setPlayerFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let imageUrl = '';
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        imageUrl = await uploadImage(formData) as string;
      }
      await submitForm({ ...playerFormData, profileImage: imageUrl }, 'players');
      setPlayerFormData(initialPlayerFormData);
      setFile(null);
      onPlayerAdded();
    } catch (error) {
      console.error('Error submitting player:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={css.playerForm}>
      <h2>Add Player</h2>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={playerFormData.name}
            onChange={handlePlayerInputChange}
          />
          <label htmlFor="nickname">Nickname</label>
          <input
            type="text"
            name="nickname"
            value={playerFormData.nickname}
            onChange={handlePlayerInputChange}
          />
        </div>
        <div>
          <label htmlFor="profileImage">Mug shot</label>
          <input
            type="file"
            name="profileImage"
            onChange={handlePlayerInputChange}
          />
        </div>
        <button type="submit">Submit</button>
    </Form>
  );
};

export default PlayerForm;