import { collection, getDocs, doc, setDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Progress } from '../types';

const COLLECTION = 'progress';

export const getMemberProgress = async (memberId: string, courseId: string): Promise<Progress[]> => {
  const q = query(
    collection(db, COLLECTION), 
    where('memberId', '==', memberId),
    where('courseId', '==', courseId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Progress));
};

export const markLessonComplete = async (
  memberId: string, 
  courseId: string, 
  lessonId: string, 
  contentVersion: number
): Promise<void> => {
  // Use a predictable composite ID so we can just upsert
  const progressId = `${memberId}_${lessonId}`;
  const docRef = doc(db, COLLECTION, progressId);
  
  const progressData: Omit<Progress, 'id'> = {
    memberId,
    courseId,
    lessonId,
    contentVersion,
    status: 'COMPLETED',
    completedAt: Timestamp.now()
  };

  await setDoc(docRef, progressData, { merge: true });
};
