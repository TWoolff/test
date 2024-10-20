import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FormData } from '@/types/types';

export const submitForm = async (data: FormData, collectionName: string) => {
	try {
		console.log('Submitting data:', data, 'to collection:', collectionName)
		const docRef = await addDoc(collection(db, collectionName), data);
		console.log('Document written with ID: ', docRef.id);
		return docRef.id;
	} catch (e) {
		console.error('Error adding document: ', e);
		throw e;
	}
};
