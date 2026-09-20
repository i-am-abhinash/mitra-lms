import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, getDoc, query, where, orderBy, Timestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Assignment, Submission } from '../types';

const COLLECTION = 'assignments';
const SUBMISSION_COLLECTION = 'assignment_submissions';

export const fetchAssignments = async (courseId?: string): Promise<Assignment[]> => {
  let q;
  if (courseId) {
    q = query(collection(db, COLLECTION), where('courseId', '==', courseId));
  } else {
    q = query(collection(db, COLLECTION));
  }
  const snapshot = await getDocs(q);
  // Sort manually to avoid needing a composite index immediately for V1 prototyping
  const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));
  return docs.sort((a, b) => (b.deadline as Timestamp).seconds - (a.deadline as Timestamp).seconds);
};

export const getAssignment = async (id: string): Promise<Assignment | null> => {
  const docRef = doc(db, COLLECTION, id);
  const snap = await getDoc(docRef);
  if (snap.exists()) return { id: snap.id, ...snap.data() } as Assignment;
  return null;
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

// --- Submissions ---

export const saveSubmission = async (submissionData: Omit<Submission, 'id'>): Promise<void> => {
  // Use composite ID so users can repeatedly draft and then finally submit
  const submissionId = `${submissionData.memberId}_${submissionData.assignmentId}`;
  const docRef = doc(db, SUBMISSION_COLLECTION, submissionId);
  await setDoc(docRef, submissionData, { merge: true });
};

export const getMemberSubmission = async (memberId: string, assignmentId: string): Promise<Submission | null> => {
  const submissionId = `${memberId}_${assignmentId}`;
  const docRef = doc(db, SUBMISSION_COLLECTION, submissionId);
  const snap = await getDoc(docRef);
  if (snap.exists()) return { id: snap.id, ...snap.data() } as Submission;
  return null;
};
