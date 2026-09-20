import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, getDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Quiz, QuizAttempt } from '../types';

const QUIZ_COLLECTION = 'quizzes';
const ATTEMPT_COLLECTION = 'quiz_attempts';

export const fetchQuizzesByCourse = async (courseId: string): Promise<Quiz[]> => {
  const q = query(collection(db, QUIZ_COLLECTION), where('courseId', '==', courseId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
};

export const getQuiz = async (id: string): Promise<Quiz | null> => {
  const docRef = doc(db, QUIZ_COLLECTION, id);
  const snap = await getDoc(docRef);
  if (snap.exists()) return { id: snap.id, ...snap.data() } as Quiz;
  return null;
};

export const createQuiz = async (quizData: Omit<Quiz, 'id'>): Promise<Quiz> => {
  const docRef = await addDoc(collection(db, QUIZ_COLLECTION), quizData);
  return { id: docRef.id, ...quizData };
};

export const updateQuiz = async (id: string, quizData: Partial<Quiz>): Promise<void> => {
  const docRef = doc(db, QUIZ_COLLECTION, id);
  await updateDoc(docRef, quizData);
};

export const deleteQuiz = async (id: string): Promise<void> => {
  const docRef = doc(db, QUIZ_COLLECTION, id);
  await deleteDoc(docRef);
};

export const submitQuizAttempt = async (attemptData: Omit<QuizAttempt, 'id' | 'submittedAt'>): Promise<QuizAttempt> => {
  const fullAttempt = {
    ...attemptData,
    submittedAt: Timestamp.now()
  };
  const docRef = await addDoc(collection(db, ATTEMPT_COLLECTION), fullAttempt);
  return { id: docRef.id, ...fullAttempt };
};

export const fetchQuizAttempts = async (quizId: string, memberId: string): Promise<QuizAttempt[]> => {
  const q = query(collection(db, ATTEMPT_COLLECTION), where('quizId', '==', quizId), where('memberId', '==', memberId), orderBy('submittedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizAttempt));
};
