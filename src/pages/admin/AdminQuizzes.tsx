import React, { useState, useEffect } from 'react';
import { fetchQuizzesByCourse, createQuiz } from '../../services/quizService';
import { fetchCourses } from '../../services/courseService';
import type { Quiz, Course } from '../../types';
import { Plus, Edit2, Trash2, HelpCircle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: '', description: '', courseId: '', timeLimitMinutes: 30, passingScore: 70 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const cData = await fetchCourses();
      const courseMap = cData.reduce((acc, c) => ({ ...acc, [c.id!]: c }), {});
      setCourses(courseMap);

      // Load all quizzes for all courses (just looping for now)
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const q = await createQuiz({
        ...newQuiz,
        questions: [{ id: 'q1', text: 'Sample Question', type: 'MULTIPLE_CHOICE', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A', points: 10 }],
        status: 'PUBLISHED'
      });
      setQuizzes([...quizzes, q]);
      setIsModalOpen(false);
      setNewQuiz({ title: '', description: '', courseId: '', timeLimitMinutes: 30, passingScore: 70 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-theme-primary'>Quizzes</h1>
          <p className='text-theme-text-secondary mt-1'>Manage your quizzes and questions</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className='flex items-center gap-2 px-4 py-2 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-lg transition-colors font-medium shadow-glow'
        >
          <Plus size={20} /> Create Quiz
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {quizzes.map(quiz => (
          <div key={quiz.id} className='card p-5 group transition-colors hover:border-theme-accent'>
            <div className='flex justify-between items-start mb-3'>
              <span className='text-xs px-2 py-1 rounded-full font-medium bg-theme-present-bg text-theme-present'>
                {quiz.status}
              </span>
              <span className='text-xs font-bold text-theme-primary bg-theme-surface-elevated px-2 py-1 rounded-md'>
                {quiz.questions.length} Questions
              </span>
            </div>
            <h3 className='text-lg font-semibold text-theme-primary mb-1 line-clamp-1'>{quiz.title}</h3>
            <p className='text-xs text-theme-accent mb-3'>{courses[quiz.courseId]?.title}</p>
            <p className='text-sm text-theme-text-secondary line-clamp-2 mb-4'>{quiz.description}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Create New Quiz'>
        <form onSubmit={handleCreate} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Course</label>
            <select required value={newQuiz.courseId} onChange={e => setNewQuiz({...newQuiz, courseId: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none'>
              <option value=''>Select a course...</option>
              {Object.values(courses).map(c => <option key={c.id} value={c.id!}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Title</label>
            <input required type='text' value={newQuiz.title} onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none' />
          </div>
          <div>
            <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Description</label>
            <textarea required value={newQuiz.description} onChange={e => setNewQuiz({...newQuiz, description: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none' />
          </div>
          <button type='submit' className='w-full py-2 bg-theme-accent text-white rounded-lg font-medium'>Create Quiz (with Sample Question)</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminQuizzes;
