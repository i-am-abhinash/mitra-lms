import React, { useState, useEffect } from 'react';
import { fetchUserNotifications, markNotificationRead } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import type { Notification } from '../../types';
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const NotificationsPopover = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const data = await fetchUserNotifications(user!.id!);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: Timestamp.now() } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.readAt).length;

  return (
    <div className='relative'>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 text-theme-text-secondary hover:text-theme-primary hover:bg-theme-surface-higher rounded-full transition-colors'
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className='absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-theme-surface'></span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 bg-theme-surface-elevated border border-theme-border rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[400px]'>
          <div className='p-4 border-b border-theme-border flex justify-between items-center'>
            <h3 className='font-bold text-theme-primary flex items-center gap-2'>
              <Bell size={16} className='text-theme-accent' /> Notifications
            </h3>
            {unreadCount > 0 && (
              <span className='text-xs font-bold bg-theme-accent text-white px-2 py-0.5 rounded-full'>{unreadCount} new</span>
            )}
          </div>
          
          <div className='overflow-y-auto flex-1 p-2'>
            {notifications.length === 0 && (
              <div className='text-center p-6 text-theme-muted text-sm'>
                No notifications yet.
              </div>
            )}
            
            {notifications.map(notif => {
              const isUnread = !notif.readAt;
              let Icon = Info;
              let iconColor = 'text-blue-500';
              if (notif.type === 'SUCCESS') { Icon = CheckCircle; iconColor = 'text-green-500'; }
              if (notif.type === 'WARNING') { Icon = AlertTriangle; iconColor = 'text-yellow-500'; }
              if (notif.type === 'ERROR') { Icon = XCircle; iconColor = 'text-red-500'; }

              return (
                <div key={notif.id} className={`p-3 rounded-lg mb-1 flex gap-3 transition-colors ${isUnread ? 'bg-theme-surface-higher' : 'hover:bg-theme-surface-higher opacity-70'}`}>
                  <div className='mt-0.5'>
                    <Icon size={16} className={iconColor} />
                  </div>
                  <div className='flex-1'>
                    <h4 className={`text-sm ${isUnread ? 'font-bold text-theme-primary' : 'font-medium text-theme-text-secondary'}`}>{notif.title}</h4>
                    <p className='text-xs text-theme-text-secondary mt-0.5'>{notif.message}</p>
                    <p className='text-[10px] text-theme-muted mt-2 flex items-center gap-1'>
                      <Clock size={10} /> {(notif.createdAt as Timestamp).toDate().toLocaleTimeString()}
                    </p>
                  </div>
                  {isUnread && (
                    <button onClick={() => handleMarkRead(notif.id!)} className='text-[10px] text-theme-accent hover:underline whitespace-nowrap' title='Mark as read'>
                      Mark read
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopover;
