import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Users, Settings, LogOut,
  BookOpen, FileText, CheckCircle, TrendingUp, Activity, Award, Bell, List
} from 'lucide-react';
import clsx from 'clsx';

const RadialNavigation = () => {
  const { isAdmin, isLeader, isMember, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsOpen(false), 300);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  let navItems: any[] = [];
  
  if (isAdmin) {
    navItems = [
      { to: '/admin', icon: Home, label: 'Dashboard' },
      { to: '/admin/courses', icon: BookOpen, label: 'Learning' },
      { to: '/admin/assignments', icon: FileText, label: 'Assignments' },
      { to: '/admin/submissions', icon: CheckCircle, label: 'Submissions' },
      { to: '/admin/growth', icon: TrendingUp, label: 'Growth' },
      { to: '/admin/members', icon: Users, label: 'Members' },
      { to: '/admin/teams', icon: Users, label: 'Teams' }
    ];
  } else if (isLeader) {
    navItems = [
      { to: '/leader', icon: Home, label: 'Dashboard' },
      { to: '/leader/team', icon: Users, label: 'My Team' },
      { to: '/member/assignments', icon: FileText, label: 'Assignments' },
      { to: '/leader/progress', icon: Activity, label: 'Progress' },
      { to: '/leader/growth', icon: TrendingUp, label: 'Growth' },
      { to: '#notifications', icon: Bell, label: 'Alerts' }
    ];
  } else if (isMember) {
    navItems = [
      { to: '/member', icon: Home, label: 'Dashboard' },
      { to: '/member/learning', icon: BookOpen, label: 'Learning' },
      { to: '/member/assignments', icon: FileText, label: 'Assignments' },
      { to: '/member/progress', icon: Activity, label: 'Progress' },
      { to: '/member/growth', icon: TrendingUp, label: 'Growth' },
      { to: '/member/skills', icon: Award, label: 'Skills' }
    ];
  }

  const allItems = [
    ...navItems, 
    ...(isAdmin ? [{ to: '#more', icon: List, label: 'More' }] : []),
    { to: '#logout', icon: LogOut, label: 'Logout', onClick: handleLogout }
  ];
  
  const totalItems = allItems.length;
  const radius = isMobile ? 85 : 100; 
  const arcRadius = radius - 15; 

  const getAngle = (index: number, total: number) => {
    if (total === 1) return 0;
    const maxSpread = 160; 
    const step = maxSpread / (total - 1);
    const startAngle = -80;
    return (startAngle + index * step) * (Math.PI / 180);
  };

  const startAngleRad = getAngle(0, totalItems);
  
  const svgCenter = radius + 20; 
  const x1 = svgCenter + arcRadius * Math.cos(startAngleRad);
  const y1 = svgCenter + arcRadius * Math.sin(startAngleRad);
  
  let d = `M ${x1},${y1}`;
  for (let i = 1; i < totalItems; i++) {
    const angle = getAngle(i, totalItems);
    const x = svgCenter + arcRadius * Math.cos(angle);
    const y = svgCenter + arcRadius * Math.sin(angle);
    d += ` A ${arcRadius} ${arcRadius} 0 0 1 ${x},${y}`;
  }

  return (
    <>
      {isOpen && (
        <div 
          className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      <div 
        ref={navRef}
        className='fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center pl-2 md:pl-6'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className='relative flex items-center h-[300px]'>
          <button 
            className={clsx(
              'relative z-50 flex items-center justify-center rounded-full bg-theme-surface-higher border-2 transition-all duration-300 shadow-float',
              isOpen 
                ? 'w-16 h-16 border-theme-accent text-theme-accent' 
                : 'w-12 h-12 border-theme-border-subtle text-theme-text-secondary hover:text-theme-primary'
            )}
            onClick={() => setIsMobile(true) && setIsOpen(!isOpen)}
          >
            <div className='font-bold tracking-widest text-[10px]'>MITRA</div>
          </button>

          <div 
            className={clsx(
              'absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-300',
              isOpen ? 'opacity-100' : 'opacity-0'
            )}
            style={{ width: (svgCenter * 2), height: (svgCenter * 2) }}
          >
            <svg width='100%' height='100%' className='absolute inset-0'>
              <path d={d} fill='none' stroke='rgba(109, 124, 255, 0.15)' strokeWidth='1' strokeDasharray='4 4' />
            </svg>

            {allItems.map((item, index) => {
              const angle = getAngle(index, totalItems);
              const cx = svgCenter + arcRadius * Math.cos(angle); 
              const cy = svgCenter + arcRadius * Math.sin(angle);
              const isActive = location.pathname === item.to || (location.pathname.startsWith(item.to) && !['/admin','/leader','/member'].includes(item.to));
              
              return (
                <circle key={`dot-${index}`} cx={cx} cy={cy} r={isActive ? '4' : '2'} fill={isActive ? '#6D7CFF' : 'rgba(109, 124, 255, 0.3)'} className='transition-all duration-300' />
              );
            })}
          </div>

          {allItems.map((item, index) => {
            const angle = getAngle(index, totalItems);
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            const delay = index * 40; 
            const isActive = location.pathname === item.to || (location.pathname.startsWith(item.to) && !['/admin','/leader','/member'].includes(item.to));

            const style = isOpen ? {
              transform: `translate(${x}px, ${y}px) scale(1)`,
              opacity: 1,
              transitionDelay: `${delay}ms`,
            } : {
              transform: `translate(0px, 0px) scale(0)`,
              opacity: 0,
              transitionDelay: '0ms',
            };

            const Icon = item.icon;

            return (
              <div 
                key={item.label}
                className='absolute top-1/2 left-1/2 -ml-6 -mt-6 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]'
                style={style}
              >
                <button
                  onClick={(e) => {
                    if (item.onClick) item.onClick(e);
                    else if (item.to.startsWith('/')) navigate(item.to);
                    if (isMobile) setIsOpen(false);
                  }}
                  className={clsx(
                    'group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 border',
                    isActive 
                      ? 'bg-theme-accent-light border-theme-accent text-theme-accent shadow-glow' 
                      : 'bg-theme-surface-elevated border-theme-border-subtle text-theme-text-secondary hover:bg-theme-surface-higher hover:text-theme-primary hover:border-theme-border'
                  )}
                  title={item.label}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  
                  <div className='absolute left-full ml-4 px-3 py-1.5 bg-theme-surface-elevated border border-theme-border rounded-lg text-sm font-medium text-theme-text whitespace-nowrap opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-float'>
                    {item.label}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default RadialNavigation;
