import React, { useState, useEffect } from 'react';
import { MetricCard } from '../../components/lms/MetricCard';
import { Users, BookOpen, FileText, CheckCircle } from 'lucide-react';
import { fetchMembers } from '../../services/memberService';
import { fetchCourses } from '../../services/courseService';
import { fetchAssignments } from '../../services/assignmentService';
import { fetchAllSubmissions } from '../../services/submissionService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ members: 0, courses: 0, assignments: 0, submissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [members, courses, assignments, submissions] = await Promise.all([
          fetchMembers(),
          fetchCourses(),
          fetchAssignments(),
          fetchAllSubmissions()
        ]);
        setStats({
          members: members.length,
          courses: courses.length,
          assignments: assignments.length,
          submissions: submissions.filter((s: any) => s.status !== 'EVALUATED' && s.status !== 'ACCEPTED').length
        });
      } catch (err) {
        console.error('Error loading admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-theme-primary'>MITRA LMS Overview</h1>
          <p className='text-theme-text-secondary mt-1'>Ecosystem health and analytics</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard title='Total Members' value={loading ? '...' : stats.members} icon={<Users size={20} />} />
        <MetricCard title='Total Courses' value={loading ? '...' : stats.courses} icon={<BookOpen size={20} />} />
        <MetricCard title='Active Assignments' value={loading ? '...' : stats.assignments} icon={<FileText size={20} />} />
        <MetricCard title='Pending Evaluations' value={loading ? '...' : stats.submissions} icon={<CheckCircle size={20} className='text-theme-absent' />} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='card p-6'>
          <h2 className='text-xl font-bold text-theme-primary mb-4'>Recent Submissions</h2>
          <p className='text-theme-text-secondary text-sm'>No data yet.</p>
        </div>
        <div className='card p-6'>
          <h2 className='text-xl font-bold text-theme-primary mb-4'>Overall Growth Trend</h2>
          <p className='text-theme-text-secondary text-sm'>No data yet.</p>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
