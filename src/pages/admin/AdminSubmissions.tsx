import React from 'react';
import { EmptyState } from '../../components/lms/EmptyState';
import { FileText } from 'lucide-react';
const AdminSubmissions = () => (
  <div className='max-w-7xl mx-auto'>
    <h1 className='text-2xl font-bold text-theme-primary mb-8'>Submissions & Evaluations</h1>
    <EmptyState icon={<FileText size={48} />} title='Submission Management' description='Coming soon.' />
  </div>
);
export default AdminSubmissions;
