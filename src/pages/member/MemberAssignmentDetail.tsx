import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAssignments, mockCourses, mockSubmissions } from '../../mockData';
import { ArrowLeft, Upload, Link as LinkIcon, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

const MemberAssignmentDetail = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const assignment = mockAssignments.find(a => a.id === assignmentId) || mockAssignments[0];
  const course = mockCourses.find(c => c.id === assignment.courseId);
  const submission = mockSubmissions.find(s => s.assignmentId === assignment.id);
  
  const [submissionContent, setSubmissionContent] = useState(submission?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Submitted successfully (Mock)!');
    }, 1000);
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <button 
        onClick={() => navigate('/member/assignments')}
        className='flex items-center gap-2 text-theme-text-secondary hover:text-theme-primary mb-6 transition-colors'
      >
        <ArrowLeft size={16} /> Back to Assignments
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='card p-6 md:p-8'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h1 className='text-2xl font-bold text-theme-primary mb-1'>{assignment.title}</h1>
                <p className='text-theme-accent'>{course?.title}</p>
              </div>
              <span className='px-3 py-1 bg-theme-surface-elevated text-theme-primary rounded-lg text-sm font-bold'>
                {assignment.maxMarks} pts
              </span>
            </div>
            
            <div className='prose prose-invert max-w-none text-theme-text-secondary mt-6 pt-6 border-t border-theme-border-subtle'>
              <h3 className='text-theme-primary text-lg font-medium mb-2'>Instructions</h3>
              <p>{assignment.description}</p>
            </div>
          </div>

          {!submission && (
            <div className='card p-6 md:p-8'>
              <h3 className='text-xl font-bold text-theme-primary mb-4'>Your Submission</h3>
              <form onSubmit={handleSubmit} className='space-y-4'>
                {assignment.submissionType === 'GITHUB_REPOSITORY' || assignment.submissionType === 'URL' ? (
                  <div>
                    <label className='block text-sm font-medium text-theme-text-secondary mb-2'>Repository / Project URL</label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <LinkIcon size={16} className='text-theme-muted' />
                      </div>
                      <input 
                        type='url' 
                        required
                        value={submissionContent}
                        onChange={(e) => setSubmissionContent(e.target.value)}
                        placeholder='https://github.com/...' 
                        className='w-full pl-10 bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none transition-colors' 
                      />
                    </div>
                  </div>
                ) : (
                  <div className='border-2 border-dashed border-theme-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-theme-accent hover:bg-theme-surface-higher transition-colors cursor-pointer'>
                    <Upload size={32} className='text-theme-muted mb-4' />
                    <p className='text-theme-primary font-medium mb-1'>Click to upload or drag and drop</p>
                    <p className='text-theme-text-secondary text-sm'>ZIP, PDF, or Markdown (Max 10MB)</p>
                  </div>
                )}
                <div className='flex justify-end pt-4'>
                  <button type='submit' disabled={isSubmitting || !submissionContent} className='px-6 py-2 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-lg transition-colors font-medium shadow-glow disabled:opacity-50'>
                    {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className='space-y-6'>
          <div className='card p-5'>
            <h3 className='font-bold text-theme-primary mb-4'>Details</h3>
            <div className='space-y-4'>
              <div>
                <p className='text-xs text-theme-muted mb-1'>Status</p>
                <div className='flex items-center gap-2'>
                  {submission ? (
                    <span className={clsx('flex items-center gap-1 text-sm font-medium', submission.status === 'EVALUATED' ? 'text-theme-accent' : 'text-theme-present')}>
                      <CheckCircle size={16} /> {submission.status}
                    </span>
                  ) : (
                    <span className='flex items-center gap-1 text-sm font-medium text-theme-late'>
                      <Clock size={16} /> Pending
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className='text-xs text-theme-muted mb-1'>Due Date</p>
                <p className='text-sm text-theme-primary'>{(assignment.deadline as any).toDate ? format((assignment.deadline as any).toDate(), 'MMM d, yyyy h:mm a') : format(assignment.deadline as Date, 'MMM d, yyyy h:mm a')}</p>
              </div>
              <div>
                <p className='text-xs text-theme-muted mb-1'>Submission Type</p>
                <p className='text-sm text-theme-primary'>{assignment.submissionType.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {submission && (
            <div className='card p-5'>
              <h3 className='font-bold text-theme-primary mb-4'>Evaluation</h3>
              {submission.status === 'EVALUATED' ? (
                <div>
                  <div className='flex items-end gap-2 mb-4'>
                    <span className='text-4xl font-bold text-theme-accent'>{submission.score}</span>
                    <span className='text-theme-text-secondary pb-1'>/ {assignment.maxMarks}</span>
                  </div>
                  <div className='bg-theme-surface-higher p-3 rounded-lg border border-theme-border-subtle'>
                    <p className='text-sm text-theme-primary mb-1 font-medium'>Feedback</p>
                    <p className='text-sm text-theme-text-secondary'>{submission.feedback}</p>
                  </div>
                </div>
              ) : (
                <p className='text-sm text-theme-text-secondary'>Your submission is currently under review by your team leader.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberAssignmentDetail;
