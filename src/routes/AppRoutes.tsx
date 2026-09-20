import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';
import { RouteGuard } from '../components/common/RouteGuard';

// Common
import Unauthorized from '../pages/common/Unauthorized';

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
import AdminRubrics from '../pages/admin/AdminRubrics';

// Leader Pages
import LeaderDashboard from '../pages/leader/LeaderDashboard';
import MyTeam from '../pages/leader/MyTeam';
import MemberOverview from '../pages/leader/MemberOverview';
import LeaderProgress from '../pages/leader/LeaderProgress';
import LeaderGrowth from '../pages/leader/LeaderGrowth';
import LeaderTasks from '../pages/leader/LeaderTasks';
import LeaderEvaluations from '../pages/leader/LeaderEvaluations';

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
import MemberQuizViewer from '../pages/member/MemberQuizViewer';
import MemberTasks from '../pages/member/MemberTasks';
import MemberProjectSubmit from '../pages/member/MemberProjectSubmit';

// Auth Pages
import Login from '../pages/auth/Login';

const AppRoutes = () => {
  const { isAdmin, isLeader } = useAuth();

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/*' element={
        <Layout title='MITRA LMS' description='Learning & Growth Management Platform'>
          <Routes>
            <Route path='/' element={<Navigate to={isAdmin ? '/admin' : isLeader ? '/leader' : '/member'} replace />} />
            
            <Route path='/unauthorized' element={<Unauthorized />} />

            {/* Admin Routes - Strictly Protected */}
            <Route path='/admin/*' element={
              <RouteGuard allowedRoles={['Admin']}>
                <Routes>
                  <Route path='' element={<AdminDashboard />} />
                  <Route path='courses' element={<AdminCourses />} />
                  <Route path='courses/:courseId' element={<AdminCourseDetail />} />
                  <Route path='assignments' element={<AdminAssignments />} />
                  <Route path='submissions' element={<AdminSubmissions />} />
                  <Route path='members' element={<AdminMembersList />} />
                  <Route path='teams' element={<AdminTeamsList />} />
                  <Route path='progress' element={<AdminProgress />} />
                  <Route path='growth' element={<AdminGrowth />} />
                  <Route path='skills' element={<AdminSkills />} />
                  <Route path='quizzes' element={<AdminQuizzes />} />
                  <Route path='notifications' element={<AdminNotifications />} />
                  <Route path='audit-logs' element={<AdminAuditLogs />} />
                  <Route path='rubrics' element={<AdminRubrics />} />
                </Routes>
              </RouteGuard>
            } />

            {/* Leader Routes - Strictly Protected */}
            <Route path='/leader/*' element={
              <RouteGuard allowedRoles={['Admin', 'Team Leader']}>
                <Routes>
                  <Route index element={<LeaderDashboard />} />
                  <Route path='team' element={<MyTeam />} />
                  <Route path='team/member/:memberId' element={<MemberOverview />} />
                  <Route path='tasks' element={<LeaderTasks />} />
                  <Route path='evaluations' element={<LeaderEvaluations />} />
                  <Route path='progress' element={<LeaderProgress />} />
                  <Route path='growth' element={<LeaderGrowth />} />
                </Routes>
              </RouteGuard>
            } />

            {/* Member Routes - Accessible by all roles for learning/viewing */}
            <Route path='/member/*' element={
              <RouteGuard allowedRoles={['Admin', 'Team Leader', 'Member']}>
                <Routes>
                  <Route index element={<MemberDashboard />} />
                  <Route path='learning' element={<MemberLearning />} />
                  <Route path='learning/:courseId' element={<MemberCourseDetail />} />
                  <Route path='learning/:courseId/lesson/:lessonId' element={<LessonViewer />} />
                  <Route path='assignments' element={<MemberAssignments />} />
                  <Route path='assignments/:assignmentId' element={<MemberAssignmentDetail />} />
                  <Route path='quizzes' element={<MemberQuizzes />} />
                  <Route path='quizzes/:quizId' element={<MemberQuizViewer />} />
                  <Route path='tasks' element={<MemberTasks />} />
                  <Route path='projects' element={<MemberProjectSubmit />} />
                  <Route path='progress' element={<MemberProgress />} />
                  <Route path='growth' element={<MemberGrowth />} />
                  <Route path='skills' element={<MemberSkills />} />
                </Routes>
              </RouteGuard>
            } />
          </Routes>
        </Layout>
      } />
    </Routes>
  );
};

export default AppRoutes;
