import React from 'react';
import type { Course } from '../../types';
import { BookOpen, Clock, Users } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  course: Course;
  progress?: number;
  onClick?: () => void;
}

export const CourseCard = ({ course, progress, onClick }: Props) => {
  return (
    <div 
      onClick={onClick}
      className={clsx(
        'card p-5 group flex flex-col transition-colors h-full',
        onClick ? 'cursor-pointer hover:border-theme-accent' : ''
      )}
    >
      <div className='flex justify-between items-start mb-3'>
        <span className={clsx(
          'text-xs px-2 py-1 rounded-full font-medium',
          course.status === 'PUBLISHED' ? 'bg-theme-present-bg text-theme-present' : 'bg-theme-late-bg text-theme-late'
        )}>
          {course.status}
        </span>
      </div>
      <h3 className='text-lg font-bold text-theme-primary mb-2 line-clamp-2'>{course.title}</h3>
      <p className='text-sm text-theme-text-secondary line-clamp-2 mb-6 flex-1'>{course.description}</p>
      
      {progress !== undefined && (
        <div className='mb-4'>
          <div className='flex justify-between text-xs mb-1'>
            <span className='text-theme-text-secondary'>Progress</span>
            <span className='text-theme-primary font-medium'>{progress}%</span>
          </div>
          <div className='w-full bg-theme-surface-higher rounded-full h-1.5'>
            <div className='bg-theme-accent h-1.5 rounded-full transition-all duration-500' style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
      
      <div className='flex items-center gap-4 text-xs text-theme-muted mt-auto pt-4 border-t border-theme-border-subtle'>
        <div className='flex items-center gap-1'><BookOpen size={14} /> Modules</div>
        <div className='flex items-center gap-1'><Users size={14} /> Enrolled</div>
      </div>
    </div>
  );
};
