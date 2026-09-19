import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssignmentCard } from '../../components/lms/AssignmentCard';
import { mockAssignments, mockCourses, mockSubmissions } from '../../mockData';
import clsx from 'clsx';

const MemberAssignments = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  
  const filters = [
    { id: 'ALL', name: 'All Assignments' },
    { id: 'PENDING', name: 'Pending' },
    { id: 'SUBMITTED', name: 'Submitted' },
    { id: 'EVALUATED', name: 'Evaluated' }
  ];

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>Assignments</h1>
        <p className='text-theme-text-secondary mt-1'>Manage your course work</p>
      </div>

      <div className='mb-6 flex gap-2 overflow-x-auto pb-2'>
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              filter === f.id 
                ? 'bg-theme-accent text-white' 
                : 'bg-theme-surface-higher text-theme-text-secondary hover:text-theme-primary hover:bg-theme-surface-elevated'
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        {mockAssignments.map(assignment => {
          const course = mockCourses.find(c => c.id === assignment.courseId);
          const sub = mockSubmissions.find(s => s.assignmentId === assignment.id);
          const status = sub ? sub.status : 'PENDING';
          
          if (filter !== 'ALL' && status !== filter) return null;

          return (
            <AssignmentCard 
              key={assignment.id} 
              assignment={assignment} 
              course={course}
              status={status as any}
              score={sub?.score}
              onClick={() => navigate(`/member/assignments/${assignment.id}`)} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default MemberAssignments;
