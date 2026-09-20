import React from 'react';
import type { Assignment, Course } from '../../types';
import { FileText, Calendar, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

interface Props {
  assignment: Assignment;
  course?: Course;
  status?: 'PENDING' | 'DRAFT' | 'SUBMITTED' | 'LATE' | 'EVALUATED';
  score?: number;
  onClick?: () => void;
}

export const AssignmentCard = ({ assignment, course, status, score, onClick }: Props) => {
  const getStatusColor = () => {
    switch(status) {
      case 'DRAFT': return 'bg-yellow-500/10 text-yellow-500';
      case 'SUBMITTED': return 'bg-theme-present-bg text-theme-present';
      case 'LATE': return 'bg-theme-absent-bg text-theme-absent';
      case 'EVALUATED': return 'bg-theme-accent-light text-theme-accent';
      default: return 'bg-theme-surface-elevated text-theme-text-secondary';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={clsx(
        'card p-5 group flex flex-col transition-colors h-full',
        onClick ? 'cursor-pointer hover:border-theme-accent' : ''
      )}
    >
      <div className='flex justify-between items-start mb-3'>
        <span className={clsx('text-xs px-2 py-1 rounded-full font-medium', getStatusColor())}>
          {status || 'Upcoming'}
        </span>
        <span className='text-xs font-bold text-theme-primary bg-theme-surface-elevated px-2 py-1 rounded-md'>
          {score !== undefined ? `${score} / ${assignment.maxMarks}` : `${assignment.maxMarks} pts`}
        </span>
      </div>
      
      <h3 className='text-base font-semibold text-theme-primary mb-1 line-clamp-1'>{assignment.title}</h3>
      {course && <p className='text-xs text-theme-accent mb-3'>{course.title}</p>}
      
      <p className='text-sm text-theme-text-secondary line-clamp-2 mb-4 flex-1'>{assignment.description}</p>
      
      <div className='flex items-center justify-between text-xs text-theme-muted mt-auto pt-3 border-t border-theme-border-subtle'>
        <div className='flex items-center gap-1'>
          <Calendar size={14} /> 
          Due {format((assignment.deadline as any).toDate ? (assignment.deadline as any).toDate() : assignment.deadline, 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  );
};
