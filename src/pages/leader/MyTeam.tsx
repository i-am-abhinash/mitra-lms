import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockUsers, mockGrowth } from '../../mockData';
import { useNavigate } from 'react-router-dom';
import { User, Activity, TrendingUp } from 'lucide-react';

const MyTeam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const teamMembers = mockUsers.filter(u => u.teamId === user?.teamId && u.role === 'Member');

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>My Team</h1>
        <p className='text-theme-text-secondary mt-1'>Manage and monitor your assigned members</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {teamMembers.map(member => {
          const growth = mockGrowth.find(g => g.userId === member.id) || mockGrowth[0];
          return (
            <div 
              key={member.id} 
              onClick={() => navigate(`/leader/team/member/${member.id}`)}
              className='card p-6 flex flex-col cursor-pointer hover:border-theme-accent transition-colors'
            >
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-12 h-12 rounded-full bg-theme-surface-elevated flex items-center justify-center border border-theme-border-subtle'>
                  <User size={24} className='text-theme-muted' />
                </div>
                <div>
                  <h3 className='font-bold text-theme-primary text-lg'>{member.name}</h3>
                  <p className='text-sm text-theme-text-secondary'>{member.email}</p>
                </div>
              </div>
              <div className='space-y-3 mt-auto'>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-theme-text-secondary flex items-center gap-1'><Activity size={14} /> Course Progress</span>
                  <span className='font-medium text-theme-primary'>{growth.courseCompletion}%</span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-theme-text-secondary flex items-center gap-1'><TrendingUp size={14} /> Overall Growth</span>
                  <span className='font-medium text-theme-present'>{growth.overallGrowth}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MyTeam;
