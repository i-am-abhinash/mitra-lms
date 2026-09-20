import React, { useState, useEffect } from 'react';
import { fetchAuditLogs } from '../../services/auditService';
import type { AuditLog } from '../../types';
import { ShieldAlert, Clock, User, FileText, Activity } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className='p-12 text-center text-theme-accent animate-pulse'>Loading Audit Logs...</div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-theme-primary flex items-center gap-2'>
            <ShieldAlert className='text-theme-accent' /> System Audit Logs
          </h1>
          <p className='text-theme-text-secondary mt-1'>Immutable ledger of sensitive actions (FR-AUD-01)</p>
        </div>
      </div>

      <div className='bg-theme-surface-elevated border border-theme-border rounded-lg overflow-hidden'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-theme-surface-higher border-b border-theme-border'>
              <th className='p-4 font-medium text-theme-text-secondary text-sm'><Clock size={16} className='inline mr-1' /> Timestamp</th>
              <th className='p-4 font-medium text-theme-text-secondary text-sm'><User size={16} className='inline mr-1' /> Actor ID</th>
              <th className='p-4 font-medium text-theme-text-secondary text-sm'><Activity size={16} className='inline mr-1' /> Action</th>
              <th className='p-4 font-medium text-theme-text-secondary text-sm'><FileText size={16} className='inline mr-1' /> Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr><td colSpan={4} className='p-8 text-center text-theme-muted'>No audit logs found.</td></tr>
            )}
            {logs.map(log => (
              <tr key={log.id} className='border-b border-theme-border-subtle hover:bg-theme-surface-higher transition-colors'>
                <td className='p-4 text-sm font-mono text-theme-text'>
                  {log.timestamp ? (log.timestamp as Timestamp).toDate().toLocaleString() : 'Unknown'}
                </td>
                <td className='p-4 text-sm font-mono text-theme-text-secondary'>{log.actorId}</td>
                <td className='p-4 text-sm'>
                  <span className='px-2 py-1 bg-theme-accent/10 text-theme-accent font-bold rounded-md'>
                    {log.action}
                  </span>
                </td>
                <td className='p-4 text-sm text-theme-text-secondary'>
                  {log.targetId && <div>Target: <span className='font-mono'>{log.targetId}</span></div>}
                  {log.details && <div>{log.details}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
