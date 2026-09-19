import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminCourses from '../pages/admin/AdminCourses';
import AdminCourseDetail from '../pages/admin/AdminCourseDetail';
import AdminAssignments from '../pages/admin/AdminAssignments';
import AdminSubmissions from '../pages/admin/AdminSubmissions';
import AdminMembersList from '../pages/admin/AdminMembersList';
import AdminTeamsList from '../pages/admin/AdminTeamsList';
import AdminProgress from '../pages/admin/AdminProgress';
import AdminGrowth from '../pages/admin/AdminGrowth';
import AdminSkills from '../pages/admin/AdminSkills';
import AdminQuizzes from '../pages/admin/AdminQuizzes';
import AdminNotifications from '../pages/admin/AdminNotifications';
import AdminAuditLogs from '../pages/admin/AdminAuditLogs';

// Leader Pages
import LeaderDashboard from '../pages/leader/LeaderDashboard';
import MyTeam from '../pages/leader/MyTeam';
import MemberOverview from '../pages/leader/MemberOverview';
import LeaderProgress from '../pages/leader/LeaderProgress';
import LeaderGrowth from '../pages/leader/LeaderGrowth';

// Member Pages
import MemberDashboard from '../pages/member/MemberDashboard';
import MemberLearning from '../pages/member/MemberLearning';
import MemberCourseDetail from '../pages/member/MemberCourseDetail';
import LessonViewer from '../pages/member/LessonViewer';
import MemberAssignments from '../pages/member/MemberAssignments';
import MemberAssignmentDetail from '../pages/member/MemberAssignmentDetail';
import MemberProgress from '../pages/member/MemberProgress';
import MemberGrowth from '../pages/member/MemberGrowth';
import MemberSkills from '../pages/member/MemberSkills';
import MemberQuizzes from '../pages/member/MemberQuizzes';

const AppRoutes = () => {
  const { user, isAdmin, isLeader, isMember } = useAuth();

  if (!user) return <Navigate to='/login' />;

  return (
    <Layout title='MITRA LMS' description='Learning & Growth Management Platform'>
      <Routes>
        <Route path='/' element={<Navigate to={isAdmin ? '/admin' : isLeader ? '/leader' : '/member'} replace />} />
        
        {/* Admin Routes */}
        {isAdmin && (
          <>
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/admin/courses' element={<AdminCourses />} />
            <Route path='/admin/courses/:courseId' element={<AdminCourseDetail />} />
            <Route path='/admin/assignments' element={<AdminAssignments />} />
            <Route path='/admin/submissions' element={<AdminSubmissions />} />
            <Route path='/admin/members' element={<AdminMembersList />} />
            <Route path='/admin/teams' element={<AdminTeamsList />} />
            <Route path='/admin/progress' element={<AdminProgress />} />
            <Route path='/admin/growth' element={<AdminGrowth />} />
            <Route path='/admin/skills' element={<AdminSkills />} />
            <Route path='/admin/quizzes' element={<AdminQuizzes />} />
            <Route path='/admin/notifications' element={<AdminNotifications />} />
            <Route path='/admin/audit-logs' element={<AdminAuditLogs />} />
          </>
        )}

        {/* Leader Routes */}
        {(isAdmin || isLeader) && (
          <>
            <Route path='/leader' element={<LeaderDashboard />} />
            <Route path='/leader/team' element={<MyTeam />} />
            <Route path='/leader/team/member/:memberId' element={<MemberOverview />} />
            <Route path='/leader/progress' element={<LeaderProgress />} />
            <Route path='/leader/growth' element={<LeaderGrowth />} />
          </>
        )}

        {/* Member Routes */}
        <Route path='/member' element={<MemberDashboard />} />
        <Route path='/member/learning' element={<MemberLearning />} />
        <Route path='/member/learning/course/:courseId' element={<MemberCourseDetail />} />
        <Route path='/member/learning/lesson/:lessonId' element={<LessonViewer />} />
        <Route path='/member/assignments' element={<MemberAssignments />} />
        <Route path='/member/assignments/:assignmentId' element={<MemberAssignmentDetail />} />
        <Route path='/member/progress' element={<MemberProgress />} />
        <Route path='/member/growth' element={<MemberGrowth />} />
        <Route path='/member/skills' element={<MemberSkills />} />
        <Route path='/member/quizzes' element={<MemberQuizzes />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
