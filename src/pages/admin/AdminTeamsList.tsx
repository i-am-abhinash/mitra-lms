import React from 'react';
import { EmptyState } from '../../components/lms/EmptyState';
import { Activity } from 'lucide-react';
const AdminTeamsList = () => (
  <div className='max-w-7xl mx-auto'>
    <h1 className='text-2xl font-bold text-theme-primary mb-8'>AdminTeamsList</h1>
    <EmptyState icon={<Activity size={48} />} title='AdminTeamsList' description='Coming soon.' />
  </div>
);
export default AdminTeamsList;
