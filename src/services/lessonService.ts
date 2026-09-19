import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Lesson } from '../types';

const COLLECTION = 'lessons';

export const fetchLessonsByModule = async (moduleId: string): Promise<Lesson[]> => {
  const q = query(collection(db, COLLECTION), where('moduleId', '==', moduleId), orderBy('orderIndex', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
};

export const fetchLessonsByCourse = async (courseId: string): Promise<Lesson[]> => {
  const q = query(collection(db, COLLECTION), where('courseId', '==', courseId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
};

export const createLesson = async (lessonData: Omit<Lesson, 'id'>): Promise<Lesson> => {
  const docRef = await addDoc(collection(db, COLLECTION), lessonData);
  return { id: docRef.id, ...lessonData };
};

export const updateLesson = async (id: string, lessonData: Partial<Lesson>): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, lessonData);
};

export const deleteLesson = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
};
