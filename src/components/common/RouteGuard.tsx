import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: ('Admin' | 'Team Leader' | 'Member')[];
}

export const RouteGuard = ({ children, allowedRoles }: RouteGuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex h-full min-h-[50vh] items-center justify-center'>
        <div className='text-theme-accent font-medium'>Loading authorization...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
