import React from 'react';
import { MetricCard } from '../../components/lms/MetricCard';
import { Users, BookOpen, FileText, CheckCircle } from 'lucide-react';
import { mockUsers, mockCourses, mockAssignments, mockSubmissions } from '../../mockData';

const AdminDashboard = () => {
  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-theme-primary'>MITRA LMS Overview</h1>
        <p className='text-theme-text-secondary mt-1'>Ecosystem health and analytics</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard title='Total Members' value={mockUsers.filter(u => u.role === 'Member').length} icon={<Users size={20} />} />
        <MetricCard title='Total Courses' value={mockCourses.length} icon={<BookOpen size={20} />} />
        <MetricCard title='Active Assignments' value={mockAssignments.length} icon={<FileText size={20} />} />
        <MetricCard title='Pending Evaluations' value={mockSubmissions.filter(s => s.status !== 'EVALUATED').length} icon={<CheckCircle size={20} className='text-theme-absent' />} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='card p-6'>
          <h2 className='text-xl font-bold text-theme-primary mb-4'>Recent Submissions</h2>
          <p className='text-theme-text-secondary text-sm'>Placeholder for submissions list.</p>
        </div>
        <div className='card p-6'>
          <h2 className='text-xl font-bold text-theme-primary mb-4'>Overall Growth Trend</h2>
          <p className='text-theme-text-secondary text-sm'>Placeholder for growth chart.</p>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
