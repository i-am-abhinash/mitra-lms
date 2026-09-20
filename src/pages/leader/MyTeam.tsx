import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchMembers } from '../../services/memberService';
import { calculateMemberGrowth } from '../../services/growthService';
import { useNavigate } from 'react-router-dom';
import { User, Activity, TrendingUp } from 'lucide-react';

const MyTeam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [growths, setGrowths] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.teamId) return;
      try {
        const members = await fetchMembers(user.teamId);
        const memberList = members.filter((m: any) => m.role === 'Member');
        setTeamMembers(memberList);

        const growthMap: Record<string, any> = {};
        for (const m of memberList) {
          growthMap[m.id!] = await calculateMemberGrowth(m.id!);
        }
        setGrowths(growthMap);
      } catch (err) {
        console.error('Error loading team members', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading team...</div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>My Team</h1>
        <p className='text-theme-text-secondary mt-1'>Manage and monitor your assigned members</p>
      </div>

      {teamMembers.length === 0 ? (
        <p className='text-theme-text-secondary'>No members in your team yet.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {teamMembers.map(member => {
            const growth = growths[member.id] || { courseCompletion: 0, overallGrowth: 0 };
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
      )}
    </div>
  );
};
export default MyTeam;
