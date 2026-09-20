import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, getDoc, query, where, orderBy, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Objective, Constraint, Task, TaskAssignment, Project, ProjectMilestone } from '../types';

export const fetchTeamObjectives = async (teamId: string): Promise<Objective[]> => {
  const q = query(collection(db, 'objectives'), where('teamId', '==', teamId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Objective));
};

export const createObjective = async (data: Omit<Objective, 'id'>): Promise<Objective> => {
  const docRef = await addDoc(collection(db, 'objectives'), data);
  return { id: docRef.id, ...data };
};

export const fetchTeamTasks = async (teamId: string): Promise<Task[]> => {
  const q = query(collection(db, 'tasks'), where('teamId', '==', teamId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

export const createTask = async (data: Omit<Task, 'id'>): Promise<Task> => {
  const docRef = await addDoc(collection(db, 'tasks'), data);
  return { id: docRef.id, ...data };
};

export const assignTask = async (taskId: string, memberId: string): Promise<TaskAssignment> => {
  const data: Omit<TaskAssignment, 'id'> = {
    taskId,
    memberId,
    status: 'PENDING'
  };
  const docRef = await addDoc(collection(db, 'task_assignments'), data);
  return { id: docRef.id, ...data };
};

export const fetchMemberTaskAssignments = async (memberId: string): Promise<TaskAssignment[]> => {
  const q = query(collection(db, 'task_assignments'), where('memberId', '==', memberId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TaskAssignment));
};

export const updateTaskStatus = async (assignmentId: string, status: 'PENDING' | 'COMPLETED'): Promise<void> => {
  const docRef = doc(db, 'task_assignments', assignmentId);
  await updateDoc(docRef, { 
    status,
    completedAt: status === 'COMPLETED' ? Timestamp.now() : null 
  });
};

export const fetchTeamProjects = async (teamId: string): Promise<Project[]> => {
  const q = query(collection(db, 'projects'), where('teamId', '==', teamId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

export const createProject = async (data: Omit<Project, 'id'>): Promise<Project> => {
  const docRef = await addDoc(collection(db, 'projects'), data);
  return { id: docRef.id, ...data };
};
