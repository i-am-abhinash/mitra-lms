import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
      <div className='bg-theme-surface w-full max-w-lg rounded-2xl border border-theme-border shadow-float overflow-hidden flex flex-col max-h-[90vh]'>
        <div className='flex justify-between items-center p-5 border-b border-theme-border-subtle'>
          <h2 className='text-xl font-bold text-theme-primary'>{title}</h2>
          <button onClick={onClose} className='p-2 text-theme-text-secondary hover:text-theme-accent hover:bg-theme-surface-higher rounded-lg transition-colors'>
            <X size={20} />
          </button>
        </div>
        <div className='p-5 overflow-y-auto'>
          {children}
        </div>
      </div>
    </div>
  );
};
