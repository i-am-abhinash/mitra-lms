import React from 'react';
import { EmptyState } from '../../components/lms/EmptyState';
import { TrendingUp } from 'lucide-react';

const MemberGrowth = () => {
  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>My Growth</h1>
        <p className='text-theme-text-secondary mt-1'>Your MITRA growth and development metrics</p>
      </div>
      <EmptyState 
        icon={<TrendingUp size={48} />} 
        title='Growth Analytics Under Construction' 
        description='The MITRA growth algorithm is currently being finalized.' 
      />
    </div>
  );
};
export default MemberGrowth;
