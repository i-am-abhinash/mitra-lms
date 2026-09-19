import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Module } from '../types';

const COLLECTION = 'modules';

export const fetchModulesByCourse = async (courseId: string): Promise<Module[]> => {
  const q = query(collection(db, COLLECTION), where('courseId', '==', courseId), orderBy('orderIndex', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
};

export const createModule = async (moduleData: Omit<Module, 'id'>): Promise<Module> => {
  const docRef = await addDoc(collection(db, COLLECTION), moduleData);
  return { id: docRef.id, ...moduleData };
};

export const updateModule = async (id: string, moduleData: Partial<Module>): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, moduleData);
};

export const deleteModule = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
};
