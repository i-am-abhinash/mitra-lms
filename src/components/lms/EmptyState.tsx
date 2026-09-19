import React from 'react';
import clsx from 'clsx';

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ icon, title, description, action, className }: Props) => {
  return (
    <div className={clsx('card p-12 flex flex-col items-center justify-center text-center', className)}>
      <div className='text-theme-muted mb-4 opacity-50'>
        {icon}
      </div>
      <h3 className='text-lg font-medium text-theme-primary mb-2'>{title}</h3>
      <p className='text-sm text-theme-text-secondary max-w-sm mb-6'>{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
