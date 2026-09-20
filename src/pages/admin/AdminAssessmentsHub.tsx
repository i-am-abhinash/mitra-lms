import React, { useEffect, useState } from 'react';
import { fetchAssignments, deleteAssignment, createAssignment } from '../../services/assignmentService';
import { fetchCourses } from '../../services/courseService';
import { fetchQuizzesByCourse, createQuiz } from '../../services/quizService';
import type { Assignment, Quiz, Course } from '../../types';
import { Plus, FileText, HelpCircle, Trash2, Calendar, GitBranch, UploadCloud, ChevronDown } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { CreateAssignmentForm } from './CreateAssignmentForm';
import { CreateQuizForm } from './CreateQuizForm';
import { format } from 'date-fns';

type Filter = 'All' | 'Assignments' | 'Quizzes';

const AdminAssessmentsHub = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('All');

  // Modals
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [aData, cData] = await Promise.all([fetchAssignments(), fetchCourses()]);
      setAssignments(aData);
      const courseMap = cData.reduce((acc, c) => ({ ...acc, [c.id!]: c }), {} as Record<string, Course>);
      setCourses(courseMap);

      let allQuizzes: Quiz[] = [];
      for (const course of cData) {
        const q = await fetchQuizzesByCourse(course.id!);
        allQuizzes = [...allQuizzes, ...q];
      }
      setQuizzes(allQuizzes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (window.confirm('Delete this assignment?')) {
      await deleteAssignment(id);
      loadData();
    }
  };

  const handleCreateAssignment = async (data: any) => {
    await createAssignment(data);
    setIsAssignmentModalOpen(false);
    loadData();
  };

  const handleCreateQuiz = async (data: any) => {
    try {
      await createQuiz(data);
      setIsQuizModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const showAssignments = filter === 'All' || filter === 'Assignments';
  const showQuizzes = filter === 'All' || filter === 'Quizzes';

  const formatDeadline = (deadline: any) => {
    try {
      const d = ('toDate' in deadline) ? deadline.toDate() : deadline;
      return format(d, 'MMM d, yyyy');
    } catch { return '—'; }
  };

  return (
    <div className='max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-theme-primary'>Assignments & Quizzes</h1>
          <p className='text-theme-text-secondary text-sm mt-1'>Manage standalone assessments for all members</p>
        </div>
        <div className='relative'>
          <button
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            className='flex items-center gap-2 bg-theme-accent hover:bg-theme-accent-hover text-white px-4 py-2 rounded-lg transition-colors shadow-glow'
          >
            <Plus size={18} /> Create Assessment <ChevronDown size={16} />
          </button>
          {showTypeMenu && (
            <div className='absolute right-0 top-full mt-2 w-48 bg-theme-surface-elevated border border-theme-border rounded-xl shadow-float z-10'>
              <button
                onClick={() => { setShowTypeMenu(false); setIsAssignmentModalOpen(true); }}
                className='w-full flex items-center gap-3 px-4 py-3 hover:bg-theme-surface-higher rounded-t-xl transition-colors text-left'
              >
                <FileText size={16} className='text-theme-accent' />
                <span className='text-theme-text font-medium'>Assignment</span>
              </button>
              <button
                onClick={() => { setShowTypeMenu(false); setIsQuizModalOpen(true); }}
                className='w-full flex items-center gap-3 px-4 py-3 hover:bg-theme-surface-higher rounded-b-xl transition-colors text-left'
              >
                <HelpCircle size={16} className='text-theme-accent' />
                <span className='text-theme-text font-medium'>Quiz</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className='flex gap-2 mb-6'>
        {(['All', 'Assignments', 'Quizzes'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-theme-accent text-white' : 'bg-theme-surface-higher text-theme-text-secondary hover:bg-theme-border'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className='flex justify-center p-12'><div className='animate-pulse text-theme-accent'>Loading...</div></div>
      ) : (
        <div className='space-y-3'>
          {/* Assignments */}
          {showAssignments && assignments.map(a => (
            <div key={a.id} className='card p-5 flex items-center justify-between hover:border-theme-accent transition-colors'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-lg bg-theme-accent-light flex items-center justify-center'>
                  <FileText size={18} className='text-theme-accent' />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-semibold text-theme-primary'>{a.title}</h3>
                    <span className='text-xs px-2 py-0.5 rounded-full bg-theme-surface-elevated text-theme-text-secondary'>Assignment</span>
                  </div>
                  <p className='text-sm text-theme-text-secondary mt-0.5 line-clamp-1'>{a.description}</p>
                  <div className='flex items-center gap-3 mt-1 text-xs text-theme-muted'>
                    <span className='flex items-center gap-1'>
                      {a.submissionType === 'GITHUB_REPOSITORY' ? <GitBranch size={12} /> : <UploadCloud size={12} />}
                      {(a.submissionType || '').replace('_', ' ')}
                    </span>
                    <span className='flex items-center gap-1'><Calendar size={12} /> {formatDeadline(a.deadline)}</span>
                    <span className='font-medium text-theme-accent'>{a.maxMarks} pts</span>
                  </div>
                </div>
              </div>
              <button onClick={() => handleDeleteAssignment(a.id!)} className='p-2 text-theme-muted hover:text-theme-absent hover:bg-theme-absent-bg rounded-lg transition-colors'>
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* Quizzes */}
          {showQuizzes && quizzes.map(q => (
            <div key={q.id} className='card p-5 flex items-center justify-between hover:border-theme-accent transition-colors'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-lg bg-theme-surface-elevated flex items-center justify-center'>
                  <HelpCircle size={18} className='text-theme-accent' />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-semibold text-theme-primary'>{q.title}</h3>
                    <span className='text-xs px-2 py-0.5 rounded-full bg-theme-present-bg text-theme-present'>Quiz</span>
                  </div>
                  <p className='text-sm text-theme-text-secondary mt-0.5'>{q.description}</p>
                  <div className='text-xs text-theme-muted mt-1'>
                    {q.questions.length} questions · {courses[q.courseId]?.title || 'Standalone'}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {!loading && assignments.length === 0 && quizzes.length === 0 && (
            <div className='card p-12 flex flex-col items-center justify-center text-center'>
              <FileText size={48} className='text-theme-muted mb-4' />
              <h3 className='text-lg font-medium text-theme-text'>No assessments yet</h3>
              <p className='text-theme-text-secondary text-sm mt-2'>Create an Assignment or Quiz to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Assignment Modal */}
      <Modal isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)} title='Create New Assignment'>
        <CreateAssignmentForm onCancel={() => setIsAssignmentModalOpen(false)} onSubmit={handleCreateAssignment} />
      </Modal>

      {/* Quiz Modal */}
      <Modal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} title='Create New Quiz'>
        <CreateQuizForm onCancel={() => setIsQuizModalOpen(false)} onSubmit={handleCreateQuiz} />
      </Modal>
    </div>
  );
};

export default AdminAssessmentsHub;
