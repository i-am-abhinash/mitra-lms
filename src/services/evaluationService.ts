import { collection, getDocs, doc, addDoc, updateDoc, getDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Rubric, Evaluation } from '../types';

export const fetchRubrics = async (): Promise<Rubric[]> => {
  const snap = await getDocs(collection(db, 'rubrics'));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rubric));
};

export const getRubric = async (id: string): Promise<Rubric | null> => {
  const snap = await getDoc(doc(db, 'rubrics', id));
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as Rubric;
  }
  return null;
};

export const createRubric = async (data: Omit<Rubric, 'id'>): Promise<Rubric> => {
  const docRef = await addDoc(collection(db, 'rubrics'), data);
  return { id: docRef.id, ...data };
};

export const updateRubric = async (id: string, data: Partial<Rubric>): Promise<void> => {
  await updateDoc(doc(db, 'rubrics', id), data);
};

export const fetchEvaluationsForSubmission = async (submissionId: string): Promise<Evaluation[]> => {
  const q = query(collection(db, 'evaluations'), where('submissionId', '==', submissionId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Evaluation));
};

export const createEvaluation = async (data: Omit<Evaluation, 'id'>): Promise<Evaluation> => {
  const docRef = await addDoc(collection(db, 'evaluations'), data);
  return { id: docRef.id, ...data };
};
