import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Link, GitBranch, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getLesson, fetchLessonsByCourse } from '../../services/lessonService';
import { getCourse } from '../../services/courseService';
import { fetchResourcesByLesson } from '../../services/resourceService';
import { markLessonComplete, getMemberProgress } from '../../services/progressService';
import type { Lesson, Course, Resource, Progress } from '../../types';

const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Assignment submission state
  const [githubUrl, setGithubUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState<FileList | null>(null);
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (lessonId && user) loadData();
  }, [lessonId, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const lData = await getLesson(lessonId!);
      if (!lData) { setLoading(false); return; }
      setLesson(lData);

      const effectiveCourseId = courseId || lData.courseId;

      const [cData, rData, allLessons, pData] = await Promise.all([
        getCourse(effectiveCourseId),
        fetchResourcesByLesson(lessonId!),
        fetchLessonsByCourse(effectiveCourseId),
        getMemberProgress(user!.id!, effectiveCourseId)
      ]);

      setCourse(cData);
      setResources(rData);
      setCourseLessons(allLessons.sort((a, b) => a.order - b.order));
      const completed = pData.some(p => p.lessonId === lessonId);
      setIsCompleted(completed);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const navigateLesson = (lessonId: string) => {
    if (course) navigate(`/member/learning/${course.id}/lesson/${lessonId}`);
    else navigate(`/member/learning/lesson/${lessonId}`);
  };

  const handleMarkComplete = async () => {
    if (!user || !lesson || !course) return;
    try {
      await markLessonComplete(user.id!, course.id!, lesson.id!, lesson.contentVersion);
      setIsCompleted(true);
      const currentIndex = courseLessons.findIndex(l => l.id === lesson.id);
      if (currentIndex !== -1 && currentIndex < courseLessons.length - 1) {
        navigateLesson(courseLessons[currentIndex + 1].id!);
      } else {
        navigate(`/member/learning/${course.id}`);
      }
    } catch (err) {
      console.error('Failed to mark complete', err);
    }
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!githubUrl && !file && !folder) {
      setSubmitError('Please provide at least one submission.');
      return;
    }
    setSubmittingAssignment(true);
    try {
      await handleMarkComplete();
      setAssignmentSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed');
    } finally {
      setSubmittingAssignment(false);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading lesson...</div>;
  if (!lesson || !course) return <div className='p-12 text-center text-theme-absent'>Lesson not found.</div>;

  const lessonAny = lesson as any;

  return (
    <div className='max-w-4xl mx-auto'>
      <button
        onClick={() => navigate(`/member/learning/${course.id}`)}
        className='flex items-center gap-2 text-theme-text-secondary hover:text-theme-primary mb-6 transition-colors'
      >
        <ArrowLeft size={16} /> Back to {course.title}
      </button>

      {/* VIDEO — only if videoUrl present */}
      {lesson.videoUrl && (
        <div className='aspect-video bg-black rounded-xl mb-8 overflow-hidden shadow-lg'>
          <iframe
            src={lesson.videoUrl.replace('watch?v=', 'embed/')}
            className='w-full h-full'
            allowFullScreen
          />
        </div>
      )}

      {/* THEORY — only if content present */}
      {lesson.content && (
        <div className='card p-8 mb-6'>
          <div className='flex justify-between items-start mb-6 pb-6 border-b border-theme-border-subtle'>
            <div>
              <h1 className='text-3xl font-bold text-theme-primary mb-2'>{lesson.title}</h1>
              {isCompleted && (
                <div className='flex items-center gap-2 text-theme-present text-sm mt-1'>
                  <CheckCircle size={16} /> Completed
                </div>
              )}
            </div>
          </div>

          <div className='prose max-w-none text-theme-text'>
            {lesson.content.split('\n').map((para, i) => para ? <p key={i} className='mb-4'>{para}</p> : <br key={i} />)}
          </div>
        </div>
      )}

      {/* Show title card if no content (video-only) */}
      {!lesson.content && (
        <div className='card p-6 mb-6'>
          <h1 className='text-2xl font-bold text-theme-primary'>{lesson.title}</h1>
          {isCompleted && (
            <div className='flex items-center gap-2 text-theme-present text-sm mt-2'>
              <CheckCircle size={16} /> Completed
            </div>
          )}
        </div>
      )}

      {/* RESOURCES */}
      {resources.length > 0 && (
        <div className='card p-6 mb-6'>
          <h3 className='text-lg font-bold text-theme-primary mb-4'>Resources</h3>
          <div className='grid gap-3'>
            {resources.map(resource => (
              <a
                key={resource.id}
                href={resource.url}
                target='_blank'
                rel='noreferrer'
                className='flex items-center gap-3 p-4 bg-theme-surface-higher hover:bg-theme-border-subtle rounded-lg transition-colors'
              >
                <Link size={20} className='text-theme-accent' />
                <span className='font-medium text-theme-primary'>{resource.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* COURSE ASSIGNMENT — only if assignmentTitle present */}
      {lessonAny.assignmentTitle && (
        <div className='card p-6 mb-6 border-theme-accent/30'>
          <h3 className='text-lg font-bold text-theme-primary mb-1'>Course Assignment</h3>
          <p className='font-semibold text-theme-accent mb-2'>{lessonAny.assignmentTitle}</p>
          {lessonAny.assignmentDescription && (
            <p className='text-theme-text-secondary text-sm mb-4'>{lessonAny.assignmentDescription}</p>
          )}

          {assignmentSubmitted ? (
            <div className='flex items-center gap-2 text-theme-present bg-theme-present/10 px-4 py-3 rounded-lg'>
              <CheckCircle size={20} /> Assignment submitted successfully
            </div>
          ) : (
            <form onSubmit={handleAssignmentSubmit} className='space-y-4'>
              {submitError && <div className='p-3 bg-theme-absent-bg text-theme-absent rounded-lg text-sm'>{submitError}</div>}
              <div>
                <label className='block text-sm font-medium text-theme-text-secondary mb-1'>
                  <GitBranch size={14} className='inline mr-1' /> GitHub Repository URL
                </label>
                <input
                  type='url'
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                  className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none'
                  placeholder='https://github.com/username/project'
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Upload File</label>
                  <input
                    type='file'
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2 text-theme-text text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Upload Folder</label>
                  <input
                    type='file'
                    {...{ webkitdirectory: '', directory: '' } as any}
                    onChange={e => setFolder(e.target.files)}
                    className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2 text-theme-text text-sm'
                  />
                </div>
              </div>
              <button
                type='submit'
                disabled={submittingAssignment}
                className='flex items-center gap-2 px-5 py-2 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-lg transition-colors font-medium disabled:opacity-50'
              >
                <Upload size={16} /> Submit Assignment
              </button>
            </form>
          )}
        </div>
      )}

      {/* Mark Complete / Next */}
      <div className='flex justify-end mt-4'>
        {!isCompleted && !lessonAny.assignmentTitle ? (
          <button
            onClick={handleMarkComplete}
            className='flex items-center gap-2 px-6 py-3 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-lg transition-colors font-medium shadow-glow'
          >
            <CheckCircle size={20} /> Mark as Complete
          </button>
        ) : isCompleted ? (
          <button
            onClick={() => {
              const currentIndex = courseLessons.findIndex(l => l.id === lesson.id);
              if (currentIndex !== -1 && currentIndex < courseLessons.length - 1) {
                navigateLesson(courseLessons[currentIndex + 1].id!);
              } else {
                navigate(`/member/learning/${course.id}`);
              }
            }}
            className='px-6 py-3 bg-theme-surface-higher hover:bg-theme-border text-theme-primary rounded-lg transition-colors font-medium'
          >
            Next Lesson →
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default LessonViewer;
