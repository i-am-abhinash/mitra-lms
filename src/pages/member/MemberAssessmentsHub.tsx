import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAssignments } from '../../services/assignmentService';
import { fetchCourses } from '../../services/courseService';
import { fetchQuizzesByCourse } from '../../services/quizService';
import type { Assignment, Quiz } from '../../types';
import { FileText, HelpCircle, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

type Filter = 'All' | 'Assignments' | 'Quizzes';

const MemberAssessmentsHub = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [aData, cData] = await Promise.all([fetchAssignments(), fetchCourses()]);
        setAssignments(aData);
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
    loadData();
  }, []);

  const formatDeadline = (deadline: any) => {
    try {
      const d = ('toDate' in deadline) ? deadline.toDate() : deadline;
      return format(d, 'MMM d, yyyy');
    } catch { return '—'; }
  };

  const showAssignments = filter === 'All' || filter === 'Assignments';
  const showQuizzes = filter === 'All' || filter === 'Quizzes';

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>Assignments & Quizzes</h1>
        <p className='text-theme-text-secondary mt-1'>Your standalone assessments and quizzes</p>
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
          {showAssignments && assignments.map(a => (
            <div
              key={a.id}
              onClick={() => navigate(`/member/assignments/${a.id}`)}
              className='card p-5 flex items-center justify-between cursor-pointer hover:border-theme-accent transition-colors'
            >
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
                  {a.deadline && (
                    <p className='text-xs text-theme-muted mt-1 flex items-center gap-1'>
                      <Calendar size={11} /> Due {formatDeadline(a.deadline)}
                    </p>
                  )}
                </div>
              </div>
              <ArrowRight size={18} className='text-theme-muted' />
            </div>
          ))}

          {showQuizzes && quizzes.map(q => (
            <div
              key={q.id}
              onClick={() => navigate(`/member/quizzes/${q.id}`)}
              className='card p-5 flex items-center justify-between cursor-pointer hover:border-theme-accent transition-colors'
            >
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
                  <p className='text-xs text-theme-muted mt-1'>{q.questions.length} questions</p>
                </div>
              </div>
              <ArrowRight size={18} className='text-theme-muted' />
            </div>
          ))}

          {assignments.length === 0 && quizzes.length === 0 && (
            <div className='card p-12 text-center'>
              <FileText size={48} className='text-theme-muted mb-4 mx-auto' />
              <h3 className='text-lg font-medium text-theme-text'>No assessments yet</h3>
              <p className='text-theme-text-secondary text-sm mt-2'>Check back when your Admin has created assignments or quizzes.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberAssessmentsHub;
