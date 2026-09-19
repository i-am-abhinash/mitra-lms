import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockUsers, mockGrowth } from '../../mockData';
import { ArrowLeft, User, Activity, TrendingUp, BookOpen, CheckCircle } from 'lucide-react';
import { MetricCard } from '../../components/lms/MetricCard';

const MemberOverview = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const member = mockUsers.find(u => u.id === memberId);
  const growth = mockGrowth.find(g => g.userId === memberId) || mockGrowth[0];

  if (!member) return <div className='p-8 text-center text-theme-absent'>Member not found</div>;

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <button 
        onClick={() => navigate('/leader/team')}
        className='flex items-center gap-2 text-theme-text-secondary hover:text-theme-primary transition-colors'
      >
        <ArrowLeft size={16} /> Back to Team
      </button>

      <div className='card p-6 flex items-center gap-6'>
        <div className='w-20 h-20 rounded-full bg-theme-surface-higher flex items-center justify-center border-2 border-theme-border'>
          <User size={32} className='text-theme-muted' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-theme-primary'>{member.name}</h1>
          <p className='text-theme-text-secondary'>{member.email} - Joined recently</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard title='Overall Growth' value={`${growth.overallGrowth}%`} icon={<TrendingUp size={20} />} trend='up' trendValue='+5%' />
        <MetricCard title='Course Completion' value={`${growth.courseCompletion}%`} icon={<BookOpen size={20} />} />
        <MetricCard title='Assignment Perf' value={`${growth.assignmentPerformance}%`} icon={<CheckCircle size={20} />} />
        <MetricCard title='Attendance' value={`${growth.attendanceConsistency}%`} icon={<Activity size={20} />} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='card p-6'>
          <h2 className='text-xl font-bold text-theme-primary mb-4'>Skill Development</h2>
          <div className='space-y-4'>
            {Object.entries(growth.skills).map(([skill, val]) => (
              <div key={skill}>
                <div className='flex justify-between text-sm mb-1'>
                  <span className='text-theme-text-secondary'>{skill}</span>
                  <span className='text-theme-primary'>{val as number}%</span>
                </div>
                <div className='w-full bg-theme-surface-higher rounded-full h-2'>
                  <div className='bg-theme-accent h-2 rounded-full' style={{ width: `${val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='card p-6'>
          <h2 className='text-xl font-bold text-theme-primary mb-4'>Recent Activity</h2>
          <p className='text-theme-text-secondary text-sm'>Activity feed placeholder.</p>
        </div>
      </div>
    </div>
  );
};
export default MemberOverview;
