import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/lms/MetricCard';
import { CourseCard } from '../../components/lms/CourseCard';
import { AssignmentCard } from '../../components/lms/AssignmentCard';
import { mockCourses, mockAssignments, mockGrowth } from '../../mockData';
import { TrendingUp, BookOpen, CheckCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MemberDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const growth = mockGrowth.find(g => g.userId === 'member1') || mockGrowth[0];

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-theme-primary'>Welcome back, {user?.name || 'Member'}</h1>
        <p className='text-theme-text-secondary mt-1'>Team: {user?.teamId || 'AIML-A'}</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard 
          title='Overall Growth' 
          value={`${growth.overallGrowth}%`} 
          icon={<TrendingUp size={20} />} 
          trend='up' trendValue='+5%' 
        />
        <MetricCard 
          title='Course Completion' 
          value={`${growth.courseCompletion}%`} 
          icon={<BookOpen size={20} />} 
        />
        <MetricCard 
          title='Assignment Performance' 
          value={`${growth.assignmentPerformance}%`} 
          icon={<CheckCircle size={20} />} 
        />
        <MetricCard 
          title='Attendance' 
          value={`${growth.attendanceConsistency}%`} 
          icon={<Calendar size={20} />} 
          trend='neutral' trendValue='Stable'
        />
      </div>

      <div>
        <div className='flex justify-between items-end mb-4'>
          <h2 className='text-xl font-bold text-theme-primary'>Current Learning</h2>
          <button onClick={() => navigate('/member/learning')} className='text-sm text-theme-accent hover:underline'>View All</button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {mockCourses.slice(0, 3).map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              progress={65} 
              onClick={() => navigate(`/member/learning/course/${course.id}`)} 
            />
          ))}
        </div>
      </div>

      <div>
        <div className='flex justify-between items-end mb-4'>
          <h2 className='text-xl font-bold text-theme-primary'>Upcoming Work</h2>
          <button onClick={() => navigate('/member/assignments')} className='text-sm text-theme-accent hover:underline'>View All</button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {mockAssignments.slice(0, 3).map(assignment => (
            <AssignmentCard 
              key={assignment.id} 
              assignment={assignment} 
              course={mockCourses.find(c => c.id === assignment.courseId)} 
              status='PENDING'
              onClick={() => navigate(`/member/assignments/${assignment.id}`)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
