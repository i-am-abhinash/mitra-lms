import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Lesson } from '../../types';

const lessonSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  type: z.enum(['VIDEO', 'READING', 'RESOURCE']),
  content: z.string().min(5, 'Content is required'),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal(''))
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface Props {
  courseId: string;
  moduleId: string;
  orderIndex: number;
  onSubmit: (data: Omit<Lesson, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export const CreateLessonForm = ({ courseId, moduleId, orderIndex, onSubmit, onCancel }: Props) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: { type: 'VIDEO' }
  });

  const watchType = watch('type');

  const submitHandler = async (data: LessonFormData) => {
    await onSubmit({
      ...data,
      courseId,
      moduleId,
      orderIndex,
      videoUrl: data.videoUrl || null
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Lesson Title</label>
        <input {...register('title')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' />
        {errors.title && <p className='text-theme-absent text-xs mt-1'>{errors.title.message}</p>}
      </div>
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Type</label>
        <select {...register('type')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors'>
          <option value='VIDEO'>Video</option>
          <option value='READING'>Reading Material</option>
          <option value='RESOURCE'>Resource Link</option>
        </select>
      </div>
      {watchType === 'VIDEO' && (
        <div>
          <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Video URL (YouTube/Vimeo)</label>
          <input {...register('videoUrl')} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' />
          {errors.videoUrl && <p className='text-theme-absent text-xs mt-1'>{errors.videoUrl.message}</p>}
        </div>
      )}
      <div>
        <label className='block text-sm font-medium text-theme-text-secondary mb-1'>{watchType === 'VIDEO' ? 'Summary/Notes' : 'Content'}</label>
        <textarea {...register('content')} rows={4} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors'></textarea>
        {errors.content && <p className='text-theme-absent text-xs mt-1'>{errors.content.message}</p>}
      </div>
      <div className='flex justify-end gap-3 mt-6 pt-4 border-t border-theme-border-subtle'>
        <button type='button' onClick={onCancel} className='px-4 py-2 rounded-lg text-theme-text-secondary hover:bg-theme-surface-higher transition-colors'>Cancel</button>
        <button type='submit' disabled={isSubmitting} className='px-4 py-2 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white transition-colors shadow-glow disabled:opacity-50'>{isSubmitting ? 'Saving...' : 'Add Lesson'}</button>
      </div>
    </form>
  );
};
