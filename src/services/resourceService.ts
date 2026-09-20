import { collection, getDocs, doc, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Resource } from '../types';

const COLLECTION = 'resources';

export const fetchResourcesByLesson = async (lessonId: string): Promise<Resource[]> => {
  const q = query(collection(db, COLLECTION), where('lessonId', '==', lessonId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
};

export const fetchResourcesByCourse = async (courseId: string): Promise<Resource[]> => {
  const q = query(collection(db, COLLECTION), where('courseId', '==', courseId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
};

export const addResource = async (resourceData: Omit<Resource, 'id'>): Promise<Resource> => {
  const docRef = await addDoc(collection(db, COLLECTION), resourceData);
  return { id: docRef.id, ...resourceData };
};

export const deleteResource = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
};
