import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
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

export const getLesson = async (id: string): Promise<Lesson | null> => {
  const docRef = doc(db, COLLECTION, id);
  const snap = await getDoc(docRef);
  if (snap.exists()) return { id: snap.id, ...snap.data() } as Lesson;
  return null;
};

export const createLesson = async (lessonData: Omit<Lesson, 'id' | 'contentVersion'>): Promise<Lesson> => {
  const newLesson = { ...lessonData, contentVersion: 1 };
  const docRef = await addDoc(collection(db, COLLECTION), newLesson);
  return { id: docRef.id, ...newLesson } as Lesson;
};

export const updateLesson = async (id: string, lessonData: Partial<Lesson>): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, lessonData);
};

export const deleteLesson = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
};
