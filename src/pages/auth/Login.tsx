import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // AppRoutes will automatically redirect to the correct role dashboard 
      // based on the auth context changing, so we just go to root.
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-theme-bg flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='w-16 h-16 bg-theme-surface-elevated rounded-2xl flex items-center justify-center mx-auto mb-4 border border-theme-border-subtle shadow-glow'>
            <div className='font-black tracking-widest text-theme-accent text-sm'>MITRA</div>
          </div>
          <h1 className='text-3xl font-bold text-theme-primary mb-2'>Welcome Back</h1>
          <p className='text-theme-text-secondary'>Sign in to MITRA Learning Management System</p>
        </div>

        <form onSubmit={handleSubmit} className='card p-6 md:p-8 space-y-6'>
          {error && (
            <div className='p-4 bg-theme-absent-bg border border-theme-absent/30 rounded-lg flex items-start gap-3'>
              <AlertCircle className='text-theme-absent shrink-0 mt-0.5' size={18} />
              <p className='text-sm text-theme-absent'>{error}</p>
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-theme-text-secondary mb-2'>Email Address</label>
            <input 
              type='email' 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-3 text-theme-text focus:border-theme-accent outline-none transition-colors' 
              placeholder='your.email@example.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-theme-text-secondary mb-2'>Password</label>
            <input 
              type='password' 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-3 text-theme-text focus:border-theme-accent outline-none transition-colors' 
              placeholder='••••••••'
            />
          </div>

          <button 
            type='submit' 
            disabled={isLoading}
            className='w-full flex items-center justify-center gap-2 bg-theme-accent hover:bg-theme-accent-hover text-white font-medium p-3 rounded-lg transition-colors shadow-glow disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Signing in...' : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
