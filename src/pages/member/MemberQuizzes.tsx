import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCourses } from '../../services/courseService';
import { fetchQuizzesByCourse, fetchQuizAttempts } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';
import type { Quiz, QuizAttempt, Course } from '../../types';
import { HelpCircle, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

const MemberQuizzes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [attempts, setAttempts] = useState<Record<string, QuizAttempt[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const cData = await fetchCourses();
      const courseMap = cData.reduce((acc, c) => ({ ...acc, [c.id!]: c }), {});
      setCourses(courseMap);

      let allQuizzes: Quiz[] = [];
      let allAttempts: Record<string, QuizAttempt[]> = {};
      
      for (const course of cData) {
        const qList = await fetchQuizzesByCourse(course.id!);
        const published = qList.filter(q => q.status === 'PUBLISHED');
        allQuizzes = [...allQuizzes, ...published];

        for (const q of published) {
          const a = await fetchQuizAttempts(q.id!, user!.id!);
          allAttempts[q.id!] = a;
        }
      }
      setQuizzes(allQuizzes);
      setAttempts(allAttempts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading quizzes...</div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>Quizzes</h1>
        <p className='text-theme-text-secondary mt-1'>Test your knowledge</p>
      </div>

      {quizzes.length === 0 ? (
        <div className='text-center py-12 text-theme-muted border-2 border-dashed border-theme-border-active rounded-lg'>
          No quizzes available.
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {quizzes.map(quiz => {
            const quizAttempts = attempts[quiz.id!] || [];
            const highestScore = quizAttempts.reduce((max, a) => Math.max(max, a.score), 0);
            const isPassed = highestScore >= (quiz.passingScore || 0);

            return (
              <div 
                key={quiz.id} 
                onClick={() => navigate(`/member/quizzes/${quiz.id}`)}
                className='card p-5 group cursor-pointer hover:border-theme-accent transition-colors'
              >
                <div className='flex justify-between items-start mb-3'>
                  <span className='text-xs px-2 py-1 rounded-full font-medium bg-theme-surface-elevated text-theme-text-secondary'>
                    {quiz.questions.length} Questions
                  </span>
                  {quizAttempts.length > 0 && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${isPassed ? 'bg-theme-present-bg text-theme-present' : 'bg-theme-absent-bg text-theme-absent'}`}>
                      Best: {highestScore} / {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
                    </span>
                  )}
                </div>
                
                <h3 className='text-lg font-semibold text-theme-primary mb-1 line-clamp-1'>{quiz.title}</h3>
                <p className='text-xs text-theme-accent mb-3'>{courses[quiz.courseId]?.title}</p>
                
                <p className='text-sm text-theme-text-secondary line-clamp-2 mb-4 h-10'>
                  {quiz.description}
                </p>

                <div className='flex items-center justify-between text-xs text-theme-muted mt-4 pt-4 border-t border-theme-border-subtle'>
                  <div className='flex items-center gap-1'>
                    <Clock size={14} /> 
                    {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} min` : 'No Limit'}
                  </div>
                  <div className='flex items-center gap-1'>
                    <HelpCircle size={14} /> 
                    {quiz.passingScore ? `Pass: ${quiz.passingScore}` : 'No Pass req.'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemberQuizzes;
