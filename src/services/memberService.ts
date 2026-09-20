import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { db } from './firebase';

const secondaryApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}, "SecondaryApp");

const secondaryAuth = getAuth(secondaryApp);

export const fetchMembers = async (teamId?: string): Promise<Array<{id: string; [key: string]: any}>> => {
  let snapshot;
  if (teamId !== undefined) {
    const q = query(collection(db, 'users'), where('teamId', '==', teamId));
    snapshot = await getDocs(q);
  } else {
    snapshot = await getDocs(collection(db, 'users'));
  }
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const fetchExternalMembers = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  const allUsers = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
  return allUsers.filter((u: any) => u.role === 'Member' && !u.teamId);
};

export const createMember = async (memberData: Record<string, any>) => {
  const { email, password, name, role } = memberData;
  const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  const uid = userCredential.user.uid;
  
  const userData = {
    email,
    name,
    role: role || 'Member',
    teamId: null // Explicitly null
  };

  await setDoc(doc(db, 'users', uid), userData);
  await secondaryAuth.signOut();
  
  return { id: uid, ...userData };
};

export const updateMember = async (userId: string, memberData: Record<string, any>) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, memberData);
};

export const deleteMember = async (userId: string) => {
  await deleteDoc(doc(db, 'users', userId));
};
