import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchTeamProjects } from '../../services/teamWorkService';
import { getMemberProjectSubmission, saveProjectSubmission } from '../../services/submissionService';
import type { Project, ProjectSubmission, SubmissionStatus } from '../../types';
import { FileCode, PlaySquare, FileText, Clock } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const MemberProjectSubmit = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, ProjectSubmission>>({});
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ProjectSubmission>>({});

  useEffect(() => {
    if (user?.teamId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const projs = await fetchTeamProjects(user!.teamId!);
      setProjects(projs);
      
      const subMap: Record<string, ProjectSubmission> = {};
      for (const p of projs) {
        const sub = await getMemberProjectSubmission(p.id!, user!.id!);
        if (sub) {
          subMap[p.id!] = sub;
        }
      }
      setSubmissions(subMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    const existing = submissions[projectId];
    setFormData(existing || {
      githubUrl: '',
      demoVideoUrl: '',
      documentation: '',
      reflection: '',
      status: 'DRAFT'
    });
  };

  const handleSave = async (isSubmit: boolean) => {
    if (!selectedProjectId || !user) return;
    const status: SubmissionStatus = isSubmit ? 'SUBMITTED' : 'DRAFT';
    
    try {
      await saveProjectSubmission({
        projectId: selectedProjectId,
        memberId: user.id!,
        teamId: user.teamId!,
        githubUrl: formData.githubUrl,
        demoVideoUrl: formData.demoVideoUrl,
        documentation: formData.documentation,
        description: formData.description,
        technologies: formData.technologies,
        challenges: formData.challenges,
        improvements: formData.improvements,
        reflection: formData.reflection,
        status,
        updatedAt: Timestamp.now(),
        submittedAt: isSubmit ? Timestamp.now() : undefined
      });
      await loadData();
      setSelectedProjectId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading projects...</div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>Project Submissions</h1>
        <p className='text-theme-text-secondary mt-1'>Submit your work for review</p>
      </div>

      {!selectedProjectId ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {projects.length === 0 && <p className='text-theme-muted'>No projects available for your team.</p>}
          {projects.map(proj => {
            const sub = submissions[proj.id!];
            return (
              <div key={proj.id} onClick={() => handleSelectProject(proj.id!)} className='card p-5 cursor-pointer hover:border-theme-accent transition-colors'>
                <div className='flex justify-between items-start mb-3'>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${sub?.status === 'EVALUATED' || sub?.status === 'ACCEPTED' ? 'bg-theme-present-bg text-theme-present' : 'bg-theme-surface-elevated text-theme-text-secondary'}`}>
                    {sub?.status || 'NOT STARTED'}
                  </span>
                </div>
                <h3 className='text-lg font-semibold text-theme-primary mb-2'>{proj.title}</h3>
                <p className='text-sm text-theme-text-secondary flex items-center gap-1 mt-4'>
                  <Clock size={14} /> Due {(proj.deadline as Timestamp).toDate().toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='card p-6 max-w-3xl mx-auto'>
          <button onClick={() => setSelectedProjectId(null)} className='text-sm text-theme-text-secondary hover:text-theme-primary mb-6'>← Back to Projects</button>
          
          <h2 className='text-2xl font-bold text-theme-primary mb-6'>Submit Evidence</h2>
          
          {submissions[selectedProjectId]?.status === 'CHANGES_REQUESTED' && (
            <div className='p-4 mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500'>
              <h3 className='font-bold mb-1'>Changes Requested!</h3>
              <p className='text-sm'>Please review the feedback and resubmit your evidence.</p>
            </div>
          )}

          <form className='space-y-4' onSubmit={e => e.preventDefault()}>
            <div>
              <label className='block text-sm font-medium mb-1 text-theme-text-secondary'>Project Overview</label>
              <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent min-h-[80px]' placeholder='Short project description' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1 text-theme-text-secondary'>Technologies</label>
              <input type='text' value={(formData.technologies || []).join(', ')} onChange={e => setFormData({...formData, technologies: e.target.value.split(',').map(s => s.trim())})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent' placeholder='Python, React, PyTorch, etc.' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1 text-theme-text-secondary'><FileCode size={16} className='inline mr-1' /> GitHub Repository</label>
              <input type='url' value={formData.githubUrl || ''} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent' placeholder='https://github.com/...' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1 text-theme-text-secondary'><PlaySquare size={16} className='inline mr-1' /> Project Demo Video</label>
              <input type='url' value={formData.demoVideoUrl || ''} onChange={e => setFormData({...formData, demoVideoUrl: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent' placeholder='Paste your public/unlisted demo video URL (LinkedIn, YouTube, etc.)' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1 text-theme-text-secondary'><FileText size={16} className='inline mr-1' /> Documentation URL</label>
              <input type='url' value={formData.documentation || ''} onChange={e => setFormData({...formData, documentation: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent' placeholder='https://...' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1 text-theme-text-secondary'>Challenges</label>
              <textarea value={formData.challenges || ''} onChange={e => setFormData({...formData, challenges: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent min-h-[80px]' placeholder='What challenges did you face?' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1 text-theme-text-secondary'>What I Learned</label>
              <textarea value={formData.reflection || ''} onChange={e => setFormData({...formData, reflection: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent min-h-[80px]' placeholder='What did you learn?' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1 text-theme-text-secondary'>Future Improvements</label>
              <textarea value={formData.improvements || ''} onChange={e => setFormData({...formData, improvements: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent min-h-[80px]' placeholder='What could be improved?' />
            </div>

            <div className='flex gap-3 pt-4'>
              <button onClick={() => handleSave(false)} className='px-6 py-2 border border-theme-border text-theme-text hover:bg-theme-surface-higher rounded-lg transition-colors'>
                Save Draft
              </button>
              <button onClick={() => handleSave(true)} className='px-6 py-2 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-lg transition-colors shadow-glow'>
                Submit for Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MemberProjectSubmit;
