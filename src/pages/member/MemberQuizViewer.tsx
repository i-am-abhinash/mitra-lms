import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuizAttempt, fetchQuizAttempts } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';
import type { Quiz, QuizAttempt } from '../../types';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';
import { Timestamp } from 'firebase/firestore';

const MemberQuizViewer = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    if (quizId && user) {
      loadData();
    }
  }, [quizId, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const qData = await getQuiz(quizId!);
      if (qData) {
        setQuiz(qData);
        const aData = await fetchQuizAttempts(quizId!, user!.id!);
        setAttempts(aData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (!quiz || !user) return;
    setSubmitting(true);
    try {
      let score = 0;
      quiz.questions.forEach(q => {
        if (q.type === 'MULTIPLE_CHOICE' && q.correctAnswer === answers[q.id]) {
          score += q.points;
        }
      });

      const attemptNo = attempts.length + 1;
      const attempt = await submitQuizAttempt({
        quizId: quiz.id!,
        memberId: user.id!,
        score,
        attemptNo,
        answers
      });
      
      setCurrentScore(score);
      setAttempts([attempt, ...attempts]);
      setShowResults(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading quiz...</div>;
  if (!quiz) return <div className='p-12 text-center text-theme-absent'>Quiz not found</div>;

  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  if (showResults) {
    const passed = currentScore >= (quiz.passingScore || 0);
    return (
      <div className='max-w-3xl mx-auto'>
        <div className='card p-12 text-center'>
          {passed ? (
            <CheckCircle size={64} className='mx-auto text-theme-present mb-6' />
          ) : (
            <XCircle size={64} className='mx-auto text-theme-absent mb-6' />
          )}
          <h1 className='text-3xl font-bold text-theme-primary mb-2'>
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </h1>
          <p className='text-theme-text-secondary mb-8'>You scored {currentScore} out of {totalPoints} points.</p>
          
          <div className='flex justify-center gap-4'>
            <button 
              onClick={() => { setShowResults(false); setAnswers({}); }}
              className='px-6 py-2 border border-theme-border rounded-lg font-medium hover:bg-theme-surface-higher'
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/member/quizzes')}
              className='px-6 py-2 bg-theme-accent text-white rounded-lg font-medium'
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <button 
        onClick={() => navigate('/member/quizzes')}
        className='flex items-center gap-2 text-theme-text-secondary hover:text-theme-primary mb-6 transition-colors'
      >
        <ArrowLeft size={16} /> Back to Quizzes
      </button>

      <div className='card p-8 mb-8'>
        <h1 className='text-3xl font-bold text-theme-primary mb-2'>{quiz.title}</h1>
        <p className='text-theme-text-secondary'>{quiz.description}</p>
        
        <div className='flex items-center gap-6 mt-6 pt-6 border-t border-theme-border-subtle'>
          <div className='text-sm'>
            <span className='block text-theme-text-secondary mb-1'>Questions</span>
            <span className='font-bold text-theme-text'>{quiz.questions.length}</span>
          </div>
          <div className='text-sm'>
            <span className='block text-theme-text-secondary mb-1'>Time Limit</span>
            <span className='font-bold text-theme-text'>{quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} min` : 'None'}</span>
          </div>
          <div className='text-sm'>
            <span className='block text-theme-text-secondary mb-1'>Passing Score</span>
            <span className='font-bold text-theme-text'>{quiz.passingScore || 0} / {totalPoints}</span>
          </div>
          <div className='text-sm'>
            <span className='block text-theme-text-secondary mb-1'>Previous Attempts</span>
            <span className='font-bold text-theme-text'>{attempts.length}</span>
          </div>
        </div>
      </div>

      <div className='space-y-6 mb-8'>
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className='card p-6'>
            <div className='flex justify-between items-start mb-4'>
              <h3 className='text-lg font-medium text-theme-primary'>
                <span className='text-theme-accent mr-2'>{idx + 1}.</span>
                {q.text}
              </h3>
              <span className='text-xs font-bold text-theme-muted bg-theme-surface-elevated px-2 py-1 rounded'>
                {q.points} pts
              </span>
            </div>

            {q.type === 'MULTIPLE_CHOICE' && q.options && (
              <div className='space-y-3 mt-4'>
                {q.options.map((opt, i) => (
                  <label 
                    key={i} 
                    className={clsx(
                      'flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors',
                      answers[q.id] === opt 
                        ? 'border-theme-accent bg-theme-accent/5' 
                        : 'border-theme-border-subtle hover:bg-theme-surface-higher'
                    )}
                  >
                    <input 
                      type='radio' 
                      name={q.id} 
                      value={opt} 
                      checked={answers[q.id] === opt}
                      onChange={() => handleOptionSelect(q.id, opt)}
                      className='text-theme-accent focus:ring-theme-accent'
                    />
                    <span className={clsx(answers[q.id] === opt ? 'text-theme-primary font-medium' : 'text-theme-text')}>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            )}
            {q.type === 'TEXT' && (
              <textarea 
                value={answers[q.id] || ''}
                onChange={e => handleOptionSelect(q.id, e.target.value)}
                className='w-full mt-2 p-3 bg-theme-surface-higher border border-theme-border-subtle rounded-lg text-theme-text focus:border-theme-accent outline-none min-h-[100px]'
                placeholder='Type your answer here...'
              />
            )}
          </div>
        ))}
      </div>

      <div className='flex justify-end'>
        <button 
          onClick={handleSubmit}
          disabled={submitting || Object.keys(answers).length < quiz.questions.length}
          className='px-8 py-3 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-lg font-bold shadow-glow disabled:opacity-50 transition-all'
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default MemberQuizViewer;
