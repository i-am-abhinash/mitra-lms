import React from 'react';
import { EmptyState } from '../../components/lms/EmptyState';
import { Award } from 'lucide-react';

const MemberSkills = () => {
  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>My Skills</h1>
        <p className='text-theme-text-secondary mt-1'>Your validated skill map</p>
      </div>
      <EmptyState 
        icon={<Award size={48} />} 
        title='Skills Radar Coming Soon' 
        description='Your skill development radar and mapped competencies will appear here.' 
      />
    </div>
  );
};
export default MemberSkills;
