import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMembers } from '../../services/memberService';
import { calculateMemberGrowth } from '../../services/growthService';
import { Users, TrendingUp, ArrowLeft, ChevronRight } from 'lucide-react';
import { MetricCard } from '../../components/lms/MetricCard';

const AdminTeamDetail = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState<any[]>([]);
  const [growthMap, setGrowthMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teamId) loadData();
  }, [teamId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allMembers = await fetchMembers(teamId);
      setMembers(allMembers as any[]);

      const gmap: Record<string, number> = {};
      for (const m of allMembers as any[]) {
        const g = await calculateMemberGrowth(m.id!);
        gmap[m.id!] = g.overallGrowth;
      }
      setGrowthMap(gmap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading team...</div>;

  const avgGrowth = members.length > 0
    ? Math.round(members.reduce((sum, m) => sum + (growthMap[m.id] || 0), 0) / members.length)
    : 0;

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <button onClick={() => navigate('/admin/teams')} className='flex items-center gap-2 text-theme-text-secondary hover:text-theme-primary'>
        <ArrowLeft size={16} /> Back to All Teams
      </button>

      <div>
        <h1 className='text-2xl font-bold text-theme-primary'>Team Dashboard</h1>
        <p className='text-theme-text-secondary mt-1'>Admin view — full access</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <MetricCard title='Members' value={members.length} icon={<Users size={20} />} />
        <MetricCard title='Avg Growth' value={`${avgGrowth}%`} icon={<TrendingUp size={20} />} />
        <MetricCard title='Team ID' value={teamId || 'Unknown'} icon={<Users size={20} />} />
      </div>

      <div className='card p-6'>
        <h2 className='text-xl font-bold text-theme-primary mb-4'>Members</h2>
        <div className='space-y-3'>
          {members.length === 0 && <p className='text-theme-muted'>No members found for this team.</p>}
          {members.map(m => (
            <div
              key={m.id}
              onClick={() => navigate(`/leader/team/member/${m.id}`)}
              className='flex justify-between items-center p-4 bg-theme-surface-higher rounded-lg cursor-pointer hover:bg-theme-surface-elevated transition-colors group'
            >
              <div>
                <h3 className='font-bold text-theme-primary'>{m.name}</h3>
                <p className='text-sm text-theme-text-secondary'>{m.email}</p>
              </div>
              <div className='flex items-center gap-4'>
                <span className='text-sm font-bold text-theme-accent'>{growthMap[m.id] || 0}% growth</span>
                <ChevronRight size={16} className='text-theme-muted group-hover:text-theme-accent transition-colors' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTeamDetail;
