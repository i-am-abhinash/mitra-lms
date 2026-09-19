import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/lms/MetricCard';
import { Users, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { mockUsers, mockGrowth } from '../../mockData';
import { useNavigate } from 'react-router-dom';

const LeaderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const teamMembers = mockUsers.filter(u => u.teamId === user?.teamId && u.role === 'Member');

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-theme-primary'>Team Dashboard</h1>
        <p className='text-theme-text-secondary mt-1'>Monitor your team's learning progress</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard title='Total Members' value={teamMembers.length} icon={<Users size={20} />} />
        <MetricCard title='Active Learners' value={teamMembers.length} icon={<Activity size={20} />} />
        <MetricCard title='Avg Team Growth' value='82%' icon={<TrendingUp size={20} />} trend='up' trendValue='+2%' />
        <MetricCard title='Needs Attention' value='1' icon={<AlertTriangle size={20} className='text-theme-absent' />} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='card p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-bold text-theme-primary'>Members Requiring Attention</h2>
          </div>
          <div className='space-y-4'>
            {teamMembers.slice(0, 1).map(member => (
              <div key={member.id} className='flex items-center justify-between p-4 bg-theme-surface-higher rounded-lg border border-theme-border-subtle'>
                <div>
                  <h3 className='font-bold text-theme-primary'>{member.name}</h3>
                  <p className='text-sm text-theme-absent'>Assignment completion ↓</p>
                </div>
                <button onClick={() => navigate(`/leader/team/member/${member.id}`)} className='px-4 py-2 text-sm bg-theme-surface hover:bg-theme-bg rounded-md transition-colors'>
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='card p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-bold text-theme-primary'>Recent Activity</h2>
          </div>
          <div className='space-y-4'>
            <p className='text-sm text-theme-text-secondary'>Activity feed placeholder.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeaderDashboard;
