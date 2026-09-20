import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchMemberSkills } from '../../services/growthService';
import type { Skill } from '../../types';
import { Award, ShieldCheck } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const MemberSkills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMemberSkills(user!.id!);
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading validated skills...</div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>My Skills</h1>
        <p className='text-theme-text-secondary mt-1'>Your validated skill map</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {skills.length === 0 && (
          <div className='col-span-full p-12 text-center border-2 border-dashed border-theme-border-active rounded-lg'>
            <Award size={48} className='mx-auto mb-4 text-theme-muted' />
            <h3 className='text-lg font-bold text-theme-primary mb-2'>No Skills Validated Yet</h3>
            <p className='text-theme-text-secondary max-w-md mx-auto'>
              Skills are awarded automatically when you complete courses or pass project evaluations. Keep learning to unlock your first skill!
            </p>
          </div>
        )}
        
        {skills.map(skill => (
          <div key={skill.id} className='card p-6 relative overflow-hidden group hover:border-theme-accent transition-colors'>
            <div className='absolute -right-4 -top-4 w-16 h-16 bg-theme-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
              <Award size={24} className='text-theme-accent mr-2 mt-2' />
            </div>
            
            <h3 className='text-xl font-bold text-theme-primary mb-1'>{skill.name}</h3>
            <div className='flex items-center gap-2 mb-4'>
              <span className='px-2 py-0.5 rounded text-xs font-bold bg-theme-surface-elevated text-theme-text-secondary'>Level {skill.level}</span>
              <span className='text-xs text-theme-muted'>Updated {(skill.updatedAt as Timestamp).toDate().toLocaleDateString()}</span>
            </div>
            
            <div className='mt-4 pt-4 border-t border-theme-border-subtle'>
              <p className='text-xs font-bold text-theme-text-secondary mb-2 flex items-center gap-1'><ShieldCheck size={14} /> Evidence Backing</p>
              <div className='space-y-1'>
                {skill.evidenceRefs.map((ref, idx) => (
                  <div key={idx} className='text-xs text-theme-muted truncate'>
                    • {ref}
                  </div>
                ))}
                {skill.evidenceRefs.length === 0 && <span className='text-xs text-theme-muted'>Manually granted by Admin</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberSkills;
