import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  fetchTeamObjectives, createObjective, 
  fetchTeamTasks, createTask, assignTask 
} from '../../services/teamWorkService';
import { fetchMembers } from '../../services/memberService';
import type { Objective, Task, User } from '../../types';
import { Target, ListTodo } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Timestamp } from 'firebase/firestore';

const LeaderTasks = () => {
  const { user } = useAuth();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OBJECTIVES' | 'TASKS'>('TASKS');

  const [objModalOpen, setObjModalOpen] = useState(false);
  const [newObj, setNewObj] = useState({ period: '', target: '', metricType: 'Project Count' });

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', objectiveId: '', memberId: '', deadline: '' });

  useEffect(() => {
    if (user?.teamId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [objs, tks, mems] = await Promise.all([
        fetchTeamObjectives(user!.teamId!),
        fetchTeamTasks(user!.teamId!),
        fetchMembers(user!.teamId!) as Promise<User[]>
      ]);
      setObjectives(objs);
      setTasks(tks);
      setMembers(mems.filter(m => m.role === 'Member'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const o = await createObjective({
        ...newObj,
        teamId: user!.teamId!
      });
      setObjectives([...objectives, o]);
      setObjModalOpen(false);
      setNewObj({ period: '', target: '', metricType: 'Project Count' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const t = await createTask({
        title: newTask.title,
        objectiveId: newTask.objectiveId,
        teamId: user!.teamId!,
        deadline: Timestamp.fromDate(new Date(newTask.deadline))
      });
      
      if (newTask.memberId) {
        await assignTask(t.id!, newTask.memberId);
      }
      
      setTasks([...tasks, t]);
      setTaskModalOpen(false);
      setNewTask({ title: '', objectiveId: '', memberId: '', deadline: '' });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading team data...</div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-theme-primary'>Team Management</h1>
          <p className='text-theme-text-secondary mt-1'>Objectives, Tasks, and Assignments</p>
        </div>
        <div className='flex gap-3'>
          <button 
            onClick={() => setObjModalOpen(true)}
            className='flex items-center gap-2 px-4 py-2 border border-theme-border text-theme-text hover:bg-theme-surface-higher rounded-lg transition-colors'
          >
            <Target size={18} /> New Objective
          </button>
          <button 
            onClick={() => setTaskModalOpen(true)}
            className='flex items-center gap-2 px-4 py-2 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-lg transition-colors shadow-glow'
          >
            <ListTodo size={18} /> Assign Task
          </button>
        </div>
      </div>

      <div className='flex gap-4 border-b border-theme-border mb-6'>
        <button 
          onClick={() => setActiveTab('TASKS')}
          className={`pb-3 px-2 font-medium transition-colors ${activeTab === 'TASKS' ? 'border-b-2 border-theme-accent text-theme-primary' : 'text-theme-text-secondary hover:text-theme-primary'}`}
        >
          Tasks
        </button>
        <button 
          onClick={() => setActiveTab('OBJECTIVES')}
          className={`pb-3 px-2 font-medium transition-colors ${activeTab === 'OBJECTIVES' ? 'border-b-2 border-theme-accent text-theme-primary' : 'text-theme-text-secondary hover:text-theme-primary'}`}
        >
          Objectives
        </button>
      </div>

      {activeTab === 'OBJECTIVES' && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {objectives.length === 0 && <p className='col-span-3 text-center text-theme-muted'>No objectives defined.</p>}
          {objectives.map(obj => (
            <div key={obj.id} className='card p-6'>
              <div className='flex items-center justify-between mb-4'>
                <span className='px-2 py-1 bg-theme-accent/10 text-theme-accent rounded text-xs font-bold'>{obj.period}</span>
                <Target size={20} className='text-theme-muted' />
              </div>
              <h3 className='font-bold text-lg text-theme-primary mb-1'>{obj.target}</h3>
              <p className='text-sm text-theme-text-secondary'>Metric: {obj.metricType}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'TASKS' && (
        <div className='space-y-4'>
          {tasks.length === 0 && <p className='text-center text-theme-muted'>No tasks created.</p>}
          {tasks.map(task => (
            <div key={task.id} className='card p-4 flex items-center justify-between hover:border-theme-border-active transition-colors'>
              <div>
                <h3 className='font-semibold text-theme-primary'>{task.title}</h3>
                <p className='text-sm text-theme-text-secondary'>Due: {(task.deadline as Timestamp).toDate().toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Objective Modal */}
      <Modal isOpen={objModalOpen} onClose={() => setObjModalOpen(false)} title='Create Team Objective'>
        <form onSubmit={handleCreateObjective} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Period</label>
            <input required type='month' value={newObj.period} onChange={e => setNewObj({...newObj, period: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent' />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Target / Goal</label>
            <input required type='text' value={newObj.target} onChange={e => setNewObj({...newObj, target: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent' placeholder='e.g., Complete 5 Projects' />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Metric Type</label>
            <select required value={newObj.metricType} onChange={e => setNewObj({...newObj, metricType: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent'>
              <option value='Project Count'>Project Count</option>
              <option value='Task Completion'>Task Completion</option>
              <option value='Learning Progress'>Learning Progress</option>
            </select>
          </div>
          <button type='submit' className='w-full py-2 bg-theme-accent text-white rounded-lg'>Create Objective</button>
        </form>
      </Modal>

      {/* Task Modal */}
      <Modal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} title='Create & Assign Task'>
        <form onSubmit={handleCreateTask} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Title</label>
            <input required type='text' value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent' />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Assign To (Member)</label>
            <select required value={newTask.memberId} onChange={e => setNewTask({...newTask, memberId: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent'>
              <option value=''>Select member...</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Related Objective (Optional)</label>
            <select value={newTask.objectiveId} onChange={e => setNewTask({...newTask, objectiveId: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent'>
              <option value=''>None</option>
              {objectives.map(o => <option key={o.id} value={o.id!}>{o.target} ({o.period})</option>)}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Deadline</label>
            <input required type='date' value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 outline-none focus:border-theme-accent' />
          </div>
          <button type='submit' className='w-full py-2 bg-theme-accent text-white rounded-lg'>Assign Task</button>
        </form>
      </Modal>

    </div>
  );
};

export default LeaderTasks;
