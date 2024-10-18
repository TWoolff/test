import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const submitForm = async (data: any, collectionName: string) => {
	try {
		console.log('Submitting data:', data, 'to collection:', collectionName);
		const docRef = await addDoc(collection(db, collectionName), data);
		console.log('Document written with ID: ', docRef.id);
		return docRef.id;
	} catch (e) {
		console.error('Error adding document: ', e);
		throw e;
	}
};
