import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { calculateMemberGrowth } from '../../services/growthService';
import type { GrowthMetrics } from '../../types';
import { TrendingUp, Activity, FileText, Target, Info } from 'lucide-react';
import { MetricCard } from '../../components/lms/MetricCard';

const MemberGrowth = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<GrowthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await calculateMemberGrowth(user!.id!);
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Calculating Growth Metrics...</div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-theme-primary'>My Growth</h1>
          <p className='text-theme-text-secondary mt-1'>Evidence-backed performance metrics</p>
        </div>
        <button 
          onClick={() => setShowSources(!showSources)}
          className='flex items-center gap-2 px-4 py-2 bg-theme-surface hover:bg-theme-surface-higher text-theme-primary rounded-lg transition-colors border border-theme-border'
        >
          <Info size={16} /> {showSources ? 'Hide Source Data' : 'View Source Evidence'}
        </button>
      </div>

      {metrics && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <div className='card p-6 border-l-4 border-l-theme-accent'>
              <div className='flex justify-between items-start mb-2'>
                <p className='text-theme-text-secondary font-medium'>Overall Growth</p>
                <TrendingUp size={20} className='text-theme-accent' />
              </div>
              <h3 className='text-3xl font-bold text-theme-primary'>{metrics.overallGrowth}%</h3>
              <p className='text-xs mt-2 text-theme-muted'>Derived from Projects & Tasks</p>
            </div>
            
            <MetricCard title='Project Score Avg' value={`${metrics.assignmentScores}%`} icon={<FileText size={20} />} />
            <MetricCard title='Task Participation' value={`${metrics.participationRate}%`} icon={<Target size={20} />} />
            <MetricCard title='Course Completion' value={`${metrics.courseCompletion}%`} icon={<Activity size={20} />} />
          </div>

          {showSources && (
            <div className='card p-6 bg-theme-surface-elevated'>
              <h2 className='text-xl font-bold text-theme-primary mb-4 flex items-center gap-2'>
                <Info size={20} className='text-theme-accent' /> Metric Sources (FR-GROW-01/03)
              </h2>
              <p className='text-sm text-theme-text-secondary mb-4'>
                Growth scores in MITRA are never manually editable. They are deterministically calculated based on the following verified evidence records:
              </p>
              <div className='bg-theme-bg rounded border border-theme-border p-4 max-h-[300px] overflow-y-auto font-mono text-xs text-theme-text space-y-2'>
                {metrics.evidenceRefs.length === 0 && <span className='text-theme-muted'>No evidence records found yet. Complete tasks or projects to generate growth.</span>}
                {metrics.evidenceRefs.map((ref, i) => (
                  <div key={i} className='p-2 bg-theme-surface rounded border border-theme-border-subtle flex gap-4'>
                    <span className='text-theme-accent'>[Evidence ID: {ref.split(':')[1]}]</span>
                    <span>Source: {ref.split(':')[0] === 'eval' ? 'Project Evaluation (Leader Graded)' : 'Completed Task'}</span>
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

export default MemberGrowth;
