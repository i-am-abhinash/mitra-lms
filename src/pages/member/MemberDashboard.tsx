import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/lms/MetricCard';
import { CourseCard } from '../../components/lms/CourseCard';
import { AssignmentCard } from '../../components/lms/AssignmentCard';
import { fetchCourses } from '../../services/courseService';
import { fetchAssignments } from '../../services/assignmentService';
import { calculateMemberGrowth } from '../../services/growthService';
import { TrendingUp, BookOpen, CheckCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MemberDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [growth, setGrowth] = useState<any>({ overallGrowth: 0, courseCompletion: 0, assignmentScores: 0, attendanceConsistency: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      try {
        const [g, c, a] = await Promise.all([
          calculateMemberGrowth(user.id),
          fetchCourses('PUBLISHED'),
          fetchAssignments()
        ]);
        setGrowth(g);
        setCourses(c);
        setAssignments(a);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-theme-primary'>Welcome back, {user?.name || 'Member'}</h1>
        <p className='text-theme-text-secondary mt-1'>Team: {user?.teamId || 'No Team'}</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard 
          title='Overall Growth' 
          value={loading ? '...' : `${growth.overallGrowth}%`} 
          icon={<TrendingUp size={20} />} 
          trend='up' trendValue='+0%' 
        />
        <MetricCard 
          title='Course Completion' 
          value={loading ? '...' : `${growth.courseCompletion}%`} 
          icon={<BookOpen size={20} />} 
        />
        <MetricCard 
          title='Project Perf' 
          value={loading ? '...' : `${growth.assignmentScores}%`} 
          icon={<CheckCircle size={20} />} 
        />
        <MetricCard 
          title='Attendance' 
          value={loading ? '...' : `${growth.attendanceConsistency || 0}%`} 
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
          {courses.length === 0 && !loading && <p className='text-theme-text-secondary text-sm'>No courses available.</p>}
          {courses.slice(0, 3).map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              progress={0} 
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
          {assignments.length === 0 && !loading && <p className='text-theme-text-secondary text-sm'>No upcoming assignments.</p>}
          {assignments.slice(0, 3).map(assignment => (
            <AssignmentCard 
              key={assignment.id} 
              assignment={assignment} 
              course={courses.find(c => c.id === assignment.courseId)} 
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
