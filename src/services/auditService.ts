import { collection, getDocs, query, Timestamp, addDoc } from 'firebase/firestore';
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

export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  // Querying all for Admin
  const snap = await getDocs(collection(db, 'audit_logs'));
  const logs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
  return logs.sort((a, b) => (b.timestamp as Timestamp).toMillis() - (a.timestamp as Timestamp).toMillis());
};
