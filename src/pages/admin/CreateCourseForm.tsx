import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Course } from '../../types';
import { useAuth } from '../../context/AuthContext';

const courseSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(2, 'Category is required'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  estimatedDurationMins: z.number().min(1, 'Duration must be greater than 0'),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface Props {
  onSubmit: (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<void>;
  onCancel: () => void;
}

export const CreateCourseForm = ({ onSubmit, onCancel }: Props) => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      difficulty: 'Beginner',
      status: 'DRAFT',
      estimatedDurationMins: 60
    }
  });

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const submitHandler = async (data: CourseFormData) => {
    setErrorMsg(null);
    try {
      await onSubmit({
        ...data,
        thumbnailUrl: '',
        createdBy: user?.id || 'unknown'
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create course');
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className='space-y-4'>
      {errorMsg && <div className='p-3 bg-theme-absent-bg text-theme-absent rounded-lg text-sm'>{errorMsg}</div>}
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Title</label>
        <input {...register('title')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' />
        {errors.title && <p className='text-theme-absent text-xs mt-1'>{errors.title.message}</p>}
      </div>
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Description</label>
        <textarea {...register('description')} rows={3} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors'></textarea>
        {errors.description && <p className='text-theme-absent text-xs mt-1'>{errors.description.message}</p>}
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Category (e.g. AI, Math)</label>
          <input {...register('category')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' />
          {errors.category && <p className='text-theme-absent text-xs mt-1'>{errors.category.message}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Duration (mins)</label>
          <input type='number' {...register('estimatedDurationMins', { valueAsNumber: true })} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' />
          {errors.estimatedDurationMins && <p className='text-theme-absent text-xs mt-1'>{errors.estimatedDurationMins.message}</p>}
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Difficulty</label>
          <select {...register('difficulty')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors'>
            <option value='Beginner'>Beginner</option>
            <option value='Intermediate'>Intermediate</option>
            <option value='Advanced'>Advanced</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Status</label>
          <select {...register('status')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors'>
            <option value='DRAFT'>Draft</option>
            <option value='PUBLISHED'>Published</option>
          </select>
        </div>
      </div>
      <div className='sticky -bottom-5 -mx-5 -mb-5 px-5 py-4 bg-theme-surface border-t border-theme-border-subtle flex justify-end gap-3 mt-6'>
        <button type='button' onClick={onCancel} className='px-4 py-2 rounded-lg text-theme-text-secondary hover:bg-theme-surface-higher transition-colors'>Cancel</button>
        <button type='submit' disabled={isSubmitting} className='px-4 py-2 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white transition-colors shadow-glow disabled:opacity-50'>{isSubmitting ? 'Saving...' : 'Create Course'}</button>
      </div>
    </form>
  );
};
