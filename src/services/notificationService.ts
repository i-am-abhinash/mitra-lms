import { collection, getDocs, doc, query, where, Timestamp, addDoc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Notification } from '../types';

export const fetchUserNotifications = async (userId: string): Promise<Notification[]> => {
  const q = query(
    collection(db, 'notifications'), 
    where('recipientId', '==', userId)
  );
  // In a real app we would orderBy('createdAt', 'desc') but requires composite index
  const snap = await getDocs(q);
  const notes = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
  return notes.sort((a, b) => (b.createdAt as Timestamp).toMillis() - (a.createdAt as Timestamp).toMillis());
};

export const createNotification = async (data: Omit<Notification, 'id' | 'createdAt'>): Promise<void> => {
  await addDoc(collection(db, 'notifications'), {
    ...data,
    createdAt: Timestamp.now()
  });
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await updateDoc(doc(db, 'notifications', id), {
    readAt: Timestamp.now()
  });
};
