import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, getDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Course } from '../types';

const COLLECTION = 'courses';

export const fetchCourses = async (status?: string): Promise<Course[]> => {
  let snapshot;
  if (status) {
    snapshot = await getDocs(query(collection(db, COLLECTION), where('status', '==', status)));
  } else {
    snapshot = await getDocs(collection(db, COLLECTION));
  }
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Course));
};

export const getCourse = async (id: string): Promise<Course | null> => {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Course;
  }
  return null;
};

export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Course> => {
  const newCourse = {
    ...courseData,
    version: 1,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  const docRef = await addDoc(collection(db, COLLECTION), newCourse);
  return { id: docRef.id, ...newCourse } as Course;
};

export const updateCourse = async (id: string, courseData: Partial<Course>): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { ...courseData, updatedAt: Timestamp.now() });
};

export const deleteCourse = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
};
