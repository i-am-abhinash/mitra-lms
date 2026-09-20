import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center min-h-[70vh] px-4 text-center'>
      <div className='w-24 h-24 bg-theme-absent-bg rounded-full flex items-center justify-center mb-6 shadow-glow'>
        <ShieldAlert size={48} className='text-theme-absent' />
      </div>
      <h1 className='text-4xl font-black tracking-wider text-theme-primary mb-4 uppercase'>
        Access Denied
      </h1>
      <p className='text-lg text-theme-text-secondary max-w-md mb-8'>
        You do not have the necessary permissions to view this page. If you believe this is an error, please contact your administrator.
      </p>
      <button 
        onClick={() => navigate('/')} 
        className='flex items-center gap-2 px-6 py-3 bg-theme-surface-elevated hover:bg-theme-surface-higher text-theme-primary font-bold rounded-lg transition-colors border border-theme-border-subtle hover:border-theme-border'
      >
        <ArrowLeft size={20} />
        Return to Dashboard
      </button>
    </div>
  );
};

export default Unauthorized;
