import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export const snapShot = (onUpdate: (count: number) => void, collectionName: string) => {
	return onSnapshot(collection(db, collectionName), snapshot => {
		onUpdate(snapshot.size)
	});
};
