'use client';
import { useEffect, useState } from "react";
import { submitForm } from "@/services/submit";
import { getPlayers } from "@/services/getdata";
import { uploadImage } from "@/services/uploadimage";
import { PlayerType } from "@/types/types";
import Form from "@/components/Form/Form";
import Player from "@/components/Player/Player";
import css from "./admin.module.css";



const Admin: React.FC = () => {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Omit<PlayerType, 'id'>>({
    name: '',
    nickname: '',
    profileImage: '',
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const fetchedPlayers = await getPlayers();
      setPlayers(fetchedPlayers);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const selectedFile = e.target.files?.[0];
      setFile(selectedFile || null);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, collectionName: string) => {
    event.preventDefault();
    try {
      let imageUrl = '';
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        imageUrl = await uploadImage(formData) as string;
      }
      await submitForm({ ...formData, profileImage: imageUrl }, collectionName);
      setFormData({ name: '', nickname: '', profileImage: '' });
      setFile(null);
      fetchPlayers();
    } catch (error) {
      console.error('Error submitting player:', error);
    }
  };

  return (
    <section className='grid space'>
      <h1>Admin</h1>
      <Form onSubmit={(e) => handleSubmit(e, 'players')} className={css.playerForm}>
        <h2>Add Player</h2>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <label htmlFor="nickname">Nickname</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="profileImage">Mug shot</label>
          <input
            type="file"
            name="profileImage"
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Submit</button>
      </Form>
      <h3>Players</h3>
      {players.map((player, i) => <Player {...player} key={i} />)}
    </section>
  );
};

export default Admin;
