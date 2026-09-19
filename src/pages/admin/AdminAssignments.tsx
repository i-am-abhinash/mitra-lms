import React, { useEffect, useState } from 'react';
import { fetchAssignments, deleteAssignment } from '../../services/assignmentService';
import { fetchCourses } from '../../services/courseService';
import type { Assignment, Course } from '../../types';
import { Plus, Edit2, Trash2, FileText, Calendar, GitBranch, UploadCloud, BookOpen } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { CreateAssignmentForm } from './CreateAssignmentForm';
import { createAssignment } from '../../services/assignmentService';
import { format } from 'date-fns';

const AdminAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [aData, cData] = await Promise.all([fetchAssignments(), fetchCourses()]);
      setAssignments(aData);
      const courseMap = cData.reduce((acc, c) => ({ ...acc, [c.id!]: c }), {});
      setCourses(courseMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this assignment?')) {
      await deleteAssignment(id);
      loadData();
    }
  };

  const handleCreate = async (data: any) => {
    await createAssignment(data);
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-theme-primary'>Manage Assignments</h1>
          <p className='text-theme-text-secondary text-sm mt-1'>Create and grade course assignments</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className='flex items-center gap-2 bg-theme-accent hover:bg-theme-accent-hover text-white px-4 py-2 rounded-lg transition-colors shadow-glow'>
          <Plus size={18} /> <span>New Assignment</span>
        </button>
      </div>

      {loading ? (
        <div className='flex justify-center p-12'><div className='animate-pulse text-theme-accent'>Loading...</div></div>
      ) : assignments.length === 0 ? (
        <div className='card p-12 flex flex-col items-center justify-center text-center'>
          <FileText size={48} className='text-theme-muted mb-4' />
          <h3 className='text-lg font-medium text-theme-text'>No assignments yet</h3>
          <p className='text-theme-text-secondary text-sm mt-2'>Create an assignment to test your members' knowledge.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {assignments.map(a => (
            <div key={a.id} className='card p-5 flex flex-col hover:border-theme-accent transition-colors'>
              <div className='flex justify-between items-start mb-3'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs px-2 py-1 rounded-full bg-theme-surface-elevated text-theme-text-secondary font-medium flex items-center gap-1'>
                    {a.submissionType === 'GITHUB_REPOSITORY' ? <GitBranch size={12} /> : <UploadCloud size={12} />}
                    {a.submissionType.replace('_', ' ')}
                  </span>
                  <span className='text-xs px-2 py-1 rounded-full bg-theme-accent-light text-theme-accent font-bold'>
                    {a.maxMarks} pts
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <button className='p-1.5 text-theme-text-secondary hover:text-theme-accent hover:bg-theme-surface-higher rounded-md transition-colors'><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(a.id!)} className='p-1.5 text-theme-text-secondary hover:text-theme-absent hover:bg-theme-absent-bg rounded-md transition-colors'><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className='text-lg font-semibold text-theme-primary mb-1 line-clamp-1'>{a.title}</h3>
              <p className='text-sm text-theme-text-secondary line-clamp-2 mb-4 flex-1'>{a.description}</p>
              <div className='text-xs text-theme-muted flex items-center justify-between pt-4 border-t border-theme-border'>
                <div className='flex items-center gap-1 line-clamp-1 w-2/3'>
                  <BookOpen size={14} /> {courses[a.courseId]?.title || 'Unknown Course'}
                </div>
                <div className='flex items-center gap-1 font-medium'>
                  <Calendar size={14} /> {format((a.deadline.toDate ? a.deadline.toDate() : a.deadline), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Create New Assignment'>
        <CreateAssignmentForm onCancel={() => setIsModalOpen(false)} onSubmit={handleCreate} />
      </Modal>
    </div>
  );
};

export default AdminAssignments;
