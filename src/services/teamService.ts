import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export const fetchTeams = async () => {
  const querySnapshot = await getDocs(collection(db, 'teams'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createTeam = async (teamData: Record<string, any>) => {
  const docRef = await addDoc(collection(db, 'teams'), teamData);
  return { id: docRef.id, ...teamData };
};

export const updateTeam = async (teamId: string, teamData: Record<string, any>) => {
  const teamRef = doc(db, 'teams', teamId);
  await updateDoc(teamRef, teamData);
};

export const deleteTeam = async (teamId: string) => {
  await deleteDoc(doc(db, 'teams', teamId));
};
