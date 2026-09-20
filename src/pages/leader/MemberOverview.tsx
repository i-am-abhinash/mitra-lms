import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Activity, TrendingUp, BookOpen, CheckCircle, Info } from 'lucide-react';
import { MetricCard } from '../../components/lms/MetricCard';
import { calculateMemberGrowth } from '../../services/growthService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import type { GrowthMetrics } from '../../types';

const MemberOverview = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  
  const [member, setMember] = useState<any>(null);
  const [growth, setGrowth] = useState<GrowthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    if (memberId) {
      loadData();
    }
  }, [memberId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'users', memberId!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMember(docSnap.data());
      }
      
      const g = await calculateMemberGrowth(memberId!);
      setGrowth(g);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading Member Profile...</div>;
  if (!member) return <div className='p-8 text-center text-theme-absent'>Member not found</div>;

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <button 
        onClick={() => navigate('/leader/team')}
        className='flex items-center gap-2 text-theme-text-secondary hover:text-theme-primary transition-colors'
      >
        <ArrowLeft size={16} /> Back to Team
      </button>

      <div className='card p-6 flex items-center justify-between'>
        <div className='flex items-center gap-6'>
          <div className='w-20 h-20 rounded-full bg-theme-surface-higher flex items-center justify-center border-2 border-theme-border'>
            <User size={32} className='text-theme-muted' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-theme-primary'>{member.name}</h1>
            <p className='text-theme-text-secondary'>{member.email}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowSources(!showSources)}
          className='flex items-center gap-2 px-4 py-2 bg-theme-surface hover:bg-theme-surface-higher text-theme-primary rounded-lg transition-colors border border-theme-border'
        >
          <Info size={16} /> {showSources ? 'Hide Source Data' : 'View Source Evidence'}
        </button>
      </div>

      {growth && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <MetricCard title='Overall Growth' value={`${growth.overallGrowth}%`} icon={<TrendingUp size={20} />} />
            <MetricCard title='Course Completion' value={`${growth.courseCompletion}%`} icon={<BookOpen size={20} />} />
            <MetricCard title='Project Perf' value={`${growth.assignmentScores}%`} icon={<CheckCircle size={20} />} />
            <MetricCard title='Task Participation' value={`${growth.participationRate}%`} icon={<Activity size={20} />} />
          </div>

          {showSources && (
            <div className='card p-6 bg-theme-surface-elevated'>
              <h2 className='text-xl font-bold text-theme-primary mb-4 flex items-center gap-2'>
                <Info size={20} className='text-theme-accent' /> Metric Sources (FR-GROW-01)
              </h2>
              <div className='bg-theme-bg rounded border border-theme-border p-4 max-h-[300px] overflow-y-auto font-mono text-xs text-theme-text space-y-2'>
                {growth.evidenceRefs.length === 0 && <span className='text-theme-muted'>No evidence records found for this member yet.</span>}
                {growth.evidenceRefs.map((ref, i) => (
                  <div key={i} className='p-2 bg-theme-surface rounded border border-theme-border-subtle flex gap-4'>
                    <span className='text-theme-accent'>[Evidence ID: {ref.split(':')[1]}]</span>
                    <span>Source: {ref.split(':')[0] === 'eval' ? 'Project Evaluation' : 'Completed Task'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemberOverview;
