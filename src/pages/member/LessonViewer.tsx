import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Video, FileText, Link } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getLesson, fetchLessonsByCourse } from '../../services/lessonService';
import { getCourse } from '../../services/courseService';
import { fetchResourcesByLesson } from '../../services/resourceService';
import { markLessonComplete, getMemberProgress } from '../../services/progressService';
import type { Lesson, Course, Resource, Progress } from '../../types';

const LessonViewer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lessonId && user) {
      loadData();
    }
  }, [lessonId, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const lData = await getLesson(lessonId!);
      if (!lData) {
        setLoading(false);
        return;
      }
      setLesson(lData);

      const [cData, rData, allLessons, pData] = await Promise.all([
        getCourse(lData.courseId),
        fetchResourcesByLesson(lessonId!),
        fetchLessonsByCourse(lData.courseId),
        getMemberProgress(user!.id!, lData.courseId)
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

  const handleMarkComplete = async () => {
    if (!user || !lesson || !course) return;
    try {
      await markLessonComplete(user.id!, course.id!, lesson.id!, lesson.contentVersion);
      setIsCompleted(true);
      
      // Navigate to next lesson if available
      const currentIndex = courseLessons.findIndex(l => l.id === lesson.id);
      if (currentIndex !== -1 && currentIndex < courseLessons.length - 1) {
        navigate(`/member/learning/lesson/${courseLessons[currentIndex + 1].id}`);
      } else {
        navigate(`/member/learning/course/${course.id}`);
      }
    } catch (err) {
      console.error("Failed to mark complete", err);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading lesson...</div>;
  if (!lesson || !course) return <div className='p-12 text-center text-theme-absent'>Lesson not found.</div>;

  return (
    <div className='max-w-4xl mx-auto'>
      <button 
        onClick={() => navigate(`/member/learning/course/${course.id}`)}
        className='flex items-center gap-2 text-theme-text-secondary hover:text-theme-primary mb-6 transition-colors'
      >
        <ArrowLeft size={16} /> Back to {course.title}
      </button>

      {lesson.videoUrl && (
        <div className='aspect-video bg-black rounded-xl mb-8 overflow-hidden relative shadow-lg group'>
          <iframe 
            src={lesson.videoUrl.replace('watch?v=', 'embed/')} 
            className='w-full h-full'
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className='card p-8'>
        <div className='flex justify-between items-start mb-6 pb-6 border-b border-theme-border-subtle'>
          <div>
            <h1 className='text-3xl font-bold text-theme-primary mb-2'>{lesson.title}</h1>
            <p className='text-theme-text-secondary'>{lesson.videoUrl ? 'Video Lesson' : 'Reading Material'}</p>
          </div>
          {isCompleted && (
            <div className='flex items-center gap-2 text-theme-present bg-theme-present/10 px-4 py-2 rounded-lg'>
              <CheckCircle size={20} />
              <span className='font-medium'>Completed</span>
            </div>
          )}
        </div>

        <div className='prose prose-invert max-w-none text-theme-text mb-8'>
          {lesson.content.split('\n').map((para, i) => (
            <p key={i} className='mb-4'>{para}</p>
          ))}
        </div>

        {resources.length > 0 && (
          <div className='mt-8 pt-8 border-t border-theme-border-subtle'>
            <h3 className='text-lg font-bold text-theme-primary mb-4'>Resources</h3>
            <div className='grid gap-3'>
              {resources.map(resource => (
                <a 
                  key={resource.id} 
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className='flex items-center gap-3 p-4 bg-theme-surface-higher hover:bg-theme-border-subtle rounded-lg transition-colors group'
                >
                  <Link size={20} className='text-theme-accent group-hover:scale-110 transition-transform' />
                  <span className='font-medium text-theme-primary'>{resource.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className='mt-10 flex justify-end'>
          {!isCompleted ? (
            <button 
              onClick={handleMarkComplete}
              className='flex items-center gap-2 px-6 py-3 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-lg transition-colors font-medium shadow-glow'
            >
              <CheckCircle size={20} />
              Mark as Complete
            </button>
          ) : (
            <button 
              onClick={() => {
                const currentIndex = courseLessons.findIndex(l => l.id === lesson.id);
                if (currentIndex !== -1 && currentIndex < courseLessons.length - 1) {
                  navigate(`/member/learning/lesson/${courseLessons[currentIndex + 1].id}`);
                } else {
                  navigate(`/member/learning/course/${course.id}`);
                }
              }}
              className='px-6 py-3 bg-theme-surface-higher hover:bg-theme-border text-theme-primary rounded-lg transition-colors font-medium'
            >
              Next Lesson
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
