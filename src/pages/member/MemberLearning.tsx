import React from 'react';
import { CourseCard } from '../../components/lms/CourseCard';
import { mockCourses } from '../../mockData';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { EmptyState } from '../../components/lms/EmptyState';

const MemberLearning = () => {
  const navigate = useNavigate();

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>My Learning</h1>
        <p className='text-theme-text-secondary mt-1'>Continue your registered courses</p>
      </div>

      {mockCourses.length === 0 ? (
        <EmptyState 
          icon={<BookOpen size={48} />} 
          title='No courses yet' 
          description='You have not been assigned any courses yet.' 
        />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {mockCourses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              progress={Math.floor(Math.random() * 100)} 
              onClick={() => navigate(`/member/learning/course/${course.id}`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberLearning;
