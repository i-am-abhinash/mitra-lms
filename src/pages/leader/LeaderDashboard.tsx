import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/lms/MetricCard';
import { Users, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { fetchMembers } from '../../services/memberService';
import { calculateMemberGrowth } from '../../services/growthService';
import { useNavigate } from 'react-router-dom';

const LeaderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [avgGrowth, setAvgGrowth] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.teamId) return;
      try {
        const members = await fetchMembers(user.teamId);
        const memberList = members.filter((m: any) => m.role === 'Member');
        setTeamMembers(memberList);

        if (memberList.length > 0) {
          let totalGrowth = 0;
          for (const m of memberList) {
            const growth = await calculateMemberGrowth(m.id!);
            totalGrowth += growth.overallGrowth || 0;
          }
          setAvgGrowth(Math.round(totalGrowth / memberList.length));
        }
      } catch (err) {
        console.error('Error loading leader dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-theme-primary'>Team Dashboard</h1>
        <p className='text-theme-text-secondary mt-1'>Monitor your team's learning progress</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard title='Total Members' value={loading ? '...' : teamMembers.length} icon={<Users size={20} />} />
        <MetricCard title='Active Learners' value={loading ? '...' : teamMembers.length} icon={<Activity size={20} />} />
        <MetricCard title='Avg Team Growth' value={loading ? '...' : `${avgGrowth}%`} icon={<TrendingUp size={20} />} trend='up' trendValue='+0%' />
        <MetricCard title='Needs Attention' value='0' icon={<AlertTriangle size={20} className='text-theme-absent' />} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='card p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-bold text-theme-primary'>Members</h2>
          </div>
          <div className='space-y-4'>
            {teamMembers.length === 0 && !loading && <p className='text-theme-text-secondary text-sm'>No members found.</p>}
            {teamMembers.map(member => (
              <div key={member.id} className='flex items-center justify-between p-4 bg-theme-surface-higher rounded-lg border border-theme-border-subtle'>
                <div>
                  <h3 className='font-bold text-theme-primary'>{member.name}</h3>
                </div>
                <button onClick={() => navigate(`/leader/team/member/${member.id}`)} className='px-4 py-2 text-sm bg-theme-surface hover:bg-theme-bg rounded-md transition-colors'>
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeaderDashboard;

