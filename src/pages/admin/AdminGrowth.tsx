import React from 'react';
import { EmptyState } from '../../components/lms/EmptyState';
import { Activity } from 'lucide-react';
const AdminGrowth = () => (
  <div className='max-w-7xl mx-auto'>
    <h1 className='text-2xl font-bold text-theme-primary mb-8'>AdminGrowth</h1>
    <EmptyState icon={<Activity size={48} />} title='AdminGrowth' description='Coming soon.' />
  </div>
);
export default AdminGrowth;
