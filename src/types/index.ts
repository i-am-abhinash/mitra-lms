import { Timestamp } from 'firebase/firestore';

export type Role = 'Admin' | 'Team Leader' | 'Member';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  teamId: string | null;
}

export interface Team {
  id: string;
  name: string;
}

export interface Course {
  id?: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  thumbnailUrl: string | null;
  estimatedDurationMins: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy: string;
}

export interface Module {
  id?: string;
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
}

export interface Lesson {
  id?: string;
  courseId: string;
  moduleId: string;
  title: string;
  type: 'VIDEO' | 'READING' | 'RESOURCE';
  content: string;
  videoUrl: string | null;
  orderIndex: number;
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
  teamId: string | null;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'LATE' | 'UNDER_REVIEW' | 'EVALUATED';
  submittedAt: Timestamp | Date | null;
  content: {
    text?: string;
    url?: string;
    githubRepo?: string;
    fileUrls?: string[];
  };
}

export interface Evaluation {
  id?: string;
  submissionId: string;
  memberId: string;
  evaluatorId: string;
  marks: number;
  rubricScores: Record<string, number>;
  feedback: string;
  evaluatedAt: Timestamp | Date;
}
