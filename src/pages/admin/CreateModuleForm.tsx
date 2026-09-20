import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Module } from '../../types';

const moduleSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(5, 'Description is required')
});

type ModuleFormData = z.infer<typeof moduleSchema>;

interface Props {
  courseId: string;
  orderIndex: number;
  onSubmit: (data: Omit<Module, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export const CreateModuleForm = ({ courseId, orderIndex, onSubmit, onCancel }: Props) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema)
  });

  const submitHandler = async (data: ModuleFormData) => {
    await onSubmit({
      ...data,
      courseId,
      order: orderIndex
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Module Title</label>
        <input {...register('title')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' />
        {errors.title && <p className='text-theme-absent text-xs mt-1'>{errors.title.message}</p>}
      </div>
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Description</label>
        <textarea {...register('description')} rows={3} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors'></textarea>
        {errors.description && <p className='text-theme-absent text-xs mt-1'>{errors.description.message}</p>}
      </div>
      <div className='flex justify-end gap-3 mt-6 pt-4 border-t border-theme-border-subtle'>
        <button type='button' onClick={onCancel} className='px-4 py-2 rounded-lg text-theme-text-secondary hover:bg-theme-surface-higher transition-colors'>Cancel</button>
        <button type='submit' disabled={isSubmitting} className='px-4 py-2 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white transition-colors shadow-glow disabled:opacity-50'>{isSubmitting ? 'Saving...' : 'Add Module'}</button>
      </div>
    </form>
  );
};
