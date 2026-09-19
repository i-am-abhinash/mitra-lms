import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockLessons, mockCourses } from '../../mockData';
import { ArrowLeft, ChevronLeft, ChevronRight, Video, FileText } from 'lucide-react';

const LessonViewer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = mockLessons.find(l => l.id === lessonId) || mockLessons[0];
  const course = mockCourses.find(c => c.id === lesson.courseId);

  return (
    <div className='max-w-5xl mx-auto'>
      <button 
        onClick={() => navigate(`/member/learning/course/${course?.id}`)}
        className='flex items-center gap-2 text-theme-text-secondary hover:text-theme-primary mb-6 transition-colors'
      >
        <ArrowLeft size={16} /> Back to {course?.title}
      </button>

      <div className='card overflow-hidden mb-6'>
        <div className='aspect-video bg-black flex items-center justify-center border-b border-theme-border relative group'>
          {lesson.videoUrl ? (
            <div className='text-theme-text-secondary flex flex-col items-center gap-2'>
              <Video size={48} className='opacity-50' />
              <p>Video Player Placeholder</p>
            </div>
          ) : (
            <div className='text-theme-text-secondary flex flex-col items-center gap-2'>
              <FileText size={48} className='opacity-50' />
              <p>Reading Material</p>
            </div>
          )}
        </div>
        <div className='p-6 md:p-8'>
          <h1 className='text-2xl font-bold text-theme-primary mb-4'>{lesson.title}</h1>
          <div className='prose prose-invert max-w-none text-theme-text-secondary'>
            {lesson.content}
          </div>
        </div>
      </div>

      <div className='flex justify-between items-center'>
        <button className='flex items-center gap-2 px-4 py-2 rounded-lg text-theme-text-secondary hover:bg-theme-surface-higher transition-colors'>
          <ChevronLeft size={18} /> Previous Lesson
        </button>
        <button className='flex items-center gap-2 px-4 py-2 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white transition-colors'>
          Next Lesson <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default LessonViewer;
