import React from 'react';
import { EmptyState } from '../../components/lms/EmptyState';
import { Activity } from 'lucide-react';

const MemberProgress = () => {
  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>My Progress</h1>
        <p className='text-theme-text-secondary mt-1'>Track your learning journey</p>
      </div>
      <EmptyState 
        icon={<Activity size={48} />} 
        title='Progress Tracking Coming Soon' 
        description='Detailed progress charts and activity timelines will be available in the next update.' 
      />
    </div>
  );
};
export default MemberProgress;
