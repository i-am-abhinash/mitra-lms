import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Lesson } from '../../types';

// All sections are optional
const lessonSchema = z.object({
  title: z.string().min(3, 'Module title is required'),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  content: z.string().optional().or(z.literal('')),
  // Course assignment title (optional)
  assignmentTitle: z.string().optional().or(z.literal('')),
  assignmentDescription: z.string().optional().or(z.literal(''))
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface Props {
  courseId: string;
  moduleId: string;
  orderIndex: number;
  onSubmit: (data: Omit<Lesson, 'id' | 'contentVersion'>) => Promise<void>;
  onCancel: () => void;
}

export const CreateLessonForm = ({ courseId, moduleId, orderIndex, onSubmit, onCancel }: Props) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema)
  });

  const submitHandler = async (data: LessonFormData) => {
    await onSubmit({
      title: data.title,
      content: data.content || '',
      courseId,
      moduleId,
      order: orderIndex,
      videoUrl: data.videoUrl || '',
      // Store assignment info inside the lesson if provided
      assignmentTitle: data.assignmentTitle || '',
      assignmentDescription: data.assignmentDescription || '',
    } as any);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className='space-y-6'>
      <div>
        <label className='block text-sm font-semibold text-theme-text mb-1'>Module Title</label>
        <input {...register('title')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' placeholder='e.g. PyTorch Basics' />
        {errors.title && <p className='text-theme-absent text-xs mt-1'>{errors.title.message}</p>}
      </div>

      <div className='border-t border-theme-border-subtle pt-4'>
        <p className='text-xs font-bold uppercase tracking-widest text-theme-muted mb-3'>VIDEO <span className='font-normal normal-case tracking-normal text-theme-muted ml-1'>— Optional</span></p>
        <input {...register('videoUrl')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' placeholder='https://youtube.com/watch?v=...' />
        {errors.videoUrl && <p className='text-theme-absent text-xs mt-1'>{errors.videoUrl.message}</p>}
      </div>

      <div className='border-t border-theme-border-subtle pt-4'>
        <p className='text-xs font-bold uppercase tracking-widest text-theme-muted mb-3'>THEORY <span className='font-normal normal-case tracking-normal text-theme-muted ml-1'>— Optional</span></p>
        <textarea {...register('content')} rows={5} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' placeholder='Educational content, concepts, explanations...' />
      </div>

      <div className='border-t border-theme-border-subtle pt-4'>
        <p className='text-xs font-bold uppercase tracking-widest text-theme-muted mb-3'>COURSE ASSIGNMENT <span className='font-normal normal-case tracking-normal text-theme-muted ml-1'>— Optional</span></p>
        <input {...register('assignmentTitle')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors mb-2' placeholder='Assignment title, e.g. Build an ANN Model' />
        <textarea {...register('assignmentDescription')} rows={3} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' placeholder='Describe what the member must build or do...' />
      </div>

      <div className='flex justify-end gap-3 pt-4 border-t border-theme-border-subtle'>
        <button type='button' onClick={onCancel} className='px-4 py-2 rounded-lg text-theme-text-secondary hover:bg-theme-surface-higher transition-colors'>Cancel</button>
        <button type='submit' disabled={isSubmitting} className='px-4 py-2 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white transition-colors shadow-glow disabled:opacity-50'>
          {isSubmitting ? 'Saving...' : 'Save Module'}
        </button>
      </div>
    </form>
  );
};
