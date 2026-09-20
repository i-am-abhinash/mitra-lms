import { Timestamp } from 'firebase/firestore';

export type Role = 'Admin' | 'Team Leader' | 'Member';

export interface User {
  id?: string;
  email: string;
  name: string;
  role: Role;
  teamId?: string;
  avatarUrl?: string;
}

export interface Team {
  id?: string;
  name: string;
  leaderId: string;
  memberIds: string[];
  createdAt: Timestamp | Date;
}

export interface Course {
  id?: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDurationMins?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  version: number;
  createdAt: Timestamp | Date;
  createdBy: string;
}

export interface Module {
  id?: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
}

export interface Lesson {
  id?: string;
  moduleId: string;
  courseId: string;
  title: string;
  content: string; // Markdown or HTML
  videoUrl?: string; // Optional external video link
  contentVersion: number;
  order: number;
}

export interface Resource {
  id?: string;
  lessonId?: string;
  courseId?: string;
  title: string;
  sourceType: 'URL' | 'STORAGE';
  url: string;
}

export interface Progress {
  id?: string;
  memberId: string;
  courseId: string;
  lessonId: string;
  contentVersion: number;
  status: 'COMPLETED';
  completedAt: Timestamp | Date;
}

export interface Assignment {
  id?: string;
  title: string;
  description: string;
  courseId: string;
  moduleId: string | null;
  deadline: Timestamp | Date;
  maxMarks: number;
  rubricId?: string;
  submissionType: 'FILE' | 'TEXT' | 'URL' | 'GITHUB_REPOSITORY' | 'MULTIPLE';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Timestamp | Date;
  createdBy: string;
}

export interface Submission {
  id?: string;
  assignmentId: string;
  memberId: string;
  teamId: string;
  courseId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'LATE' | 'EVALUATED';
  submittedAt: Timestamp | Date;
  content: string; // URL, text, or file reference
  score?: number;
  feedback?: string;
  evaluatedBy?: string;
  evaluatedAt?: Timestamp | Date;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TEXT';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface Quiz {
  id?: string;
  courseId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimitMinutes?: number;
  passingScore?: number;
  status: 'DRAFT' | 'PUBLISHED';
}

export interface QuizAttempt {
  id?: string;
  quizId: string;
  memberId: string;
  score: number;
  attemptNo: number;
  answers: Record<string, string>;
  submittedAt: Timestamp | Date;
}

export interface Objective {
  id?: string;
  teamId: string;
  period: string; // e.g. "2026-09"
  target: string;
  metricType: string;
}

export interface Constraint {
  id?: string;
  teamId: string;
  objectiveId: string;
  type: string;
  target: number;
  period: string;
  threshold: number;
}

export interface Task {
  id?: string;
  teamId: string;
  objectiveId?: string;
  constraintId?: string;
  title: string;
  deadline: Timestamp | Date;
}

export interface TaskAssignment {
  id?: string;
  taskId: string;
  memberId: string;
  status: 'PENDING' | 'COMPLETED';
  completedAt?: Timestamp | Date;
}

export interface Project {
  id?: string;
  teamId: string;
  objectiveId?: string;
  courseId?: string;
  title: string;
  deadline: Timestamp | Date;
  rubricId?: string;
}

export interface ProjectMilestone {
  id?: string;
  projectId: string;
  title: string;
  deadline: Timestamp | Date;
  status: 'PENDING' | 'COMPLETED';
}

export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'CHANGES_REQUESTED' | 'RESUBMITTED' | 'EVALUATED' | 'ACCEPTED';

export interface ProjectSubmission {
  id?: string;
  projectId: string;
  memberId: string;
  teamId: string;
  githubUrl?: string;
  demoVideoUrl?: string;
  documentation?: string;
  description?: string;
  technologies?: string[];
  reflection?: string;
  challenges?: string;
  improvements?: string;
  status: SubmissionStatus;
  submittedAt?: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-100 (weights across all criteria must sum to 100)
}

export interface Rubric {
  id?: string;
  title: string;
  description: string;
  passingScore: number;
  version: number;
  criteria: RubricCriterion[];
}

export interface Evaluation {
  id?: string;
  submissionId: string;
  rubricId: string;
  rubricVersion: number;
  evaluatorId: string;
  scores: Record<string, number>; // criterionId -> score (0-5)
  feedback: string;
  totalScore: number; // 0-100 weighted
  evaluatedAt: Timestamp | Date;
}

export interface GrowthMetrics {
  userId: string;
  overallGrowth: number; // 0-100
  courseCompletion: number; // 0-100
  assignmentPerformance: number; // 0-100
  attendanceConsistency: number; // 0-100
  skills: Record<string, number>; // e.g., { 'Python': 80, 'Machine Learning': 60 }
  lastUpdated: Timestamp | Date;
}
