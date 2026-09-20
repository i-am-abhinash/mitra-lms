import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Link as LinkIcon, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { getAssignment, getMemberSubmission, saveSubmission } from '../../services/assignmentService';
import { getCourse } from '../../services/courseService';
import type { Assignment, Course, Submission } from '../../types';
import { Timestamp } from 'firebase/firestore';

const MemberAssignmentDetail = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  
  const [submissionContent, setSubmissionContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assignmentId && user) {
      loadData();
    }
  }, [assignmentId, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const aData = await getAssignment(assignmentId!);
      if (aData) {
        setAssignment(aData);
        const cData = await getCourse(aData.courseId);
        setCourse(cData);
        
        const subData = await getMemberSubmission(user!.id!, aData.id!);
        if (subData) {
          setSubmission(subData);
          setSubmissionContent(subData.content);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (isDraft: boolean) => {
    if (!user || !assignment || !course) return;
    setIsSubmitting(true);
    try {
      const newStatus = isDraft ? 'DRAFT' : 'SUBMITTED';
      await saveSubmission({
        assignmentId: assignment.id!,
        memberId: user.id!,
        teamId: user.teamId || '',
        courseId: course.id!,
        status: newStatus,
        submittedAt: Timestamp.now(),
        content: submissionContent
      });
      // reload to get updated state
      await loadData();
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading assignment...</div>;
  if (!assignment) return <div className='p-12 text-center text-theme-absent'>Assignment not found</div>;

  const isSubmitted = submission?.status === 'SUBMITTED' || submission?.status === 'EVALUATED' || submission?.status === 'LATE';
  const deadlineDate = (assignment.deadline as Timestamp).toDate ? (assignment.deadline as Timestamp).toDate() : assignment.deadline as Date;

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
                <span className='text-theme-accent text-sm font-semibold mb-2 block'>{course?.title}</span>
                <h1 className='text-3xl font-bold text-theme-primary'>{assignment.title}</h1>
              </div>
            </div>
            
            <div className='flex items-center gap-6 py-4 border-y border-theme-border-subtle my-6 text-sm'>
              <div>
                <span className='text-theme-text-secondary block mb-1'>Points</span>
                <span className='font-semibold text-theme-text'>{assignment.maxMarks}</span>
              </div>
              <div>
                <span className='text-theme-text-secondary block mb-1'>Format</span>
                <span className='font-semibold text-theme-text'>{assignment.submissionType.replace('_', ' ')}</span>
              </div>
            </div>

            <div className='prose prose-invert max-w-none text-theme-text'>
              <p>{assignment.description}</p>
            </div>
          </div>

          <div className='card p-6 md:p-8'>
            <h2 className='text-xl font-bold text-theme-primary mb-6'>Your Work</h2>
            
            {submission?.status === 'EVALUATED' && (
              <div className='mb-6 p-4 bg-theme-surface-higher border border-theme-border rounded-xl'>
                <h3 className='font-bold text-theme-primary mb-2'>Evaluation Feedback</h3>
                <div className='text-3xl font-bold text-theme-accent mb-2'>{submission.score} / {assignment.maxMarks}</div>
                <p className='text-theme-text-secondary'>{submission.feedback}</p>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSave(false); }}>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-theme-text-secondary mb-2'>
                  Submission Content ({assignment.submissionType.replace('_', ' ')})
                </label>
                <textarea 
                  required
                  disabled={isSubmitted}
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-3 text-theme-text focus:border-theme-accent outline-none min-h-[150px] disabled:opacity-50'
                  placeholder='Enter your submission or provide the URL...'
                />
              </div>

              {!isSubmitted && (
                <div className='flex items-center justify-end gap-3'>
                  <button 
                    type='button'
                    disabled={isSubmitting}
                    onClick={() => handleSave(true)}
                    className='px-4 py-2 border border-theme-border text-theme-text hover:bg-theme-surface-higher rounded-lg font-medium transition-colors disabled:opacity-50'
                  >
                    Save Draft
                  </button>
                  <button 
                    type='submit' 
                    disabled={isSubmitting || !submissionContent}
                    className='flex items-center gap-2 px-6 py-2 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-lg font-medium shadow-glow transition-colors disabled:opacity-50'
                  >
                    <Upload size={18} />
                    {isSubmitting ? 'Submitting...' : 'Submit Final Work'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='card p-6'>
            <h3 className='font-bold text-theme-primary mb-4'>Status</h3>
            
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <Clock className={clsx('mt-1 shrink-0', new Date() > deadlineDate && !isSubmitted ? 'text-theme-absent' : 'text-theme-muted')} size={18} />
                <div>
                  <p className='text-sm text-theme-text-secondary font-medium'>Deadline</p>
                  <p className={clsx('font-semibold', new Date() > deadlineDate && !isSubmitted ? 'text-theme-absent' : 'text-theme-text')}>
                    {format(deadlineDate, 'PPP')}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <CheckCircle className={clsx('mt-1 shrink-0', isSubmitted ? 'text-theme-present' : 'text-theme-muted')} size={18} />
                <div>
                  <p className='text-sm text-theme-text-secondary font-medium'>Submission</p>
                  <p className={clsx('font-semibold', isSubmitted ? 'text-theme-present' : 'text-theme-text')}>
                    {submission?.status || 'Not Submitted'}
                  </p>
                  {isSubmitted && submission?.submittedAt && (
                    <p className='text-xs text-theme-text-secondary mt-1'>
                      {format((submission.submittedAt as Timestamp).toDate ? (submission.submittedAt as Timestamp).toDate() : submission.submittedAt as Date, 'PP p')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberAssignmentDetail;
