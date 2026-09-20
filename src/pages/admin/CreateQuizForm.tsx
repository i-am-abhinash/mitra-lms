import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchCourses } from '../../services/courseService';
import type { Course, QuizQuestion } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const CreateQuizForm = ({ onSubmit, onCancel }: Props) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { id: 'q1', text: '', type: 'MULTIPLE_CHOICE', options: ['', '', '', ''], correctAnswer: '0', points: 5 }
  ]);

  useEffect(() => {
    fetchCourses().then(setCourses);
  }, []);

  const totalMarks = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: `q${Date.now()}`, text: '', type: 'MULTIPLE_CHOICE', options: ['', '', '', ''], correctAnswer: '0', points: 5 }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    const options = [...(updated[qIndex].options || [])];
    options[optIndex] = value;
    updated[qIndex].options = options;
    setQuestions(updated);
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        courseId,
        questions,
        totalMarks,
        status: 'PUBLISHED',
        createdBy: user?.id || ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className='space-y-4 max-h-[70vh] overflow-y-auto px-1'>
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Course</label>
        <select value={courseId} onChange={e => setCourseId(e.target.value)} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors'>
          <option value=''>Standalone / No Course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Quiz Title</label>
        <input required value={title} onChange={e => setTitle(e.target.value)} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' />
      </div>
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Description / Instructions</label>
        <textarea required rows={2} value={description} onChange={e => setDescription(e.target.value)} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors'></textarea>
      </div>

      <div className='border-t border-theme-border-subtle pt-4 mt-4'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-bold text-theme-primary'>Questions</h3>
          <span className='px-3 py-1 bg-theme-accent-light text-theme-accent rounded-full text-sm font-bold'>Total Marks: {totalMarks}</span>
        </div>

        {questions.map((q, qIndex) => (
          <div key={q.id} className='bg-theme-surface-higher p-4 rounded-lg border border-theme-border mb-4 relative'>
            <div className='flex justify-between items-start mb-3'>
              <h4 className='text-sm font-semibold'>Question {qIndex + 1}</h4>
              {questions.length > 1 && (
                <button type='button' onClick={() => handleRemoveQuestion(qIndex)} className='text-theme-muted hover:text-theme-absent transition-colors'>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            
            <div className='space-y-3'>
              <div>
                <label className='block text-xs font-medium text-theme-text-secondary mb-1'>Question Text</label>
                <input required value={q.text} onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)} className='w-full bg-theme-bg border border-theme-border rounded-md p-2 text-sm outline-none focus:border-theme-accent' />
              </div>
              
              <div className='grid grid-cols-2 gap-3'>
                {q.options?.map((opt, optIndex) => (
                  <div key={optIndex} className='flex items-center gap-2'>
                    <input 
                      type='radio' 
                      name={`correct-${qIndex}`} 
                      checked={q.correctAnswer === optIndex.toString() || q.correctAnswer === opt}
                      onChange={() => handleQuestionChange(qIndex, 'correctAnswer', opt)}
                      required
                    />
                    <input 
                      required 
                      value={opt} 
                      onChange={e => {
                        handleOptionChange(qIndex, optIndex, e.target.value);
                        if (q.correctAnswer === q.options![optIndex]) {
                          handleQuestionChange(qIndex, 'correctAnswer', e.target.value);
                        }
                      }} 
                      placeholder={`Option ${optIndex + 1}`}
                      className='flex-1 bg-theme-bg border border-theme-border rounded-md p-2 text-sm outline-none focus:border-theme-accent' 
                    />
                  </div>
                ))}
              </div>

              <div className='w-1/3 pt-2'>
                <label className='block text-xs font-medium text-theme-text-secondary mb-1'>Marks</label>
                <input required type='number' min='1' value={q.points} onChange={e => handleQuestionChange(qIndex, 'points', parseInt(e.target.value) || 0)} className='w-full bg-theme-bg border border-theme-border rounded-md p-2 text-sm outline-none focus:border-theme-accent' />
              </div>
            </div>
          </div>
        ))}

        <button type='button' onClick={handleAddQuestion} className='flex items-center gap-2 text-theme-accent hover:text-theme-accent-hover font-medium text-sm'>
          <Plus size={16} /> Add Question
        </button>
      </div>

      <div className='sticky -bottom-5 -mx-5 -mb-5 px-5 py-4 bg-theme-surface border-t border-theme-border-subtle flex justify-end gap-3 mt-6'>
        <button type='button' onClick={onCancel} className='px-4 py-2 rounded-lg text-theme-text-secondary hover:bg-theme-surface-higher transition-colors'>Cancel</button>
        <button type='submit' disabled={isSubmitting} className='px-4 py-2 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white transition-colors shadow-glow disabled:opacity-50'>{isSubmitting ? 'Saving...' : 'Create Quiz'}</button>
      </div>
    </form>
  );
};
