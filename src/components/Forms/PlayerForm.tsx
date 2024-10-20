'use client'
import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { uploadImage } from '@/services/uploadimage'
import { PlayerType } from '@/types/types'
import css from './Forms.module.css'

const initialPlayerFormData = {
	name: '',
	nickname: '',
	profileImage: '',
}

const PlayerForm: React.FC = () => {
	const [playerFormData, setPlayerFormData] = useState<Omit<PlayerType, 'id'>>(initialPlayerFormData)
	const [file, setFile] = useState<File | null>(null)

	const handlePlayerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, files } = e.target
		if (type === 'file') {
			setFile(files?.[0] || null)
		} else {
			setPlayerFormData(prev => ({ ...prev, [name]: value }))
		}
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		try {
			let imageUrl = ''
			if (file) {
				const formData = new FormData()
				formData.append('file', file)
				imageUrl = (await uploadImage(formData)) as string
			}

			// Add the new player to Firestore
			const docRef = await addDoc(collection(db, 'players'), {
				...playerFormData,
				profileImage: imageUrl
			})

			console.log('New player added with ID: ', docRef.id)

			// Reset the form
			setPlayerFormData(initialPlayerFormData)
			setFile(null)
		} catch (error) {
			console.error('Error submitting player:', error)
		}
	}

	return (
		<form onSubmit={handleSubmit} className={css.playerForm}>
			<input 
				type='text' 
				name='name' 
				placeholder='Player Name' 
				value={playerFormData.name} 
				onChange={handlePlayerInputChange} 
				required 
			/>
			<input 
				type='text' 
				name='nickname' 
				placeholder='Nickname (optional)' 
				value={playerFormData.nickname} 
				onChange={handlePlayerInputChange} 
			/>
			<div className={css.fileInputWrapper}>
				<input 
					type='file' 
					name='profileImage' 
					id='profileImage'
					onChange={handlePlayerInputChange} 
					accept="image/*"
				/>
				<label htmlFor='profileImage'>
					{file ? file.name : 'Choose Mug Shot'}
				</label>
			</div>
			<button type='submit'>Add Player</button>
		</form>
	)
}

export default PlayerForm
