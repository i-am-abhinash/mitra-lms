import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCourses, mockModules, mockLessons } from '../../mockData';
import { ArrowLeft, PlayCircle, CheckCircle, Circle } from 'lucide-react';
import clsx from 'clsx';

const MemberCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find(c => c.id === courseId) || mockCourses[0];
  const modules = mockModules.filter(m => m.courseId === course.id).sort((a, b) => a.order - b.order);
  const lessons = mockLessons.filter(l => l.courseId === course.id);

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
            72% Completed
          </span>
        </div>
        <p className='text-theme-text-secondary text-lg mb-6'>{course.description}</p>
        
        <div className='w-full bg-theme-surface-higher rounded-full h-2 mb-2'>
          <div className='bg-theme-accent h-2 rounded-full transition-all duration-500' style={{ width: '72%' }}></div>
        </div>
        <button onClick={() => navigate(`/member/learning/lesson/${lessons[0]?.id}`)} className='mt-6 px-6 py-2 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-lg transition-colors font-medium'>
          Continue Learning
        </button>
      </div>

      <div className='space-y-6'>
        <h2 className='text-xl font-bold text-theme-primary'>Course Curriculum</h2>
        {modules.map(module => {
          const moduleLessons = lessons.filter(l => l.moduleId === module.id).sort((a, b) => a.order - b.order);
          return (
            <div key={module.id} className='card overflow-hidden'>
              <div className='p-5 bg-theme-surface-elevated border-b border-theme-border-subtle'>
                <h3 className='font-bold text-theme-primary'>{module.title}</h3>
                <p className='text-sm text-theme-text-secondary mt-1'>{module.description}</p>
              </div>
              <div className='divide-y divide-theme-border-subtle'>
                {moduleLessons.map((lesson, idx) => {
                  const isCompleted = idx === 0;
                  const isCurrent = idx === 1;
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
                      <span className='text-xs text-theme-text-secondary'>10 min</span>
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
