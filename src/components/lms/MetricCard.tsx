import React from 'react';
import clsx from 'clsx';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export const MetricCard = ({ title, value, subtitle, icon, trend, trendValue, className }: MetricCardProps) => {
  return (
    <div className={clsx('card p-6 flex flex-col', className)}>
      <div className='flex justify-between items-start mb-4'>
        <h3 className='text-theme-text-secondary font-medium text-sm'>{title}</h3>
        {icon && <div className='text-theme-accent opacity-80'>{icon}</div>}
      </div>
      <div className='mt-auto'>
        <div className='text-3xl font-bold text-theme-primary'>{value}</div>
        {(subtitle || trendValue) && (
          <div className='flex items-center gap-2 mt-2 text-sm'>
            {trendValue && (
              <span className={clsx(
                'font-medium',
                trend === 'up' ? 'text-theme-present' : trend === 'down' ? 'text-theme-absent' : 'text-theme-text-secondary'
              )}>
                {trend === 'up' ? '?' : trend === 'down' ? '?' : ''} {trendValue}
              </span>
            )}
            {subtitle && <span className='text-theme-muted'>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
