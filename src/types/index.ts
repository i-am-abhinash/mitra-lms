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
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
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
  videoUrl?: string;
  order: number;
}

export interface Assignment {
  id?: string;
  title: string;
  description: string;
  courseId: string;
  moduleId: string | null;
  deadline: Timestamp | Date;
  maxMarks: number;
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
  status: 'SUBMITTED' | 'LATE' | 'EVALUATED';
  submittedAt: Timestamp | Date;
  content: string; // URL, text, or file reference
  score?: number;
  feedback?: string;
  evaluatedBy?: string;
  evaluatedAt?: Timestamp | Date;
}

export interface Quiz {
  id?: string;
  courseId: string;
  title: string;
  description: string;
  timeLimitMinutes?: number;
  passingScore?: number;
  status: 'DRAFT' | 'PUBLISHED';
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
