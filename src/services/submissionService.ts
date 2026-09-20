import { collection, getDocs, doc, addDoc, updateDoc, getDoc, query, where, Timestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { ProjectSubmission, SubmissionStatus } from '../types';

export const getMemberProjectSubmission = async (projectId: string, memberId: string): Promise<ProjectSubmission | null> => {
  const docId = `${memberId}_${projectId}`;
  const docRef = doc(db, 'project_submissions', docId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as ProjectSubmission;
  }
  return null;
};

export const saveProjectSubmission = async (data: Omit<ProjectSubmission, 'id'>): Promise<void> => {
  const docId = `${data.memberId}_${data.projectId}`;
  await setDoc(doc(db, 'project_submissions', docId), {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const fetchTeamProjectSubmissions = async (teamId: string): Promise<ProjectSubmission[]> => {
  const q = query(collection(db, 'project_submissions'), where('teamId', '==', teamId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectSubmission));
};

export const updateSubmissionStatus = async (submissionId: string, status: SubmissionStatus): Promise<void> => {
  const docRef = doc(db, 'project_submissions', submissionId);
  await updateDoc(docRef, { status, updatedAt: Timestamp.now() });
};
