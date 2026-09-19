import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Assignment } from '../types';

const COLLECTION = 'assignments';

export const fetchAssignments = async (courseId?: string): Promise<Assignment[]> => {
  let q = collection(db, COLLECTION);
  if (courseId) {
    q = query(q, where('courseId', '==', courseId), orderBy('deadline', 'desc'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));
};

export const createAssignment = async (assignmentData: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> => {
  const newAssignment = {
    ...assignmentData,
    createdAt: Timestamp.now()
  };
  const docRef = await addDoc(collection(db, COLLECTION), newAssignment);
  return { id: docRef.id, ...newAssignment } as Assignment;
};

export const updateAssignment = async (id: string, assignmentData: Partial<Assignment>): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, assignmentData);
};

export const deleteAssignment = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
};
