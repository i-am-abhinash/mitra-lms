import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchCourses } from '../../services/courseService';
import type { Course, Assignment } from '../../types';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const assignmentSchema = z.object({
  courseId: z.string().optional().or(z.literal('')),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  submissionType: z.enum(['GITHUB_REPOSITORY', 'FILE', 'FOLDER']),
  maxMarks: z.number().min(1, 'Points must be at least 1'),
  deadline: z.string().min(1, 'Deadline is required')
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface Props {
  onSubmit: (data: Omit<Assignment, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
}

export const CreateAssignmentForm = ({ onSubmit, onCancel }: Props) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: { submissionType: 'GITHUB_REPOSITORY', maxMarks: 100 }
  });

  useEffect(() => {
    fetchCourses().then(setCourses);
  }, []);

  const submitHandler = async (data: AssignmentFormData) => {
    await onSubmit({
      courseId: data.courseId || '',
      title: data.title,
      description: data.description,
      submissionType: data.submissionType,
      maxMarks: data.maxMarks,
      moduleId: null,
      status: 'PUBLISHED',
      createdBy: user?.id || '',
      deadline: Timestamp.fromDate(new Date(data.deadline))
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Course</label>
        <select {...register('courseId')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors'>
          <option value=''>Standalone / No Course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        {errors.courseId && <p className='text-theme-absent text-xs mt-1'>{errors.courseId.message}</p>}
      </div>
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Title</label>
        <input {...register('title')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' />
        {errors.title && <p className='text-theme-absent text-xs mt-1'>{errors.title.message}</p>}
      </div>
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Description / Instructions</label>
        <textarea {...register('description')} rows={4} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors'></textarea>
        {errors.description && <p className='text-theme-absent text-xs mt-1'>{errors.description.message}</p>}
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Submission Type</label>
          <select {...register('submissionType')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors'>
            <option value='GITHUB_REPOSITORY'>GitHub Repository</option>
            <option value='FILE'>File Upload</option>
            <option value='FOLDER'>Folder Upload</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Maximum Marks</label>
          <input type='number' {...register('maxMarks', { valueAsNumber: true })} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' />
          {errors.maxMarks && <p className='text-theme-absent text-xs mt-1'>{errors.maxMarks.message}</p>}
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Deadline</label>
        <input type='datetime-local' {...register('deadline')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' />
        {errors.deadline && <p className='text-theme-absent text-xs mt-1'>{errors.deadline.message}</p>}
      </div>
      <div className='flex justify-end gap-3 mt-6 pt-4 border-t border-theme-border-subtle'>
        <button type='button' onClick={onCancel} className='px-4 py-2 rounded-lg text-theme-text-secondary hover:bg-theme-surface-higher transition-colors'>Cancel</button>
        <button type='submit' disabled={isSubmitting} className='px-4 py-2 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white transition-colors shadow-glow disabled:opacity-50'>{isSubmitting ? 'Saving...' : 'Create Assignment'}</button>
      </div>
    </form>
  );
};

