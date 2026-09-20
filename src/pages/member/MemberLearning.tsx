import React, { useEffect, useState } from 'react';
import { CourseCard } from '../../components/lms/CourseCard';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { EmptyState } from '../../components/lms/EmptyState';
import { fetchCourses } from '../../services/courseService';
import { getMemberProgress } from '../../services/progressService';
import { fetchLessonsByCourse } from '../../services/lessonService';
import { useAuth } from '../../context/AuthContext';
import type { Course } from '../../types';

const MemberLearning = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<(Course & { progressPct: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCourses();
    }
  }, [user]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const publishedCourses = await fetchCourses('PUBLISHED');
      
      const enrichedCourses = await Promise.all(publishedCourses.map(async (course) => {
        const [lessons, progress] = await Promise.all([
          fetchLessonsByCourse(course.id!),
          getMemberProgress(user!.id!, course.id!)
        ]);
        
        const completedCount = new Set(progress.map(p => p.lessonId)).size;
        const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
        
        return { ...course, progressPct };
      }));
      
      setCourses(enrichedCourses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading courses...</div>;
  }

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>My Learning</h1>
        <p className='text-theme-text-secondary mt-1'>Continue your registered courses</p>
      </div>

      {courses.length === 0 ? (
        <EmptyState 
          icon={<BookOpen size={48} />} 
          title='No courses yet' 
          description='You have not been assigned any courses yet.' 
        />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {courses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              progress={course.progressPct} 
              onClick={() => navigate(`/member/learning/course/${course.id}`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberLearning;
