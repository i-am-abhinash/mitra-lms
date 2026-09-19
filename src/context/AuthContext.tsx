import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { subscribeToAuthChanges, loginUser, logoutUser, registerUser, changeUserPassword } from '../services/authService';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (e: string, p: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (e: string, p: string) => Promise<any>;
  changePassword: (c: string, n: string) => Promise<void>;
  isAdmin: boolean;
  isLeader: boolean;
  isMember: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((userData: any) => {
      setUser(userData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    login: loginUser,
    logout: logoutUser,
    register: registerUser,
    changePassword: changeUserPassword,
    isAdmin: user?.role === 'Admin',
    isLeader: user?.role === 'Team Leader',
    isMember: user?.role === 'Member',
  };

  return <AuthContext.Provider value={value}>{loading ? <div className='flex h-screen w-screen items-center justify-center bg-theme-bg text-theme-accent'>Loading MITRA LMS...</div> : children}</AuthContext.Provider>;
};
