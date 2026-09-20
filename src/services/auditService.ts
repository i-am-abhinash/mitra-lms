import { collection, getDocs, query, Timestamp, addDoc, limit } from 'firebase/firestore';
import { db } from './firebase';
import type { AuditLog } from '../types';

export const logAction = async (actorId: string, action: string, targetId?: string, details?: string): Promise<void> => {
  await addDoc(collection(db, 'audit_logs'), {
    actorId,
    action,
    targetId: targetId || null,
    details: details || null,
    timestamp: Timestamp.now()
  });
};

export const fetchAuditLogs = async (pageLimit = 100): Promise<AuditLog[]> => {
  // NFR-PERF-03: Paginate large lists
  const q = query(collection(db, 'audit_logs'), limit(pageLimit));
  const snap = await getDocs(q);
  const logs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
  return logs.sort((a, b) => (b.timestamp as Timestamp).toMillis() - (a.timestamp as Timestamp).toMillis());
};
