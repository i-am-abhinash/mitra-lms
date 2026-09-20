import { collection, getDocs, doc, query, where, Timestamp, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { GrowthMetrics, Skill, GrowthSnapshot, ProjectSubmission, Evaluation, TaskAssignment } from '../types';

export const calculateMemberGrowth = async (memberId: string): Promise<GrowthMetrics> => {
  // Fetch Evidence
  const subsSnap = await getDocs(query(collection(db, 'project_submissions'), where('memberId', '==', memberId)));
  const submissions = subsSnap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectSubmission));
  
  const tasksSnap = await getDocs(query(collection(db, 'task_assignments'), where('memberId', '==', memberId)));
  const tasks = tasksSnap.docs.map(d => ({ id: d.id, ...d.data() } as TaskAssignment));

  const evidenceRefs: string[] = [];
  
  let evaluationScoreTotal = 0;
  let evaluationCount = 0;

  // For each submission, fetch its evaluations to calculate assignmentScores
  for (const sub of submissions) {
    if (sub.status === 'EVALUATED' || sub.status === 'ACCEPTED') {
      const evalsSnap = await getDocs(query(collection(db, 'evaluations'), where('submissionId', '==', sub.id)));
      evalsSnap.forEach(e => {
        const ev = e.data() as Evaluation;
        evaluationScoreTotal += ev.totalScore;
        evaluationCount++;
        evidenceRefs.push(`eval:${e.id}`);
      });
    }
  }

  const assignmentScores = evaluationCount > 0 ? Math.round(evaluationScoreTotal / evaluationCount) : 0;
  
  // Tasks participation
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  const participationRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  completedTasks.forEach(t => evidenceRefs.push(`task:${t.id}`));

  // Course Completion (Mocked to 100 for now, could be wired to progressService)
  const courseCompletion = 100;

  // Overall Growth is a weighted average
  const overallGrowth = Math.round((assignmentScores * 0.6) + (participationRate * 0.4));

  return {
    userId: memberId,
    overallGrowth,
    courseCompletion,
    assignmentScores,
    participationRate,
    attendanceConsistency: 100, // mock
    skills: {}, // Deprecated in favor of separate Skills collection
    evidenceRefs,
    lastUpdated: Timestamp.now()
  };
};

export const fetchMemberSkills = async (memberId: string): Promise<Skill[]> => {
  const q = query(collection(db, 'skills'), where('memberId', '==', memberId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
};

export const saveGrowthSnapshot = async (snapshot: Omit<GrowthSnapshot, 'id'>): Promise<void> => {
  await addDoc(collection(db, 'growth'), snapshot);
};

export const fetchGrowthSnapshots = async (memberId: string): Promise<GrowthSnapshot[]> => {
  const q = query(collection(db, 'growth'), where('memberId', '==', memberId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GrowthSnapshot));
};
