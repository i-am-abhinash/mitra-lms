import React from 'react';
import { EmptyState } from '../../components/lms/EmptyState';
import { TrendingUp } from 'lucide-react';
const LeaderGrowth = () => (
  <div className='max-w-7xl mx-auto'>
    <h1 className='text-2xl font-bold text-theme-primary mb-8'>Team Growth</h1>
    <EmptyState icon={<TrendingUp size={48} />} title='Team Growth Analytics' description='Coming soon.' />
  </div>
);
export default LeaderGrowth;
