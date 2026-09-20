import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchTeamProjectSubmissions, updateSubmissionStatus } from '../../services/submissionService';
import { fetchRubrics, createEvaluation } from '../../services/evaluationService';
import { fetchTeamProjects } from '../../services/teamWorkService';
import { logAction } from '../../services/auditService';
import { createNotification } from '../../services/notificationService';
import type { ProjectSubmission, Rubric, Evaluation, Project } from '../../types';
import { Timestamp } from 'firebase/firestore';

const LeaderEvaluations = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(true);

  const [evaluatingSub, setEvaluatingSub] = useState<ProjectSubmission | null>(null);
  const [selectedRubricId, setSelectedRubricId] = useState<string>('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (user?.teamId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subs, projs, rubs] = await Promise.all([
        fetchTeamProjectSubmissions(user!.teamId!),
        fetchTeamProjects(user!.teamId!),
        fetchRubrics()
      ]);
      setSubmissions(subs.filter(s => s.status !== 'DRAFT'));
      
      const pMap: Record<string, Project> = {};
      projs.forEach(p => { pMap[p.id!] = p; });
      setProjects(pMap);
      
      setRubrics(rubs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEvaluation = (sub: ProjectSubmission) => {
    setEvaluatingSub(sub);
    const proj = projects[sub.projectId];
    const defaultRubric = proj?.rubricId || rubrics[0]?.id || '';
    setSelectedRubricId(defaultRubric);
    setScores({});
    setFeedback('');
  };

  const handleScoreChange = (critId: string, val: number) => {
    setScores(prev => ({ ...prev, [critId]: val }));
  };

  const calculateTotal = (rubric: Rubric) => {
    let total = 0;
    rubric.criteria.forEach(c => {
      const s = scores[c.id] || 0;
      // Score is 0-5. Weight is out of 100.
      // (score / 5) * weight = weighted score for criterion
      total += (s / 5) * c.weight;
    });
    return Math.round(total);
  };

  const handleSubmitEvaluation = async () => {
    if (!evaluatingSub || !user) return;
    const r = rubrics.find(x => x.id === selectedRubricId);
    if (!r) return;

    const total = calculateTotal(r);
    const passed = total >= r.passingScore;
    const newStatus = passed ? 'ACCEPTED' : 'CHANGES_REQUESTED';

    try {
      await createEvaluation({
        submissionId: evaluatingSub.id!,
        rubricId: r.id!,
        rubricVersion: r.version,
        evaluatorId: user.id!,
        scores,
        feedback,
        totalScore: total,
        evaluatedAt: Timestamp.now()
      });
      await updateSubmissionStatus(evaluatingSub.id!, newStatus);

      // FR-AUD-01: Audit log the evaluation
      await logAction(user.id!, 'EVALUATED_PROJECT', evaluatingSub.id!, `Score: ${total}, Passed: ${passed}`);
      
      // FR-NOT-01: Notify the member
      await createNotification({
        recipientId: evaluatingSub.memberId,
        type: passed ? 'SUCCESS' : 'WARNING',
        title: `Project ${passed ? 'Accepted' : 'Changes Requested'}`,
        message: `Your project submission has been evaluated. Score: ${total}/100.`,
      });

      await loadData();
      setEvaluatingSub(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading submissions...</div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>Evaluate Projects</h1>
        <p className='text-theme-text-secondary mt-1'>Review and score member submissions</p>
      </div>

      {!evaluatingSub ? (
        <div className='grid gap-4'>
          {submissions.length === 0 && <p className='text-theme-muted'>No active submissions to evaluate.</p>}
          {submissions.map(sub => {
            const proj = projects[sub.projectId];
            return (
              <div key={sub.id} className='card p-5 flex justify-between items-center'>
                <div>
                  <h3 className='font-bold text-theme-primary'>{proj?.title || 'Unknown Project'}</h3>
                  <p className='text-sm text-theme-text-secondary'>Submitted by: Member {sub.memberId}</p>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='px-3 py-1 rounded-full text-xs font-bold bg-theme-surface-elevated'>
                    {sub.status}
                  </span>
                  {(sub.status === 'SUBMITTED' || sub.status === 'RESUBMITTED') && (
                    <button onClick={() => handleStartEvaluation(sub)} className='px-4 py-2 bg-theme-accent text-white rounded-lg text-sm'>
                      Evaluate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='card p-6'>
          <button onClick={() => setEvaluatingSub(null)} className='text-sm text-theme-text-secondary hover:text-theme-primary mb-6'>← Back to List</button>
          
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div>
              <h2 className='text-xl font-bold text-theme-primary mb-4'>Submission Evidence</h2>
              <div className='space-y-4'>
                <div><strong className='text-theme-text-secondary text-sm'>GitHub:</strong> <a href={evaluatingSub.githubUrl} className='text-theme-accent underline block'>{evaluatingSub.githubUrl || 'N/A'}</a></div>
                <div><strong className='text-theme-text-secondary text-sm'>Demo Video:</strong> <a href={evaluatingSub.demoVideoUrl} className='text-theme-accent underline block'>{evaluatingSub.demoVideoUrl || 'N/A'}</a></div>
                <div><strong className='text-theme-text-secondary text-sm'>Reflection:</strong> <p className='bg-theme-surface-higher p-3 rounded-lg text-sm mt-1'>{evaluatingSub.reflection || 'None provided'}</p></div>
              </div>
            </div>

            <div className='border-l border-theme-border-subtle pl-8'>
              <h2 className='text-xl font-bold text-theme-primary mb-4'>Rubric Scoring</h2>
              
              <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>Select Rubric</label>
                <select value={selectedRubricId} onChange={e => setSelectedRubricId(e.target.value)} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2'>
                  <option value=''>Choose a rubric...</option>
                  {rubrics.map(r => <option key={r.id} value={r.id!}>{r.title} (v{r.version})</option>)}
                </select>
              </div>

              {selectedRubricId && rubrics.find(r => r.id === selectedRubricId) && (
                <div className='space-y-4'>
                  {rubrics.find(r => r.id === selectedRubricId)!.criteria.map(c => (
                    <div key={c.id} className='bg-theme-surface-higher p-3 rounded-lg'>
                      <div className='flex justify-between items-start mb-2'>
                        <div>
                          <p className='font-bold text-sm text-theme-primary'>{c.name}</p>
                          <p className='text-xs text-theme-text-secondary'>{c.description}</p>
                        </div>
                        <span className='text-xs font-bold text-theme-accent'>Wt: {c.weight}%</span>
                      </div>
                      <div className='flex gap-2 mt-2'>
                        {[0,1,2,3,4,5].map(v => (
                          <button 
                            key={v}
                            onClick={() => handleScoreChange(c.id, v)}
                            className={`flex-1 py-1 rounded text-sm font-medium transition-colors ${scores[c.id] === v ? 'bg-theme-accent text-white' : 'bg-theme-surface border border-theme-border text-theme-text-secondary hover:bg-theme-border-active'}`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className='mt-6'>
                    <label className='block text-sm font-medium mb-1'>Feedback</label>
                    <textarea value={feedback} onChange={e => setFeedback(e.target.value)} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 min-h-[100px]' placeholder='Provide constructive feedback...' />
                  </div>

                  <div className='mt-6 p-4 bg-theme-surface-elevated rounded-lg flex justify-between items-center'>
                    <div>
                      <p className='text-sm text-theme-text-secondary'>Total Weighted Score</p>
                      <p className='text-2xl font-bold text-theme-primary'>
                        {calculateTotal(rubrics.find(r => r.id === selectedRubricId)!)} / 100
                      </p>
                    </div>
                    <button onClick={handleSubmitEvaluation} className='px-6 py-2 bg-theme-accent text-white rounded-lg font-medium'>
                      Complete Evaluation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderEvaluations;
