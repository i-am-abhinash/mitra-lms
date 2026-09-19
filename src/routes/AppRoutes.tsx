import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import AdminCourses from '../pages/admin/AdminCourses';
import AdminCourseDetail from '../pages/admin/AdminCourseDetail';
import AdminAssignments from '../pages/admin/AdminAssignments';

const AppRoutes = () => {
  return (
    <Layout title='MITRA LMS' description='LMS Administration Dashboard'>
      <Routes>
        <Route path='/' element={<Navigate to='/admin/courses' replace />} />
        <Route path='/admin/courses' element={<AdminCourses />} />
        <Route path='/admin/courses/:courseId' element={<AdminCourseDetail />} />
        <Route path='/admin/assignments' element={<AdminAssignments />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
