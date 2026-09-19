import React from 'react';
import { EmptyState } from '../../components/lms/EmptyState';
import { HelpCircle } from 'lucide-react';

const MemberQuizzes = () => {
  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>Quizzes</h1>
        <p className='text-theme-text-secondary mt-1'>Assess your knowledge</p>
      </div>
      <EmptyState 
        icon={<HelpCircle size={48} />} 
        title='No Quizzes Available' 
        description='There are currently no active quizzes for your courses.' 
      />
    </div>
  );
};
export default MemberQuizzes;
