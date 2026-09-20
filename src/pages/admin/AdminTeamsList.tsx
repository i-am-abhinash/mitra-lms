import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTeams } from '../../services/teamService';
import { fetchMembers } from '../../services/memberService';
import { Users, ChevronRight } from 'lucide-react';

const AdminTeamsList = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<any[]>([]);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const t = await fetchTeams();
      setTeams(t);
      // Fetch member counts per team
      const allMembers = await fetchMembers();
      const counts: Record<string, number> = {};
      (allMembers as any[]).forEach((m: any) => {
        if (m.teamId) {
          counts[m.teamId] = (counts[m.teamId] || 0) + 1;
        }
      });
      setMemberCounts(counts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading teams...</div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>All Teams</h1>
        <p className='text-theme-text-secondary mt-1'>Admin: Select a team to view its dashboard and members</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {teams.length === 0 && <p className='text-theme-muted'>No teams found in Firestore.</p>}
        {teams.map(team => (
          <div
            key={team.id}
            className='card p-6 cursor-pointer hover:border-theme-accent transition-colors group'
            onClick={() => navigate(`/admin/teams/${team.id}`)}
          >
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-lg font-bold text-theme-primary mb-1'>{team.name}</h3>
                <p className='text-sm text-theme-text-secondary'>{team.description || 'No description'}</p>
              </div>
              <ChevronRight size={20} className='text-theme-muted group-hover:text-theme-accent transition-colors' />
            </div>
            <div className='mt-4 flex items-center gap-2 text-sm text-theme-text-secondary'>
              <Users size={16} />
              <span>{memberCounts[team.id] || 0} members</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTeamsList;
