import React, { useState, useEffect } from 'react';
import { fetchRubrics, createRubric } from '../../services/evaluationService';
import type { Rubric, RubricCriterion } from '../../types';
import { Plus, ListChecks } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

const AdminRubrics = () => {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRubric, setNewRubric] = useState<Partial<Rubric>>({
    title: '', description: '', passingScore: 70, version: 1,
    criteria: [
      { id: 'c1', name: 'Code Quality', description: 'Clean, readable code', weight: 40 },
      { id: 'c2', name: 'Functionality', description: 'Meets requirements', weight: 40 },
      { id: 'c3', name: 'Documentation', description: 'Clear README', weight: 20 }
    ]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchRubrics();
      setRubrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await createRubric(newRubric as Rubric);
      setRubrics([...rubrics, r]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading rubrics...</div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-theme-primary'>Evaluation Rubrics</h1>
          <p className='text-theme-text-secondary mt-1'>Manage grading criteria templates</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className='flex items-center gap-2 px-4 py-2 bg-theme-accent text-white rounded-lg transition-colors shadow-glow'
        >
          <Plus size={20} /> Create Rubric
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {rubrics.length === 0 && <p className='text-theme-muted'>No rubrics found.</p>}
        {rubrics.map(rubric => (
          <div key={rubric.id} className='card p-5 group'>
            <div className='flex justify-between items-start mb-3'>
              <span className='text-xs px-2 py-1 rounded-full font-medium bg-theme-surface-elevated text-theme-text-secondary'>
                v{rubric.version}
              </span>
              <span className='text-xs font-bold text-theme-primary bg-theme-surface-elevated px-2 py-1 rounded-md'>
                Pass: {rubric.passingScore}
              </span>
            </div>
            <h3 className='text-lg font-semibold text-theme-primary mb-1'>{rubric.title}</h3>
            <p className='text-sm text-theme-text-secondary line-clamp-2 mb-4'>{rubric.description}</p>
            
            <div className='border-t border-theme-border-subtle pt-3'>
              <div className='flex items-center gap-2 text-sm text-theme-muted mb-2'>
                <ListChecks size={16} /> Criteria ({rubric.criteria.length})
              </div>
              <ul className='space-y-1'>
                {rubric.criteria.map(c => (
                  <li key={c.id} className='text-xs text-theme-text flex justify-between'>
                    <span>{c.name}</span>
                    <span className='font-bold text-theme-accent'>{c.weight}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Create New Rubric'>
        <form onSubmit={handleCreate} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Title</label>
            <input required type='text' value={newRubric.title} onChange={e => setNewRubric({...newRubric, title: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent' />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Description</label>
            <textarea required value={newRubric.description} onChange={e => setNewRubric({...newRubric, description: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent' />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Passing Score (0-100)</label>
            <input required type='number' min='0' max='100' value={newRubric.passingScore} onChange={e => setNewRubric({...newRubric, passingScore: Number(e.target.value)})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent' />
          </div>
          <div className='p-3 bg-theme-surface-elevated rounded-lg text-sm text-theme-text-secondary'>
            Note: Creating custom criteria requires the full Advanced Builder (Coming in a future update). This uses the default AI Team criteria weights summing to 100%.
          </div>
          <button type='submit' className='w-full py-2 bg-theme-accent text-white rounded-lg font-medium'>Create Rubric</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminRubrics;
