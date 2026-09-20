import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssignmentCard } from '../../components/lms/AssignmentCard';
import { fetchAssignments } from '../../services/assignmentService';
import { fetchCourses } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import type { Assignment, Course, Submission } from '../../types';
import clsx from 'clsx';

const MemberAssignments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState('ALL');
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [submissions, setSubmissions] = useState<Record<string, Submission>>({});
  const [loading, setLoading] = useState(true);

  const filters = [
    { id: 'ALL', name: 'All Assignments' },
    { id: 'PENDING', name: 'Pending' },
    { id: 'DRAFT', name: 'Drafts' },
    { id: 'SUBMITTED', name: 'Submitted' },
    { id: 'EVALUATED', name: 'Evaluated' }
  ];

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [aData, cData] = await Promise.all([
        fetchAssignments(), 
        fetchCourses()
      ]);
      setAssignments(aData);
      
      const courseMap = cData.reduce((acc, c) => ({ ...acc, [c.id!]: c }), {});
      setCourses(courseMap);

      // Fetch submissions for user
      const subQuery = query(collection(db, 'assignment_submissions'), where('memberId', '==', user!.id));
      const subSnap = await getDocs(subQuery);
      const subMap: Record<string, Submission> = {};
      subSnap.docs.forEach(doc => {
        const data = doc.data() as Submission;
        subMap[data.assignmentId] = data;
      });
      setSubmissions(subMap);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (assignment: Assignment) => {
    const sub = submissions[assignment.id!];
    if (sub) return sub.status;
    return 'PENDING';
  };

  const filteredAssignments = assignments.filter(a => {
    if (filter === 'ALL') return true;
    const status = getStatus(a);
    return status === filter;
  });

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading assignments...</div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-theme-primary'>Assignments</h1>
        <p className='text-theme-text-secondary mt-1'>Manage your course work</p>
      </div>

      <div className='mb-6 flex gap-2 overflow-x-auto pb-2'>
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              filter === f.id 
                ? 'bg-theme-accent text-white' 
                : 'bg-theme-surface-higher text-theme-text-secondary hover:text-theme-primary hover:bg-theme-surface-elevated'
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      {filteredAssignments.length === 0 ? (
        <div className='text-center py-12 text-theme-muted border-2 border-dashed border-theme-border-active rounded-lg'>
          No assignments found for this status.
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredAssignments.map(assignment => {
            const status = getStatus(assignment);
            const score = submissions[assignment.id!]?.score;
            return (
              <AssignmentCard 
                key={assignment.id} 
                assignment={assignment} 
                course={courses[assignment.courseId]} 
                status={status as any}
                score={score}
                onClick={() => navigate(`/member/assignments/${assignment.id}`)} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemberAssignments;
