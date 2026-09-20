import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse } from '../../services/courseService';
import { fetchModulesByCourse } from '../../services/moduleService';
import { fetchLessonsByCourse } from '../../services/lessonService';
import { getMemberProgress } from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';
import type { Course, Module, Lesson, Progress } from '../../types';
import { ArrowLeft, PlayCircle, CheckCircle, Circle } from 'lucide-react';
import clsx from 'clsx';

const MemberCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId && user) {
      loadData();
    }
  }, [courseId, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cData, mData, lData, pData] = await Promise.all([
        getCourse(courseId!),
        fetchModulesByCourse(courseId!),
        fetchLessonsByCourse(courseId!),
        getMemberProgress(user!.id!, courseId!)
      ]);
      setCourse(cData);
      setModules(mData.sort((a, b) => a.order - b.order));
      setLessons(lData.sort((a, b) => a.order - b.order));
      setProgress(pData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading curriculum...</div>;
  if (!course) return <div className='p-12 text-center text-theme-absent'>Course not found</div>;

  const completedLessonIds = new Set(progress.map(p => p.lessonId));
  const completionPercent = lessons.length > 0 ? Math.round((completedLessonIds.size / lessons.length) * 100) : 0;
  
  const firstIncompleteLesson = lessons.find(l => !completedLessonIds.has(l.id!));
  const nextLessonId = firstIncompleteLesson ? firstIncompleteLesson.id : lessons[0]?.id;

  return (
    <div className='max-w-4xl mx-auto'>
      <button 
        onClick={() => navigate('/member/learning')}
        className='flex items-center gap-2 text-theme-text-secondary hover:text-theme-primary mb-6 transition-colors'
      >
        <ArrowLeft size={16} /> Back to Learning
      </button>

      <div className='card p-8 mb-8'>
        <div className='flex justify-between items-start mb-4'>
          <h1 className='text-3xl font-bold text-theme-primary'>{course.title}</h1>
          <span className='px-3 py-1 bg-theme-accent-light text-theme-accent rounded-full text-sm font-medium'>
            {completionPercent}% Completed
          </span>
        </div>
        <p className='text-theme-text-secondary text-lg mb-6'>{course.description}</p>
        
        <div className='w-full bg-theme-surface-higher rounded-full h-2 mb-2 overflow-hidden'>
          <div className='bg-theme-accent h-2 transition-all duration-500' style={{ width: `${completionPercent}%` }}></div>
        </div>
        {nextLessonId && (
          <button 
            onClick={() => navigate(`/member/learning/lesson/${nextLessonId}`)} 
            className='mt-6 px-6 py-2 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-lg transition-colors font-medium'
          >
            {completedLessonIds.size === 0 ? 'Start Learning' : completionPercent === 100 ? 'Review Course' : 'Continue Learning'}
          </button>
        )}
      </div>

      <div className='space-y-6'>
        <h2 className='text-xl font-bold text-theme-primary'>Course Curriculum</h2>
        {modules.map(module => {
          const moduleLessons = lessons.filter(l => l.moduleId === module.id);
          return (
            <div key={module.id} className='card overflow-hidden'>
              <div className='p-5 bg-theme-surface-elevated border-b border-theme-border-subtle'>
                <h3 className='font-bold text-theme-primary'>{module.title}</h3>
                <p className='text-sm text-theme-text-secondary mt-1'>{module.description}</p>
              </div>
              <div className='divide-y divide-theme-border-subtle'>
                {moduleLessons.map((lesson) => {
                  const isCompleted = completedLessonIds.has(lesson.id!);
                  const isCurrent = lesson.id === nextLessonId;
                  
                  return (
                    <div 
                      key={lesson.id} 
                      onClick={() => navigate(`/member/learning/lesson/${lesson.id}`)}
                      className={clsx(
                        'p-4 flex items-center justify-between cursor-pointer transition-colors',
                        isCurrent ? 'bg-theme-accent-light hover:bg-theme-surface-higher' : 'hover:bg-theme-surface-higher'
                      )}
                    >
                      <div className='flex items-center gap-3'>
                        {isCompleted ? <CheckCircle size={18} className='text-theme-present' /> : 
                         isCurrent ? <PlayCircle size={18} className='text-theme-accent' /> : 
                         <Circle size={18} className='text-theme-muted' />}
                        <span className={clsx('font-medium', isCurrent ? 'text-theme-accent' : 'text-theme-primary')}>
                          {lesson.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberCourseDetail;
