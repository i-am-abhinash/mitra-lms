import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchMemberTaskAssignments, updateTaskStatus } from '../../services/teamWorkService';
import type { TaskAssignment } from '../../types';
import { CheckCircle, Clock } from 'lucide-react';
import { getDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

const MemberTasks = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<(TaskAssignment & { taskTitle?: string, deadline?: Timestamp })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const assigns = await fetchMemberTaskAssignments(user!.id!);
      
      // Fetch task details for each assignment
      const enriched = await Promise.all(assigns.map(async (a) => {
        const taskSnap = await getDoc(doc(db, 'tasks', a.taskId));
        if (taskSnap.exists()) {
          const taskData = taskSnap.data();
          return { ...a, taskTitle: taskData.title, deadline: taskData.deadline };
        }
        return a;
      }));
      
      setAssignments(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (assignment: TaskAssignment & { taskTitle?: string }) => {
    const newStatus = assignment.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    await updateTaskStatus(assignment.id!, newStatus);
    loadData();
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading tasks...</div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>My Tasks</h1>
        <p className='text-theme-text-secondary mt-1'>Manage your assigned tasks</p>
      </div>

      <div className='grid gap-4'>
        {assignments.length === 0 && (
          <div className='text-center py-12 text-theme-muted border-2 border-dashed border-theme-border-active rounded-lg'>
            No tasks assigned.
          </div>
        )}
        
        {assignments.map(a => (
          <div key={a.id} className='card p-5 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <button 
                onClick={() => handleToggleStatus(a)}
                className={`flex-shrink-0 transition-colors ${a.status === 'COMPLETED' ? 'text-theme-present' : 'text-theme-muted hover:text-theme-accent'}`}
              >
                <CheckCircle size={28} />
              </button>
              <div>
                <h3 className={`font-semibold text-lg ${a.status === 'COMPLETED' ? 'line-through text-theme-text-secondary' : 'text-theme-primary'}`}>
                  {a.taskTitle || 'Unknown Task'}
                </h3>
                <div className='flex items-center gap-2 mt-1 text-sm text-theme-text-secondary'>
                  <Clock size={14} />
                  {a.deadline ? a.deadline.toDate().toLocaleDateString() : 'No deadline'}
                  
                  {a.status === 'COMPLETED' && a.completedAt && (
                    <span className='ml-2 text-theme-present'>
                      (Completed {(a.completedAt as Timestamp).toDate().toLocaleDateString()})
                    </span>
                  )}
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${a.status === 'COMPLETED' ? 'bg-theme-present-bg text-theme-present' : 'bg-yellow-500/10 text-yellow-500'}`}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberTasks;
