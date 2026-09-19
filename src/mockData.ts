import type { User, Team, Course, Module, Lesson, Assignment, Submission, Quiz, GrowthMetrics } from './types';

export const mockUsers: User[] = [
  { id: 'admin1', name: 'Abhinash', email: 'admin@mitra.com', role: 'Admin' },
  { id: 'leader1', name: 'Gowri', email: 'leader@mitra.com', role: 'Team Leader', teamId: 'team1' },
  { id: 'member1', name: 'Akhil', email: 'akhil@mitra.com', role: 'Member', teamId: 'team1' },
  { id: 'member2', name: 'Rahul', email: 'rahul@mitra.com', role: 'Member', teamId: 'team2' }
];

export const mockTeams: Team[] = [
  { id: 'team1', name: 'AIML-A', leaderId: 'leader1', memberIds: ['member1'], createdAt: new Date() },
  { id: 'team2', name: 'Web Development', leaderId: 'admin1', memberIds: ['member2'], createdAt: new Date() }
];

export const mockCourses: Course[] = [
  { id: 'c1', title: 'Python for AI', description: 'Core Python concepts for ML.', status: 'PUBLISHED', createdBy: 'admin1', createdAt: new Date() },
  { id: 'c2', title: 'Machine Learning Fundamentals', description: 'Intro to sklearn and classic algorithms.', status: 'PUBLISHED', createdBy: 'admin1', createdAt: new Date() },
  { id: 'c3', title: 'Deep Learning', description: 'Neural networks with PyTorch.', status: 'DRAFT', createdBy: 'admin1', createdAt: new Date() }
];

export const mockModules: Module[] = [
  { id: 'm1', courseId: 'c1', title: 'Python Basics', description: 'Syntax and variables', order: 1 },
  { id: 'm2', courseId: 'c1', title: 'NumPy & Pandas', description: 'Data manipulation', order: 2 }
];

export const mockLessons: Lesson[] = [
  { id: 'l1', courseId: 'c1', moduleId: 'm1', title: 'Introduction to Python', content: 'Python is a high-level language...', order: 1 },
  { id: 'l2', courseId: 'c1', moduleId: 'm1', title: 'Data Types', content: 'Strings, ints, floats...', order: 2 }
];

export const mockAssignments: Assignment[] = [
  { id: 'a1', courseId: 'c1', moduleId: 'm2', title: 'Data Cleaning Project', description: 'Clean the provided CSV file using Pandas.', deadline: new Date(Date.now() + 86400000 * 3), maxMarks: 100, submissionType: 'GITHUB_REPOSITORY', status: 'PUBLISHED', createdBy: 'admin1', createdAt: new Date() }
];

export const mockSubmissions: Submission[] = [
  { id: 's1', assignmentId: 'a1', memberId: 'member1', teamId: 'team1', courseId: 'c1', status: 'EVALUATED', submittedAt: new Date(Date.now() - 86400000), content: 'https://github.com/akhil/pandas-clean', score: 85, feedback: 'Good job, watch out for null values.', evaluatedBy: 'leader1', evaluatedAt: new Date() }
];

export const mockQuizzes: Quiz[] = [
  { id: 'q1', courseId: 'c1', title: 'Python Syntax Quiz', description: 'Test your knowledge on basic Python syntax.', timeLimitMinutes: 15, passingScore: 70, status: 'PUBLISHED' }
];

export const mockGrowth: GrowthMetrics[] = [
  { userId: 'member1', overallGrowth: 78, courseCompletion: 65, assignmentPerformance: 85, attendanceConsistency: 90, skills: { 'Python': 80, 'Pandas': 60 }, lastUpdated: new Date() }
];
